# App Store Connect: ConnectUni

Alles, was du beim Anlegen der App in App Store Connect eintragen musst. Texte in eckigen Klammern füllst du
selbst aus (nur noch die Telefonnummer). Die Zeichengrenzen von Apple sind eingehalten (geprüft).

## App-Informationen

| Feld | Eintrag |
|---|---|
| Name | ConnectUni |
| Bundle ID | `de.connectuni.app` |
| SKU | `connectuni-ios` |
| Primäre Sprache | Deutsch |
| Kategorie | Soziale Netze (zweite Kategorie optional: Lifestyle) |
| Preis | Kostenlos |
| Copyright | 2026 Kiril Temelkov |
| Support-URL | `https://connect-uni.de/support` (die Seite entsteht mit `node website/build.mjs`, siehe README → Website) |
| Datenschutz-URL | `https://connect-uni.de/datenschutz` (dto.) |
| Marketing-URL | optional: `https://connect-uni.de` |
| Altersfreigabe | Fragebogen ausfüllen wie unten im Abschnitt „Altersfreigabe“, Ergebnis mindestens 16+. |
| Verschlüsselung | Nichts zu tun, die App erklärt das schon selbst (`ITSAppUsesNonExemptEncryption = NO`). |
| Rechte an Inhalten | Ja, die App zeigt Inhalte Dritter: Fotos der Nutzer und Bilder von Unsplash (Unsplash-Lizenz). |

## Deutsch

**Untertitel** (max. 30 Zeichen)

```
Freunde finden an deiner Uni
```

**Werbetext** (max. 170 Zeichen)

```
Neu an der Uni oder Lust auf neue Leute? Finde Studis aus deinem Fach, spontane Mensa-Treffen und Lerngruppen. Nur mit verifizierter Uni-Mail.
```

**Beschreibung**

```
ConnectUni ist die App, um an deiner Hochschule echte Freunde zu finden: Leute aus deinem Fach, für die Lerngruppe, die Mensa oder den Abend.

NUR ECHTE STUDIERENDE
Anmelden kannst du dich nur mit deiner Uni-Mail. Du siehst nur Studierende deiner eigenen Hochschule, und niemand sonst sieht dein Profil.

MATCH ÜBER DEIN FACH
Wähle Hauptfach, Nebenfach und Semester. ConnectUni zeigt dir zuerst die Leute, mit denen du etwas gemeinsam hast: dasselbe Fach, dasselbe Nebenfach oder dieselben Interessen.

CONNECTEN UND SCHREIBEN
Wink jemandem zu. Winkt die Person zurück, seid ihr verbunden und schreibt euch direkt im Chat.

SPONTAN
Mensa in 20 Minuten? Kaffee nach der Vorlesung? Starte ein spontanes Treffen für deine ganze Uni oder nur für dein Fach und sieh, wer dabei ist.

GRUPPEN
Lerngruppen, Sport, Erstis, Hobbys: Tritt Gruppen bei oder gründe eigene und lade Leute ein. Jede Gruppe hat ihren eigenen Chat.

SICHER
Du kannst jedes Profil und jeden Chat melden und Personen blockieren. Wir prüfen Meldungen innerhalb von 24 Stunden. Dein Konto löschst du jederzeit direkt in der App.

Für über 390 Hochschulen in Deutschland, Universitäten wie Fachhochschulen. Auf Deutsch und Englisch.
```

**Keywords** (max. 100 Zeichen, mit Komma, ohne Leerzeichen)

```
Studium,Studenten,Hochschule,Kommilitonen,Freunde,Lerngruppe,Mensa,Erstsemester,Campus,FH,Ersti
```

## English

**Subtitle**

```
Make friends at your uni
```

**Promotional text**

```
New at uni or looking for new people? Meet students from your subject, spontaneous lunch meetups and study groups. Verified uni email only.
```

**Description**

```
ConnectUni helps you find real friends at your university: people from your subject, for your study group, lunch at the Mensa or a night out.

ONLY REAL STUDENTS
You can only sign up with your university email. You only see students from your own university, and nobody else sees your profile.

MATCHED BY YOUR SUBJECT
Pick your major, minor and semester. ConnectUni shows you the people you have something in common with first: the same major, the same minor or the same interests.

CONNECT AND CHAT
Wave at someone. If they wave back, you're connected and can chat right away.

SPONTANEOUS MEETUPS
Lunch in 20 minutes? Coffee after the lecture? Start a hangout for your whole university or just your subject and see who's in.

GROUPS
Study groups, sports, freshers, hobbies: join groups or start your own and invite people. Every group has its own chat.

SAFE
You can report any profile or chat and block people. We review reports within 24 hours. You can delete your account at any time right in the app.

For more than 390 universities and universities of applied sciences in Germany. In German and English.
```

**Keywords**

```
university,students,college,classmates,friends,study group,campus,freshers,make friends,social
```

## Screenshots

`store/screenshots/de/` und `store/screenshots/en/`, je 5 Bilder in 1320 × 2868 (6,9-Zoll-iPhone). Hochladen in
der Reihenfolge der Dateinamen. Apple verkleinert sie selbst für kleinere iPhones. Neu erzeugen nach
Änderungen am Design: `npm run screenshots`.

Die Personen auf den Fotos sind Unsplash-Bilder aus dem Demo-Modus, keine echten Nutzer.

## App-Review-Informationen

**Anmeldung erforderlich:** ja. Benutzername `review@connect-uni.de`, Passwort aus `PRUEFKONTEN.local.md`.

**Kontakt:** Kiril Temelkov, [Telefonnummer], support@connect-uni.de

