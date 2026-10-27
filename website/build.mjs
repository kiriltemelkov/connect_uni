// Writes the pages Apple and the law ask for (privacy policy, support, imprint, terms) as plain HTML into docs/.
// Run after changing src/legal.js or this file:  node website/build.mjs
// Upload the CONTENTS of docs/ to the web root of connect-uni.de (or serve docs/ with GitHub Pages). See README.md → Website.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LEGAL, LEGAL_DATE, SITE, SUPPORT_EMAIL } from "../src/legal.js";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const link = (s) =>
  esc(s)
    .replaceAll(SUPPORT_EMAIL, `<a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>`)
    .replace("(ldi.nrw.de)", '(<a href="https://www.ldi.nrw.de">ldi.nrw.de</a>)');

// "• item" lines become a list, everything else a paragraph (line breaks kept).
function body(text) {
  const out = [];
  let list = null;
  let para = null;
  const flush = () => {
    if (list) out.push(`<ul>${list.map((i) => `<li>${link(i)}</li>`).join("")}</ul>`);
    if (para) out.push(`<p>${para.map(link).join("<br>")}</p>`);
    list = para = null;
  };
  for (const line of text.split("\n")) {
    if (line.startsWith("• ")) {
      if (para) flush();
      (list ??= []).push(line.slice(2));
    } else {
      if (list) flush();
      (para ??= []).push(line);
    }
  }
  flush();
  return out.join("\n");
}

const sections = (rows) => rows.map(([h, t]) => `<section><h3>${esc(h)}</h3>\n${body(t)}</section>`).join("\n");

const NAMES = {
  imprint: { de: "Impressum", en: "Legal notice", path: "impressum" },
  privacy: { de: "Datenschutzerklärung", en: "Privacy policy", path: "datenschutz" },
  terms: { de: "Community-Regeln & Nutzungsbedingungen", en: "Community rules & terms", path: "nutzungsbedingungen" },
  support: { de: "Support", en: "Support", path: "support" },
};

const SUPPORT = {
  de: [
    [
      "Kontakt",
      `Schreib uns an ${SUPPORT_EMAIL}. Wir antworten in der Regel innerhalb von zwei Werktagen, Meldungen von Inhalten prüfen wir innerhalb von 24 Stunden.`,
    ],
    [
      "Der Anmeldecode kommt nicht an",
      "Prüf den Spam-Ordner und ob du deine Hochschul-E-Mail-Adresse richtig geschrieben hast. Warte eine Minute und fordere den Code erneut an. Klappt es weiter nicht, schreib uns mit deiner Hochschule und Adresse.",
    ],
    [
      "Konto löschen",
      "In der App: Tippe oben links auf dein Hochschul-Abzeichen, dann ganz unten auf „Konto löschen“. Dein Profil, deine Fotos, Chats und Gruppen-Mitgliedschaften werden endgültig entfernt. Ohne App-Zugang schreib uns von deiner Hochschul-Adresse aus, dann löschen wir das Konto.",
    ],
    [
      "Jemanden melden oder blockieren",
      "Öffne das Profil und tippe unten auf „Melden“ oder „Blockieren“, im Chat auf das Flaggen-Symbol. Wir prüfen jede Meldung innerhalb von 24 Stunden, entfernen verbotene Inhalte und sperren Konten, die gegen die Regeln verstoßen.",
    ],
    [
      "Rechtswidrige Inhalte melden",
      `Wenn du Inhalte auf ConnectUni für rechtswidrig hältst, nutze die Melden-Funktion oder schreib an ${SUPPORT_EMAIL} und nenne das Profil oder den Chat und den Grund.`,
    ],
    [
      "Keine Mitteilungen",
      "Öffne auf dem iPhone Einstellungen → Mitteilungen → ConnectUni und erlaube Mitteilungen. In der App zeigt Profil → Push-Mitteilungen den Status.",
    ],
    [
      "Datenschutz-Anfragen",
      `Auskunft, Berichtigung oder Löschung deiner Daten: schreib an ${SUPPORT_EMAIL}. Mehr steht in der Datenschutzerklärung.`,
    ],
  ],
  en: [
    ["Contact", `Write to ${SUPPORT_EMAIL}. We usually reply within two working days, and we review reports of content within 24 hours.`],
    [
      "The sign-in code doesn't arrive",
      "Check your spam folder and that you typed your university email address correctly. Wait a minute and request the code again. If it still doesn't work, write to us with your university and address.",
    ],
    [
      "Delete your account",
      "In the app: tap your university badge at the top left, then “Delete account” at the very bottom. Your profile, photos, chats and group memberships are removed for good. If you can't open the app, write to us from your university address and we'll delete the account.",
    ],
    [
      "Report or block someone",
      "Open their profile and tap “Report” or “Block” at the bottom, or the flag icon in a chat. We review every report within 24 hours, remove prohibited content and suspend accounts that break the rules.",
    ],
    [
      "Report unlawful content",
      `If you think content on ConnectUni is unlawful, use the Report button or write to ${SUPPORT_EMAIL} and tell us the profile or chat and the reason.`,
    ],
    [
      "No notifications",
      "On your iPhone open Settings → Notifications → ConnectUni and allow notifications. In the app, Profile → Push notifications shows the status.",
    ],
    ["Privacy requests", `Access, correction or deletion of your data: write to ${SUPPORT_EMAIL}. More in the privacy policy.`],
  ],
};

