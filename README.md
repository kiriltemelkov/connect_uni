# ConnectUni

Photo-first campus friend finder, inspired by Instagram, Hinge and BeReal: verified sign-up with your uni
email, a people feed matched by Hauptfach (major) and Nebenfach (minor), stories, spontaneous hangouts,
circles and chats. German and English. Support: support@connect-uni.de.

The whole UI is one React component, [`src/ConnectUni.jsx`](src/ConnectUni.jsx), styled with Tailwind CSS
and using `lucide-react` icons. It runs on Supabase (see below); with `?demo` in the URL it uses made-up
students on local React state instead. Portraits and cover photos load from Unsplash, so the app needs an
internet connection.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Try it (demo mode, `?demo`)

- **Fast path:** "⚡ Quick Demo Login" at the bottom of the sign-up screen.
- **Full sign-up:** pick a uni, your Fach, type the part of your uni email before the @ (the domain is set
  by the uni) and enter **482910**, or tap the floating code badge.
- "Other uni" searches all 390 German Hochschulen from the official HRK Hochschulkompass list (plus ETH
  Zürich and Uni Wien) by name, city or short name, e.g. "Bielefeld" or "HSBI". Student addresses on a
  subdomain (like `@stud.…`) work when you type the full address.
- Connect 👋 with someone and you get a match, and a message from them shortly after. Chats reply on their
  own, and other students join your hangouts and groups after a few seconds.
- Whatever Hauptfach you pick, the app generates classmates, a Fach-only hangout and a fresher group for it.

## Backend (Supabase)

The app runs on real data from Supabase (`src/backend.js`); add `?demo` to the URL to use the made-up
students instead. The publishable key in `backend.js` is meant to ship in the app: row level security
decides what each student can read and write.

- **Database:** run `supabase/migrations/20261023120000_init.sql` once in the Supabase SQL Editor. It creates
  profiles, waves/matches, chats, hangouts, groups, notifications, reports, blocks, the photo bucket and the
  account-deletion function. Students only see their own university.
- **Existing database:** if the initial migration is already installed, run the later migrations once:
  `supabase/migrations/20261026120000_hangout_duration.sql` adds hangout durations. New installs get
  that change from the initial migration.
- **Moderation (App Store guideline 1.2):** run `supabase/migrations/20261027130000_moderation.sql` once: it replaces
  insults and slurs with `***` in messages, names, hangouts and groups, and adds bans (`ban_user`, below).
- **Push notifications:** run `supabase/migrations/20261027120000_push.sql` once (it stores one token per phone). Then,
  once, the sending side:
  1. developer.apple.com → Certificates, Identifiers & Profiles → Keys → "+" → name it, tick **Apple Push Notifications
     service (APNs)** → download the `.p8` file (Apple shows it only once) and note the Key ID.
  2. Supabase → Edge Functions → Deploy a new function → "Via Editor", name `push`, paste
     `supabase/functions/push/index.ts`, deploy. In the function's settings switch off "Enforce JWT verification"
     (the webhook secret below protects it instead).
  3. Edge Functions → Secrets: `APNS_KEY_ID`, `APNS_TEAM_ID` (UKVNY6ZNC8), `APNS_PRIVATE_KEY` (the whole `.p8` text),
     `APNS_BUNDLE_ID` (`de.connectuni.app`) and `WEBHOOK_SECRET` (any long random string).
  4. Database → Webhooks → Create a new hook, twice: table `messages` and table `notifications`, event Insert, type
     "Supabase Edge Functions" → function `push`, plus the HTTP header `x-webhook-secret` with the same value as
     `WEBHOOK_SECRET`.

  Until then the app asks for permission and stores the token, but nothing is sent. Push needs a real iPhone (not the
  simulator) and the Push Notifications capability, which is already in `ios/App/App/App.entitlements`.
- **Login codes:** Authentication → Email Templates ("Magic Link" and "Confirm signup") must contain
  `{{ .Token }}` so the email shows the 6-digit code, e.g. subject `Dein ConnectUni-Code: {{ .Token }}`.
- **Email delivery:** Supabase's built-in mailer only sends to members of your Supabase team and only a few
  per hour. For real users, send through the IONOS mailbox (Authentication → SMTP Settings): host
  `smtp.ionos.de`, port `465`, username and sender `support@connect-uni.de`, sender name `ConnectUni`,
  password = the mailbox password. Then raise the email limit under Authentication → Rate Limits.