Apple verlangt hier eine Telefonnummer für Rückfragen der Prüfer. Sie wird nicht veröffentlicht.

**Notizen** (auf Englisch, für die Prüfer):

```
ConnectUni is only for students: sign-up requires a university email address and sends a 6-digit code to it. For the review, please use the test account above, which logs in with a password instead of a code:

1. Tap "Already on ConnectUni? Log in".
2. Enter review@connect-uni.de and tap "Continue".
3. Enter the password and tap "Log in".

The test account belongs to a separate test university with other test students, so you can try everything: wave back at Mia ("Wave back"), chat, join hangouts ("Hangouts" tab) and accept the study group invite ("Circles" tab).

- Report and block: open any profile and tap "Report" or "Block" at the bottom; in a chat, tap the flag icon.
- Filter: our server replaces offensive words in messages, names, hangouts and groups with ***.
- We review reports within 24 hours, remove the content and ban the account that posted it.
- Delete account: tap the university badge at the top left, then "Delete account".
- Terms (zero tolerance for objectionable content) and privacy policy: in the same menu under "Legal & help". New users must accept the terms with a checkbox on the sign-up screen.
```

Vor jeder Einreichung: `supabase/review-accounts.sql` noch einmal ausführen (neue Hangouts). Hat Apple das
Prüfkonto gelöscht, legst du es wie in `PRUEFKONTEN.local.md` beschrieben neu an.

## Altersfreigabe (Fragebogen)

Apple fragt, was die App **kann**, nicht wer sie typischerweise nutzt. Auch Studierende können unter 18 sein, und
ConnectUni hat Chat und Nutzerinhalte, deshalb zählt das. Die Fragen heißen je nach Version von App Store Connect
leicht anders; sinngemäß so antworten:

| Frage | Antwort |
|---|---|
| Gewalt (Cartoon, realistisch, drastisch), Waffen | Keine |
| Sexuelle oder anzügliche Inhalte, Nacktheit | Keine (eigene Inhalte der App). Nutzerinhalte deckt die Frage unten ab. |
| Alkohol, Tabak, Drogen; Horror; Profanität | Keine |
| Glücksspiel (simuliert oder echt), Wettbewerbe | Keine |
| Medizinische Informationen, Gesundheitsthemen | Keine |
| **Nachrichten und Chat** | **Ja** |
| **Nutzergenerierte Inhalte** | **Ja** (Fotos, Texte, Hangouts, Gruppen) |
| Uneingeschränkter Webzugriff | Nein (die App öffnet keine freien Webseiten) |
| Werbung | Nein |
| Kindersicherung | Nein |
| Altersüberprüfung durch die App | Nein (wir fragen nur das Geburtsjahr ab und lassen nur Jahrgänge ab 16 zu; keine Ausweisprüfung) |

Das Ergebnis ist meist 13+ oder 16+. Unsere Nutzungsbedingungen und die DSGVO-Einwilligungsgrenze in Deutschland
verlangen **16 Jahre**: Liegt das Ergebnis darunter, hebst du die Freigabe in App Store Connect auf **16+** an
(„Altersfreigabe“ → höhere Freigabe wählen / Override). Antworte nie „Keine“ bei Chat oder Nutzerinhalten.

## Händlerstatus (EU, Digital Services Act)

Apple fragt jeden Entwickler, ob er „Händler“ (Trader) ist. Das hängt nicht vom Preis ab, sondern davon, ob du
beruflich oder geschäftlich handelst.

- **Händler:** Apple zeigt Name, Adresse, Telefonnummer und E-Mail in der EU öffentlich auf der App-Seite. Wähle das,
  wenn du Einnahmen planst (Werbung, Abo) oder ConnectUni als Geschäft betreibst. Nimm die Angaben, die zum Impressum passen.
- **Kein Händler:** Ein reines Hobbyprojekt ohne Einnahmen. Dann bleiben die Kontaktdaten verborgen. Bist du unsicher, frag vor dem Einreichen kurz einen Anwalt.
- **Wichtig:** Als Verkäufer steht in App Store und Impressum **dieselbe Person**. Der Apple-Entwicklerkonto-Inhaber ist
  Emir Gani, das Impressum nennt Kiril Temelkov. Das passt nicht zusammen. Entweder steht in beiden dieselbe Person
  (Impressum auf den Konto-Inhaber ändern oder beide als GbR nennen), oder die App zieht auf ein Konto, das auf den
  Betreiber läuft.

## App-Datenschutz (Fragebogen)

Tracking: **nein**. Alle Daten dienen der **App-Funktionalität** und sind **mit der Identität verknüpft**.

| Kategorie in App Store Connect | Was ConnectUni speichert |
|---|---|
| Kontaktinformationen → E-Mail-Adresse | Uni-Mail für die Anmeldung |
| Kontaktinformationen → Name | Name im Profil |
| Nutzerinhalte → Fotos oder Videos | Profilfoto |
| Nutzerinhalte → E-Mails oder Textnachrichten | Chat-Nachrichten |
| Nutzerinhalte → Andere Nutzerinhalte | Über-mich-Text, Status, Hangouts, Gruppen, Meldungen |
| Kennungen → Nutzer-ID | Konto-ID |
| Kennungen → Geräte-ID | Push-Token des iPhones (nur wenn Mitteilungen erlaubt sind). Sicherheitshalber angeben: Funktionalität, mit Identität verknüpft, kein Tracking. |
| Andere Daten → Andere Datentypen | Geburtsjahr, Hochschule, Fächer, Semester, Interessen |

Nicht erhoben: Standort, Kontakte, Nutzungs- und Diagnosedaten, Werbe-IDs, Käufe.
