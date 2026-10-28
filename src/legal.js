// Legal texts, shown in the app (Profile → Legal & help) and on the website (website/build.mjs writes them to docs/).
// One source for both, so the app and the pages Apple links to can't disagree. Drafts: have a lawyer check them before launch.
// Keep this file free of imports so Node can load it too.

export const SUPPORT_EMAIL = "support@connect-uni.de";
export const SITE = "https://connect-uni.de";

// Who runs ConnectUni (the imprint is the only place with the address; the other texts point to it).
export const PROVIDER = { name: "Kiril Temelkov", product: "ConnectUni", street: "Lohbreite 1", zip: "33607", city: "Bielefeld" };

export const LEGAL_DATE = { de: "27. Oktober 2026", en: "27 October 2026" };

export const LEGAL = {
  terms: {
    de: [
      ["Anbieter", `ConnectUni wird betrieben von ${PROVIDER.name}. Die Anschrift steht im Impressum. Kontakt: ${SUPPORT_EMAIL}`],
      [
        "Wer mitmachen darf",
        "ConnectUni ist nur für Studierende mit einer gültigen Hochschul-E-Mail-Adresse. Du musst mindestens 16 Jahre alt sein und darfst nur ein Konto haben.",
      ],
      [
        "Null Toleranz",
        "Keine Belästigung, Hassrede, Diskriminierung, Drohungen, sexuellen oder gewaltverherrlichenden Inhalte und kein Spam. Keine Fake-Profile und keine Fotos anderer Personen ohne deren Erlaubnis. Grobe Beleidigungen ersetzt ConnectUni automatisch durch ***.",
      ],
      [
        "Melden & Blockieren",
        "Du kannst jedes Profil und jeden Chat melden und Personen blockieren. Wir prüfen Meldungen innerhalb von 24 Stunden, entfernen verbotene Inhalte und sperren Konten, die gegen diese Regeln verstoßen.",
      ],
      [
        "Sperren",
        `Bei Verstößen entfernen wir Inhalte und sperren das Konto, bei schweren Verstößen ohne Vorwarnung. Eine gesperrte E-Mail-Adresse kann sich nicht neu anmelden. Wenn du glaubst, dass eine Sperre ein Fehler war, schreib an ${SUPPORT_EMAIL}.`,
      ],
      ["Deine Inhalte", "Fotos und Texte bleiben deine. Du erlaubst uns, sie in ConnectUni anzuzeigen, solange dein Konto besteht."],
      ["Treffen", "Hangouts finden im echten Leben statt. Triff dich an öffentlichen Orten und pass auf dich auf."],
      [
        "Kostenlos, ohne Garantie",
        "ConnectUni ist kostenlos. Wir bemühen uns um einen stabilen Betrieb, können aber keine ständige Verfügbarkeit zusagen und Funktionen ändern oder einstellen.",
      ],
      ["Konto löschen", "Du kannst dein Konto jederzeit unter „Mein Profil → Konto löschen“ löschen. Deine Daten werden dabei endgültig entfernt."],
      ["Kontakt", SUPPORT_EMAIL],
    ],
    en: [
      ["Provider", `ConnectUni is run by ${PROVIDER.name}. The address is in the legal notice. Contact: ${SUPPORT_EMAIL}`],
      [
        "Who can join",
        "ConnectUni is only for students with a valid university email address. You must be at least 16 and may only have one account.",
      ],
      [
        "Zero tolerance",
        "No harassment, hate speech, discrimination, threats, sexual or violent content and no spam. No fake profiles and no photos of other people without their permission. ConnectUni automatically replaces gross insults with ***.",
      ],
      [
        "Report & block",
        "You can report any profile or chat and block people. We review reports within 24 hours, remove prohibited content and suspend accounts that break these rules.",
      ],
      [
        "Suspensions",
        `If you break these rules we remove content and suspend the account, without warning for serious violations. A suspended email address can't sign up again. If you think a suspension was a mistake, write to ${SUPPORT_EMAIL}.`,
      ],
      ["Your content", "Your photos and texts stay yours. You allow us to show them in ConnectUni for as long as your account exists."],
      ["Meeting up", "Hangouts happen in real life. Meet in public places and look out for yourself."],
      [
        "Free, no guarantee",
        "ConnectUni is free. We aim for stable service but can't promise constant availability, and we may change or stop features.",
      ],
      ["Deleting your account", "You can delete your account at any time under “My profile → Delete account”. Your data is then removed for good."],
      ["Contact", SUPPORT_EMAIL],
    ],
  },

  privacy: {
    de: [
      [
        "Verantwortlich",
        `${PROVIDER.name} (ConnectUni). Die Anschrift steht im Impressum.\nE-Mail: ${SUPPORT_EMAIL}\nEinen Datenschutzbeauftragten haben wir nicht benannt, weil das für uns nicht vorgeschrieben ist. Bei Fragen schreib uns.`,
      ],
      [
        "Welche Daten wir verarbeiten",
        "• Konto: deine Hochschul-E-Mail-Adresse (zur Anmeldung per Einmal-Code, nie öffentlich).\n• Profil: Name, Geburtsjahr (andere sehen in der App nur dein Alter), Hochschule, Haupt- und Nebenfach, Semester, Interessen, Status, Über-mich-Text und Profilfotos.\n• Inhalte und Aktivität: Verbindungen („Winken“), Nachrichten, Hangouts, Gruppen und deren Mitglieder, Benachrichtigungen, Meldungen und Blockierungen, außerdem ob du gerade online warst.\n• Push-Mitteilungen: wenn du sie erlaubst, das Gerätetoken deines iPhones und deine App-Sprache.\n• Technische Daten: IP-Adresse, Gerätetyp und Zeitpunkt in den Server-Protokollen unseres Dienstleisters.\n• Kamera und Fotos: die App greift nur auf das Foto zu, das du für dein Profil aufnimmst oder auswählst. Es wird vor dem Hochladen verkleinert.",
      ],
      [
        "Wofür und auf welcher Grundlage",
        "• Um dir ConnectUni bereitzustellen: Konto, Profil, Chats, Hangouts und Gruppen (Art. 6 Abs. 1 lit. b DSGVO).\n• Für Sicherheit, Missbrauchsschutz und Moderation, also Meldungen, Blockierungen, den automatischen Wortfilter und Sperren (Art. 6 Abs. 1 lit. f DSGVO).\n• Für Push-Mitteilungen, wenn du sie in iOS erlaubst (Art. 6 Abs. 1 lit. a DSGVO). Du kannst sie jederzeit unter iPhone-Einstellungen → Mitteilungen → ConnectUni abschalten.\n• Zur Prüfung des Mindestalters von 16 Jahren über das Geburtsjahr (Art. 6 Abs. 1 lit. b und f DSGVO).\n• Um gesetzliche Pflichten zu erfüllen (Art. 6 Abs. 1 lit. c DSGVO).\nKeine Werbung, kein Tracking, keine Analyse-Dienste, kein Verkauf von Daten. Es gibt keine automatisierten Entscheidungen mit rechtlicher Wirkung: Der Wortfilter ersetzt nur Wörter, über Sperren entscheiden wir von Hand.",
      ],
      [
        "Wer Daten erhält",
        "• Andere Nutzer: Dein Profil (ohne E-Mail-Adresse, vom Geburtsjahr nur das Alter) sehen nur verifizierte Studierende deiner Hochschule, die du nicht blockiert hast. Nachrichten sehen nur die Teilnehmer des Chats. Hangouts und Gruppen sehen die Studierenden deiner Hochschule, bei „nur mein Fach“ nur dein Fach.\n• Supabase Inc.: Datenbank, Anmeldung, Foto-Speicher und Server-Funktionen in unserem Auftrag. Die Server stehen in Irland (EU). Supabase hat seinen Sitz in den USA; für mögliche Zugriffe von dort gelten EU-Standardvertragsklauseln.\n• IONOS SE (Deutschland): Versand der Anmeldecodes über unser E-Mail-Postfach sowie die Domain.\n• GitHub Inc. (USA): stellt die Website connect-uni.de bereit (GitHub Pages) und sieht dabei die IP-Adresse der Besucher. GitHub ist nach dem EU-US Data Privacy Framework zertifiziert. Die App selbst nutzt GitHub nicht.\n• Apple: Wenn du Push erlaubst, liefert Apples Push-Dienst die Mitteilung auf dein Gerät. Sie enthält den Namen des Absenders und den Anfang der Nachricht. Apple ist dafür selbst verantwortlich. Apple stellt auch den App Store und TestFlight bereit.\n• Unsplash: Titel- und Beispielbilder lädt die App von images.unsplash.com, dabei sieht Unsplash deine IP-Adresse.\n• Behörden, wenn wir gesetzlich dazu verpflichtet sind.",
      ],
      [
        "Auf deinem Gerät",
        "Die App speichert auf deinem Gerät nur, was sie zum Funktionieren braucht: deine Anmeldung, die gewählte Sprache und das Hell/Dunkel-Design. Keine Analyse- oder Werbe-Cookies.",
      ],
      [
        "Wie lange",
        "Solange dein Konto besteht. Wenn du es in der App löschst, werden Profil, Fotos, Nachrichten, Hangouts und Gruppen-Mitgliedschaften entfernt; letzte Reste in technischen Protokollen verschwinden innerhalb von 30 Tagen, sofern wir sie nicht gesetzlich länger aufbewahren müssen. Wenn wir ein Konto wegen Verstößen sperren, behalten wir die gesperrte E-Mail-Adresse, damit sie sich nicht neu anmelden kann (Art. 6 Abs. 1 lit. f DSGVO).",
      ],
      [
        "Deine Rechte",
        `Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch (Art. 15–21 DSGVO) und kannst Einwilligungen jederzeit widerrufen. Schreib dafür an ${SUPPORT_EMAIL}. Dein Konto löschst du direkt in der App. Du kannst dich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf (ldi.nrw.de).`,
      ],
      ["Kinder und Jugendliche", "ConnectUni ist erst ab 16 Jahren. Wenn wir erfahren, dass jemand jünger ist, löschen wir das Konto."],
      ["Stand", LEGAL_DATE.de],
    ],
    en: [
      [
        "Controller",
        `${PROVIDER.name} (ConnectUni). The address is in the legal notice.\nEmail: ${SUPPORT_EMAIL}\nWe haven't appointed a data protection officer because we aren't required to. If you have questions, write to us.`,
      ],
      [
        "What we process",
        "• Account: your university email address (for signing in with a one-time code, never public).\n• Profile: name, year of birth (others only see your age in the app), university, major and minor, semester, interests, status, bio and profile photos.\n• Content and activity: connections (“waves”), messages, hangouts, groups and their members, notifications, reports and blocks, and whether you were recently online.\n• Push notifications: if you allow them, your iPhone's device token and your app language.\n• Technical data: IP address, device type and time in our provider's server logs.\n• Camera and photos: the app only accesses the photo you take or pick for your profile. It is scaled down before upload.",
      ],
      [
        "Why and on what basis",
        "• To provide ConnectUni: account, profile, chats, hangouts and groups (Art. 6(1)(b) GDPR).\n• For safety, abuse prevention and moderation, i.e. reports, blocks, the automatic word filter and suspensions (Art. 6(1)(f) GDPR).\n• For push notifications, if you allow them in iOS (Art. 6(1)(a) GDPR). You can turn them off any time under iPhone Settings → Notifications → ConnectUni.\n• To check the minimum age of 16 through your year of birth (Art. 6(1)(b) and (f) GDPR).\n• To meet legal obligations (Art. 6(1)(c) GDPR).\nNo ads, no tracking, no analytics services, no selling of data. There are no automated decisions with legal effect: the word filter only replaces words, and we decide on suspensions by hand.",
      ],
      [
        "Who receives data",
        "• Other users: your profile (without your email address, and of your year of birth only your age) is visible only to verified students at your university whom you haven't blocked. Messages are visible only to the participants of the chat. Hangouts and groups are visible to students at your university, or to your major only if set to “only my major”.\n• Supabase Inc.: database, sign-in, photo storage and server functions on our behalf. The servers are in Ireland (EU). Supabase is based in the USA; EU Standard Contractual Clauses cover possible access from there.\n• IONOS SE (Germany): sending the sign-in codes from our mailbox, plus the domain.\nâ¢ GitHub Inc. (USA): hosts the website connect-uni.de (GitHub Pages) and sees visitorsâ IP addresses. GitHub is certified under the EU-US Data Privacy Framework. The app itself doesnât use GitHub.\n• Apple: if you allow push, Apple's push service delivers the notification to your device. It contains the sender's name and the start of the message. Apple is responsible for that service itself. Apple also provides the App Store and TestFlight.\n• Unsplash: the app loads cover and sample images from images.unsplash.com, so Unsplash sees your IP address.\n• Authorities, where we are legally required to.",
      ],
      [
        "On your device",
        "The app only stores what it needs to work on your device: your sign-in, your chosen language and the light/dark theme. No analytics or advertising cookies.",
      ],
      [
        "How long",
        "As long as your account exists. When you delete it in the app, your profile, photos, messages, hangouts and group memberships are removed; last traces in technical logs disappear within 30 days unless the law requires us to keep them longer. If we suspend an account for violations, we keep the suspended email address so it can't sign up again (Art. 6(1)(f) GDPR).",
      ],
      [
        "Your rights",
        `You have the right of access, rectification, erasure, restriction, data portability and objection (Art. 15–21 GDPR), and you can withdraw consent at any time. Write to ${SUPPORT_EMAIL}. You delete your account right in the app. You can also complain to a data protection authority, for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia, Kavalleriestraße 2–4, 40213 Düsseldorf, Germany (ldi.nrw.de).`,
      ],
      ["Children and teenagers", "ConnectUni is for people aged 16 and over. If we learn that someone is younger, we delete the account."],
      ["Last updated", LEGAL_DATE.en],
    ],
  },

  imprint: {
    de: [
      ["Angaben gemäß § 5 DDG", `${PROVIDER.name}\n${PROVIDER.product}\n${PROVIDER.street}\n${PROVIDER.zip} ${PROVIDER.city}\nDeutschland`],
      ["Kontakt", `E-Mail: ${SUPPORT_EMAIL}`],
      [
        "Kontaktstelle nach dem Digital Services Act",
        `Nutzer und Behörden erreichen uns unter ${SUPPORT_EMAIL}, auf Deutsch und Englisch. Inhalte kannst du in der App direkt melden (Profil → Melden).`,
      ],
      [
        "Inhalte von Nutzern",
        "Für Fotos, Texte und andere Inhalte, die Nutzer einstellen, sind diese selbst verantwortlich. Wir prüfen gemeldete Inhalte innerhalb von 24 Stunden und entfernen rechtswidrige Inhalte.",
      ],
      [
        "Verbraucherstreitbeilegung",
        "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      ],
    ],
    en: [
      [
        "Information according to § 5 DDG (German Digital Services Act)",
        `${PROVIDER.name}\n${PROVIDER.product}\n${PROVIDER.street}\n${PROVIDER.zip} ${PROVIDER.city}\nGermany`,
      ],
      ["Contact", `Email: ${SUPPORT_EMAIL}`],
      [
        "Point of contact under the Digital Services Act",
        `Users and authorities can reach us at ${SUPPORT_EMAIL}, in German and English. You can report content right in the app (Profile → Report).`,
      ],
      [
        "User content",
        "Users are responsible for the photos, texts and other content they post. We review reported content within 24 hours and remove unlawful content.",
      ],
      [
        "Consumer dispute resolution",
        "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board.",
      ],
    ],
  },
};
