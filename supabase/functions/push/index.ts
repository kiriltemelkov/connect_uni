// Sends push notifications through Apple (APNs) for new messages and activity (waves, matches, hangouts, group invites).
// Supabase Database Webhooks call it for every INSERT on `messages` and `notifications`. Setup: README.md → "Push notifications".
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (name: string) => Deno.env.get(name) ?? "";
const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

type Text = { de: string; en: string };
type Job = { userId: string; title: Text; body: Text; conversation?: string };

const first = (name?: string | null) => (name ?? "").split(" ")[0] || "?";
const clip = (text: string) => (text.length > 140 ? `${text.slice(0, 137)}…` : text);

// ── APNs ────────────────────────────────────────────────────────────────────────

const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  return btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

// Apple wants a fresh signed token at least every hour; ours lives 40 minutes.
let cached = { value: "", at: 0 };
async function apnsToken() {
  if (Date.now() - cached.at < 40 * 60_000) return cached.value;
  const pem = env("APNS_PRIVATE_KEY").replaceAll("\\n", "\n").replace(/-----[^-]+-----|\s/g, "");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const head = b64url(JSON.stringify({ alg: "ES256", kid: env("APNS_KEY_ID") }));
  const claims = b64url(JSON.stringify({ iss: env("APNS_TEAM_ID"), iat: Math.floor(Date.now() / 1000) }));
  const signature = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, new TextEncoder().encode(`${head}.${claims}`));
  cached = { value: `${head}.${claims}.${b64url(signature)}`, at: Date.now() };
  return cached.value;
}

// TestFlight and App Store builds use Apple's production servers, builds started from Xcode the sandbox.
async function deliver(token: string, payload: unknown) {
  for (const host of ["api.push.apple.com", "api.sandbox.push.apple.com"]) {
    const res = await fetch(`https://${host}/3/device/${token}`, {
      method: "POST",
      headers: {
        authorization: `bearer ${await apnsToken()}`,
        "apns-topic": env("APNS_BUNDLE_ID") || "de.connectuni.app",
        "apns-push-type": "alert",
        "apns-priority": "10",
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return;
    const reason = (await res.json().catch(() => ({}))).reason;
    if (reason === "BadDeviceToken" && host === "api.push.apple.com") continue;
    console.error("APNs", res.status, reason);
    // The app was deleted or the token belongs to the other environment: stop trying this phone.
    if (res.status === 410 || reason === "Unregistered" || reason === "BadDeviceToken") await db.from("push_tokens").delete().eq("token", token);
    return;
  }
}

async function send(job: Job) {
  const { data: phones } = await db.from("push_tokens").select("token, lang").eq("user_id", job.userId);
  await Promise.allSettled(
    (phones ?? []).map(({ token, lang }) => {
      const l = lang === "en" ? "en" : "de";
      return deliver(token, {
        aps: { alert: { title: job.title[l], body: job.body[l] }, sound: "default", "thread-id": job.conversation },
        conversation: job.conversation,
      });
    }),
  );
}

// ── What to send ────────────────────────────────────────────────────────────────

async function forMessage(m: { conversation_id: string; sender_id: string | null; kind: string; body: string }): Promise<Job[]> {
  if (m.kind !== "text" || !m.sender_id) return [];
  const [{ data: sender }, { data: conversation }, { data: members }] = await Promise.all([
    db.from("profiles").select("name").eq("id", m.sender_id).single(),
    db.from("conversations").select("kind, groups(name)").eq("id", m.conversation_id).single(),
    db.from("conversation_members").select("user_id").eq("conversation_id", m.conversation_id).neq("user_id", m.sender_id),
  ]);
  const ids = (members ?? []).map((row) => row.user_id);
  // People who blocked the sender get nothing.
  const { data: blocked } = await db.from("blocks").select("blocker_id").eq("blocked_id", m.sender_id).in("blocker_id", ids);
  const skip = new Set((blocked ?? []).map((row) => row.blocker_id));
  const group = conversation?.kind === "group" ? (conversation.groups as { name: string } | null)?.name : null;
  const name = first(sender?.name);
  const text = clip(m.body);
  return ids
    .filter((id) => !skip.has(id))
    .map((userId) => ({
      userId,
      conversation: m.conversation_id,
      title: { de: group ?? name, en: group ?? name },
      body: { de: group ? `${name}: ${text}` : text, en: group ? `${name}: ${text}` : text },
    }));
}

async function forNotification(n: { user_id: string; kind: string; actor_id: string | null; ref_id: string | null }): Promise<Job[]> {
  const { data: actor } = n.actor_id ? await db.from("profiles").select("name").eq("id", n.actor_id).single() : { data: null };
  const name = first(actor?.name);
  let group = "";
  if (n.kind === "group_invite" || n.kind === "group_join") {
    group = (await db.from("groups").select("name").eq("id", n.ref_id).single()).data?.name ?? "";
  }
  const texts: Record<string, Text> = {
    wave: { de: `${name} hat dir gewunken 👋`, en: `${name} waved at you 👋` },
    match: { de: `Du und ${name} seid jetzt verbunden.`, en: `You and ${name} are now connected.` },
    hangout: { de: `${name} ist deinem Hangout beigetreten 🙌`, en: `${name} joined your hangout 🙌` },
    group_invite: { de: `${name} hat dich in ${group} eingeladen 💌`, en: `${name} invited you to ${group} 💌` },
    group_join: { de: `${name} ist ${group} beigetreten 🎉`, en: `${name} joined ${group} 🎉` },
  };
  const body = texts[n.kind];
  if (!body) return [];
  const title = n.kind === "match" ? { de: "🎉 It's a Study Match!", en: "🎉 It's a Study Match!" } : { de: "ConnectUni", en: "ConnectUni" };
  return [{ userId: n.user_id, title, body }];
}

Deno.serve(async (req) => {
  const secret = env("WEBHOOK_SECRET");
  if (!secret || req.headers.get("x-webhook-secret") !== secret) return new Response("forbidden", { status: 403 });
  const { type, table, record } = await req.json();
  if (type !== "INSERT") return new Response("ignored");
  const jobs = table === "messages" ? await forMessage(record) : table === "notifications" ? await forNotification(record) : [];
  await Promise.allSettled(jobs.map(send));
  return new Response("ok");
});