const HOME = {
  de: [
    [
      "ConnectUni",
      "Finde an deiner Hochschule echte Freunde: Leute aus deinem Fach, für die Lerngruppe, die Mensa oder den Abend. Anmelden kannst du dich nur mit deiner Uni-Mail, und du siehst nur Studierende deiner eigenen Hochschule.",
    ],
    ["Bald im App Store", `Die iPhone-App erscheint demnächst. Fragen an ${SUPPORT_EMAIL}.`],
  ],
  en: [
    [
      "ConnectUni",
      "Find real friends at your university: people from your subject, for your study group, lunch at the Mensa or a night out. You can only sign up with your university email, and you only see students from your own university.",
    ],
    ["Coming soon to the App Store", `The iPhone app is coming soon. Questions: ${SUPPORT_EMAIL}.`],
  ],
};

const CSS = `
:root{color-scheme:light dark;--bg:#fafafa;--fg:#1c1c21;--muted:#6b6b75;--line:#e4e4ea;--accent:#e11d63}
@media (prefers-color-scheme:dark){:root{--bg:#0a0a0c;--fg:#f2f2f5;--muted:#9c9ca6;--line:#2a2a31;--accent:#ff6b98}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
header,main,footer{max-width:720px;margin:0 auto;padding:0 20px}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding-top:22px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.logo{font-weight:800;font-size:1.25rem;letter-spacing:-.02em;color:var(--fg);text-decoration:none}
.logo span{background:linear-gradient(120deg,#ff7a59,#ff3d7f 48%,#8b3dff);-webkit-background-clip:text;background-clip:text;color:transparent}
nav{display:flex;gap:16px;font-size:.9rem}
a{color:var(--accent)}
nav a{color:var(--muted);text-decoration:none}
nav a:hover{color:var(--fg)}
h1{font-size:1.9rem;line-height:1.2;letter-spacing:-.02em;margin:28px 0 4px}
h3{font-size:1.05rem;margin:26px 0 4px}
p,ul{margin:6px 0}
ul{padding-left:1.2em}li{margin:4px 0}
.lang{font-size:.85rem;color:var(--muted);margin:0 0 6px}
article[lang=en]{display:none}
article[lang=en]:target{display:block}
body:has(#en:target) article[lang=de]{display:none}
.small{font-size:.8rem}.small h3{font-size:.9rem}
footer{padding-top:26px;padding-bottom:40px;margin-top:40px;border-top:1px solid var(--line);font-size:.8rem;color:var(--muted)}
footer a{color:var(--muted)}
footer p{margin:2px 0}
`;

const page = ({ key, title, lead, small = false, noindex = false, html }) => {
  const nav = ["support", "privacy", "imprint"].map((k) => `<a href="/${NAMES[k].path}/">${NAMES[k].de}</a>`).join("");
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title.de)} · ConnectUni</title>
<meta name="description" content="${esc(lead.de)}">${noindex ? '\n<meta name="robots" content="noindex">' : ""}
<style>${CSS}</style>
</head>
<body>
<header><a class="logo" href="/"><span>ConnectUni</span></a><nav>${nav}</nav></header>
<main>
${["de", "en"]
  .map(
    (l) => `<article lang="${l}" id="${l}"${small ? ' class="small"' : ""}>
<p class="lang">${l === "de" ? 'Deutsch · <a href="#en">English</a>' : '<a href="#de">Deutsch</a> · English'}</p>
<h1>${esc(title[l])}</h1>
${html[l]}
</article>`,
  )
  .join("\n")}
</main>
<footer>
<p>${["imprint", "privacy", "terms", "support"].map((k) => `<a href="/${NAMES[k].path}/">${NAMES[k].de}</a>`).join(" · ")}</p>
<p>© 2026 ConnectUni · <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a></p>
</footer>
</body>
</html>
`;
};

const pages = [
  {
    path: "",
    key: "home",
    title: { de: "Freunde finden an deiner Uni", en: "Make friends at your uni" },
    lead: { de: HOME.de[0][1], en: HOME.en[0][1] },
    html: { de: sections(HOME.de), en: sections(HOME.en) },
  },
  {
    path: NAMES.imprint.path,
    key: "imprint",
    title: NAMES.imprint,
    lead: { de: "Impressum von ConnectUni", en: "Legal notice of ConnectUni" },
    small: true,
    noindex: true,
    html: { de: sections(LEGAL.imprint.de), en: sections(LEGAL.imprint.en) },
  },
  {
    path: NAMES.privacy.path,
    key: "privacy",
    title: NAMES.privacy,
    lead: { de: "Datenschutzerklärung der ConnectUni-App", en: "Privacy policy of the ConnectUni app" },
    html: { de: sections(LEGAL.privacy.de), en: sections(LEGAL.privacy.en) },
  },
  {
    path: NAMES.terms.path,
    key: "terms",
    title: NAMES.terms,
    lead: { de: "Community-Regeln und Nutzungsbedingungen von ConnectUni", en: "Community rules and terms of ConnectUni" },
    html: { de: sections(LEGAL.terms.de), en: sections(LEGAL.terms.en) },
  },
  {
    path: NAMES.support.path,
    key: "support",
    title: NAMES.support,
    lead: { de: "Hilfe und Kontakt zu ConnectUni", en: "Help and contact for ConnectUni" },
    html: { de: sections(SUPPORT.de), en: sections(SUPPORT.en) },
  },
];

for (const p of pages) {
  const dir = join(OUT, p.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), page(p));
}
writeFileSync(join(OUT, ".nojekyll"), "");
console.log(`Wrote ${pages.length} pages to docs/ for ${SITE}`);
