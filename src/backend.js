// Supabase client and every call the app makes. The publishable key is meant to ship inside apps: what
// each signed-in student may read or write is decided by row level security (supabase/migrations).
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jgfucadwctcrnmfnulvc.supabase.co";
const SUPABASE_KEY = "sb_publishable_aaWBkjcD5IdBXrzeYWJjhw_WcrZUjZI";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

const must = ({ data, error }) => {
  if (error) throw error;
  return data;
};

// Photos are scaled down on the phone before upload: max 1080 px, JPEG.
async function shrink(file, max = 1080) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const backend = {
  /* Sign-in */
  async session() {
    return must(await supabase.auth.getSession()).session;
  },
  onSignOut(callback) {
    const { data } = supabase.auth.onAuthStateChange((event) => event === "SIGNED_OUT" && callback());
    return () => data.subscription.unsubscribe();
  },
  async sendCode(email) {
    must(await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } }));
  },
  async verifyCode(email, token) {
    return must(await supabase.auth.verifyOtp({ email, token, type: "email" })).session;
  },
  // Only the test accounts for the App Store review have a password (supabase/review-accounts.sql).
  async signInWithPassword(email, password) {
    return must(await supabase.auth.signInWithPassword({ email, password })).session;
  },
  async signOut() {
    await supabase.auth.signOut();
  },

  /* My profile */
  async profile(id) {
    return must(await supabase.from("profiles").select("*").eq("id", id).maybeSingle());
  },
  async createProfile(row) {
    return must(await supabase.from("profiles").insert(row).select().single());
  },
  async updateProfile(id, patch) {
    return must(await supabase.from("profiles").update(patch).eq("id", id).select().single());
  },
  async touch(id) {
    await supabase.from("profiles").update({ last_active: new Date().toISOString() }).eq("id", id);
  },
  // Uploads a new profile photo and removes the previous ones.
  async uploadPhoto(id, file) {
    const blob = await shrink(file);
    const path = `${id}/${crypto.randomUUID()}.jpg`;
    must(await supabase.storage.from("avatars").upload(path, blob, { contentType: "image/jpeg" }));
    const old = must(await supabase.storage.from("avatars").list(id)).filter((f) => `${id}/${f.name}` !== path);
    if (old.length) await supabase.storage.from("avatars").remove(old.map((f) => `${id}/${f.name}`));
    return supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  },
  async deleteAccount(id) {
    const files = must(await supabase.storage.from("avatars").list(id));
    if (files.length) must(await supabase.storage.from("avatars").remove(files.map((f) => `${id}/${f.name}`)));
    must(await supabase.rpc("delete_my_account"));
    await supabase.auth.signOut();
  },

  /* Everything visible to me (row level security does the filtering) */
  async load() {
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const results = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("waves").select("*"),
      supabase.from("blocks").select("blocked_id"),
      supabase.from("conversations").select("*"),
      supabase.from("conversation_members").select("*"),
      supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(1000),
      supabase.from("hangouts").select("*").gte("starts_at", since).order("starts_at"),
      supabase.from("hangout_members").select("*"),
      supabase.from("groups").select("*"),
      supabase.from("group_members").select("*"),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100),
    ]);
    const [profiles, waves, blocks, conversations, conversationMembers, messages, hangouts, hangoutMembers, groups, groupMembers, notifications] =
      results.map(must);
    return { profiles, waves, blocks, conversations, conversationMembers, messages, hangouts, hangoutMembers, groups, groupMembers, notifications };
  },

  /* Actions */
  wave: async (from, to) => must(await supabase.from("waves").insert({ from_id: from, to_id: to })),
  block: async (me, id) => must(await supabase.from("blocks").insert({ blocker_id: me, blocked_id: id })),
  unblock: async (me, id) => must(await supabase.from("blocks").delete().eq("blocker_id", me).eq("blocked_id", id)),
  report: async (me, id, reason, note) =>
    must(await supabase.from("reports").insert({ reporter_id: me, reported_id: id, reason, note: note || null })),
  startDm: async (other) => must(await supabase.rpc("start_dm", { other })),
  sendMessage: async (row) => must(await supabase.from("messages").insert(row)),
  markRead: async (conversation, me) =>
    must(
      await supabase
        .from("conversation_members")
        .update({ last_read_at: new Date().toISOString() })
        .eq("conversation_id", conversation)
        .eq("user_id", me),
    ),
  createHangout: async (row) => must(await supabase.from("hangouts").insert(row)),
  deleteHangout: async (id) => must(await supabase.from("hangouts").delete().eq("id", id)),
  joinHangout: async (hangout, me) => must(await supabase.from("hangout_members").insert({ hangout_id: hangout, user_id: me })),
  createGroup: async (row) => must(await supabase.from("groups").insert(row).select("id").single()).id,
  joinGroup: async (group, me) => must(await supabase.from("group_members").insert({ group_id: group, user_id: me })),
  acceptInvite: async (group, me) => must(await supabase.from("group_members").update({ status: "member" }).eq("group_id", group).eq("user_id", me)),
  invite: async (group, me, ids) =>
    ids.length &&
    must(await supabase.from("group_members").insert(ids.map((id) => ({ group_id: group, user_id: id, status: "invited", invited_by: me })))),
  savePushToken: async (token, lang) => must(await supabase.rpc("save_push_token", { device_token: token, language: lang })),
  deletePushToken: async (token) => must(await supabase.rpc("delete_push_token", { device_token: token })),
  markNotificationsRead: async (me) => must(await supabase.from("notifications").update({ read: true }).eq("user_id", me).eq("read", false)),

  /* Live updates: new messages arrive as rows, everything else triggers a refresh */
  subscribe(me, onChange) {
    const channel = supabase
      .channel(`uc-${me}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (p) => onChange("message", p.new))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${me}` }, (p) =>
        onChange("notification", p.new),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "waves" }, () => onChange("refresh"))
      .on("postgres_changes", { event: "*", schema: "public", table: "hangout_members" }, () => onChange("refresh"))
      .on("postgres_changes", { event: "*", schema: "public", table: "hangouts" }, () => onChange("refresh"))
      .on("postgres_changes", { event: "*", schema: "public", table: "group_members" }, () => onChange("refresh"))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversation_members", filter: `user_id=eq.${me}` }, () =>
        onChange("refresh"),
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  },
};