- **Test accounts:** `review@connect-uni.de` (for Apple's review), `test@connect-uni.de` and
  `loeschtest@connect-uni.de` log in with a password instead of a code and live in their own test university.
  Create them under Authentication → Users, then run `supabase/review-accounts.sql`, which adds their profiles,
  a wave, a message, a group invite and hangouts. The steps and the password are in `PRUEFKONTEN.local.md`,
  which stays out of git.

## iOS app (Capacitor)

```bash
npm run ios      # builds the web app, copies it into ios/ and opens Xcode
```

In Xcode, pick a simulator or your iPhone and press Run. On your own iPhone a free Apple account (Personal
Team) works for 7 days per install; TestFlight and the App Store need the paid Apple Developer Program.
The App Store bundle ID is `de.connectuni.app`; it can't be changed once the app exists in App Store Connect.
While only the free Personal Team is available, the Xcode project uses `de.connectuni.app.dev`, so the real ID
doesn't get tied to the Personal Team. Set it back to `de.connectuni.app` (target App → Signing & Capabilities)
together with the paid team before the first archive. The app is iPhone-only for now, so the App Store needs no
iPad screenshots.

After adding a Capacitor plugin, clean the build (Xcode: Product → Clean Build Folder, or `xcodebuild` with a fresh
`-derivedDataPath`) before archiving. Otherwise Xcode can reuse the old package graph and leave the new plugin out of
the app without any error, and its JavaScript calls fail silently. Check with `strings App.app/App | grep PushNotificationsPlugin`.

## App Store

[`store/app-store.md`](store/app-store.md) has everything to enter in App Store Connect: texts in German and
English, keywords, review notes with the test account and the answers for the privacy questionnaire. The
screenshots are in `store/screenshots/`; `npm run screenshots` makes new ones from the demo mode (needs
Google Chrome).

The iOS 26.3.1 simulator runtime draws emoji as "?" boxes, which is an Apple bug. Real devices are not affected.

## Look and feel

- **Dark mode:** profile sheet → Appearance (Auto follows the phone, or Light / Dark). The palette is swapped in
  `src/index.css` under `html.dark`; `src/theme.js` sets it. New Tailwind colors need a line there.
- **Gestures:** a chat follows your finger when you swipe it away from the left edge; pull down in the chat list or in a
  chat to reload.

## Website (privacy policy, support, imprint)

Apple needs a public privacy policy URL and support URL, and German law needs an imprint on the web. The texts live in
one place, [`src/legal.js`](src/legal.js), which the app and the website both use. `node website/build.mjs` writes the
pages (imprint, privacy, terms, support, home; German with an English version at `#en`) into [`docs/`](docs). Run it after
every change to `legal.js`.

To publish, either upload the **contents** of `docs/` to the web root of connect-uni.de at IONOS (webspace → file
manager or SFTP), so that `https://connect-uni.de/datenschutz/` and `/support/` work, or serve `docs/` with GitHub Pages
(Settings → Pages → branch `main`, folder `/docs`, custom domain `connect-uni.de`, plus the DNS records GitHub shows at
IONOS). The imprint page is `noindex`, so search engines skip it; it is still linked in every page's footer.

## Using the component elsewhere

`ConnectUni.jsx` only needs React 18+, Tailwind CSS (v3.4+ or v4) and `lucide-react`. It injects its own
animations and respects notch and home-indicator safe areas. The font (Plus Jakarta Sans) ships with the app
via `@fontsource-variable/plus-jakarta-sans` in `src/main.jsx`, so nothing loads from Google.

## Before release

- Legal texts (`src/legal.js`) are drafts with the real provider details; have them reviewed by a lawyer. They name Supabase (servers in Ireland, EU), IONOS and Unsplash as
  processors; sign the data processing agreements with Supabase and IONOS. The contact address is
  `SUPPORT_EMAIL` (support@connect-uni.de).
- The App Store needs the privacy policy and support pages on the web: `node website/build.mjs`, then publish `docs/` (see Website above).
- Reports land in the `reports` table (Supabase → Table Editor). The terms promise a review within 24 hours. To
  remove someone, run `select public.ban_user('their@uni.de');` in the SQL Editor: it deletes their profile, messages
  and hangouts and stops the email from signing in again. It returns their account ID; delete the folder with that
  name under Storage → avatars yourself.

The previous minimal design is kept in [`backup/UniConnect.minimal.jsx`](backup/UniConnect.minimal.jsx).
