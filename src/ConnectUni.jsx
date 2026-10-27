import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { getTheme, setTheme } from "./theme.js";
import { Capacitor } from "@capacitor/core";
import { enablePush, forgetPush, pushState, startPush } from "./push.js";
import { LEGAL, SUPPORT_EMAIL } from "./legal.js";
import { success, tap } from "./haptics.js";
import {
  ArrowDown,
  ArrowLeft,
  Ban,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Flag,
  Hand,
  Heart,
  House,
  Info,
  LoaderCircle,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  RotateCcw,
  Scale,
  Search,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────────────────
 * ConnectUni: photo-first campus friend finder. Bilingual (DE / EN), all data mocked.
 * ──────────────────────────────────────────────────────────────────────────── */

const STRINGS = {
  en: {
    close: "Close",
    back: "Back",
    less: "Less",
    more: "More",
    language: "Language",
    theme: "Appearance",
    themeSystem: "Auto",
    themeLight: "Light",
    themeDark: "Dark",
    refreshing: "Updating…",
    pushTitle: "Push notifications",
    pushOn: "On",
    pushWait: "Setting up…",
    pushAsk: "Turn on",
    pushDenied: "Off. Allow them in iPhone Settings → Notifications → ConnectUni.",
    heroA: "Find ",
    heroB: "your people",
    heroC: " on campus.",
    heroLead: "Only verified students. Match by Fach, meet up spontaneously, make real friends.",
    s1Title: "Where do you study?",
    otherUni: "Other uni",
    searchUni: "Name, city or short name",
    uniSearchHint: "Search {n} universities and colleges, e.g. “Bielefeld” or “HSBI”.",
    noUniMatch: "No match. Pick “My uni isn't listed” below.",
    uniType_uni: "University",
    uniType_haw: "University of applied sciences",
    uniType_art: "Art & music",
    uniType_admin: "Public administration",
    uniType_other: "Specialised university",
    notListed: "My uni isn't listed",
    customUniPh: "Name of your university",
    crowd: "{n} students from your uni are already here 👀",
    s2Title: "What do you study?",
    majorLabel: "Major (Hauptfach)",
    minorLabel: "Minor (optional)",
    noMinor: "None",
    semesterLabel: "Semester",
    ersti: "Fresher 🐣",
    semesterN: "Semester {n}",
    s3Title: "Your official uni email",
    emailHint: "We'll send you a 6-digit code. Your address never shows on your profile.",
    emailLocalPh: "firstname.lastname",
    emailFullPh: "name@uni-example.de",
    domain: "Domain",
    emailOk: "Uni domain verified ✓",
    emailAltHint: "Different ending, like @stud…? Just type your full address.",
    errDomainEnd: "Your address needs to end in @{domain}.",
    errLocal: "Only letters, numbers, dots and dashes before the @.",
    errFormat: "That doesn't look like an email address yet.",
    errPersonal: "{provider} is a private address. Use your uni email.",
    errDomain: "That doesn't look like a university domain.",
    sendCode: "Send code ✉️",
    sending: "Sending…",
    codeSent: "Code sent ✓",
    s4Title: "Enter your code",
    tapToFill: "tap to fill",
    codeSentTo: "Sent to {email}",
    verified: "You're in! 🎉",
    codeWrong: "Not quite. Try again!",
    digit: "Digit {n}",
    resendIn: "Resend code in {s}s",
    resend: "Resend code",
    quickDemo: "⚡ Quick Demo Login",
    quickDemoSub: "Skip sign-up and look around as Max.",
    itsAMatch: "🎉 It's a Study Match!",
    collageMatch: "You and Lena both study Computer Science",
    matchBody: "You and {name} are now connected.",
    chatCta: "Chat 💬",
    filters: "Filters",
    filterMajor: "🔥 Your Fach ({subject})",
    filterMinor: "✨ Minor ({subject})",
    filterInterests: "🎯 Same interests",
    filterAll: "🌍 Discover all",
    emptyFilter: "No one here yet. Try another filter.",
    activeNow: "Active now",
    activeAgo: "Active {ago}",
    yourStatus: "Your status",
    connect: "Connect",
    connected: "Connected",
    waveBack: "Wave back",
    openProfile: "Open {name}'s profile",
    online: "Online",
    semShort: "Sem {n}",
    messageTo: "Message {name}",
    storyOf: "Story from {name}",
    prevStory: "Previous",
    nextStory: "Next",
    wave: "Wave 👋",
    message: "Message",
    profile: "Profile",
    waveSent: "You waved at {name} 👋",
    matchLine: "{n}% Match",
    whyMatch: "Why you match",
    reasonSameMajor: "Same major: {subject}",
    reasonTheirMajor: "Studies your minor {subject}",
    reasonAlso: "Also {subject}",
    reasonInterests: "{n} shared interests",
    reasonInterests_one: "1 shared interest",
    reasonSemester: "Same semester",
    interests: "Interests",
    createGroupWith: "Start a group",
    inviteToGroup: "Invite to group",
    inviteNameTo: "Invite {name} to…",
    invited: "Invited ✓",
    invite: "Invite",
    statusTitle: "What are you up to?",
    clearStatus: "Clear status",
    statusSet: "Status updated",
    navStart: "People",
    navSpontan: "Hangouts",
    navGroups: "Circles",
    navChats: "Chats",
    spontanTitle: "Hangouts ✨",
    spontanLead: "What's happening on campus right now?",
    newHangout: "Hangout",
    hfAll: "All",
    hfToday: "Now & today",
    hfMajor: "🔒 {subject}",
    hfMine: "Mine",
    noHangouts: "Nothing planned. Start something!",
    hiddenHangouts: "{n} hangouts are only for other Fächer",
    hiddenHangouts_one: "1 hangout is only for another Fach",
    liveNow: "Live now",
    dayAt: "{day} · {time}",
    audienceMajor: "🔒 {subject} only",
    audienceAll: "🌍 Whole uni",
    byYou: "by you",
    hostedBy: "by {name}",
    approvalNote: "host approves",
    going: "{n}/{max} going",
    whoIsComing: "Who's coming",
    hostTag: "Host",
    yourHangout: "Your hangout",
    join: "I'm in 🙌",
    joined: "You're in ✓",
    requestJoin: "Request 🙋",
    requested: "Requested…",
    full: "Full",
    requestSent: "Request sent 🙋",
    joinedToast: "You're in! 🙌",
    posted: "Your hangout is live! 🚀",
    chTitle: "New hangout",
    chWhat: "What's the plan?",
    chName: "Title",
    chWhen: "Starts",
    chDate: "Date",
    chTime: "Time",
    chDuration: "Available for",
    chDurationHint: "It stays visible for this long after its start time.",
    duration30: "30 minutes",
    duration1h: "1 hour",
    durationHours: "{n} hours",
    durationHoursHalf: "{n}½ hours",
    chWhere: "Meeting point",
    placePlaceholder: "e.g. Main Mensa, library entrance",
    hangoutDetails: "Hangout details",
    meetAt: "Meet at",
    startsAt: "Starts",
    availableUntil: "Available until",
    availableUntilShort: "until {time}",
    minutesLeft: "{n} minutes left",
    minutesLeft_one: "1 minute left",
    duration: "Available for",
    deleteHangout: "Delete hangout",
    confirmDeleteHangout: "Delete this hangout?",
    confirmDeleteHangoutBody: "This will remove it for everyone who planned to join.",
    keepHangout: "Keep hangout",
    hangoutDeleted: "Hangout deleted",
    errPlace: "Add a meeting point.",
    chMax: "How many?",
    people: "{n} people",
    whoCanJoin: "Who can join?",
    onlyMajor: "Only my Fach",
    onlyMajorSub: "Only {subject} students see it",
    wholeUni: "Whole uni",
    wholeUniSub: "Open to every Fach",
    post: "Post hangout 🚀",
    errTitle: "Give it a short title.",
    errPast: "Pick a time that hasn't passed yet.",
    groupsTitle: "Circles",
    groupsLead: "Your Fach, your hobbies, your people.",
    newGroup: "Group",
    tabMine: "Mine",
    tabDiscover: "Discover",
    noMyGroups: "You're not in a group yet.",
    allJoined: "You've joined every group 🙌",
    hiddenGroups: "{n} groups are only for other Fächer",
    hiddenGroups_one: "1 group is only for another Fach",
    members: "{n} members",
    members_one: "1 member",
    open: "Open",
    joinGroup: "Join",
    joinedGroup: "Welcome to {name}! 🎉",
    cgTitle: "New group",
    cgVibe: "Vibe",
    cgName: "Name",
    cgNamePh: "e.g. {subject} study crew",
    cgAbout: "What's it about?",
    cgAboutPh: "Exam prep, Mensa, memes…",
    cgAboutDefault: "New group. Say hi 👋",
    cgInvite: "Invite friends",
    noFriends: "Connect with people first 👋",
    cgCreate: "Create group ✨",
    created: "Group created! 🎉",
    errName: "Give your group a name.",
    inviteTitle: "Invite to {name}",
    sendInvites: "Invite ({n})",
    invitesSent: "{n} invites sent 💌",
    invitesSent_one: "1 invite sent 💌",
    allInGroup: "All your friends are already in 🙌",
    chatsTitle: "Chats",
    noChats: "No chats yet. Say hi to someone 👋",
    pickChat: "Pick a chat",
    typing: "{name} is typing…",
    unread: "Unread",
    messagePh: "Message…",
    send: "Send",
    you: "You",
    reply: "Reply",
    sysConnected: "You're now connected ✨",
    sysJoined: "You joined the group 🎉",
    sysCreated: "You created this group ✨",
    sysMemberJoined: "{name} joined 👋",
    notifications: "Activity",
    noNotifications: "All quiet for now.",
    n_wave: "{name} waved at you 👋",
    n_match: "You and {name} are now connected ✨",
    n_message: "{name}: {text}",
    n_hangout: "{name} joined your hangout 🙌",
    n_accepted: "{name} let you in 🎉",
    n_group: "{name} joined {group} 🎉",
    n_welcome: "Welcome to ConnectUni, {me}! 🎉",
    myProfile: "My profile",
    changePhoto: "Change photo",
    addPhoto: "Add a photo",
    verifiedVia: "Verified via {email}",
    myStatus: "My status",
    myInterests: "My interests",
    seeMoreInterests: "See more interests ({n})",
    seeFewerInterests: "Show fewer interests",
    logout: "Log out",
    report: "Report",
    block: "Block",
    unblock: "Unblock",
    undo: "Undo",
    blockedToast: "{name} is blocked. You won't see each other anymore.",
    unblockedToast: "{name} is unblocked.",
    reportTitle: "Report {name}",
    reportWhy: "What's wrong?",
    reason_fake: "Fake profile",
    reason_harassment: "Harassment or hate",
    reason_inappropriate: "Inappropriate photos or messages",
    reason_spam: "Spam or scam",
    reason_other: "Something else",
    reportNotePh: "Anything else we should know? (optional)",
    reportAlsoBlock: "Also block {name}",
    reportSend: "Send report",
    reportThanks: "Thanks for your report 🛡️",
    reportThanksBody: "We review every report within 24 hours.",
    blockedPeople: "Blocked people",
    legalTitle: "Legal & help",
    legal_terms: "Community rules & terms",
    legal_privacy: "Privacy policy",
    legal_imprint: "Legal notice",
    legal_licenses: "Open-source licenses",
    support: "Contact support",
    deleteAccount: "Delete account",
    deleteTitle: "Delete your account?",
    deleteBody: "Your profile, photos, chats, hangouts and group memberships will be deleted for good. This can't be undone.",
    deleteConfirm: "Delete account for good",
    cancel: "Cancel",
    accountDeleted: "Your account and all your data have been deleted.",
    consentA: "I accept the ",
    consentB: " and have read the ",
    consentC: ".",
    haveAccount: "Already on ConnectUni? Log in",
    backToSignup: "New here? Sign up",
    loginTitle: "Log in with your uni email",
    continueBtn: "Continue",
    passwordTitle: "Password",
    reviewHint: "Test accounts (@connect-uni.de) log in with a password.",
    logIn: "Log in",
    passwordWrong: "Email or password is wrong.",
    birthYear: "Year of birth",
    pickYear: "Choose",
    pickBirthYear: "Pick your year of birth first (step 2).",
    checking: "Checking…",
    errCodeSend: "Couldn't send the code. Check the address or try again in a minute.",
    accountBanned: `This account has been blocked for breaking the community rules. Questions: ${SUPPORT_EMAIL}`,
    errUniMismatch: "This address doesn't match the university you picked.",
    noProfileYet: "There's no profile for this address yet. Sign up first.",
    errGeneric: "Something went wrong. Please try again.",
    filteredTitle: "Some words were hidden",
    filteredBody: "They break the community rules, so they now show as ***.",
    errFull: "This hangout is already full.",
    someone: "Someone",
    waved: "Waved",
    waveBody: "If {name} waves back, you're connected.",
    acceptInvite: "Accept invite",
    n_invite: "{name} invited you to {group} 💌",
    addPhotoPrompt: "Add a photo so people recognise you 📸",
    uploading: "Uploading your photo…",
    justNow: "just now",
    minAgo: "{n} min ago",
    hAgo: "{n} h ago",
    dAgo: "{n} days ago",
    dAgo_one: "yesterday",
  },
  de: {
    close: "Schließen",
    back: "Zurück",
    less: "Weniger",
    more: "Mehr",
    language: "Sprache",
    theme: "Darstellung",
    themeSystem: "Auto",
    themeLight: "Hell",
    themeDark: "Dunkel",
    refreshing: "Wird aktualisiert…",
    pushTitle: "Push-Mitteilungen",
    pushOn: "An",
    pushWait: "Wird eingerichtet…",
    pushAsk: "Aktivieren",
    pushDenied: "Aus. Erlaube sie in den iPhone-Einstellungen → Mitteilungen → ConnectUni.",
    heroA: "Finde ",
    heroB: "deine Leute",
    heroC: " auf dem Campus.",
    heroLead: "Nur für verifizierte Studis. Match über dein Fach, triff dich spontan, find echte Freunde.",
    s1Title: "Wo studierst du?",
    otherUni: "Andere Uni",
    searchUni: "Name, Stadt oder Kürzel",
    uniSearchHint: "Durchsuche {n} Hochschulen, z. B. „Bielefeld“ oder „HSBI“.",
    noUniMatch: "Nichts gefunden. Wähl unten „Meine Uni ist nicht dabei“.",
    uniType_uni: "Universität",
    uniType_haw: "Hochschule / FH",
    uniType_art: "Kunst- und Musikhochschule",
    uniType_admin: "Verwaltungshochschule",
    uniType_other: "Hochschule eigenen Typs",
    notListed: "Meine Uni ist nicht dabei",
    customUniPh: "Name deiner Uni",
    crowd: "{n} Studis aus deiner Uni sind schon da 👀",
    s2Title: "Was studierst du?",
    majorLabel: "Hauptfach",
    minorLabel: "Nebenfach (optional)",
    noMinor: "Keins",
    semesterLabel: "Semester",
    ersti: "Ersti 🐣",
    semesterN: "{n}. Semester",
    s3Title: "Deine offizielle Uni-Mail",
    emailHint: "Wir schicken dir einen 6-stelligen Code. Deine Adresse ist nie öffentlich.",
    emailLocalPh: "vorname.nachname",
    emailFullPh: "name@uni-beispiel.de",
    domain: "Domain",
    emailOk: "Uni-Domain erkannt ✓",
    emailAltHint: "Andere Endung, z. B. @stud…? Tipp einfach die ganze Adresse ein.",
    errDomainEnd: "Deine Adresse muss auf @{domain} enden.",
    errLocal: "Vor dem @ nur Buchstaben, Zahlen, Punkte und Bindestriche.",
    errFormat: "Das sieht noch nicht nach einer E-Mail-Adresse aus.",
    errPersonal: "{provider} ist eine private Adresse. Nimm deine Uni-Mail.",
    errDomain: "Das sieht nicht nach einer Uni-Domain aus.",
    sendCode: "Code senden ✉️",
    sending: "Wird gesendet…",
    codeSent: "Code gesendet ✓",
    s4Title: "Code eingeben",
    tapToFill: "tippen zum Einfügen",
    codeSentTo: "Gesendet an {email}",
    verified: "Du bist drin! 🎉",
    codeWrong: "Fast! Versuch's nochmal.",
    digit: "Ziffer {n}",
    resendIn: "Code erneut senden in {s} s",
    resend: "Code erneut senden",
    quickDemo: "⚡ Quick Demo Login",
    quickDemoSub: "Ohne Registrierung als Max umschauen.",
    itsAMatch: "🎉 It's a Study Match!",
    collageMatch: "Du und Lena studiert beide Informatik",
    matchBody: "Du und {name} seid jetzt verbunden.",
    chatCta: "Chat 💬",
    filters: "Filter",
    filterMajor: "🔥 Dein Fach ({subject})",
    filterMinor: "✨ Nebenfach ({subject})",
    filterInterests: "🎯 Gleiche Interessen",
    filterAll: "🌍 Alle entdecken",
    emptyFilter: "Hier ist noch niemand. Probier einen anderen Filter.",
    activeNow: "Gerade aktiv",
    activeAgo: "Aktiv {ago}",
    yourStatus: "Dein Status",
    connect: "Connect",
    connected: "Verbunden",
    waveBack: "Zurückwinken",
    openProfile: "Profil von {name} öffnen",
    online: "Online",
    semShort: "{n}. Sem.",
    messageTo: "{name} schreiben",
    storyOf: "Story von {name}",
    prevStory: "Zurück",
    nextStory: "Weiter",
    wave: "Winken 👋",
    message: "Nachricht",
    profile: "Profil",
    waveSent: "Du hast {name} gewunken 👋",
    matchLine: "{n}% Match",
    whyMatch: "Warum ihr passt",
    reasonSameMajor: "Gleiches Hauptfach: {subject}",
    reasonTheirMajor: "Studiert dein Nebenfach {subject}",
    reasonAlso: "Auch {subject}",
    reasonInterests: "{n} gemeinsame Interessen",
    reasonInterests_one: "1 gemeinsames Interesse",
    reasonSemester: "Gleiches Semester",
    interests: "Interessen",
    createGroupWith: "Gruppe gründen",
    inviteToGroup: "In Gruppe einladen",
    inviteNameTo: "{name} einladen in…",
    invited: "Eingeladen ✓",
    invite: "Einladen",
    statusTitle: "Was machst du gerade?",
    clearStatus: "Status entfernen",
    statusSet: "Status gesetzt",
    navStart: "Start",
    navSpontan: "Spontan",
    navGroups: "Gruppen",
    navChats: "Chats",
    spontanTitle: "Spontan ✨",
    spontanLead: "Was geht gerade auf dem Campus?",
    newHangout: "Hangout",
    hfAll: "Alle",
    hfToday: "Jetzt & heute",
    hfMajor: "🔒 {subject}",
    hfMine: "Meine",
    noHangouts: "Noch nichts geplant. Starte was!",
    hiddenHangouts: "{n} Hangouts sind nur für andere Fächer",
    hiddenHangouts_one: "1 Hangout ist nur für ein anderes Fach",
    liveNow: "Jetzt live",
    dayAt: "{day} · {time}",
    audienceMajor: "🔒 Nur {subject}",
    audienceAll: "🌍 Ganze Uni",
    byYou: "von dir",
    hostedBy: "von {name}",
    approvalNote: "Host bestätigt",
    going: "{n}/{max} dabei",
    whoIsComing: "Wer kommt",
    hostTag: "Host",
    yourHangout: "Dein Hangout",
    join: "Bin dabei 🙌",
    joined: "Du bist dabei ✓",
    requestJoin: "Anfragen 🙋",
    requested: "Angefragt…",
    full: "Voll",
    requestSent: "Anfrage gesendet 🙋",
    joinedToast: "Du bist dabei! 🙌",
    posted: "Dein Hangout ist live! 🚀",
    chTitle: "Neuer Hangout",
    chWhat: "Was ist der Plan?",
    chName: "Titel",
    chWhen: "Beginnt",
    chDate: "Datum",
    chTime: "Uhrzeit",
    chDuration: "Verfügbar für",
    chDurationHint: "Ab der Startzeit bleibt der Hangout so lange sichtbar.",
    duration30: "30 Minuten",
    duration1h: "1 Stunde",
    durationHours: "{n} Stunden",
    durationHoursHalf: "{n}½ Stunden",
    chWhere: "Treffpunkt",
    placePlaceholder: "z. B. Hauptmensa, Bibliothekseingang",
    hangoutDetails: "Hangout-Details",
    meetAt: "Treffpunkt",
    startsAt: "Beginn",
    availableUntil: "Verfügbar bis",
    availableUntilShort: "bis {time}",
    minutesLeft: "Noch {n} Minuten",
    minutesLeft_one: "Noch 1 Minute",
    duration: "Verfügbar für",
    deleteHangout: "Hangout löschen",
    confirmDeleteHangout: "Diesen Hangout löschen?",
    confirmDeleteHangoutBody: "Der Hangout wird für alle entfernt, die teilnehmen wollten.",
    keepHangout: "Hangout behalten",
    hangoutDeleted: "Hangout gelöscht",
    errPlace: "Gib einen Treffpunkt an.",
    chMax: "Wie viele?",
    people: "{n} Leute",
    whoCanJoin: "Wer darf mitmachen?",
    onlyMajor: "Nur mein Fach",
    onlyMajorSub: "Nur {subject}-Studis sehen das",
    wholeUni: "Ganze Uni",
    wholeUniSub: "Offen für alle Fächer",
    post: "Hangout posten 🚀",
    errTitle: "Gib ihm einen kurzen Titel.",
    errPast: "Wähl eine Zeit, die noch kommt.",
    groupsTitle: "Gruppen",
    groupsLead: "Dein Fach, deine Hobbys, deine Leute.",
    newGroup: "Gruppe",
    tabMine: "Meine",
    tabDiscover: "Entdecken",
    noMyGroups: "Du bist noch in keiner Gruppe.",
    allJoined: "Du bist überall schon drin 🙌",
    hiddenGroups: "{n} Gruppen sind nur für andere Fächer",
    hiddenGroups_one: "1 Gruppe ist nur für ein anderes Fach",
    members: "{n} Mitglieder",
    members_one: "1 Mitglied",
    open: "Öffnen",
    joinGroup: "Beitreten",
    joinedGroup: "Willkommen in {name}! 🎉",
    cgTitle: "Neue Gruppe",
    cgVibe: "Vibe",
    cgName: "Name",
    cgNamePh: "z. B. {subject}-Lerncrew",
    cgAbout: "Worum geht's?",
    cgAboutPh: "Klausurvorbereitung, Mensa, Memes…",
    cgAboutDefault: "Neue Gruppe. Sag Hallo 👋",
    cgInvite: "Freunde einladen",
    noFriends: "Vernetz dich zuerst mit Leuten 👋",
    cgCreate: "Gruppe gründen ✨",
    created: "Gruppe gegründet! 🎉",
    errName: "Gib deiner Gruppe einen Namen.",
    inviteTitle: "In {name} einladen",
    sendInvites: "Einladen ({n})",
    invitesSent: "{n} Einladungen verschickt 💌",
    invitesSent_one: "1 Einladung verschickt 💌",
    allInGroup: "Alle deine Freunde sind schon drin 🙌",
    chatsTitle: "Chats",
    noChats: "Noch keine Chats. Sag jemandem Hallo 👋",
    pickChat: "Wähl einen Chat",
    typing: "{name} schreibt…",
    unread: "Ungelesen",
    messagePh: "Nachricht…",
    send: "Senden",
    you: "Du",
    reply: "Antworten",
    sysConnected: "Ihr seid jetzt verbunden ✨",
    sysJoined: "Du bist der Gruppe beigetreten 🎉",
    sysCreated: "Du hast die Gruppe gegründet ✨",
    sysMemberJoined: "{name} ist dabei 👋",
    notifications: "Aktivität",
    noNotifications: "Gerade ist alles ruhig.",
    n_wave: "{name} hat dir gewunken 👋",
    n_match: "Du und {name} seid jetzt verbunden ✨",
    n_message: "{name}: {text}",
    n_hangout: "{name} ist deinem Hangout beigetreten 🙌",
    n_accepted: "{name} hat dich reingelassen 🎉",
    n_group: "{name} ist {group} beigetreten 🎉",
    n_welcome: "Willkommen bei ConnectUni, {me}! 🎉",
    myProfile: "Mein Profil",
    changePhoto: "Foto ändern",
    addPhoto: "Foto hinzufügen",
    verifiedVia: "Verifiziert über {email}",
    myStatus: "Mein Status",
    myInterests: "Meine Interessen",
    seeMoreInterests: "Mehr Interessen anzeigen ({n})",
    seeFewerInterests: "Weniger Interessen anzeigen",
    logout: "Abmelden",
    report: "Melden",
    block: "Blockieren",
    unblock: "Freigeben",
    undo: "Rückgängig",
    blockedToast: "{name} ist blockiert. Ihr seht euch gegenseitig nicht mehr.",
    unblockedToast: "{name} ist wieder freigegeben.",
    reportTitle: "{name} melden",
    reportWhy: "Was ist los?",
    reason_fake: "Fake-Profil",
    reason_harassment: "Belästigung oder Hass",
    reason_inappropriate: "Unangemessene Fotos oder Nachrichten",
    reason_spam: "Spam oder Betrug",
    reason_other: "Etwas anderes",
    reportNotePh: "Sonst noch etwas, das wir wissen sollten? (optional)",
    reportAlsoBlock: "{name} auch blockieren",
    reportSend: "Meldung senden",
    reportThanks: "Danke für deine Meldung 🛡️",
    reportThanksBody: "Wir prüfen jede Meldung innerhalb von 24 Stunden.",
    blockedPeople: "Blockierte Personen",
    legalTitle: "Rechtliches & Hilfe",
    legal_terms: "Community-Regeln & Nutzungsbedingungen",
    legal_privacy: "Datenschutzerklärung",
    legal_imprint: "Impressum",
    legal_licenses: "Open-Source-Lizenzen",
    support: "Support kontaktieren",
    deleteAccount: "Konto löschen",
    deleteTitle: "Konto wirklich löschen?",
    deleteBody:
      "Dein Profil, deine Fotos, Chats, Hangouts und Gruppen-Mitgliedschaften werden endgültig gelöscht. Das lässt sich nicht rückgängig machen.",
    deleteConfirm: "Konto endgültig löschen",
    cancel: "Abbrechen",
    accountDeleted: "Dein Konto und alle deine Daten wurden gelöscht.",
    consentA: "Ich akzeptiere die ",
    consentB: " und habe die ",
    consentC: " gelesen.",
    haveAccount: "Schon dabei? Einloggen",
    backToSignup: "Neu hier? Registrieren",
    loginTitle: "Mit deiner Uni-Mail einloggen",
    continueBtn: "Weiter",
    passwordTitle: "Passwort",
    reviewHint: "Testkonten (@connect-uni.de) melden sich mit Passwort an.",
    logIn: "Einloggen",
    passwordWrong: "E-Mail oder Passwort stimmt nicht.",
    birthYear: "Geburtsjahr",
    pickYear: "Auswählen",
    pickBirthYear: "Wähl zuerst dein Geburtsjahr (Schritt 2).",
    checking: "Wird geprüft…",
    errCodeSend: "Code konnte nicht gesendet werden. Prüf die Adresse oder versuch's gleich nochmal.",
    accountBanned: `Dieses Konto wurde wegen Verstößen gegen die Community-Regeln gesperrt. Fragen an ${SUPPORT_EMAIL}`,
    errUniMismatch: "Diese Adresse passt nicht zur gewählten Hochschule.",
    noProfileYet: "Zu dieser Adresse gibt es noch kein Profil. Registrier dich zuerst.",
    errGeneric: "Da ist etwas schiefgelaufen. Versuch's bitte nochmal.",
    filteredTitle: "Ein paar Wörter wurden ausgeblendet",
    filteredBody: "Sie verstoßen gegen die Community-Regeln und erscheinen jetzt als ***.",
    errFull: "Dieser Hangout ist schon voll.",
    someone: "Jemand",
    waved: "Gewunken",
    waveBody: "Winkt {name} zurück, seid ihr verbunden.",
    acceptInvite: "Einladung annehmen",
    n_invite: "{name} hat dich in {group} eingeladen 💌",
    addPhotoPrompt: "Füg ein Foto hinzu, damit dich andere erkennen 📸",
    uploading: "Foto wird hochgeladen…",
    justNow: "gerade eben",
    minAgo: "vor {n} Min.",
    hAgo: "vor {n} Std.",
    dAgo: "vor {n} Tagen",
    dAgo_one: "gestern",
  },
};
/* ────────────────────────────────────────────────────────────────────────────
 * Data
 * ──────────────────────────────────────────────────────────────────────────── */

const ME = "me";
const DEMO_CODE = "482910";
const DEFAULT_HANGOUT_MINUTES = 30;
const MAX_HANGOUT_MINUTES = 6 * 60;

// Unsplash photo ids for galleries, group covers and hangout cards.
const VIBE = {
  coffee: "1495474472287-4d71bcdd2085",
  latte: "1509042239860-f550ce710b93",
  icedCoffee: "1461023058943-07fcbe16d735",
  matcha: "1515823064-d6e0c04616a7",
  library: "1521587760476-6c12a4b040da",
  books: "1497633762265-9d179a990aa6",
  notes: "1434030216411-0b793f4b4173",
  studyGroup: "1523240795612-9a054b0db644",
  laptops: "1522202176988-66273c2fd55f",
  graduation: "1541339907198-e08756dedf3f",
  campus: "1562774053-701939374585",
  mensa: "1504674900247-0877df9cc836",
  salad: "1546069901-ba9599a7e63c",
  pizza: "1565299624946-b28f40a0ae38",
  bowl: "1512621776951-a57141f2eefd",
  yoga: "1544367567-0f2fcb009e0b",
  gym: "1517836357463-d25dfeac3438",
  climbing: "1522163182402-834f871fd851",
  hiking: "1551632811-561732d1e306",
  tennis: "1554068865-24cecd4e34b8",
  football: "1574629810360-7efbbe195018",
  party: "1492684223066-81342ee5ff30",
  concert: "1514525253161-7a46d19cd819",
  gaming: "1542751371-adc38448a05e",
  code: "1517694712202-14dd9538aa97",
  desk: "1498050108023-c5249f4df085",
  travel: "1488646953014-85cb44e25828",
  camera: "1452587925148-ce544e77e70d",
  cooking: "1556910103-1c02745aae4d",
  paint: "1513364776144-60967b0f800f",
  guitar: "1511379938547-c1f69419868d",
  friends: "1529156069898-49953e39b3ac",
};

// Every German Hochschule from the HRK Hochschulkompass (hs-kompass.de, list "hs_liste", October 2026), plus ETH Zürich
// and Uni Wien. Email domains come from each website; well-known universities also list their student domains.
// [id, name, official name, short label, city, email domains, type, students]
// prettier-ignore
const UNI_ROWS = [
  ["h354", "accadis Hochschule", "accadis Hochschule Bad Homburg", "accadis Hochschule", "Bad Homburg", "accadis.com", "haw", 569],
  ["h156", "AKAD Hochschule Stuttgart", "AKAD Hochschule Stuttgart - staatlich anerkannt", "AKAD Hochschule Stuttgart", "Stuttgart", "akad.de", "haw", 6633],
  ["h187", "Akademie der Bildenden Künste München", "", "Akademie der Bildenden Künste München", "München", "adbk.de", "art", 687],
  ["h202", "Akademie der Bildenden Künste Nürnberg", "", "Akademie der Bildenden Künste Nürnberg", "Nürnberg", "adbk-nuernberg.de", "art", 303],
  ["h431", "Akkon Hochschule", "Akkon-Hochschule", "Akkon Hochschule", "Berlin", "akkon-hochschule.de", "haw", 1422],
  ["h349", "Alanus Hochschule für Kunst und Gesellschaft", "", "Alanus Hochschule für Kunst und Gesellschaft", "Alfter", "alanus.edu", "art", 1392],
  ["h18", "Alice Salomon Hochschule Berlin", "", "Alice Salomon Hochschule Berlin", "Berlin", "ash-berlin.eu", "haw", 4225],
  ["h338", "Allensbach Hochschule Konstanz", "Allensbach Hochschule Konstanz,  staatlich anerkannte Hochschule der European Education Group GmbH", "Allensbach Hochschule Konstanz", "Konstanz", "allensbach-hochschule.de", "haw", 625],
  ["h361", "APOLLON Hochschule der Gesundheitswirtschaft", "", "APOLLON Hochschule der Gesundheitswirtschaft", "Bremen", "apollon-hochschule.de", "haw", 4409],
  ["h196", "Augustana-Hochschule", "Augustana-Hochschule Neuendettelsau", "Augustana-Hochschule", "Neuendettelsau", "augustana.de", "uni", 106],
  ["h437", "Bard College Berlin", "Bard College Berlin, A Liberal Arts University", "Bard College Berlin", "Berlin", "berlin.bard.edu", "uni", 286],
  ["h389", "bbw Hochschule", "", "bbw Hochschule", "Berlin", "bbw-hochschule.de", "haw", 698],
  ["h279", "Bergische Universität Wuppertal", "", "Bergische Uni Wuppertal", "Wuppertal", "uni-wuppertal.de", "uni", 20422],
  ["h15", "Berliner Hochschule für Technik", "", "Berliner Hochschule für Technik", "Berlin", "bht-berlin.de", "haw", 11892],
  ["h519", "Berufliche Hochschule Hamburg (BHH)", "", "BHH", "Hamburg", "bhh.de", "other", 524],
  ["h422", "Brand University of Applied Sciences", "", "Brand University of Applied Sciences", "Hamburg", "brand-university.de", "haw", 259],
  ["h415", "BSP Business and Law School", "BSP Business and Law School - Hochschule für Management und Recht", "BSP Business and Law School", "Berlin", "businessschool-berlin.de", "haw", 1939],
  ["h45", "BTU Cottbus-Senftenberg", "Brandenburgische Technische Universität Cottbus-Senftenberg", "BTU Cottbus-Senftenberg", "Cottbus", "b-tu.de", "uni", 7559],
  ["h326", "Bucerius Law School", "Bucerius Law School, Hochschule für Rechtswissenschaft", "Bucerius Law School", "Hamburg", "law-school.de", "uni", 855],
  ["h102", "Burg Giebichenstein Kunsthochschule", "Burg Giebichenstein Kunsthochschule Halle", "Burg Giebichenstein Kunsthochschule", "Halle", "burg-halle.de", "art", 1265],
  ["h414", "CBS University of Applied Sciences", "", "CBS University of Applied Sciences", "Köln", "cbs.de", "haw", 4454],
  ["h558", "Charlotte Fresenius Hochschule", "", "Charlotte Fresenius Hochschule", "Wiesbaden", "charlotte-fresenius-uni.de", "uni", 1508],
  ["h506", "CODE University of Applied Sciences", "", "CODE University of Applied Sciences", "Berlin", "code.berlin", "haw", 478],
  ["h327", "Constructor University", "", "Constructor University", "Bremen", "constructor.university", "uni", 2001],
  ["h194", "CTS Hochschule Münster", "", "CTS Hochschule Münster", "Münster", "cts-hochschule.de", "uni", 7],
  ["h591", "Deutsche Hochschule für Angewandte Wissenschaften", "Deutsche Hochschule für Angewandte Wissenschaften - German University of Applied Sciences", "Deutsche Hochschule für Angewandte Wissenschaften", "Potsdam", "deutschehochschule.de", "haw", 467],
  ["h383", "Deutsche Hochschule für Gesundheit und Sport", "DHGS Deutsche Hochschule für Gesundheit und Sport", "Deutsche Hochschule für Gesundheit und Sport", "Berlin", "dhgs-hochschule.de", "haw", 2224],
  ["h391", "Deutsche Hochschule für Prävention und Gesundheitsmanagement", "Deutsche Hochschule für Prävention und Gesundheitsmanagement GmbH", "Deutsche Hochschule für Prävention und Gesundheitsmanagement", "Saarbrücken", "dhfpg.de", "haw", 6179],
  ["h148", "Deutsche Sporthochschule Köln", "", "Deutsche Sporthochschule Köln", "Köln", "dshs-koeln.de", "uni", 6170],
  ["h516", "Digital Business University of Applied Sciences", "", "Digital Business University of Applied Sciences", "Berlin", "dbuas.de", "haw", 282],
  ["h318", "DIPLOMA Hochschule Nordhessen", "DIPLOMA Hochschule - Private Fachhochschule Nordhessen", "DIPLOMA Hochschule Nordhessen", "Bad Sooden-Allendorf", "diploma.de", "haw", 6538],
  ["h394", "DIU Dresden International University GmbH", "DIU - Dresden International University GmbH", "DIU Dresden International University GmbH", "Dresden", "di-uni.de", "uni", 911],
  ["h398", "Duale Hochschule Baden-Württemberg", "", "Duale Hochschule Baden-Württemberg", "Stuttgart", "dhbw.de", "other", 33367],
  ["h487", "Duale Hochschule Gera-Eisenach", "", "Duale Hochschule Gera-Eisenach", "Gera", "dhge.de", "other", 1474],
  ["h727", "Duale Hochschule Sachsen", "", "Duale Hochschule Sachsen", "Glauchau", "dhsn.de", "other", 4076],
  ["h507", "Duale Hochschule Schleswig-Holstein", "Duale Hochschule Schleswig-Holstein - staatlich anerkannte Hochschule für angewandte Wissenschaften in Trägerschaft der Wirtschaftsakademie Schleswig-Holstein", "Duale Hochschule Schleswig-Holstein", "Kiel", "dhsh.de", "haw", 616],
  ["h206", "EBS Universität", "EBS Universität für Wirtschaft und Recht", "EBS Universität", "Oestrich-Winkel", "ebs.edu", "uni", 1891],
  ["h658", "EHIP - Europäische Hochschule für Innovation und Perspektive", "", "EHIP - Europäische Hochschule für Innovation und Perspektive", "Backnang", "ehip.eu", "haw", 150],
  ["h134", "Ernst-Abbe-Hochschule Jena", "", "Ernst-Abbe-Hochschule Jena", "Jena", "eah-jena.de", "haw", 4052],
  ["h14", "ESCP Europe Berlin", "ESCP Europe Wirtschaftshochschule Berlin e.V.", "ESCP Europe Berlin", "Berlin", "escp.eu", "uni", 1478],
  ["h396", "ESMT European School of Management and Technology", "", "ESMT European School of Management and Technology", "Berlin", "esmt.org", "uni", 855],
  ["eth", "ETH Zürich", "Eidgenössische Technische Hochschule Zürich", "ETH", "Zürich", "student.ethz.ch ethz.ch", "uni", 25000],
  ["h76", "Europa-Universität Flensburg", "", "Europa-Uni Flensburg", "Flensburg", "uni-flensburg.de", "uni", 5648],
  ["h84", "Europa-Universität Viadrina Frankfurt (Oder)", "", "Oder", "Frankfurt (Oder)", "europa-uni.de", "uni", 3841],
  ["h350", "Europäische Fernhochschule Hamburg", "", "Europäische Fernhochschule Hamburg", "Hamburg", "euro-fh.de", "haw", 10610],
  ["h19", "Evangelische Hochschule Berlin", "", "Evangelische Hochschule Berlin", "Berlin", "eh-berlin.de", "haw", 1624],
  ["h55", "Evangelische Hochschule Dresden", "", "Evangelische Hochschule Dresden", "Dresden", "ehs-dresden.de", "haw", 828],
  ["h89", "Evangelische Hochschule Freiburg", "Evangelische Hochschule Freiburg, staatlich anerkannte Hochschule der Evangelischen Landeskirche in Baden", "Evangelische Hochschule Freiburg", "Freiburg", "eh-freiburg.de", "haw", 900],
  ["h103", "Evangelische Hochschule für Kirchenmusik Halle", "Evangelische Hochschule für Kirchenmusik", "Evangelische Hochschule für Kirchenmusik Halle", "Halle", "ehk-halle.de", "art", 57],
  ["h108", "Evangelische Hochschule für Soziale Arbeit & Diakonie Hamburg", "Evangelische Hochschule für Soziale Arbeit & Diakonie", "Evangelische Hochschule für Soziale Arbeit & Diakonie Hamburg", "Hamburg", "ev-hochschule-hh.de", "haw", 724],
  ["h48", "Evangelische Hochschule Hessen", "", "Evangelische Hochschule Hessen", "Darmstadt", "eh-darmstadt.de", "haw", 1178],
  ["h229", "Evangelische Hochschule Ludwigsburg", "Evangelische Hochschule Ludwigsburg - staatlich anerkannte Hochschule für Angewandte Wissenschaften der Evangelischen Landeskirche Württemberg", "Evangelische Hochschule Ludwigsburg", "Ludwigsburg", "eh-ludwigsburg.de", "haw", 1312],
  ["h201", "Evangelische Hochschule Nürnberg", "Evangelische Hochschule für angewandte Wissenschaften - Evangelische Fachhochschule Nürnberg", "Evangelische Hochschule Nürnberg", "Nürnberg", "evhn.de", "haw", 1355],
  ["h231", "Evangelische Hochschule Rheinland-Westfalen-Lippe", "", "Evangelische Hochschule Rheinland-Westfalen-Lippe", "Bochum", "evh-bochum.de", "haw", 2665],
  ["h426", "Evangelische Hochschule Tabor", "", "Evangelische Hochschule Tabor", "Marburg", "eh-tabor.de", "haw", 143],
  ["h2", "Fachhochschule Aachen", "", "FH Aachen", "Aachen", "fh-aachen.de", "haw", 13527],
  ["h216", "Fachhochschule der Wirtschaft", "", "FH der Wirtschaft", "Paderborn", "fhdw.de", "haw", 2059],
  ["h331", "Fachhochschule des Mittelstands", "Fachhochschule des Mittelstands (FHM)", "FHM", "Bielefeld", "fh-mittelstand.de", "haw", 5483],
  ["h52", "Fachhochschule Dortmund", "", "FH Dortmund", "Dortmund", "fh-dortmund.de", "haw", 13315],
  ["h428", "Fachhochschule Dresden", "", "FH Dresden", "Dresden", "fh-dresden.eu", "haw", 426],
  ["h67", "Fachhochschule Erfurt", "", "FH Erfurt", "Erfurt", "fh-erfurt.de", "haw", 4000],
  ["h311", "Fachhochschule für die Wirtschaft Hannover", "", "FH für die Wirtschaft Hannover", "Hannover", "fhdw-hannover.de", "haw", 615],
  ["h471", "Fachhochschule für Finanzen Brandenburg", "", "FH für Finanzen Brandenburg", "Königs Wusterhausen", "fhf.brandenburg.de", "admin", 843],
  ["h479", "Fachhochschule für öffentliche Verwaltung, Polizei und Rechtspflege des Landes Mecklenburg-Vorpommern", "", "FH für öffentliche Verwaltung, Polizei und Rechtspflege des Landes Mecklenburg-Vorpommern", "Güstrow", "fh-guestrow.de", "admin", 551],
  ["h443", "Fachhochschule für Sport und Management Potsdam", "", "FH für Sport und Management Potsdam", "Potsdam", "fhsmp.de", "haw", 606],
  ["h222", "Fachhochschule Potsdam", "", "FH Potsdam", "Potsdam", "fh-potsdam.de", "haw", 3578],
  ["h343", "Fachhochschule Südwestfalen", "", "FH Südwestfalen", "Iserlohn", "fh-swf.de", "haw", 10183],
  ["h263", "Fachhochschule Wedel", "", "FH Wedel", "Wedel", "fh-wedel.de", "haw", 988],
  ["h269", "Fachhochschule Westküste", "Fachhochschule Westküste, Hochschule für Wirtschaft und Technik", "FH Westküste", "Heide", "fh-westkueste.de", "haw", 1379],
  ["h70", "FAU Erlangen-Nürnberg", "Friedrich-Alexander-Universität Erlangen-Nürnberg", "FAU Erlangen-Nürnberg", "Erlangen", "fau.de", "uni", 39209],
  ["h100", "FernUniversität in Hagen", "", "FernUni in Hagen", "Hagen", "fernuni-hagen.de", "uni", 63447],
  ["h192", "FH Münster", "FH Münster - University of Applied Sciences", "FH Münster", "Münster", "fhms.eu", "haw", 14188],
  ["h223", "Filmuniversität Babelsberg", "Filmuniversität Babelsberg Konrad Wolf", "Filmuniversität Babelsberg", "Potsdam", "filmuniversitaet.de", "art", 965],
  ["h433", "Fliedner Fachhochschule", "Fliedner Fachhochschule Düsseldorf", "Fliedner Fachhochschule", "Düsseldorf", "fliedner-fachhochschule.de", "haw", 2080],
  ["h72", "Folkwang Universität der Künste", "", "Folkwang Uni der Künste", "Essen", "folkwang-uni.de", "art", 1639],
  ["h286", "FOM Hochschule für Oekonomie & Management", "FOM Hochschule für Oekonomie & Management - University of Applied Sciences", "FOM Hochschule für Oekonomie & Management", "Essen", "fom.de", "haw", 45369],
  ["h83", "Frankfurt School of Finance & Management", "", "Frankfurt School of Finance & Management", "Frankfurt am Main", "frankfurt-school.de", "uni", 4391],
  ["h79", "Frankfurt University of Applied Sciences", "", "Frankfurt University of Applied Sciences", "Frankfurt am Main", "frankfurt-university.de", "haw", 15061],
  ["fu", "FU Berlin", "Freie Universität Berlin", "FU Berlin", "Berlin", "zedat.fu-berlin.de fu-berlin.de", "uni", 43795],
  ["h728", "German International University", "", "German International University", "Berlin", "giu-berlin.de", "uni", 389],
  ["h518", "Gisma University of Applied Sciences", "", "Gisma University of Applied Sciences", "Potsdam", "gisma.com", "haw", 1483],
  ["ffm", "Goethe-Uni Frankfurt", "Johann Wolfgang Goethe-Universität, Frankfurt am Main", "Goethe-Uni", "Frankfurt am Main", "stud.uni-frankfurt.de uni-frankfurt.de", "uni", 40749],
  ["h362", "HafenCity Universität Hamburg", "", "HafenCity Uni Hamburg", "Hamburg", "hcu-hamburg.de", "uni", 2513],
  ["h358", "Hamburg School of Business Administration", "HSBA Hamburg School of Business Administration", "Hamburg School of Business Administration", "Hamburg", "hsba.de", "haw", 1054],
  ["h128", "HAWK Hochschule für angewandte Wissenschaft und Kunst", "HAWK Hochschule für angewandte Wissenschaft und Kunst Hildesheim/Holzminden/Göttingen", "HAWK Hochschule für angewandte Wissenschaft und Kunst", "Hildesheim", "hawk.de", "haw", 6127],
  ["h390", "Health Innovation University of Applied Sciences", "", "Health Innovation University of Applied Sciences", "Berlin", "hi-university.de", "haw", 492],
  ["h106", "Helmut-Schmidt-Universität/ Universität der Bundeswehr", "Helmut-Schmidt-Universität/Universität der Bundeswehr Hamburg", "Helmut-Schmidt-Universität/ Uni der Bundeswehr", "Hamburg", "hsu-hh.de", "uni", 2371],
  ["h384", "Hertie School", "", "Hertie School", "Berlin", "hertie-school.org", "uni", 755],
  ["h408", "Hessische Hochschule für öffentliches Management und Sicherheit", "", "Hessische Hochschule für öffentliches Management und Sicherheit", "Wiesbaden", "hoems.hessen.de", "admin", 5148],
  ["h316", "HFH Hamburger Fern-Hochschule", "Hamburger Fern-Hochschule, gemeinnützige GmbH", "HFH Hamburger Fern-Hochschule", "Hamburg", "hfh-fernstudium.de", "haw", 14265],
  ["h295", "HHL Leipzig", "HHL Leipzig Graduate School of Management", "HHL Leipzig", "Leipzig", "hhl.de", "uni", 781],
  ["h517", "HMU Health and Medical University", "", "HMU Health and Medical University", "Erfurt", "health-and-medical-university-erfurt.de", "other", 1850],
  ["h729", "HMU Health and Medical University Potsdam", "", "HMU Health and Medical University Potsdam", "Potsdam", "health-and-medical-university.de", "other", 0],
  ["h363", "hochschule 21", "", "hochschule 21", "Buxtehude", "hs21.de", "haw", 1036],
  ["h3", "Hochschule Aalen", "Hochschule Aalen - Technik, Wirtschaft und Gesundheit", "Hochschule Aalen", "Aalen", "hs-aalen.de", "haw", 4269],
  ["h4", "Hochschule Albstadt-Sigmaringen", "", "Hochschule Albstadt-Sigmaringen", "Sigmaringen", "hs-albsig.de", "haw", 2590],
  ["h5", "Hochschule Anhalt", "Hochschule Anhalt - Anhalt University of Applied Sciences", "Hochschule Anhalt", "Köthen", "hs-anhalt.de", "haw", 6672],
  ["h312", "Hochschule Ansbach", "Hochschule für angewandte Wissenschaften Ansbach", "Hochschule Ansbach", "Ansbach", "hs-ansbach.de", "haw", 4143],
  ["h26", "Hochschule Biberach", "Hochschule Biberach - Architektur und Bauwesen, Betriebswirtschaft und Biotechnologie", "Hochschule Biberach", "Biberach", "hochschule-biberach.de", "haw", 2228],
  ["h28", "Hochschule Bielefeld", "Hochschule Bielefeld - University of Applied Sciences and Arts (HSBI)", "HSBI", "Bielefeld", "hsbi.de", "haw", 9975],
  ["h30", "Hochschule Bochum", "", "Hochschule Bochum", "Bochum", "hochschule-bochum.de", "haw", 9415],
  ["h294", "Hochschule Bonn-Rhein-Sieg", "Hochschule Bonn-Rhein-Sieg, University of Applied Sciences", "Hochschule Bonn-Rhein-Sieg", "Sankt Augustin", "h-brs.de", "haw", 8990],
  ["h40", "Hochschule Bremen", "", "Hochschule Bremen", "Bremen", "hs-bremen.de", "haw", 8596],
  ["h41", "Hochschule Bremerhaven", "", "Hochschule Bremerhaven", "Bremerhaven", "hs-bremerhaven.de", "haw", 3036],
  ["h44", "Hochschule Coburg", "Hochschule für angewandte Wissenschaften Coburg", "Hochschule Coburg", "Coburg", "hs-coburg.de", "haw", 4426],
  ["h47", "Hochschule Darmstadt", "", "Hochschule Darmstadt", "Darmstadt", "h-da.de", "haw", 13816],
  ["h467", "Hochschule der Bayerischen Wirtschaft für angewandte Wissenschaften", "Hochschule der Bayerischen Wirtschaft für angewandte Wissenschaften - HDBW", "Hochschule der Bayerischen Wirtschaft für angewandte Wissenschaften", "München", "hdbw-hochschule.de", "haw", 459],
  ["h454", "Hochschule der bildenden Künste Essen", "Hochschule der bildenden Künste (HBK) Essen", "HBK", "Essen", "hbk-essen.de", "art", 317],
  ["h239", "Hochschule der Bildenden Künste Saar", "", "Hochschule der Bildenden Künste Saar", "Saarbrücken", "hbksaar.de", "art", 451],
  ["h457", "Hochschule der Bundesagentur für Arbeit", "Hochschule der Bundesagentur für Arbeit - Staatlich anerkannte Hochschule für angewandte Wissenschaft in Mannheim und Schwerin (University of Applied Labour Studies of the Federal Employment Agency)", "Hochschule der Bundesagentur für Arbeit", "Mannheim", "hdba.de", "admin", 1554],
  ["h375", "Hochschule der Diakonie", "", "Hochschule der Diakonie", "Bielefeld", "hochschule-diakonie.de", "haw", 702],
  ["h250", "Hochschule der Medien Stuttgart", "", "Hochschule der Medien Stuttgart", "Stuttgart", "hdm-stuttgart.de", "haw", 5195],
  ["h432", "Hochschule der Wirtschaft für Management", "", "Hochschule der Wirtschaft für Management", "Mannheim", "hdwm.de", "haw", 226],
  ["h469", "Hochschule des Bundes für öffentliche Verwaltung", "", "Hochschule des Bundes für öffentliche Verwaltung", "Brühl", "hsbund.de", "admin", 8932],
  ["h60", "Hochschule Düsseldorf", "", "Hochschule Düsseldorf", "Düsseldorf", "hs-duesseldorf.de", "haw", 10820],
  ["h405", "Hochschule Emden/ Leer", "Hochschule Emden/Leer", "Hochschule Emden/ Leer", "Emden", "hs-emden-leer.de", "haw", 3777],
  ["h73", "Hochschule Esslingen", "", "Hochschule Esslingen", "Esslingen", "hs-esslingen.de", "haw", 5869],
  ["h77", "Hochschule Flensburg", "", "Hochschule Flensburg", "Flensburg", "hs-flensburg.de", "haw", 2991],
  ["h271", "Hochschule Fresenius", "", "Hochschule Fresenius", "Idstein", "hs-fresenius.de", "haw", 15502],
  ["h440", "Hochschule Fresenius Heidelberg", "Hochschule Fresenius Heidelberg – staatlich anerkannte Hochschule der Hochschule Fresenius für Internationales Management GmbH", "Hochschule Fresenius Heidelberg", "Heidelberg", "hs-fresenius.de", "haw", 582],
  ["h92", "Hochschule Fulda", "Hochschule Fulda - University of Applied Sciences", "Hochschule Fulda", "Fulda", "hs-fulda.de", "haw", 9638],
  ["h107", "Hochschule für Angewandte Wissenschaften Hamburg", "", "Hochschule für Angewandte Wissenschaften Hamburg", "Hamburg", "haw-hamburg.de", "haw", 16536],
  ["h145", "Hochschule für Angewandte Wissenschaften Kiel", "", "Hochschule für Angewandte Wissenschaften Kiel", "Kiel", "haw-kiel.de", "haw", 7773],
  ["h369", "Hochschule für angewandtes Management", "", "Hochschule für angewandtes Management", "Teltow", "fham.de", "haw", 3510],
  ["h80", "Hochschule für Bildende Künste", "Hochschule für Bildende Künste (Städelschule)", "Hochschule für Bildende Künste", "Frankfurt am Main", "staedelschule.de", "art", 143],
  ["h37", "Hochschule für Bildende Künste Braunschweig", "", "Hochschule für Bildende Künste Braunschweig", "Braunschweig", "hbk-bs.de", "art", 873],
  ["h56", "Hochschule für Bildende Künste Dresden", "", "Hochschule für Bildende Künste Dresden", "Dresden", "hfbk-dresden.de", "art", 588],
  ["h109", "Hochschule für Bildende Künste Hamburg", "", "Hochschule für Bildende Künste Hamburg", "Hamburg", "hfbk-hamburg.de", "art", 986],
  ["h339", "Hochschule für Evangelische Kirchenmusik", "Hochschule für evangelische Kirchenmusik der Evangelisch-Lutherischen Kirche in Bayern", "Hochschule für Evangelische Kirchenmusik", "Bayreuth", "hfk-bayreuth.de", "art", 22],
  ["h190", "Hochschule für Fernsehen und Film", "Hochschule für Fernsehen und Film München", "Hochschule für Fernsehen und Film", "München", "hff-muc.de", "art", 422],
  ["h488", "Hochschule für Finanzen NRW", "", "Hochschule für Finanzen NRW", "Nordkirchen", "finanzverwaltung.nrw.de", "admin", 2561],
  ["h352", "Hochschule für Finanzwirtschaft & Management", "", "Hochschule für Finanzwirtschaft & Management", "Bonn", "s-hochschule.de", "haw", 831],
  ["h300", "Hochschule für Forstwirtschaft Rottenburg", "", "Hochschule für Forstwirtschaft Rottenburg", "Rottenburg", "hs-rottenburg.net", "haw", 868],
  ["h468", "Hochschule für Gesellschaftsgestaltung", "", "Hochschule für Gesellschaftsgestaltung", "Koblenz", "hfgg.de", "other", 141],
  ["h207", "Hochschule für Gestaltung Offenbach", "", "Hochschule für Gestaltung Offenbach", "Offenbach", "hfg-offenbach.de", "art", 767],
  ["h244", "Hochschule für Gestaltung Schwäbisch Gmünd", "", "Hochschule für Gestaltung Schwäbisch Gmünd", "Schwäbisch Gmünd", "hfg-gmuend.de", "haw", 575],
  ["h692", "Hochschule für Gesundheitsfachberufe Eberswalde", "", "Hochschule für Gesundheitsfachberufe Eberswalde", "Eberswalde", "gesundheit-hochschule.de", "haw", 46],
  ["h164", "Hochschule für Grafik und Buchkunst Leipzig", "", "Hochschule für Grafik und Buchkunst Leipzig", "Leipzig", "hgb-leipzig.de", "art", 544],
  ["h121", "Hochschule für Jüdische Studien", "Hochschule für Jüdische Studien Heidelberg", "Hochschule für Jüdische Studien", "Heidelberg", "hfjs.eu", "uni", 144],
  ["h346", "Hochschule für Katholische Kirchenmusik und Musikpädagogik", "", "Hochschule für Katholische Kirchenmusik und Musikpädagogik", "Regensburg", "hfkm-regensburg.de", "art", 127],
  ["h241", "Hochschule für Katholische Theologie", "Kölner Hochschule für Katholische Theologie (KHKT)", "KHKT", "Köln", "khkt.de", "uni", 105],
  ["h126", "Hochschule für Kirchenmusik der Evangelischen Kirche von Westfalen", "", "Hochschule für Kirchenmusik der Evangelischen Kirche von Westfalen", "Witten", "hochschule-kirchenmusik.de", "art", 39],
  ["h58", "Hochschule für Kirchenmusik Dresden", "Hochschule für Kirchenmusik der Evangelisch-Lutherischen Landeskirche Sachsens", "Hochschule für Kirchenmusik Dresden", "Dresden", "kirchenmusik-dresden.de", "art", 22],
  ["h124", "Hochschule für Kirchenmusik Heidelberg", "Hochschule für Kirchenmusik der Evangelischen Landeskirche in Baden", "Hochschule für Kirchenmusik Heidelberg", "Heidelberg", "hfk-heidelberg.de", "art", 32],
  ["h325", "Hochschule für Kirchenmusik Rottenburg", "Hochschule für Kirchenmusik der Diözese Rottenburg-Stuttgart", "Hochschule für Kirchenmusik Rottenburg", "Rottenburg", "kirchenmusik-hochschule.org", "art", 18],
  ["h75", "Hochschule für Kirchenmusik Tübingen", "Hochschule für Kirchenmusik der Evangelischen Landeskirche in Württemberg", "Hochschule für Kirchenmusik Tübingen", "Tübingen", "kirchenmusikhochschule.de", "art", 24],
  ["h39", "Hochschule für Künste Bremen", "", "Hochschule für Künste Bremen", "Bremen", "hfk-bremen.de", "art", 1090],
  ["h213", "Hochschule für Künste im Sozialen", "Hochschule für Künste im Sozialen, Ottersberg", "Hochschule für Künste im Sozialen", "Ottersberg", "hks-ottersberg.de", "haw", 274],
  ["h21", "Hochschule für Musik Berlin", "Hochschule für Musik Hanns Eisler Berlin", "Hochschule für Musik Berlin", "Berlin", "hfm-berlin.de", "art", 572],
  ["h49", "Hochschule für Musik Detmold", "", "Hochschule für Musik Detmold", "Detmold", "hfm-detmold.de", "art", 664],
  ["h57", "Hochschule für Musik Dresden", "Hochschule für Musik Carl Maria von Weber Dresden", "Hochschule für Musik Dresden", "Dresden", "hfmdd.de", "art", 698],
  ["h90", "Hochschule für Musik Freiburg", "Hochschule für Musik Freiburg im Breisgau", "Hochschule für Musik Freiburg", "Freiburg", "mh-freiburg.de", "art", 668],
  ["h141", "Hochschule für Musik Karlsruhe", "", "Hochschule für Musik Karlsruhe", "Karlsruhe", "hfm-karlsruhe.de", "art", 554],
  ["h321", "Hochschule für Musik Nürnberg", "", "Hochschule für Musik Nürnberg", "Nürnberg", "hfm-nuernberg.de", "art", 457],
  ["h240", "Hochschule für Musik Saar", "", "Hochschule für Musik Saar", "Saarbrücken", "hfmsaar.de", "art", 523],
  ["h81", "Hochschule für Musik und Darstellende Kunst Frankfurt am Main", "", "Hochschule für Musik und Darstellende Kunst Frankfurt am Main", "Frankfurt am Main", "hfmdk-frankfurt.de", "art", 938],
  ["h123", "Hochschule für Musik und Darstellende Kunst Mannheim", "Staatliche Hochschule für Musik und Darstellende Kunst Mannheim", "Hochschule für Musik und Darstellende Kunst Mannheim", "Mannheim", "muho-mannheim.de", "art", 636],
  ["h254", "Hochschule für Musik und Darstellende Kunst Stuttgart", "Staatliche Hochschule für Musik und Darstellende Kunst Stuttgart", "Hochschule für Musik und Darstellende Kunst Stuttgart", "Stuttgart", "hmdk-stuttgart.de", "art", 833],
  ["h153", "Hochschule für Musik und Tanz Köln", "", "Hochschule für Musik und Tanz Köln", "Köln", "hfmt-koeln.de", "art", 1420],
  ["h110", "Hochschule für Musik und Theater Hamburg", "", "Hochschule für Musik und Theater Hamburg", "Hamburg", "hfmt-hamburg.de", "art", 1445],
  ["h162", "Hochschule für Musik und Theater Leipzig", "Hochschule für Musik und Theater Felix Mendelssohn Bartholdy Leipzig", "Hochschule für Musik und Theater Leipzig", "Leipzig", "hmt-leipzig.de", "art", 1171],
  ["h188", "Hochschule für Musik und Theater München", "", "Hochschule für Musik und Theater München", "München", "hmtm.de", "art", 1235],
  ["h234", "Hochschule für Musik und Theater Rostock", "", "Hochschule für Musik und Theater Rostock", "Rostock", "hmt-rostock.de", "art", 568],
  ["h267", "Hochschule für Musik Weimar", "Hochschule für Musik Franz Liszt Weimar", "Hochschule für Musik Weimar", "Weimar", "hfm-weimar.de", "art", 798],
  ["h278", "Hochschule für Musik Würzburg", "", "Hochschule für Musik Würzburg", "Würzburg", "hfm-wuerzburg.de", "art", 561],
  ["h117", "Hochschule für Musik, Theater und Medien Hannover", "", "Hochschule für Musik, Theater und Medien Hannover", "Hannover", "hmtm-hannover.de", "art", 1345],
  ["h64", "Hochschule für nachhaltige Entwicklung", "Hochschule für nachhaltige Entwicklung Eberswalde", "Hochschule für nachhaltige Entwicklung", "Eberswalde", "hnee.de", "haw", 2291],
  ["h470", "Hochschule für Öffentliche Verwaltung Bremen", "", "Hochschule für Öffentliche Verwaltung Bremen", "Bremen", "hfoev.bremen.de", "admin", 666],
  ["h466", "Hochschule für öffentliche Verwaltung und Finanzen Ludwigsburg", "", "Hochschule für öffentliche Verwaltung und Finanzen Ludwigsburg", "Ludwigsburg", "hs-ludwigsburg.de", "admin", 2593],
  ["h189", "Hochschule für Philosophie", "", "Hochschule für Philosophie", "München", "hfph.de", "uni", 378],
  ["h504", "Hochschule für Polizei Baden-Württemberg", "", "Hochschule für Polizei Baden-Württemberg", "Villingen-Schwenningen", "hfpol-bw.de", "admin", 2070],
  ["h484", "Hochschule für Polizei und öffentliche Verwaltung Nordrhein-Westfalen", "", "Hochschule für Polizei und öffentliche Verwaltung Nordrhein-Westfalen", "Gelsenkirchen", "hspv.nrw.de", "admin", 13815],
  ["h23", "Hochschule für Schauspielkunst Berlin", "Hochschule für Schauspielkunst Ernst Busch", "Hochschule für Schauspielkunst Berlin", "Berlin", "hfs-berlin.de", "art", 190],
  ["h458", "Hochschule für Soziale Arbeit und Pädagogik", "Hochschule für Soziale Arbeit und Pädagogik (HSAP) gemeinnützige Betriebsgesellschaft mbH", "HSAP", "Berlin", "hsap.de", "haw", 522],
  ["h251", "Hochschule für Technik Stuttgart", "", "Hochschule für Technik Stuttgart", "Stuttgart", "hft-stuttgart.de", "haw", 3962],
  ["h16", "Hochschule für Technik und Wirtschaft Berlin", "", "Hochschule für Technik und Wirtschaft Berlin", "Berlin", "htw-berlin.de", "haw", 16028],
  ["h236", "Hochschule für Technik und Wirtschaft des Saarlandes", "", "Hochschule für Technik und Wirtschaft des Saarlandes", "Saarbrücken", "htwsaar.de", "haw", 6028],
  ["h54", "Hochschule für Technik und Wirtschaft Dresden", "Hochschule für Technik und Wirtschaft Dresden - University of Applied Sciences", "Hochschule für Technik und Wirtschaft Dresden", "Dresden", "htw-dresden.de", "haw", 4640],
  ["h160", "Hochschule für Technik, Wirtschaft und Kultur Leipzig", "", "Hochschule für Technik, Wirtschaft und Kultur Leipzig", "Leipzig", "htwk-leipzig.de", "haw", 6431],
  ["h208", "Hochschule für Technik, Wirtschaft und Medien Offenburg", "", "Hochschule für Technik, Wirtschaft und Medien Offenburg", "Offenburg", "hs-offenburg.de", "haw", 3640],
  ["h307", "Hochschule für Wirtschaft und Gesellschaft Ludwigshafen", "", "Hochschule für Wirtschaft und Gesellschaft Ludwigshafen", "Ludwigshafen", "hwg-lu.de", "haw", 4128],
  ["h17", "Hochschule für Wirtschaft und Recht Berlin", "", "Hochschule für Wirtschaft und Recht Berlin", "Berlin", "hwr-berlin.de", "haw", 11833],
  ["h203", "Hochschule für Wirtschaft und Umwelt Nürtingen-Geislingen", "", "Hochschule für Wirtschaft und Umwelt Nürtingen-Geislingen", "Nürtingen", "hfwu.de", "haw", 5365],
  ["h94", "Hochschule Furtwangen", "Hochschule Furtwangen - Informatik, Technik, Wirtschaft, Medien, Gesundheit", "Hochschule Furtwangen", "Furtwangen", "hs-furtwangen.de", "haw", 4603],
  ["h446", "Hochschule Geisenheim", "", "Hochschule Geisenheim", "Geisenheim", "hs-geisenheim.de", "other", 1334],
  ["h399", "Hochschule Hamm-Lippstadt", "", "Hochschule Hamm-Lippstadt", "Hamm", "hshl.de", "haw", 4341],
  ["h115", "Hochschule Hannover", "", "Hochschule Hannover", "Hannover", "hs-hannover.de", "haw", 8441],
  ["h118", "Hochschule Harz", "Hochschule Harz, Hochschule für angewandte Wissenschaften (FH)", "FH", "Wernigerode", "hs-harz.de", "haw", 2779],
  ["h125", "Hochschule Heilbronn", "Hochschule Heilbronn, Technik, Wirtschaft, Informatik", "Hochschule Heilbronn", "Heilbronn", "hs-heilbronn.de", "haw", 6882],
  ["h287", "Hochschule Hof", "Hochschule für angewandte Wissenschaften Hof", "Hochschule Hof", "Hof", "hof-university.de", "haw", 3697],
  ["h306", "Hochschule Kaiserslautern", "Hochschule Kaiserslautern (University of Applied Sciences)", "Hochschule Kaiserslautern", "Kaiserslautern", "hs-kl.de", "haw", 5175],
  ["h138", "Hochschule Karlsruhe", "Hochschule Karlsruhe - Technik und Wirtschaft", "Hochschule Karlsruhe", "Karlsruhe", "h-ka.de", "haw", 6903],
  ["h143", "Hochschule Kempten", "Hochschule für angewandte Wissenschaften Kempten", "Hochschule Kempten", "Kempten", "hs-kempten.de", "haw", 4601],
  ["h305", "Hochschule Koblenz", "", "Hochschule Koblenz", "Koblenz", "hs-koblenz.de", "haw", 8620],
  ["h155", "Hochschule Konstanz", "Hochschule Konstanz Technik, Wirtschaft und Gestaltung", "Hochschule Konstanz", "Konstanz", "htwg-konstanz.de", "haw", 4159],
  ["h157", "Hochschule Landshut", "Hochschule Landshut - Hochschule für angewandte Wissenschaften", "Hochschule Landshut", "Landshut", "haw-landshut.de", "haw", 5051],
  ["h173", "Hochschule Magdeburg-Stendal", "", "Hochschule Magdeburg-Stendal", "Magdeburg", "h2.de", "haw", 5169],
  ["h310", "Hochschule Mainz", "", "Hochschule Mainz", "Mainz", "hs-mainz.de", "haw", 5407],
  ["h498", "Hochschule Meißen (FH) und Fortbildungszentrum", "Hochschule für öffentliche Verwaltung und Rechtspflege (FH), Fortbildungszentrum des Freistaates Sachsen (HSF)", "FH", "Meißen", "hsf.sachsen.de", "admin", 1156],
  ["h180", "Hochschule Merseburg", "", "Hochschule Merseburg", "Merseburg", "hs-merseburg.de", "haw", 3054],
  ["h181", "Hochschule Mittweida", "Hochschule Mittweida, University of Applied Sciences", "Hochschule Mittweida", "Mittweida", "hs-mittweida.de", "haw", 6115],
  ["h291", "Hochschule München", "Hochschule für angewandte Wissenschaften München", "Hochschule München", "München", "hm.edu", "haw", 18826],
  ["h319", "Hochschule Neu-Ulm", "Hochschule für angewandte Wissenschaften Neu-Ulm", "Hochschule Neu-Ulm", "Neu-Ulm", "hnu.de", "haw", 4284],
  ["h195", "Hochschule Neubrandenburg", "Hochschule Neubrandenburg - University of Applied Sciences", "Hochschule Neubrandenburg", "Neubrandenburg", "hs-nb.de", "haw", 1832],
  ["h197", "Hochschule Niederrhein", "", "Hochschule Niederrhein", "Krefeld", "hs-niederrhein.de", "haw", 12969],
  ["h315", "Hochschule Nordhausen", "", "Hochschule Nordhausen", "Nordhausen", "hs-nordhausen.de", "haw", 1753],
  ["h214", "Hochschule Osnabrück", "", "Hochschule Osnabrück", "Osnabrück", "hs-osnabrueck.de", "haw", 12983],
  ["h219", "Hochschule Pforzheim", "Hochschule Pforzheim - Gestaltung, Technik, Wirtschaft und Recht", "Hochschule Pforzheim", "Pforzheim", "hs-pforzheim.de", "haw", 5771],
  ["h224", "Hochschule Ravensburg-Weingarten", "", "Hochschule Ravensburg-Weingarten", "Weingarten", "rwu.de", "haw", 3477],
  ["h227", "Hochschule Reutlingen", "Hochschule Reutlingen, Hochschule für Technik-  Wirtschaft-Informatik-Design", "Hochschule Reutlingen", "Reutlingen", "reutlingen-university.de", "haw", 5203],
  ["h400", "Hochschule Rhein-Waal", "Hochschule Rhein-Waal - University of Applied Sciences", "Hochschule Rhein-Waal", "Kleve", "hochschule-rhein-waal.de", "haw", 6043],
  ["h270", "Hochschule RheinMain", "", "Hochschule RheinMain", "Wiesbaden", "hs-rm.de", "haw", 12637],
  ["h409", "Hochschule Ruhr West", "Hochschule Ruhr West- University of Applied Sciences", "Hochschule Ruhr West", "Mülheim", "hochschule-ruhr-west.de", "haw", 5460],
  ["h242", "Hochschule Schmalkalden", "", "Hochschule Schmalkalden", "Schmalkalden", "hs-schmalkalden.de", "haw", 2933],
  ["h247", "Hochschule Stralsund", "", "Hochschule Stralsund", "Stralsund", "hochschule-stralsund.de", "haw", 1770],
  ["h308", "Hochschule Trier", "Hochschule Trier - Trier University of Applied Sciences", "Hochschule Trier", "Trier", "hochschule-trier.de", "haw", 6426],
  ["h264", "Hochschule Weihenstephan-Triesdorf", "Hochschule für angewandte Wissenschaften Weihenstephan-Triesdorf", "Hochschule Weihenstephan-Triesdorf", "Freising", "hswt.de", "haw", 5683],
  ["h427", "Hochschule Weserbergland", "", "Hochschule Weserbergland", "Hameln", "hsw-hameln.de", "haw", 443],
  ["h274", "Hochschule Wismar", "Hochschule Wismar - University of Applied Sciences: Technology, Business and Design", "Hochschule Wismar", "Wismar", "hs-wismar.de", "haw", 7262],
  ["h309", "Hochschule Worms", "Hochschule Worms, University of Applied Sciences", "Hochschule Worms", "Worms", "hs-worms.de", "haw", 3111],
  ["h282", "Hochschule Zittau/ Görlitz", "Hochschule Zittau/Görlitz", "Hochschule Zittau/ Görlitz", "Zittau", "hszg.de", "haw", 2377],
  ["h455", "HSD Hochschule Döpfer", "", "HSD Hochschule Döpfer", "Potsdam", "hs-doepfer.de", "haw", 1546],
  ["hu", "HU Berlin", "Humboldt-Universität zu Berlin", "HU Berlin", "Berlin", "hu-berlin.de", "uni", 40573],
  ["h401", "International Psychoanalytic University", "International Psychoanalytic University Berlin", "International Psychoanalytic University", "Berlin", "ipu-berlin.de", "uni", 749],
  ["h285", "International School of Management", "", "International School of Management", "Dortmund", "ism.de", "haw", 3728],
  ["h434", "Internationale Hochschule Liebenzell", "Internationale Hochschule Liebenzell (IHL)", "IHL", "Bad Liebenzell", "ihl.eu", "haw", 318],
  ["h376", "Internationale Hochschule SDI", "Internationale Hochschule SDI München - Hochschule für angewandte Wissenschaften", "Internationale Hochschule SDI", "München", "sdi-muenchen.de", "haw", 264],
  ["h525", "INU - Innovative University of Applied Sciences", "", "INU - Innovative University of Applied Sciences", "Köln", "inu.de", "haw", 107],
  ["h449", "IST-Hochschule für Management", "", "IST-Hochschule für Management", "Düsseldorf", "ist-hochschule.de", "haw", 4797],
  ["h329", "IU Internationale Hochschule", "", "IU Internationale Hochschule", "Erfurt", "iu.prf.hn", "haw", 125250],
  ["h406", "Jade Hochschule", "Jade Hochschule -  Wilhelmshaven/Oldenburg/Elsfleth", "Jade Hochschule", "Wilhelmshaven", "jade-hs.de", "haw", 6091],
  ["h359", "Karlshochschule International University", "Karlshochschule International University - staatlich anerkannte Hochschule der Karlshochschule gemeinnützige GmbH Karlsruhe", "Karlshochschule International University", "Karlsruhe", "karlshochschule.de", "haw", 255],
  ["h88", "Katholische Hochschule Freiburg", "Katholische Hochschule Freiburg, staatlich anerkannte Hochschule - Catholic University of Applied Sciences", "Katholische Hochschule Freiburg", "Freiburg", "kh-freiburg.de", "haw", 1788],
  ["h24", "Katholische Hochschule für Sozialwesen Berlin", "Katholische Hochschule für Sozialwesen Berlin (KHSB) - Staatlich anerkannte Fachhochschule für Sozialwesen", "KHSB", "Berlin", "khsb-berlin.de", "haw", 1263],
  ["h175", "Katholische Hochschule Mainz", "Katholische Hochschule Mainz Catholic University of Applied Sciences", "Katholische Hochschule Mainz", "Mainz", "kh-mz.de", "haw", 1396],
  ["h151", "Katholische Hochschule Nordrhein-Westfalen", "Katholische Hochschule Nordrhein-Westfalen - Catholic University of Applied Sciences", "Katholische Hochschule Nordrhein-Westfalen", "Köln", "katho-nrw.de", "haw", 5464],
  ["h186", "Katholische Stiftungshochschule München", "Katholische    Stiftungshochschule für   angewandte Wissenschaften München - Hochschule der Kirchlichen Stiftung des öffentlichen Rechts Katholische Bildungsstätten für Sozialberufe in Bayern", "Katholische Stiftungshochschule München", "München", "ksh-muenchen.de", "haw", 2546],
  ["h65", "Katholische Universität Eichstätt - Ingolstadt", "", "Katholische Uni Eichstätt - Ingolstadt", "Eichstätt", "ku.de", "uni", 4759],
  ["h281", "Kirchliche Hochschule Wuppertal", "", "Kirchliche Hochschule Wuppertal", "Wuppertal", "kiho-wuppertal.de", "uni", 136],
  ["kit", "KIT Karlsruhe", "Karlsruher Institut für Technologie", "KIT", "Karlsruhe", "student.kit.edu kit.edu", "uni", 22404],
  ["h520", "Kolping Hochschule für Gesundheit und Soziales Köln", "Kolping Hochschule", "Kolping Hochschule für Gesundheit und Soziales Köln", "Köln", "kolping-hochschule.de", "haw", 181],
  ["h429", "Kühne Logistics University", "Kühne Logistics University - Wissenschaftliche Hochschule für Logistik und Unternehmensführung", "Kühne Logistics University", "Hamburg", "klu.org", "uni", 284],
  ["h61", "Kunstakademie Düsseldorf", "", "Kunstakademie Düsseldorf", "Düsseldorf", "kunstakademie-duesseldorf.de", "art", 575],
  ["h139", "Kunstakademie Karlsruhe", "Staatliche Akademie der Bildenden Künste Karlsruhe", "Kunstakademie Karlsruhe", "Karlsruhe", "kunstakademie-karlsruhe.de", "art", 371],
  ["h193", "Kunstakademie Münster", "Kunstakademie Münster, Hochschule für Bildende Künste", "Kunstakademie Münster", "Münster", "kunstakademie-muenster.de", "art", 365],
  ["h152", "Kunsthochschule für Medien Köln", "", "Kunsthochschule für Medien Köln", "Köln", "khm.de", "art", 394],
  ["h114", "Leibniz Universität Hannover", "Gottfried Wilhelm Leibniz Universität Hannover", "Leibniz Uni Hannover", "Hannover", "uni-hannover.de", "uni", 25377],
  ["h439", "Leibniz-Fachhochschule Hannover", "Leibniz-Fachhochschule", "Leibniz-FH Hannover", "Hannover", "leibniz-fh.de", "haw", 621],
  ["h171", "Leuphana Universität", "Leuphana Universität Lüneburg", "Leuphana Universität", "Lüneburg", "leuphana.de", "uni", 9267],
  ["lmu", "LMU München", "Ludwig-Maximilians-Universität München", "LMU", "München", "campus.lmu.de lmu.de", "uni", 51737],
  ["h205", "Lutherische Theologische Hochschule Oberursel", "", "Lutherische Theologische Hochschule Oberursel", "Oberursel", "lthh-oberursel.de", "uni", 13],
  ["h366", "Macromedia University of Applied Sciences", "", "Macromedia University of Applied Sciences", "Potsdam", "macromedia-fachhochschule.de", "haw", 5341],
  ["h353", "Mediadesign Hochschule", "Mediadesign Hochschule für Design und Informatik", "Mediadesign Hochschule", "Berlin", "mediadesign.de", "haw", 669],
  ["h448", "Medical School Berlin", "Medical School Berlin - Hochschule für Gesundheit und Medizin (MSB)", "MSB", "Berlin", "medicalschool-berlin.de", "haw", 3120],
  ["h421", "Medical School Hamburg", "MSH Medical School Hamburg - University of Applied Sciences and Medical University", "Medical School Hamburg", "Hamburg", "medicalschool-hamburg.de", "other", 5512],
  ["h463", "Medizinische Hochschule Brandenburg Theodor Fontane", "", "Medizinische Hochschule Brandenburg Theodor Fontane", "Neuruppin", "mhb-fontane.de", "uni", 966],
  ["h112", "Medizinische Hochschule Hannover", "Medizinische Hochschule Hannover (MHH)", "MHH", "Hannover", "mh-hannover.de", "uni", 4085],
  ["h762", "Medizinische Universität Lausitz - Carl Thiem", "", "Medizinische Uni Lausitz - Carl Thiem", "Cottbus", "mul-ct.de", "uni", 0],
  ["h252", "Merz Akademie Stuttgart", "Merz Akademie Hochschule für Gestaltung, Kunst und Medien, Stuttgart - Staatlich anerkannt", "Merz Akademie Stuttgart", "Stuttgart", "merz-akademie.de", "haw", 205],
  ["h420", "MU Media University of Applied Sciences", "", "MU Media University of Applied Sciences", "Berlin", "media-university.de", "haw", 1809],
  ["h336", "Munich Business School", "Munich Business School - Staatlich anerkannte private Fachhochschule", "Munich Business School", "München", "munich-business-school.de", "haw", 705],
  ["h763", "Munich University of Digital \nTechnologies & Applied Sciences", "", "Munich University of Digital \nTechnologies & Applied Sciences", "München", "uni-munich.de", "haw", 0],
  ["h170", "Musikhochschule Lübeck", "", "Musikhochschule Lübeck", "Lübeck", "mh-luebeck.de", "art", 444],
  ["h289", "Muthesius Kunsthochschule", "", "Muthesius Kunsthochschule", "Kiel", "muthesius-kunsthochschule.de", "art", 551],
  ["h220", "NORDAKADEMIE Hochschule der Wirtschaft", "", "NORDAKADEMIE Hochschule der Wirtschaft", "Elmshorn", "nordakademie.de", "haw", 2506],
  ["h460", "Northern Business School", "NBS Northern Business School – University of Applied Sciences", "Northern Business School", "Hamburg", "nbs.de", "haw", 871],
  ["h280", "Ostbayerische Technische Hochschule Amberg-Weiden", "", "Ostbayerische TH Amberg-Weiden", "Amberg", "oth-aw.de", "haw", 4299],
  ["h226", "Ostbayerische Technische Hochschule Regensburg", "", "Ostbayerische TH Regensburg", "Regensburg", "oth-regensburg.de", "haw", 11070],
  ["h36", "Ostfalia Hochschule", "Hochschule Braunschweig/Wolfenbüttel, Ostfalia Hochschule für angewandte Wissenschaften", "Ostfalia Hochschule", "Wolfenbüttel", "ostfalia.de", "haw", 10050],
  ["h87", "Pädagogische Hochschule Freiburg", "", "PH Freiburg", "Freiburg", "ph-freiburg.de", "uni", 5125],
  ["h120", "Pädagogische Hochschule Heidelberg", "", "PH Heidelberg", "Heidelberg", "ph-heidelberg.de", "uni", 5254],
  ["h137", "Pädagogische Hochschule Karlsruhe", "", "PH Karlsruhe", "Karlsruhe", "ph-karlsruhe.de", "uni", 3371],
  ["h166", "Pädagogische Hochschule Ludwigsburg", "", "PH Ludwigsburg", "Ludwigsburg", "ph-ludwigsburg.de", "uni", 5833],
  ["h243", "Pädagogische Hochschule Schwäbisch Gmünd", "", "PH Schwäbisch Gmünd", "Schwäbisch Gmünd", "ph-gmuend.de", "uni", 2534],
  ["h268", "Pädagogische Hochschule Weingarten", "", "PH Weingarten", "Weingarten", "ph-weingarten.de", "uni", 3190],
  ["h324", "Palucca Hochschule für Tanz", "Palucca Hochschule für Tanz Dresden", "Palucca Hochschule für Tanz", "Dresden", "palucca.eu", "art", 185],
  ["h82", "Philosophisch-Theologische Hochschule Frankfurt am Main", "Philosophisch-Theologische Hochschule Sankt Georgen Frankfurt am Main", "Philosophisch-Theologische Hochschule Frankfurt am Main", "Frankfurt am Main", "sankt-georgen.de", "uni", 216],
  ["h320", "PHWT Vechta/Diepholz", "Private Hochschule für Wirtschaft und Technik Vechta/Diepholz", "PHWT Vechta/Diepholz", "Vechta", "phwt.de", "haw", 497],
  ["h299", "Private Hochschule Göttingen", "PFH - Private Hochschule Göttingen", "Private Hochschule Göttingen", "Göttingen", "pfh.de", "haw", 4315],
  ["h441", "Psychologische Hochschule Berlin", "Psychologische Hochschule Berlin (PHB)", "PHB", "Berlin", "psychologische-hochschule.de", "uni", 742],
  ["h150", "Rheinische Hochschule", "Rheinische Hochschule Köln", "Rheinische Hochschule", "Köln", "rh-koeln.de", "haw", 5677],
  ["h62", "Robert Schumann Hochschule", "Robert Schumann Hochschule Düsseldorf", "Robert Schumann Hochschule", "Düsseldorf", "rsh-duesseldorf.de", "art", 819],
  ["h135", "RPTU Kaiserslautern-Landau", "Rheinland-Pfälzische Technische Universität Kaiserslautern-Landau", "RPTU Kaiserslautern-Landau", "Kaiserslautern", "rptu.de", "uni", 16047],
  ["rwth", "RWTH Aachen", "Rheinisch-Westfälische Technische Hochschule Aachen", "RWTH", "Aachen", "rwth-aachen.de", "uni", 44587],
  ["h313", "SRH Fernhochschule - The Mobile University", "", "SRH Fernhochschule - The Mobile University", "Riedlingen", "mobile-university.de", "haw", 9282],
  ["h122", "SRH Heidelberg", "SRH University of Applied Sciences Heidelberg", "SRH Heidelberg", "Heidelberg", "srh-university.de", "haw", 9490],
  ["h253", "Staatliche Akademie der Bildenden Künste Stuttgart", "", "Staatliche Akademie der Bildenden Künste Stuttgart", "Stuttgart", "abk-stuttgart.de", "art", 774],
  ["h140", "Staatliche Hochschule für Gestaltung Karlsruhe", "", "Staatliche Hochschule für Gestaltung Karlsruhe", "Karlsruhe", "hfg-karlsruhe.de", "art", 351],
  ["h257", "Staatliche Hochschule für Musik Trossingen", "", "Staatliche Hochschule für Musik Trossingen", "Trossingen", "hfm-trossingen.de", "art", 426],
  ["h330", "Steinbeis Hochschule", "", "Steinbeis Hochschule", "Magdeburg", "steinbeis-hochschule.de", "haw", 4102],
  ["h333", "Technische Hochschule Aschaffenburg", "", "TH Aschaffenburg", "Aschaffenburg", "th-ab.de", "haw", 4033],
  ["h7", "Technische Hochschule Augsburg", "", "TH Augsburg", "Augsburg", "tha.de", "haw", 7653],
  ["h304", "Technische Hochschule Bingen", "", "TH Bingen", "Bingen", "th-bingen.de", "haw", 2160],
  ["h34", "Technische Hochschule Brandenburg", "", "TH Brandenburg", "Brandenburg", "th-brandenburg.de", "haw", 3151],
  ["h284", "Technische Hochschule Deggendorf", "", "TH Deggendorf", "Deggendorf", "th-deg.de", "haw", 9345],
  ["h31", "Technische Hochschule Georg Agricola", "", "TH Georg Agricola", "Bochum", "thga.de", "haw", 2142],
  ["h288", "Technische Hochschule Ingolstadt", "", "TH Ingolstadt", "Ingolstadt", "thi.de", "haw", 8579],
  ["h149", "Technische Hochschule Köln", "", "TH Köln", "Köln", "th-koeln.de", "haw", 20438],
  ["h169", "Technische Hochschule Lübeck", "", "TH Lübeck", "Lübeck", "th-luebeck.de", "haw", 4767],
  ["h177", "Technische Hochschule Mannheim", "", "TH Mannheim", "Mannheim", "th-mannheim.de", "haw", 5148],
  ["h97", "Technische Hochschule Mittelhessen", "Technische Hochschule Mittelhessen - THM", "TH Mittelhessen", "Gießen", "thm.de", "haw", 14666],
  ["h200", "Technische Hochschule Nürnberg", "Technische Hochschule Nürnberg Georg Simon Ohm", "TH Nürnberg", "Nürnberg", "studium.th-nuernberg.de", "haw", 12261],
  ["h165", "Technische Hochschule Ostwestfalen-Lippe", "", "TH Ostwestfalen-Lippe", "Lemgo", "th-owl.de", "haw", 5701],
  ["h232", "Technische Hochschule Rosenheim", "", "TH Rosenheim", "Rosenheim", "th-rosenheim.de", "haw", 7614],
  ["h260", "Technische Hochschule Ulm", "", "TH Ulm", "Ulm", "thu.de", "haw", 2915],
  ["h272", "Technische Hochschule Wildau", "", "TH Wildau", "Wildau", "th-wildau.de", "haw", 3478],
  ["h277", "Technische Hochschule Würzburg-Schweinfurt", "", "TH Würzburg-Schweinfurt", "Würzburg", "thws.de", "haw", 9214],
  ["h691", "Technische Universität Nürnberg", "", "TU Nürnberg", "Nürnberg", "utn.de", "uni", 62],
  ["h93", "Theologische Fakultät Fulda", "", "Theologische Fakultät Fulda", "Fulda", "thf-fulda.de", "uni", 11],
  ["h217", "Theologische Fakultät Paderborn", "", "Theologische Fakultät Paderborn", "Paderborn", "thf-paderborn.de", "uni", 60],
  ["h256", "Theologische Fakultät Trier", "", "Theologische Fakultät Trier", "Trier", "theologie-trier.de", "uni", 140],
  ["h407", "Theologische Hochschule Elstal", "", "Theologische Hochschule Elstal", "Wustermark", "th-elstal.de", "haw", 38],
  ["h447", "Theologische Hochschule Ewersbach", "", "Theologische Hochschule Ewersbach", "Dietzhölztal", "th-ewersbach.de", "haw", 60],
  ["h91", "Theologische Hochschule Friedensau", "", "Theologische Hochschule Friedensau", "Friedensau", "thh-friedensau.de", "uni", 216],
  ["h360", "Theologische Hochschule Reutlingen", "Theologische Hochschule Reutlingen - staatlich anerkannte Fachhochschule der Evangelisch-methodistischen Kirche", "Theologische Hochschule Reutlingen", "Reutlingen", "th-reutlingen.de", "haw", 99],
  ["h113", "Tierärztliche Hochschule Hannover", "Stiftung Tierärztliche Hochschule Hannover", "Tierärztliche Hochschule Hannover", "Hannover", "tiho-hannover.de", "uni", 2306],
  ["h657", "Tomorrow University of Applied Sciences", "", "Tomorrow University of Applied Sciences", "Frankfurt am Main", "tomorrow-university", "haw", 272],
  ["h85", "TU Bergakademie Freiberg", "Technische Universität Bergakademie Freiberg", "TU Bergakademie Freiberg", "Freiberg", "tu-freiberg.de", "uni", 4179],
  ["tub", "TU Berlin", "Technische Universität Berlin", "TU Berlin", "Berlin", "campus.tu-berlin.de tu-berlin.de", "uni", 34475],
  ["h35", "TU Braunschweig", "Technische Universität Braunschweig", "TU Braunschweig", "Braunschweig", "tu-braunschweig.de", "uni", 15051],
  ["h42", "TU Chemnitz", "Technische Universität Chemnitz", "TU Chemnitz", "Chemnitz", "tu-chemnitz.de", "uni", 8447],
  ["h43", "TU Clausthal", "Technische Universität Clausthal", "TU Clausthal", "Clausthal-Zellerfeld", "tu-clausthal.de", "uni", 2802],
  ["h46", "TU Darmstadt", "Technische Universität Darmstadt", "TU Darmstadt", "Darmstadt", "tu-darmstadt.de", "uni", 24465],
  ["h51", "TU Dortmund", "Technische Universität Dortmund", "TU Dortmund", "Dortmund", "tu-dortmund.de", "uni", 29227],
  ["tud", "TU Dresden", "Technische Universität Dresden", "TUD", "Dresden", "mailbox.tu-dresden.de tu-dresden.de", "uni", 27531],
  ["h105", "TU Hamburg", "Technische Universität Hamburg", "TU Hamburg", "Hamburg", "tuhh.de", "uni", 8704],
  ["h130", "TU Ilmenau", "Technische Universität Ilmenau", "TU Ilmenau", "Ilmenau", "tu-ilmenau.de", "uni", 3968],
  ["tum", "TU München", "Technische Universität München", "TUM", "München", "tum.de mytum.de", "uni", 54368],
  ["uhh", "Uni Hamburg", "Universität Hamburg", "UHH", "Hamburg", "studium.uni-hamburg.de uni-hamburg.de", "uni", 42585],
  ["hd", "Uni Heidelberg", "Ruprecht-Karls-Universität Heidelberg", "Uni Heidelberg", "Heidelberg", "stud.uni-heidelberg.de uni-heidelberg.de", "uni", 31417],
  ["koeln", "Uni Köln", "Universität zu Köln", "Uni Köln", "Köln", "smail.uni-koeln.de uni-koeln.de", "uni", 47024],
  ["ma", "Uni Mannheim", "Universität Mannheim", "Uni Mannheim", "Mannheim", "students.uni-mannheim.de uni-mannheim.de", "uni", 11463],
  ["ms", "Uni Münster", "Universität Münster", "Uni Münster", "Münster", "uni-muenster.de", "uni", 41306],
  ["wien", "Uni Wien", "Universität Wien", "Uni Wien", "Wien", "univie.ac.at", "uni", 85000],
  ["h6", "Universität Augsburg", "", "Uni Augsburg", "Augsburg", "uni-augsburg.de", "uni", 17591],
  ["h8", "Universität Bamberg", "Otto-Friedrich-Universität Bamberg", "Uni Bamberg", "Bamberg", "uni-bamberg.de", "uni", 9500],
  ["h9", "Universität Bayreuth", "", "Uni Bayreuth", "Bayreuth", "uni-bayreuth.de", "uni", 11057],
  ["h27", "Universität Bielefeld", "", "Uni Bielefeld", "Bielefeld", "uni-bielefeld.de", "uni", 23582],
  ["h29", "Universität Bochum", "Ruhr-Universität Bochum", "Uni Bochum", "Bochum", "ruhr-uni-bochum.de", "uni", 37716],
  ["h32", "Universität Bonn", "Rheinische Friedrich-Wilhelms-Universität Bonn", "Uni Bonn", "Bonn", "uni-bonn.de", "uni", 34652],
  ["h38", "Universität Bremen", "", "Uni Bremen", "Bremen", "uni-bremen.de", "uni", 18200],
  ["h185", "Universität der Bundeswehr München", "", "Uni der Bundeswehr München", "Neubiberg", "unibw.de", "uni", 3137],
  ["h20", "Universität der Künste Berlin", "", "Uni der Künste Berlin", "Berlin", "udk-berlin.de", "art", 4446],
  ["h235", "Universität des Saarlandes", "", "Uni des Saarlandes", "Saarbrücken", "uni-saarland.de", "uni", 15644],
  ["h71", "Universität Duisburg-Essen", "", "Uni Duisburg-Essen", "Essen", "uni-due.de", "uni", 37276],
  ["h59", "Universität Düsseldorf", "Heinrich-Heine-Universität Düsseldorf", "Uni Düsseldorf", "Düsseldorf", "hhu.de", "uni", 28201],
  ["h66", "Universität Erfurt", "", "Uni Erfurt", "Erfurt", "uni-erfurt.de", "uni", 5363],
  ["h86", "Universität Freiburg im Breisgau", "Albert-Ludwigs-Universität Freiburg im Breisgau", "Uni Freiburg im Breisgau", "Freiburg", "uni-freiburg.de", "uni", 24212],
  ["h246", "Universität für Verwaltungswissenschaften Speyer", "Deutsche Universität für Verwaltungswissenschaften Speyer", "Uni für Verwaltungswissenschaften Speyer", "Speyer", "uni-speyer.de", "uni", 243],
  ["h96", "Universität Giessen", "Justus-Liebig-Universität Gießen", "Uni Giessen", "Gießen", "uni-giessen.de", "uni", 24540],
  ["h98", "Universität Göttingen", "Georg-August-Universität Göttingen", "Uni Göttingen", "Göttingen", "uni-goettingen.de", "uni", 26855],
  ["h99", "Universität Greifswald", "", "Uni Greifswald", "Greifswald", "uni-greifswald.de", "uni", 9728],
  ["h101", "Universität Halle-Wittenberg", "Martin-Luther-Universität Halle-Wittenberg", "Uni Halle-Wittenberg", "Halle", "uni-halle.de", "uni", 18679],
  ["h127", "Universität Hildesheim", "", "Uni Hildesheim", "Hildesheim", "uni-hildesheim.de", "uni", 7342],
  ["h129", "Universität Hohenheim", "", "Uni Hohenheim", "Stuttgart", "uni-hohenheim.de", "uni", 8505],
  ["h133", "Universität Jena", "Friedrich-Schiller-Universität Jena", "Uni Jena", "Jena", "uni-jena.de", "uni", 16106],
  ["h142", "Universität Kassel", "", "Uni Kassel", "Kassel", "uni-kassel.de", "uni", 21037],
  ["h146", "Universität Koblenz", "", "Uni Koblenz", "Koblenz", "uni-koblenz.de", "uni", 9755],
  ["h154", "Universität Konstanz", "", "Uni Konstanz", "Konstanz", "uni-konstanz.de", "uni", 9688],
  ["h159", "Universität Leipzig", "", "Uni Leipzig", "Leipzig", "uni-leipzig.de", "uni", 30337],
  ["h172", "Universität Magdeburg", "Otto-von-Guericke-Universität Magdeburg", "Uni Magdeburg", "Magdeburg", "ovgu.de", "uni", 13121],
  ["h174", "Universität Mainz", "Johannes Gutenberg-Universität Mainz", "Uni Mainz", "Mainz", "uni-mainz.de", "uni", 29454],
  ["h179", "Universität Marburg", "Philipps-Universität Marburg", "Uni Marburg", "Marburg", "uni-marburg.de", "uni", 20278],
  ["h209", "Universität Oldenburg", "Carl von Ossietzky Universität Oldenburg", "Uni Oldenburg", "Oldenburg", "uol.de", "uni", 14456],
  ["h211", "Universität Osnabrück", "", "Uni Osnabrück", "Osnabrück", "uni-osnabrueck.de", "uni", 13271],
  ["h215", "Universität Paderborn", "", "Uni Paderborn", "Paderborn", "meine.uni-paderborn.de", "uni", 17047],
  ["h218", "Universität Passau", "", "Uni Passau", "Passau", "uni-passau.de", "uni", 10569],
  ["h221", "Universität Potsdam", "", "Uni Potsdam", "Potsdam", "uni-potsdam.de", "uni", 19652],
  ["h225", "Universität Regensburg", "", "Uni Regensburg", "Regensburg", "uni-regensburg.de", "uni", 19062],
  ["h233", "Universität Rostock", "", "Uni Rostock", "Rostock", "uni-rostock.de", "uni", 12775],
  ["h245", "Universität Siegen", "", "Uni Siegen", "Siegen", "uni-siegen.de", "uni", 13841],
  ["h248", "Universität Stuttgart", "", "Uni Stuttgart", "Stuttgart", "uni-stuttgart.de", "uni", 20309],
  ["h255", "Universität Trier", "", "Uni Trier", "Trier", "uni-trier.de", "uni", 10311],
  ["h258", "Universität Tübingen", "Eberhard Karls Universität Tübingen", "Uni Tübingen", "Tübingen", "uni-tuebingen.de", "uni", 27750],
  ["h259", "Universität Ulm", "", "Uni Ulm", "Ulm", "uni-ulm.de", "uni", 9832],
  ["h293", "Universität Vechta", "", "Uni Vechta", "Vechta", "uni-vechta.de", "uni", 3464],
  ["h266", "Universität Weimar", "Bauhaus-Universität Weimar", "Uni Weimar", "Weimar", "uni-weimar.de", "uni", 3825],
  ["h275", "Universität Witten/Herdecke", "Private Universität Witten/Herdecke gGmbH", "Uni Witten/Herdecke", "Witten", "uni-wh.de", "uni", 3332],
  ["h276", "Universität Würzburg", "Julius-Maximilians-Universität Würzburg", "Uni Würzburg", "Würzburg", "uni-wuerzburg.de", "uni", 25281],
  ["h144", "Universität zu Kiel", "Christian-Albrechts-Universität zu Kiel", "Uni zu Kiel", "Kiel", "uni-kiel.de", "uni", 24438],
  ["h168", "Universität zu Lübeck", "", "Uni zu Lübeck", "Lübeck", "uni-luebeck.de", "uni", 6160],
  ["h335", "University of Europe for Applied Sciences", "", "University of Europe for Applied Sciences", "Potsdam", "ue-germany.com", "haw", 6352],
  ["h524", "University of Labour", "", "University of Labour", "Frankfurt am Main", "university-of-labour.de", "haw", 73],
  ["h262", "Vinzenz Pallotti University", "Vinzenz Pallotti University - kirchlich und staatlich anerkannte wissenschaftliche Hochschule in freier Trägerschaft", "Vinzenz Pallotti University", "Vallendar", "vp-uni.de", "uni", 444],
  ["h22", "weißensee kunsthochschule berlin", "", "weißensee kunsthochschule berlin", "Berlin", "kh-berlin.de", "art", 844],
  ["h95", "Westfälische Hochschule", "Westfälische Hochschule Gelsenkirchen, Bocholt, Recklinghausen", "Westfälische Hochschule", "Gelsenkirchen", "w-hs.de", "haw", 7154],
  ["h283", "Westsächsische Hochschule", "Westsächsische Hochschule Zwickau", "Westsächsische Hochschule", "Zwickau", "whz.de", "haw", 2956],
  ["h462", "Whitecliffe University of Applied Sciences", "", "Whitecliffe University of Applied Sciences", "Berlin", "whitecliffe.de", "haw", 521],
  ["h261", "WHU Vallendar", "WHU - Otto Beisheim School of Management", "WHU Vallendar", "Vallendar", "whu.edu", "uni", 2064],
  ["h317", "Wilhelm Büchner Hochschule", "", "Wilhelm Büchner Hochschule", "Darmstadt", "wb-fernstudium.de", "haw", 4313],
  ["h515", "XU Exponential University of Applied Sciences", "", "XU Exponential University of Applied Sciences", "Potsdam", "xu-university.com", "haw", 118],
  ["h351", "Zeppelin Universität", "Zeppelin Universität - Hochschule zwischen Wirtschaft, Kultur und Politik", "Zeppelin Universität", "Friedrichshafen", "zu.de", "uni", 506],
];
const FEATURED_UNIS = ["tum", "lmu", "rwth", "hd", "fu"];
const UNIVERSITIES = UNI_ROWS.map(([id, name, full, short, city, domains, type, students]) => ({
  id,
  name,
  full,
  short,
  city,
  domains: domains.split(" "),
  type,
  students,
  featured: FEATURED_UNIS.includes(id),
}));
const UNI_BY_ID = Object.fromEntries(UNIVERSITIES.map((u) => [u.id, u]));

const MAJORS = [
  { id: "cs", emoji: "💻", en: "Computer Science", de: "Informatik" },
  { id: "psy", emoji: "🧠", en: "Psychology", de: "Psychologie" },
  { id: "bwl", emoji: "📈", en: "Business", de: "BWL" },
  { id: "econ", emoji: "💶", en: "Economics", de: "VWL" },
  { id: "law", emoji: "⚖️", en: "Law", de: "Jura" },
  { id: "med", emoji: "🩺", en: "Medicine", de: "Medizin" },
  { id: "math", emoji: "📐", en: "Mathematics", de: "Mathematik" },
  { id: "phys", emoji: "⚛️", en: "Physics", de: "Physik" },
  { id: "chem", emoji: "🧪", en: "Chemistry", de: "Chemie" },
  { id: "bio", emoji: "🧬", en: "Biology", de: "Biologie" },
  { id: "mech", emoji: "⚙️", en: "Mechanical Eng.", de: "Maschinenbau" },
  { id: "ee", emoji: "🔌", en: "Electrical Eng.", de: "E-Technik" },
  { id: "arch", emoji: "🏛️", en: "Architecture", de: "Architektur" },
  { id: "design", emoji: "🎨", en: "Design", de: "Design" },
  { id: "pol", emoji: "🗳️", en: "Political Science", de: "Politikwissenschaft" },
  { id: "edu", emoji: "🍎", en: "Teacher Training", de: "Lehramt" },
];
const MAJOR_BY_ID = Object.fromEntries(MAJORS.map((m) => [m.id, m]));
// Keep existing custom-major records readable after removing the custom-major sign-up option.
const majorLabel = (id) => (typeof id === "string" && id.startsWith("custom:") ? id.slice(7) : id);
const majorInfo = (id) => MAJOR_BY_ID[id] ?? { en: majorLabel(id), de: majorLabel(id) };

const INTERESTS = [
  { id: "coding", emoji: "💻", en: "Coding", de: "Coding", photo: VIBE.code },
  { id: "matcha", emoji: "🍵", en: "Iced Matcha", de: "Iced Matcha", photo: VIBE.matcha },
  { id: "coffee", emoji: "☕", en: "Coffee", de: "Kaffee", photo: VIBE.coffee },
  { id: "padel", emoji: "🎾", en: "Padel", de: "Padel", photo: VIBE.tennis },
  { id: "gym", emoji: "🏋️", en: "Gym", de: "Gym", photo: VIBE.gym },
  { id: "running", emoji: "🏃", en: "Running", de: "Laufen", photo: VIBE.hiking },
  { id: "hiking", emoji: "🥾", en: "Hiking", de: "Wandern", photo: VIBE.hiking },
  { id: "climbing", emoji: "🧗", en: "Bouldering", de: "Bouldern", photo: VIBE.climbing },
  { id: "football", emoji: "⚽", en: "Football", de: "Fußball", photo: VIBE.football },
  { id: "music", emoji: "🎧", en: "Music", de: "Musik", photo: VIBE.concert },
  { id: "gaming", emoji: "🎮", en: "Gaming", de: "Gaming", photo: VIBE.gaming },
  { id: "boardgames", emoji: "🎲", en: "Board games", de: "Brettspiele", photo: VIBE.friends },
  { id: "cooking", emoji: "🍳", en: "Cooking", de: "Kochen", photo: VIBE.cooking },
  { id: "photography", emoji: "📸", en: "Photography", de: "Fotografie", photo: VIBE.camera },
  { id: "travel", emoji: "✈️", en: "Travel", de: "Reisen", photo: VIBE.travel },
  { id: "film", emoji: "🎬", en: "Movies", de: "Filme", photo: VIBE.friends },
  { id: "books", emoji: "📖", en: "Reading", de: "Lesen", photo: VIBE.books },
  { id: "art", emoji: "🎨", en: "Art", de: "Kunst", photo: VIBE.paint },
  { id: "startups", emoji: "🚀", en: "Startups", de: "Startups", photo: VIBE.desk },
  { id: "party", emoji: "🪩", en: "Going out", de: "Feiern", photo: VIBE.party },
  { id: "yoga", emoji: "🧘", en: "Yoga", de: "Yoga", photo: VIBE.yoga },
  { id: "guitar", emoji: "🎸", en: "Guitar", de: "Gitarre", photo: VIBE.guitar },
  { id: "basketball", emoji: "🏀", en: "Basketball", de: "Basketball", photo: VIBE.tennis },
  { id: "swimming", emoji: "🏊", en: "Swimming", de: "Schwimmen", photo: VIBE.hiking },
  { id: "cycling", emoji: "🚴", en: "Cycling", de: "Radfahren", photo: VIBE.hiking },
  { id: "badminton", emoji: "🏸", en: "Badminton", de: "Badminton", photo: VIBE.tennis },
  { id: "volleyball", emoji: "🏐", en: "Volleyball", de: "Volleyball", photo: VIBE.tennis },
  { id: "dancing", emoji: "💃", en: "Dancing", de: "Tanzen", photo: VIBE.party },
  { id: "skateboarding", emoji: "🛹", en: "Skateboarding", de: "Skateboarden", photo: VIBE.campus },
  { id: "chess", emoji: "♟️", en: "Chess", de: "Schach", photo: VIBE.books },
  { id: "anime", emoji: "🍥", en: "Anime", de: "Anime", photo: VIBE.gaming },
  { id: "podcasts", emoji: "🎙️", en: "Podcasts", de: "Podcasts", photo: VIBE.concert },
  { id: "languages", emoji: "🗣️", en: "Learning languages", de: "Sprachen lernen", photo: VIBE.travel },
  { id: "fashion", emoji: "👗", en: "Fashion", de: "Mode", photo: VIBE.camera },
  { id: "thrifting", emoji: "🧥", en: "Thrifting", de: "Secondhand", photo: VIBE.travel },
  { id: "baking", emoji: "🧁", en: "Baking", de: "Backen", photo: VIBE.cooking },
  { id: "brunch", emoji: "🥐", en: "Brunch", de: "Brunch", photo: VIBE.coffee },
  { id: "foodspots", emoji: "🥑", en: "Finding food spots", de: "Neue Foodspots", photo: VIBE.mensa },
  { id: "plants", emoji: "🪴", en: "Plants", de: "Pflanzen", photo: VIBE.campus },
  { id: "pets", emoji: "🐕", en: "Dogs & pets", de: "Hunde & Haustiere", photo: VIBE.friends },
  { id: "volunteering", emoji: "🤝", en: "Volunteering", de: "Ehrenamt", photo: VIBE.friends },
  { id: "sustainability", emoji: "🌱", en: "Sustainability", de: "Nachhaltigkeit", photo: VIBE.hiking },
  { id: "camping", emoji: "🏕️", en: "Camping", de: "Camping", photo: VIBE.hiking },
  { id: "skiing", emoji: "⛷️", en: "Skiing", de: "Skifahren", photo: VIBE.hiking },
  { id: "surfing", emoji: "🏄", en: "Surfing", de: "Surfen", photo: VIBE.travel },
  { id: "martial_arts", emoji: "🥋", en: "Martial arts", de: "Kampfsport", photo: VIBE.gym },
  { id: "meditation", emoji: "🧘‍♂️", en: "Meditation", de: "Meditation", photo: VIBE.yoga },
  { id: "astronomy", emoji: "🔭", en: "Astronomy", de: "Astronomie", photo: VIBE.studyGroup },
  { id: "theatre", emoji: "🎭", en: "Theatre", de: "Theater", photo: VIBE.concert },
  { id: "writing", emoji: "✍️", en: "Writing", de: "Schreiben", photo: VIBE.books },
  { id: "formula1", emoji: "🏎️", en: "Formula 1", de: "Formel 1", photo: VIBE.gaming },
];
const INTEREST_BY_ID = Object.fromEntries(INTERESTS.map((i) => [i.id, i]));

// Starting interests for people who sign up (editable in "My profile").
const DEFAULT_INTERESTS = {
  cs: ["coding", "gaming", "coffee"],
  psy: ["books", "yoga", "matcha"],
  bwl: ["startups", "padel", "party"],
  med: ["running", "coffee", "cooking"],
  law: ["books", "coffee", "travel"],
};

const STATUSES = [
  { id: "library", emoji: "📚", en: "Library", de: "Bib" },
  { id: "coffee", emoji: "☕", en: "Coffee", de: "Kaffee" },
  { id: "mensa", emoji: "🍝", en: "Mensa", de: "Mensa" },
  { id: "studying", emoji: "💻", en: "Studying", de: "Am Lernen" },
  { id: "lecture", emoji: "🎓", en: "Lecture", de: "Vorlesung" },
  { id: "sport", emoji: "🏃", en: "Sport", de: "Sport" },
  { id: "party", emoji: "🍻", en: "Out tonight", de: "Unterwegs" },
  { id: "new", emoji: "✨", en: "New here", de: "Neu dabei" },
];
const STATUS_BY_ID = Object.fromEntries(STATUSES.map((s) => [s.id, s]));

const HANGOUT_TYPES = [
  { id: "coffee", emoji: "☕", en: "Coffee", de: "Kaffee", photo: VIBE.latte, max: 4, title: { en: "Coffee break? ☕", de: "Kaffeepause? ☕" } },
  {
    id: "mensa",
    emoji: "🍝",
    en: "Mensa",
    de: "Mensa",
    photo: VIBE.bowl,
    max: 6,
    title: { en: "Mensa, who's in? 🍝", de: "Mensa, wer kommt mit? 🍝" },
  },
  { id: "study", emoji: "📚", en: "Study", de: "Lernen", photo: VIBE.notes, max: 6, title: { en: "Study session 📚", de: "Lernsession 📚" } },
  {
    id: "sport",
    emoji: "🏃",
    en: "Sport",
    de: "Sport",
    photo: VIBE.tennis,
    max: 8,
    title: { en: "Quick game of padel? 🎾", de: "Spontan Padel? 🎾" },
  },
  {
    id: "party",
    emoji: "🍻",
    en: "Going out",
    de: "Feiern",
    photo: VIBE.party,
    max: 20,
    title: { en: "Drinks tonight? 🍻", de: "Heute Abend was trinken? 🍻" },
  },
];
const HANGOUT_TYPE_BY_ID = Object.fromEntries(HANGOUT_TYPES.map((h) => [h.id, h]));

const PLACES = [
  { en: "Main Mensa", de: "Hauptmensa" },
  { en: "Library, 2nd floor", de: "Bib, 2. OG" },
  { en: "Courtyard café", de: "Café im Innenhof" },
  { en: "Uni sports centre", de: "Hochschulsport" },
  { en: "Campus lawn", de: "Campus-Wiese" },
];

const GROUP_EMOJIS = ["📚", "🍝", "🎮", "🧗", "🎾", "🎧", "🚀", "🧠", "☕", "🍻"];

// Portraits are matched to names; `ago` is minutes since the person was last active.
const STUDENTS = [
  {
    id: "s1",
    name: "Lena Hoffmann",
    age: 21,
    photo: "1534528741775-53994a69daeb",
    major: "cs",
    minor: "psy",
    semester: 3,
    interests: ["coding", "matcha", "boardgames", "climbing"],
    online: true,
    status: "library",
    ago: 4,
    bio: {
      en: "CS meets psychology. Building apps that don't stress people out. Matcha addict 🍵",
      de: "Informatik trifft Psychologie. Ich baue Apps, die nicht stressen. Matcha-süchtig 🍵",
    },
  },
  {
    id: "s2",
    name: "Noah Becker",
    age: 22,
    photo: "1507003211169-0a1dd7228f2d",
    major: "cs",
    minor: "math",
    semester: 5,
    interests: ["coding", "gaming", "coffee", "football"],
    online: true,
    status: "coffee",
    ago: 9,
    bio: {
      en: "Tutor for Algorithms. Ask me anything, except about my sleep schedule ☕",
      de: "Tutor für Algorithmen. Frag mich alles, nur nicht nach meinem Schlafrhythmus ☕",
    },
  },
  {
    id: "s3",
    name: "Mia Wagner",
    age: 20,
    photo: "1494790108377-be9c29b29330",
    major: "cs",
    minor: "psy",
    semester: 1,
    interests: ["photography", "matcha", "yoga", "travel"],
    online: true,
    status: "new",
    ago: 2,
    bio: { en: "Fresher, new in town and looking for my people ✨", de: "Ersti, neu in der Stadt und auf der Suche nach meinen Leuten ✨" },
  },
  {
    id: "s4",
    name: "Elias Schmitt",
    age: 23,
    photo: "1535713875002-d1d0cf377fde",
    major: "cs",
    minor: null,
    semester: 7,
    interests: ["startups", "coding", "running"],
    online: true,
    status: "studying",
    ago: 12,
    bio: {
      en: "Working on my thesis and a tiny startup. Always up for a run 🏃",
      de: "Schreibe gerade Bachelorarbeit und baue ein kleines Startup. Immer bereit für eine Runde laufen 🏃",
    },
  },
  {
    id: "s5",
    name: "Amara Okafor",
    age: 22,
    photo: "1531123897727-8f129e1688ce",
    major: "psy",
    minor: "cs",
    semester: 5,
    interests: ["books", "yoga", "music", "travel"],
    online: true,
    status: "coffee",
    ago: 6,
    bio: {
      en: "Psych with a coding minor. Podcasts, long walks, good coffee.",
      de: "Psychologie mit Informatik im Nebenfach. Podcasts, lange Spaziergänge, guter Kaffee.",
    },
  },
  {
    id: "s6",
    name: "Jonas Weber",
    age: 24,
    photo: "1506794778202-cad84cf45f1d",
    major: "psy",
    minor: null,
    semester: 7,
    interests: ["gym", "music", "film"],
    online: false,
    ago: 95,
    bio: { en: "Research assistant in the cognition lab. Film nights at my place 🎬", de: "Hiwi im Kognitionslabor. Filmabende bei mir 🎬" },
  },
  {
    id: "s7",
    name: "Sophie Braun",
    age: 21,
    photo: "1438761681033-6461ffad8d80",
    major: "psy",
    minor: "bwl",
    semester: 3,
    interests: ["books", "matcha", "art"],
    online: true,
    status: "library",
    ago: 15,
    bio: { en: "Stats I is my nemesis. Looking for a study buddy 📚", de: "Statistik I ist mein Endgegner. Suche Lernbuddy 📚" },
  },
  {
    id: "s8",
    name: "Luca Rossi",
    age: 22,
    photo: "1539571696357-5a69c17a67c6",
    major: "bwl",
    minor: "cs",
    semester: 5,
    interests: ["padel", "startups", "party"],
    online: true,
    status: "mensa",
    ago: 3,
    bio: {
      en: "From Milan, studying in Germany. Padel, pasta and pitch decks 🎾",
      de: "Aus Mailand, studiere in Deutschland. Padel, Pasta und Pitch Decks 🎾",
    },
  },
  {
    id: "s9",
    name: "Hannah Klein",
    age: 20,
    photo: "1544005313-94ddf0286df2",
    major: "med",
    minor: "psy",
    semester: 3,
    interests: ["running", "cooking", "music"],
    online: false,
    ago: 240,
    bio: { en: "Anatomy by day, cooking experiments by night 🍳", de: "Tagsüber Anatomie, abends Kochexperimente 🍳" },
  },
  {
    id: "s10",
    name: "David Nguyen",
    age: 23,
    photo: "1633332755192-727a05c4013d",
    major: "math",
    minor: "cs",
    semester: 5,
    interests: ["boardgames", "coding", "climbing"],
    online: true,
    status: "studying",
    ago: 20,
    bio: { en: "Proofs, puzzles and bouldering. Board game nights every Friday 🎲", de: "Beweise, Rätsel und Bouldern. Freitags Spieleabend 🎲" },
  },
  {
    id: "s11",
    name: "Zoe Fischer",
    age: 19,
    photo: "1529626455594-4ff0802cfb7e",
    major: "design",
    minor: null,
    semester: 1,
    interests: ["art", "photography", "film"],
    online: true,
    status: "new",
    ago: 1,
    bio: { en: "First semester, camera always with me 📸", de: "Erstes Semester, Kamera immer dabei 📸" },
  },
  {
    id: "s12",
    name: "Kofi Mensah",
    age: 24,
    photo: "1463453091185-61582044d556",
    major: "mech",
    minor: null,
    semester: 7,
    interests: ["football", "gym", "gaming"],
    online: false,
    ago: 60,
    bio: { en: "Racing team engineer. Sunday league striker ⚽", de: "Ingenieur im Racing-Team. Stürmer in der Sonntagsliga ⚽" },
  },
  {
    id: "s13",
    name: "Clara Neumann",
    age: 22,
    photo: "1544725176-7c40e5a71c5e",
    major: "law",
    minor: "pol",
    semester: 5,
    interests: ["books", "travel", "coffee"],
    online: true,
    status: "coffee",
    ago: 8,
    bio: { en: "Moot court team. I will argue about anything, kindly ☕", de: "Moot-Court-Team. Ich diskutiere über alles, aber nett ☕" },
  },
  {
    id: "s14",
    name: "Felix Wolf",
    age: 21,
    photo: "1527980965255-d3b416303d12",
    major: "cs",
    minor: null,
    semester: 3,
    interests: ["gaming", "padel", "party"],
    online: true,
    status: "mensa",
    ago: 5,
    bio: { en: "Smash main, padel rookie, Mensa regular 🎮", de: "Smash-Main, Padel-Anfänger, Mensa-Stammgast 🎮" },
  },
  {
    id: "s15",
    name: "Aylin Demir",
    age: 21,
    photo: "1488426862026-3ee34a7d66df",
    major: "psy",
    minor: null,
    semester: 3,
    interests: ["yoga", "cooking", "matcha"],
    online: true,
    status: "sport",
    ago: 11,
    bio: { en: "Yoga at 7, lectures at 10, matcha in between 🧘", de: "Yoga um 7, Vorlesung um 10, Matcha dazwischen 🧘" },
  },
  {
    id: "s16",
    name: "Jakob Schulz",
    age: 25,
    photo: "1599566150163-29194dcaad36",
    major: "phys",
    minor: "math",
    semester: 9,
    interests: ["hiking", "music", "coffee"],
    online: false,
    ago: 180,
    bio: { en: "Master's student. Weekends in the mountains 🥾", de: "Im Master. Wochenenden in den Bergen 🥾" },
  },
  {
    id: "s17",
    name: "Emma Richter",
    age: 20,
    photo: "1487412720507-e7ab37603c6f",
    major: "bwl",
    minor: "psy",
    semester: 1,
    interests: ["party", "travel", "padel"],
    online: true,
    status: "party",
    ago: 7,
    bio: { en: "Organising the fresher pub crawl. You're invited 🍻", de: "Ich organisiere die Ersti-Kneipentour. Du bist eingeladen 🍻" },
  },
  {
    id: "s18",
    name: "Samuel Adeyemi",
    age: 22,
    photo: "1522529599102-193c0d76b5b6",
    major: "med",
    minor: null,
    semester: 5,
    interests: ["running", "music", "books"],
    online: false,
    ago: 300,
    bio: { en: "Future surgeon, current coffee enthusiast.", de: "Zukünftiger Chirurg, aktuell Kaffee-Enthusiast." },
  },
  {
    id: "s19",
    name: "Lea Krüger",
    age: 23,
    photo: "1580489944761-15a19d654956",
    major: "bio",
    minor: null,
    semester: 5,
    interests: ["hiking", "photography", "cooking"],
    online: true,
    status: "lecture",
    ago: 14,
    bio: { en: "Field trips, plants and bad puns 🌿", de: "Exkursionen, Pflanzen und schlechte Wortwitze 🌿" },
  },
  {
    id: "s20",
    name: "Moritz Lang",
    age: 22,
    photo: "1570295999919-56ceb5ecca61",
    major: "law",
    minor: "bwl",
    semester: 3,
    interests: ["padel", "running", "coffee"],
    online: false,
    ago: 45,
    bio: { en: "Law student by day, padel player by night 🎾", de: "Tagsüber Jura, abends Padel 🎾" },
  },
  {
    id: "s21",
    name: "Yuki Tanaka",
    age: 21,
    photo: "1534751516642-a1af1ef26a56",
    major: "cs",
    minor: "design",
    semester: 3,
    interests: ["gaming", "art", "matcha"],
    online: true,
    status: "studying",
    ago: 10,
    bio: { en: "UI nerd. Pixel art and too many tabs open 🎨", de: "UI-Nerd. Pixel Art und zu viele offene Tabs 🎨" },
  },
  {
    id: "s22",
    name: "Nina Vogel",
    age: 22,
    photo: "1546961329-78bef0414d7c",
    major: "pol",
    minor: "law",
    semester: 5,
    interests: ["travel", "books", "party"],
    online: false,
    ago: 70,
    bio: { en: "Model UN, travel plans and good debates ✈️", de: "Model UN, Reisepläne und gute Debatten ✈️" },
  },
];

// Extra portraits for classmates generated for whatever Hauptfach someone picks.
const PEER_POOL = {
  f: {
    photos: [
      "1524504388940-b1c1722653e1",
      "1607746882042-944635dfe10e",
      "1541823709867-1b206113eafd",
      "1502685104226-ee32379fefbe",
      "1515023115689-589c33041d3c",
      "1520813792240-56fc4a3765a7",
      "1554151228-14d9def656e4",
      "1500917293891-ef795e70e1f6",
      "1485893086445-ed75865251e0",
      "1548142813-c348350df52b",
    ],
    names: ["Marie", "Julia", "Sara", "Lina", "Paula", "Ida", "Emily", "Nora", "Leonie", "Elif"],
  },
  m: {
    photos: [
      "1500648767791-00dcc994a43e",
      "1547425260-76bcadfb4f2c",
      "1506277886164-e25aa3f4ef7f",
      "1568602471122-7832951cc4c5",
      "1566492031773-4f4e44671857",
      "1531427186611-ecfd6d936c79",
      "1499996860823-5214fcc65f8f",
      "1503443207922-dff7d543fd0e",
    ],
    names: ["Paul", "Leon", "Finn", "Ben", "Julian", "Can", "Ole", "Malik"],
  },
};
const SURNAMES = ["Hartmann", "Koch", "Bauer", "Schäfer", "Werner", "Krause", "Lehmann", "Huber", "Kaya", "Peters", "Frank", "Yilmaz"];

const BASE_HANGOUTS = [
  {
    id: "h1",
    type: "study",
    title: { en: "Pomodoro session in the library 📚", de: "Pomodoro-Session in der Bib 📚" },
    live: 25,
    place: PLACES[1],
    max: 6,
    host: "s2",
    attendees: ["s2", "s10", "s4"],
  },
  {
    id: "h2",
    type: "mensa",
    title: { en: "Mensa: daily special & chat 🍝", de: "Mensa: Tagesgericht & quatschen 🍝" },
    at: { day: 0, h: 12, m: 30 },
    place: PLACES[0],
    max: 8,
    host: "s8",
    attendees: ["s8", "s5", "s13"],
  },
  {
    id: "h3",
    type: "coffee",
    title: { en: "Iced matcha & stats panic 🍵", de: "Iced Matcha & Statistik-Panik 🍵" },
    at: { day: 1, h: 10, m: 15 },
    place: PLACES[2],
    max: 5,
    host: "s7",
    attendees: ["s7", "s15"],
    audience: "psy",
  },
  {
    id: "h4",
    type: "sport",
    title: { en: "Padel after lectures 🎾", de: "Padel nach der Vorlesung 🎾" },
    at: { day: 0, h: 18, m: 0 },
    place: PLACES[3],
    max: 4,
    host: "s14",
    attendees: ["s14", "s8", "s20"],
  },
  {
    id: "h5",
    type: "party",
    title: { en: "Fresher pub crawl 🍻", de: "Ersti-Kneipentour 🍻" },
    at: { day: 0, h: 21, m: 0 },
    place: { en: "Meet at the Mensa square", de: "Treffpunkt: Mensa-Vorplatz" },
    max: 25,
    host: "s17",
    attendees: ["s17", "s3", "s11", "s12", "s13"],
  },
  {
    id: "h6",
    type: "coffee",
    title: { en: "Coffee with a view ☕", de: "Kaffee mit Ausblick ☕" },
    at: { day: 0, h: 15, m: 30 },
    place: { en: "Roof terrace, main building", de: "Dachterrasse Hauptgebäude" },
    max: 4,
    host: "s13",
    attendees: ["s13", "s19"],
    approval: true,
  },
  {
    id: "h7",
    type: "mensa",
    title: { en: "Med school lunch 🩺", de: "Mediziner-Lunch 🩺" },
    at: { day: 1, h: 12, m: 0 },
    place: PLACES[0],
    max: 6,
    host: "s9",
    attendees: ["s9", "s18"],
    audience: "med",
  },
];

const BASE_GROUPS = [
  {
    id: "g1",
    emoji: "🍝",
    name: { en: "Mensa Gourmets", de: "Mensa-Gourmets" },
    about: { en: "We rate today's special so you don't have to.", de: "Wir testen das Tagesgericht, damit du es nicht musst." },
    cover: VIBE.mensa,
    members: ["s8", "s2", "s5", "s17", "s13", "s20"],
    extra: 34,
  },
  {
    id: "g2",
    emoji: "🧗",
    name: { en: "Boulder Crew", de: "Boulder-Crew" },
    about: { en: "Tuesdays & Thursdays after lectures. All levels welcome.", de: "Di & Do nach der Vorlesung. Alle Level willkommen." },
    cover: VIBE.climbing,
    members: ["s1", "s10", "s19"],
    extra: 18,
  },
  {
    id: "g3",
    emoji: "🎮",
    name: { en: "Gaming Nights", de: "Gaming Nights" },
    about: { en: "Mario Kart, Smash and way too much pizza.", de: "Mario Kart, Smash und viel zu viel Pizza." },
    cover: VIBE.gaming,
    members: ["s14", "s12", "s21", "s2"],
    extra: 27,
  },
  {
    id: "g4",
    emoji: "🎾",
    name: { en: "Padel & Pizza", de: "Padel & Pizza" },
    about: { en: "Two courts booked every Wednesday. Pizza after.", de: "Mittwochs zwei Plätze gebucht. Danach Pizza." },
    cover: VIBE.tennis,
    members: ["s8", "s20", "s17", "s14"],
    extra: 12,
  },
  {
    id: "g5",
    emoji: "📈",
    name: { en: "Business Case Club", de: "BWL Case Club" },
    about: { en: "Weekly cases, consulting prep, free snacks.", de: "Wöchentliche Cases, Consulting-Prep, gratis Snacks." },
    cover: VIBE.desk,
    members: ["s8", "s17"],
    extra: 41,
    audience: "bwl",
  },
  {
    id: "g6",
    emoji: "🧠",
    name: { en: "Psychology Study Group", de: "Psychologie-Lerngruppe" },
    about: { en: "Stats I survival squad.", de: "Statistik-I-Überlebenstruppe." },
    cover: VIBE.studyGroup,
    members: ["s5", "s6", "s7", "s15"],
    extra: 22,
    audience: "psy",
  },
  {
    id: "g7",
    emoji: "🏃",
    name: { en: "Riverside Runners", de: "Laufgruppe am Fluss" },
    about: { en: "5k loops, Sunday mornings, coffee after.", de: "5-km-Runden, sonntags früh, danach Kaffee." },
    cover: VIBE.hiking,
    members: ["s9", "s18", "s16"],
    extra: 15,
  },
];

const DM_SEED = [
  [
    {
      from: "them",
      min: 52,
      text: {
        en: "Did you do the exercise sheet for Thursday yet? I'm stuck on task 3 😅",
        de: "Hast du das Übungsblatt für Donnerstag schon? Ich häng bei Aufgabe 3 fest 😅",
      },
    },
    {
      from: ME,
      min: 47,
      text: { en: "Not yet. Library after lunch? We'll do it together.", de: "Noch nicht. Nach dem Mittag in die Bib? Dann machen wir's zusammen." },
    },
    {
      from: "them",
      min: 44,
      text: { en: "Deal! But Mensa first, the special looks good today 🍝", de: "Deal! Aber erst Mensa, das Tagesgericht sieht heute gut aus 🍝" },
    },
  ],
  [{ from: "them", min: 130, text: { en: "Coming to the pub crawl tonight? 🍻", de: "Kommst du heute Abend zur Kneipentour? 🍻" } }],
];
const GROUP_SEED = [
  { from: 0, min: 180, text: { en: "Does anyone have the slides from Monday? 🙏", de: "Hat jemand die Folien von Montag? 🙏" } },
  { from: 1, min: 176, text: { en: "Uploaded them to the drive 📎", de: "Hab sie in den Drive geladen 📎" } },
  { from: 0, min: 171, text: { en: "Legend 🙌", de: "Ehrenmann 🙌" } },
];

const REPLY_RULES = [
  [/mensa|essen|lunch|hunger|food|🍝/i, { en: "Yes! 12:30 at the entrance? 🍝", de: "Ja! 12:30 am Eingang? 🍝" }],
  [/kaffee|coffee|matcha|caf[eé]|☕/i, { en: "Always ☕ Iced matcha for me", de: "Immer ☕ Für mich Iced Matcha" }],
  [
    /lern|study|bib|librar|klausur|exam|übung|📚/i,
    { en: "Please, I can't do this alone 😅 Library tomorrow?", de: "Bitte, allein schaff ich das nicht 😅 Morgen in die Bib?" },
  ],
  [/party|feiern|bier|drinks|kneipe|tonight|abend|🍻/i, { en: "I'm in 🍻 see you there!", de: "Bin dabei 🍻 bis später!" }],
  [/sport|padel|lauf|run|gym|boulder|climb/i, { en: "Count me in 💪", de: "Ich bin dabei 💪" }],
  [/^\s*(hi|hey|hallo|moin|servus|hello|yo)\b/i, { en: "Heyy 👋 how's it going?", de: "Heyy 👋 wie läuft's?" }],
  [/👋/, { en: "👋😄 Hey you!", de: "👋😄 Hey du!" }],
];
const DEFAULT_REPLIES = [
  { en: "Haha true 😂", de: "Haha stimmt 😂" },
  { en: "Sounds good! 🙌", de: "Klingt gut! 🙌" },
  { en: "Let's talk at the Mensa later 😄", de: "Lass uns später in der Mensa quatschen 😄" },
  { en: "Wait, really? 👀", de: "Warte, echt? 👀" },
];
const MATCH_HELLO = { en: "Hey! 👋 Nice that we matched. Mensa sometime?", de: "Hey! 👋 Schön, dass wir uns gefunden haben. Mal zusammen Mensa?" };
const QUICK_REPLIES = { en: ["👋", "Mensa? 🍝", "Coffee? ☕", "Study? 📚", "😂"], de: ["👋", "Mensa? 🍝", "Kaffee? ☕", "Lernen? 📚", "😂"] };

const PERSONAL_PROVIDERS = /^(gmail|googlemail|yahoo|outlook|hotmail|live|icloud|me|gmx|web|t-online|aol|proton|protonmail|mail|freenet)\./i;

const DEMO_PROFILE = {
  name: "Max Mustermann",
  email: "max.mustermann@tum.de",
  uni: UNI_BY_ID.tum,
  major: "cs",
  minor: "psy",
  semester: 3,
  interests: ["coding", "padel", "matcha", "boardgames"],
  photo: "1557862921-37829c790f19",
  bio: { en: "CS + psychology. Looking for a study crew and padel partners 🎾", de: "Informatik + Psychologie. Suche Lerncrew und Padel-Partner 🎾" },
};

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

const cx = (...classes) => classes.filter(Boolean).join(" ");
const firstName = (name) => name.split(" ")[0];
const hash = (str) => [...str].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
const MIN = 60_000;

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Unsplash ids become sized, face-cropped URLs; uploaded photos (blob:) pass through.
function photoUrl(src, w, h = w) {
  if (!src) return null;
  if (/^(blob:|data:|https?:)/.test(src)) return src;
  return `https://images.unsplash.com/photo-${src}?w=${w}&h=${h}&fit=crop&crop=faces&auto=format&q=80`;
}

const isEmojiOnly = (text) => /^[\p{Extended_Pictographic}\p{Emoji_Modifier}️‍\s]{1,12}$/u.test(text) && /\p{Extended_Pictographic}/u.test(text);

/* i18n */

const I18nContext = createContext(null);
const useI18n = () => useContext(I18nContext);

function initialLang() {
  try {
    const saved = localStorage.getItem("connectuni.lang");
    if (saved === "de" || saved === "en") return saved;
  } catch {
    // Storage can be unavailable (private mode, sandboxed frames).
  }
  return typeof navigator !== "undefined" && navigator.language?.toLowerCase().startsWith("de") ? "de" : "en";
}

function makeI18n(lang, setLang) {
  const dict = STRINGS[lang];
  const tx = (value) => (value && typeof value === "object" && !Array.isArray(value) ? (value[lang] ?? value.en) : value);
  const t = (key, vars = {}) => {
    const text = (vars.n === 1 && dict[`${key}_one`]) || dict[key] || STRINGS.en[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, name) => (vars[name] == null ? "" : String(tx(vars[name]))));
  };
  const subject = (id) => (id ? tx(majorInfo(id)) : "");
  return { lang, setLang, t, tx, subject };
}

/* Sign-up */

const fold = (text) =>
  text
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
const spellUmlauts = (text) => text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
const UNI_INDEX = UNIVERSITIES.map((u) => {
  const text = `${u.name} ${u.full} ${u.short} ${u.city} ${u.domains.join(" ")}`;
  return [u, `${fold(text)} ${spellUmlauts(text)}`];
});

// Best matches first: exact short label, then name or city prefix, then the bigger institutions.
function searchUnis(query) {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const rank = (u) => (fold(u.short) === terms[0] ? 0 : fold(u.name).startsWith(terms[0]) ? 1 : fold(u.city).startsWith(terms[0]) ? 2 : 3);
  return UNI_INDEX.filter(([, text]) => terms.every((term) => text.includes(term)))
    .map(([u]) => u)
    .sort((a, b) => rank(a) - rank(b) || b.students - a.students);
}

const localPartError = (local) => (/^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/i.test(local) ? null : "errLocal");

function checkAcademicEmail(email) {
  const match = /^[^\s@]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i.exec(email.trim());
  if (!match) return { error: "errFormat" };
  const domain = match[1].toLowerCase();
  if (PERSONAL_PROVIDERS.test(domain)) return { error: "errPersonal", provider: domain };
  const academic =
    /\.(edu|ac\.[a-z]{2})$/.test(domain) ||
    /(^|\.)(uni|tu|th|fh|hs|ph|htw)-[a-z0-9-]+\.(de|at|ch)$/.test(domain) ||
    /(^|\.)uni[a-z]*\.(de|at|ch|it)$/.test(domain) ||
    UNIVERSITIES.some((u) => u.domains.some((d) => domain === d || domain.endsWith(`.${d}`)));
  return academic ? { ok: true } : { error: "errDomain" };
}

// Test accounts for the App Store review (supabase/review-accounts.sql) log in with a password, not a code.
const isReviewAddress = (email) => /@connect-uni\.de$/i.test(email.trim());
// Accounts removed with ban_user (supabase/migrations/20261027130000_moderation.sql) can't sign in again.
const isBanned = (error) => error?.code === "user_banned" || /banned/i.test(error?.message ?? "");

const nameFromEmail = (local) =>
  local
    .replace(/\d+/g, "")
    .split(/[._+-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ") || "Student";

/* Time */

function startOf(now, { day, h, m }) {
  const d = new Date(now);
  d.setDate(d.getDate() + day);
  d.setHours(h, m, 0, 0);
  // A "today" slot that has already ended moves to tomorrow so the feed never looks stale.
  if (day === 0 && d.getTime() + DEFAULT_HANGOUT_MINUTES * MIN < now) d.setDate(d.getDate() + 1);
  return d.getTime();
}
const durationOf = (h) => Math.min(MAX_HANGOUT_MINUTES, Math.max(DEFAULT_HANGOUT_MINUTES, Number(h.duration ?? h.duration_minutes ?? DEFAULT_HANGOUT_MINUTES)));
const isLive = (h, now) => h.start <= now && now < h.start + durationOf(h) * MIN;
const isOver = (h, now) => now >= h.start + durationOf(h) * MIN;
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const locale = (lang) => (lang === "de" ? "de-DE" : "en-GB");
const fmtTime = (ts, lang) => new Intl.DateTimeFormat(locale(lang), { hour: "2-digit", minute: "2-digit" }).format(ts);
const fmtDate = (ts, lang) => {
  const date = new Date(ts);
  const options = { day: "numeric", month: "short" };
  if (date.getFullYear() !== new Date().getFullYear()) options.year = "numeric";
  return new Intl.DateTimeFormat(locale(lang), options).format(date);
};
const fmtDuration = (minutes, t) => {
  if (minutes === 30) return t("duration30");
  if (minutes === 60) return t("duration1h");
  const hours = minutes / 60;
  return hours % 1 ? t("durationHoursHalf", { n: Math.floor(hours) }) : t("durationHours", { n: hours });
};

function fmtWhen(ts, now, t, lang) {
  return t("dayAt", { day: fmtDate(ts, lang), time: fmtTime(ts, lang) });
}

function fmtAgo(ts, now, t) {
  const m = Math.max(0, Math.round((now - ts) / MIN));
  if (m < 1) return t("justNow");
  if (m < 60) return t("minAgo", { n: m });
  const h = Math.round(m / 60);
  return h < 24 ? t("hAgo", { n: h }) : t("dAgo", { n: Math.round(h / 24) });
}

/* Matching */

const canAccess = (item, me) => !item.audience || item.audience === me.major || item.audience === me.minor;

function matchInfo(s, me) {
  const shared = s.interests.filter((i) => me.interests.includes(i));
  const sameMajor = s.major === me.major;
  const minorLink = (!!me.minor && (s.major === me.minor || s.minor === me.minor)) || (!!s.minor && s.minor === me.major);
  const reasons = [];
  let score = 55;
  if (sameMajor) {
    score += 24;
    reasons.push(["reasonSameMajor", { subject: me.major }]);
  } else if (me.minor && s.major === me.minor) {
    score += 14;
    reasons.push(["reasonTheirMajor", { subject: s.major }]);
  }
  if (me.minor && s.minor === me.minor) {
    score += 8;
    reasons.push(["reasonAlso", { subject: me.minor }]);
  } else if (s.minor && s.minor === me.major && !sameMajor) {
    score += 8;
    reasons.push(["reasonAlso", { subject: me.major }]);
  }
  if (shared.length) {
    score += Math.min(shared.length, 3) * 5;
    reasons.push(["reasonInterests", { n: shared.length }]);
  }
  if (s.semester === me.semester) {
    score += 4;
    reasons.push(["reasonSemester", {}]);
  }
  score = Math.min(99, score + (Math.abs(hash(s.id + me.major)) % 4));
  // Subjects you have in common, for the "96% Match · Informatik & Psychologie" line.
  const subjects = [
    ...new Set(
      [sameMajor && me.major, minorLink && (me.minor && (s.major === me.minor || s.minor === me.minor) ? me.minor : me.major)].filter(Boolean),
    ),
  ];
  return { score, shared, sameMajor, minorLink, reasons, subjects };
}

function pickReply(text) {
  for (const [pattern, reply] of REPLY_RULES) if (pattern.test(text)) return reply;
  return DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
}

/* World: everyone at your uni, with enough classmates for whatever you study */

function gallery(s) {
  return [s.photo, ...new Set(s.interests.map((i) => INTEREST_BY_ID[i].photo))].slice(0, 3);
}

function buildWorld(profile, now) {
  const rng = mulberry32(hash(`${profile.major}|${profile.minor}|${profile.uni.id}`));
  const students = STUDENTS.map((s) => ({ ...s, lastActive: now - s.ago * MIN }));
  const used = new Set([...students.map((s) => s.photo), profile.photo]);
  const pools = { f: PEER_POOL.f.photos.filter((p) => !used.has(p)), m: PEER_POOL.m.photos.filter((p) => !used.has(p)) };
  const takenNames = new Set(students.map((s) => firstName(s.name)));
  let n = 0;

  const addPeers = (major, count) => {
    for (let i = 0; i < count; i++, n++) {
      const g = pools[n % 2 ? "m" : "f"].length ? (n % 2 ? "m" : "f") : n % 2 ? "f" : "m";
      const photo = pools[g].shift();
      if (!photo) return;
      const first = PEER_POOL[g].names.find((name) => !takenNames.has(name)) ?? PEER_POOL[g].names[n % PEER_POOL[g].names.length];
      takenNames.add(first);
      const own = profile.interests.filter(() => rng() < 0.5).slice(0, 2);
      const rest = INTERESTS.map((x) => x.id).filter((id) => !own.includes(id));
      while (own.length < 3) own.push(rest.splice(Math.floor(rng() * rest.length), 1)[0]);
      const online = n === 0 || rng() < 0.65;
      const M = majorInfo(major);
      const ago = online ? 1 + Math.floor(rng() * 15) : 30 + Math.floor(rng() * 200);
      students.push({
        id: `p${n + 1}`,
        name: `${first} ${SURNAMES[Math.floor(rng() * SURNAMES.length)]}`,
        age: 19 + Math.floor(rng() * 5),
        photo,
        major,
        minor: null,
        semester: n === 0 ? 1 : 1 + 2 * Math.floor(rng() * 3),
        interests: own,
        online,
        status: online ? (n === 0 ? "new" : STATUSES[Math.floor(rng() * 6)].id) : null,
        ago,
        lastActive: now - ago * MIN,
        bio: {
          en: `${M.en} student. Always up for Mensa and study sessions 🙌`,
          de: `Studiere ${M.de}. Immer zu haben für Mensa und Lernsessions 🙌`,
        },
      });
    }
  };
  const count = (major) => students.filter((s) => s.major === major).length;
  if (count(profile.major) < 5) addPeers(profile.major, 5 - count(profile.major));
  if (profile.minor && count(profile.minor) < 2) addPeers(profile.minor, 2 - count(profile.minor));
  for (const s of students) s.gallery = gallery(s);

  const classmates = students.filter((s) => s.major === profile.major);
  const incoming = classmates.find((s) => s.status === "new") ?? classmates.at(-1);
  const others = classmates.filter((s) => s !== incoming);
  const minorFriend = profile.minor && students.find((s) => s.major !== profile.major && (s.major === profile.minor || s.minor === profile.minor));
  const friends = [...others.slice(0, 2), minorFriend].filter(Boolean).map((s) => s.id);
  const rels = Object.fromEntries(friends.map((id) => [id, "connected"]));
  if (incoming) rels[incoming.id] = "incoming";

  const M = majorInfo(profile.major);
  const hangouts = BASE_HANGOUTS.map((h) => ({ ...h, start: h.live ? now - h.live * MIN : startOf(now, h.at), duration: DEFAULT_HANGOUT_MINUTES, pending: [] }));
  hangouts.push({
    id: "h-fach",
    type: "study",
    title: { en: `${M.en} study meetup 📚`, de: `${M.de}-Lerntreff 📚` },
    start: startOf(now, { day: 1, h: 14, m: 0 }),
    duration: DEFAULT_HANGOUT_MINUTES,
    place: PLACES[1],
    max: 6,
    host: others[0].id,
    attendees: others.slice(0, 2).map((s) => s.id),
    audience: profile.major,
    pending: [],
  });
  hangouts.sort((a, b) => a.start - b.start);

  const fach = {
    id: "g-fach",
    emoji: "🐣",
    name: { en: `${M.en} Freshers`, de: `${M.de}-Erstis` },
    about: { en: "Questions, notes, Mensa: everything for your first semesters.", de: "Fragen, Mitschriften, Mensa: alles für die ersten Semester." },
    cover: VIBE.laptops,
    members: [ME, ...classmates.slice(0, 4).map((s) => s.id)],
    extra: 58,
    audience: profile.major,
  };
  const groups = [fach, ...BASE_GROUPS.map((g) => ({ ...g, members: [...g.members] }))];

  const threads = {};
  const seedDm = (id, seed) => {
    threads[`dm-${id}`] = {
      id: `dm-${id}`,
      kind: "dm",
      with: id,
      unread: 1,
      messages: seed.map((m, i) => ({ id: `${id}-seed-${i}`, from: m.from === ME ? ME : id, text: m.text, ts: now - m.min * MIN })),
    };
  };
  if (friends[0]) seedDm(friends[0], DM_SEED[0]);
  if (friends.at(-1) && friends.length > 1) seedDm(friends.at(-1), DM_SEED[1]);
  const fachPeers = fach.members.filter((id) => id !== ME);
  threads["grp-g-fach"] = {
    id: "grp-g-fach",
    kind: "group",
    group: "g-fach",
    unread: 0,
    messages: GROUP_SEED.map((m, i) => ({ id: `g-seed-${i}`, from: fachPeers[m.from] ?? fachPeers[0], text: m.text, ts: now - m.min * MIN })),
  };

  const notifications = [{ id: "n-welcome", kind: "welcome", ts: now, read: false }];
  if (incoming) notifications.unshift({ id: "n-wave", kind: "wave", person: incoming.id, ts: now - 12 * MIN, read: false });
  return { students, rels, hangouts, groups, threads, notifications };
}

/* ────────────────────────────────────────────────────────────────────────────
 * Style
 * ──────────────────────────────────────────────────────────────────────────── */

const GLOBAL_CSS = `
.uc-root { font-family: "Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; color-scheme: light; -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent;
  --uc-grad: linear-gradient(120deg, #ff7a59 0%, #ff3d7f 48%, #8b3dff 100%); }
.uc-root button:not(:disabled), .uc-root label[for] { cursor: pointer; }
.uc-grad { background-image: var(--uc-grad); }
.uc-grad-text { background-image: var(--uc-grad); -webkit-background-clip: text; background-clip: text; color: transparent; }
.uc-ring { background-image: var(--uc-grad); }
.uc-glow { animation: uc-glow 2.6s ease-in-out infinite; }
.uc-glass { background: rgba(250,250,250,.78); -webkit-backdrop-filter: blur(20px) saturate(1.8); backdrop-filter: blur(20px) saturate(1.8); }
.uc-glass-light { background: rgba(255,255,255,.22); -webkit-backdrop-filter: blur(14px) saturate(1.6); backdrop-filter: blur(14px) saturate(1.6); border: 1px solid rgba(255,255,255,.28); }
.uc-glass-dark { background: rgba(15,15,20,.34); -webkit-backdrop-filter: blur(12px) saturate(1.4); backdrop-filter: blur(12px) saturate(1.4); border: 1px solid rgba(255,255,255,.16); }
.uc-scrim { background: linear-gradient(to top, rgba(0,0,0,.82) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,0) 72%); }
.uc-scrim-top { background: linear-gradient(to bottom, rgba(0,0,0,.55), rgba(0,0,0,0)); }
.uc-noscroll { scrollbar-width: none; } .uc-noscroll::-webkit-scrollbar { display: none; }
.uc-shimmer { background: linear-gradient(110deg, #ececf1 30%, #f6f6f9 50%, #ececf1 70%); background-size: 200% 100%; animation: uc-shimmer 1.4s linear infinite; }
.uc-tnum { font-variant-numeric: tabular-nums; }
@keyframes uc-rise { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }
@keyframes uc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes uc-pop { 0% { transform: scale(1); } 35% { transform: scale(1.16); } 65% { transform: scale(.94); } 100% { transform: scale(1); } }
@keyframes uc-sheet { from { transform: translateY(100%); } to { transform: none; } }
@keyframes uc-drawer { from { transform: translateX(100%); } to { transform: none; } }
@keyframes uc-float { 0% { transform: translate(-50%, -50%) scale(.4); opacity: 0; } 15% { opacity: 1; }
  100% { transform: translate(calc(-50% + var(--dx)), calc(-50% - var(--dy))) rotate(var(--rot)) scale(1.2); opacity: 0; } }
@keyframes uc-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,61,127,0); } 50% { box-shadow: 0 0 16px 1px rgba(255,61,127,.45); } }
@keyframes uc-shimmer { to { background-position: -200% 0; } }
@keyframes uc-shake { 20%, 60% { transform: translateX(-7px); } 40%, 80% { transform: translateX(7px); } }
@keyframes uc-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes uc-draw { to { stroke-dashoffset: 0; } }
@keyframes uc-toast { from { opacity: 0; transform: translateY(-14px) scale(.95); } to { opacity: 1; transform: none; } }
@keyframes uc-bounce { 0% { transform: scale(.3); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
@keyframes uc-dot { 0%, 80%, 100% { opacity: .3; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
.uc-rise { animation: uc-rise .55s cubic-bezier(.22,1,.36,1) both; }
.uc-fade { animation: uc-fade .35s ease-out both; }
.uc-pop { animation: uc-pop .5s cubic-bezier(.34,1.56,.64,1); }
.uc-sheet { animation: uc-sheet .45s cubic-bezier(.22,1,.36,1) both; }
@media (min-width: 640px) { .uc-sheet { animation-name: uc-rise; } }
.uc-drawer { animation: uc-drawer .42s cubic-bezier(.22,1,.36,1) both; }
.uc-particle { position: fixed; pointer-events: none; animation: uc-float 1.3s cubic-bezier(.22,1,.36,1) forwards; }
.uc-shake { animation: uc-shake .4s; }
.uc-toast { animation: uc-toast .45s cubic-bezier(.22,1,.36,1) both; }
.uc-bounce { animation: uc-bounce .6s cubic-bezier(.34,1.56,.64,1) both; }
.uc-check path { stroke-dasharray: 24; stroke-dashoffset: 24; animation: uc-draw .45s .15s ease-out forwards; }
.uc-progress { transform-origin: left; animation: uc-progress linear forwards; }
.uc-dot { animation: uc-dot 1.2s infinite; }
@media (prefers-reduced-motion: reduce) {
  .uc-root *:not(.uc-progress), .uc-root *::before, .uc-root *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
}
`;

function GlobalStyles() {
  return <style>{GLOBAL_CSS}</style>;
}

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-[#ff3d7f]/60 focus-visible:ring-offset-2";
const BTN = `inline-flex items-center justify-center gap-1.5 rounded-full font-semibold whitespace-nowrap transition duration-200 active:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 ${FOCUS}`;
const btn = {
  grad: `${BTN} uc-grad text-white shadow-[0_8px_22px_-8px_rgba(255,61,127,0.6)] hover:brightness-110`,
  dark: `${BTN} bg-zinc-900 text-white hover:bg-zinc-800`,
  soft: `${BTN} bg-white text-zinc-900 shadow-sm ring-1 ring-black/[0.07] hover:bg-zinc-50`,
  ghost: `${BTN} text-zinc-600 hover:bg-black/[0.04] hover:text-zinc-900`,
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};
const PILL = `inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap transition duration-200 active:scale-[0.96] ${FOCUS}`;
const PILL_ON = "uc-grad text-white shadow-[0_6px_18px_-8px_rgba(255,61,127,0.65)]";
const PILL_OFF = "bg-white text-zinc-700 ring-1 ring-black/[0.07] hover:ring-black/20";
const CARD = "rounded-3xl bg-white ring-1 ring-black/[0.05] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_-14px_rgba(0,0,0,0.14)]";
const INPUT =
  "w-full rounded-2xl bg-white px-4 py-3 text-base text-zinc-900 ring-1 ring-black/[0.08] outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-[#ff3d7f]/50";
const LABEL = "mb-2 block text-[13px] font-semibold text-zinc-500";
const MUTED = "text-zinc-500";

/* ────────────────────────────────────────────────────────────────────────────
 * Primitives
 * ──────────────────────────────────────────────────────────────────────────── */

const AppContext = createContext(null);
const useApp = () => useContext(AppContext);

function Photo({ src, w, h = w, alt = "", className, zoom = false }) {
  const url = photoUrl(src, w, h);
  const [loaded, setLoaded] = useState(null);
  const [failed, setFailed] = useState(null);
  const ok = url && failed !== url;
  return (
    <span className={cx("relative block overflow-hidden bg-zinc-100", className)}>
      {ok && loaded !== url && <span className="uc-shimmer absolute inset-0" />}
      {ok ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(url)}
          onError={() => setFailed(url)}
          className={cx(
            "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out",
            loaded === url ? "opacity-100" : "opacity-0",
            zoom && "group-hover:scale-[1.04]",
          )}
        />
      ) : (
        <span className="uc-grad absolute inset-0 grid place-items-center opacity-80">
          <UserRound className="size-1/2 text-white/80" aria-hidden="true" />
        </span>
      )}
    </span>
  );
}

const AVATAR_SIZES = { xs: "size-6", sm: "size-8", md: "size-11", lg: "size-14", xl: "size-[72px]", "2xl": "size-28" };
const AVATAR_PX = { xs: 48, sm: 64, md: 96, lg: 120, xl: 160, "2xl": 240 };

function Avatar({ person, size = "md", ring = false, seen = false, glow = false, online = false, className }) {
  const image = person?.photo ? (
    <Photo src={person.photo} w={AVATAR_PX[size]} alt={person.name} className="h-full w-full rounded-full" />
  ) : (
    <span className="uc-grad grid h-full w-full place-items-center rounded-full text-white">
      <Camera className="size-[42%]" aria-hidden="true" />
    </span>
  );
  return (
    <span className={cx("relative inline-block shrink-0 rounded-full", AVATAR_SIZES[size], className)}>
      {ring ? (
        <span className={cx("block h-full w-full rounded-full p-[2.5px]", seen ? "bg-zinc-200" : "uc-ring", glow && !seen && "uc-glow")}>
          <span className="block h-full w-full rounded-full bg-white p-[2px]">{image}</span>
        </span>
      ) : (
        image
      )}
      {online && (
        <span
          className={cx(
            "absolute bottom-0 right-0 rounded-full bg-emerald-400 ring-2 ring-white",
            size === "xs" || size === "sm" ? "size-2" : "size-3",
          )}
        />
      )}
    </span>
  );
}

function FacePile({ ids, max = 4, size = "sm", extra = 0 }) {
  const app = useApp();
  const shown = ids.slice(0, max);
  const more = ids.length - shown.length + extra;
  return (
    <span className="flex items-center">
      <span className="flex -space-x-2">
        {shown.map((id) => (
          <Avatar key={id} person={app.person(id)} size={size} className="ring-2 ring-white" />
        ))}
      </span>
      {more > 0 && <span className="ml-1.5 text-xs font-bold text-zinc-500">+{more}</span>}
    </span>
  );
}

function LogoMark({ className = "size-8" }) {
  return (
    <span className={cx("uc-grad grid shrink-0 place-items-center rounded-[30%] shadow-[0_6px_16px_-6px_rgba(255,61,127,0.7)]", className)}>
      <svg viewBox="0 0 32 32" className="size-[78%]" aria-hidden="true">
        <circle cx="10.5" cy="9.5" r="3.1" fill="#fff" />
        <circle cx="21.5" cy="9.5" r="3.1" fill="#fff" fillOpacity=".75" />
        <path d="M8.2 15v1.6a7.8 7.8 0 0 0 15.6 0V15" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className={cx("text-[19px] font-extrabold tracking-[-0.03em]", compact && "hidden sm:inline")}>ConnectUni</span>
    </span>
  );
}

function LangToggle({ className }) {
  const { lang, setLang, t } = useI18n();
  return (
    <span
      role="group"
      aria-label={t("language")}
      className={cx("inline-flex shrink-0 rounded-full bg-black/[0.05] p-0.5 text-[12px] font-bold", className)}
    >
      {["de", "en"].map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cx(
            "rounded-full px-2.5 py-1 uppercase transition",
            lang === l ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-700",
            FOCUS,
          )}
        >
          {l}
        </button>
      ))}
    </span>
  );
}

// iOS app only: whether this phone gets push notifications, with the reason when it doesn't.
function PushRow() {
  const { t } = useI18n();
  const [info, setInfo] = useState(pushState);
  useEffect(() => {
    const id = setInterval(() => setInfo(pushState()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!Capacitor.isNativePlatform()) return null;
  const ready = info.permission === "granted";
  const denied = info.permission === "denied";
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-3">
        <p className={cx(LABEL, "mb-0")}>{t("pushTitle")}</p>
        {ready || denied ? (
          <span className={cx("text-[13px] font-bold", ready && info.saved ? "text-emerald-600" : "text-zinc-500")}>
            {ready ? (info.saved ? t("pushOn") : t("pushWait")) : t("pushDenied").split(".")[0]}
          </span>
        ) : (
          <button type="button" onClick={() => enablePush().then(() => setInfo(pushState()))} className={cx(btn.soft, btn.sm)}>
            {t("pushAsk")}
          </button>
        )}
      </div>
      {denied && <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{t("pushDenied")}</p>}
      {info.error && <p className="mt-1.5 break-words text-xs leading-relaxed text-rose-600">{info.error}</p>}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useI18n();
  const [theme, setChoice] = useState(getTheme);
  return (
    <span role="group" aria-label={t("theme")} className="inline-flex shrink-0 rounded-full bg-black/[0.05] p-0.5 text-[12px] font-bold">
      {[
        ["system", "themeSystem"],
        ["light", "themeLight"],
        ["dark", "themeDark"],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            setTheme(id);
            setChoice(id);
          }}
          aria-pressed={theme === id}
          className={cx(
            "rounded-full px-2.5 py-1 transition",
            theme === id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 hover:text-zinc-700",
            FOCUS,
          )}
        >
          {t(label)}
        </button>
      ))}
    </span>
  );
}

function IconButton({ label, onClick, children, className, dark = false, disabled = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "grid size-10 shrink-0 place-items-center rounded-full transition active:scale-95 disabled:opacity-30",
        dark ? "uc-glass-dark text-white hover:bg-black/50" : "text-zinc-600 hover:bg-black/[0.05] hover:text-zinc-900",
        FOCUS,
        className,
      )}
    >
      {children}
    </button>
  );
}

function Sheet({ onClose, title, children, footer, wide = false, z = "z-50", bare = false }) {
  const { t } = useI18n();
  const panel = useRef(null);
  const scroller = useRef(null);
  const backdrop = useRef(null);
  useSwipeDown(panel, scroller, backdrop, onClose);
  useCardStack();
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={cx("uc-kb-lift fixed inset-0 flex items-end justify-center sm:items-center sm:p-6", z)}
    >
      <div ref={backdrop} className="uc-fade absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        ref={panel}
        className={cx(
          "uc-sheet relative flex w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]",
          wide ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
        style={{ maxHeight: "calc(94dvh - var(--uc-kb))" }}
      >
        {/* Grabber: shows that the sheet can be pulled down (phones only). */}
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none absolute left-1/2 top-2 z-10 h-[5px] w-9 -translate-x-1/2 rounded-full sm:hidden",
            bare ? "bg-white/70" : "bg-zinc-300",
          )}
        />
        {!bare && (
          <header className="flex items-center justify-between gap-3 px-5 pb-1 pt-4">
            <h2 className="min-w-0 truncate text-lg font-extrabold tracking-tight">{title}</h2>
            <IconButton label={t("close")} onClick={onClose} className="-mr-2">
              <X className="size-5" />
            </IconButton>
          </header>
        )}
        <div
          ref={scroller}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
          style={footer ? undefined : { paddingBottom: "max(0px, calc(env(safe-area-inset-bottom, 0px) - var(--uc-kb)))" }}
        >
          {children}
        </div>
        {footer && (
          <footer
            className="border-t border-black/[0.05] bg-white px-5 pt-3"
            style={{ paddingBottom: "max(0.875rem, calc(env(safe-area-inset-bottom, 0px) - var(--uc-kb)))" }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

function Toasts({ toasts, onDismiss }) {
  const app = useApp();
  const { t } = useI18n();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(0.75rem_+_env(safe-area-inset-top,0px))] z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:left-auto lg:right-6 lg:top-auto lg:items-end lg:px-0"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="uc-toast pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-[22px] bg-white/95 p-2.5 pr-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.05] backdrop-blur-xl"
        >
          {toast.people?.length ? (
            <span className="flex shrink-0 -space-x-3">
              {toast.people.map((id) => (
                <Avatar key={id} person={app.person(id)} size="md" className="ring-2 ring-white" />
              ))}
            </span>
          ) : (
            <span className="uc-grad grid size-11 shrink-0 place-items-center rounded-full text-xl">{toast.emoji ?? "✨"}</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug">{toast.title}</p>
            {toast.body && <p className="mt-0.5 truncate text-[13px] text-zinc-500">{toast.body}</p>}
          </div>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action.run();
                onDismiss(toast.id);
              }}
              className={cx(btn.grad, "h-8 shrink-0 px-3 text-[12px]")}
            >
              {toast.action.label}
            </button>
          )}
          <IconButton label={t("close")} onClick={() => onDismiss(toast.id)} className="size-8">
            <X className="size-4" />
          </IconButton>
        </div>
      ))}
    </div>
  );
}

function Bursts({ bursts }) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      {bursts.map((p) => (
        <span
          key={p.id}
          className="uc-particle text-2xl"
          style={{ left: p.x, top: p.y, "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, "--rot": `${p.rot}deg`, animationDelay: `${p.delay}ms` }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function CheckBadge({ className = "size-6" }) {
  return (
    <span
      className={cx(
        "uc-bounce grid shrink-0 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.6)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="uc-check size-[62%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

function Tag({ id, highlight = false }) {
  const { tx } = useI18n();
  const interest = INTEREST_BY_ID[id];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
        highlight ? "bg-[#fff0f4] text-[#d61f5f] ring-1 ring-[#ff3d7f]/25" : "bg-zinc-100 text-zinc-600",
      )}
    >
      {interest.emoji} {tx(interest)}
    </span>
  );
}

function Stepper({ value, min, max, onChange, label, render }) {
  const { t } = useI18n();
  const step = "grid size-9 place-items-center rounded-full transition hover:bg-zinc-100 disabled:opacity-30";
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-black/[0.07]" role="group" aria-label={label}>
      <button type="button" aria-label={t("less")} disabled={value <= min} onClick={() => onChange(value - 1)} className={cx(step, FOCUS)}>
        <Minus className="size-4" />
      </button>
      <span className="uc-tnum min-w-[5.5rem] text-center text-sm font-bold" aria-live="polite">
        {render ? render(value) : value}
      </span>
      <button type="button" aria-label={t("more")} disabled={value >= max} onClick={() => onChange(value + 1)} className={cx(step, FOCUS)}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function AudienceToggle({ value, onChange, subject }) {
  const { t } = useI18n();
  const options = [
    ["major", "🔒", t("onlyMajor"), t("onlyMajorSub", { subject })],
    ["all", "🌍", t("wholeUni"), t("wholeUniSub")],
  ];
  return (
    <div role="radiogroup" aria-label={t("whoCanJoin")} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.map(([id, emoji, title, sub]) => {
        const on = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(id)}
            className={cx(
              "flex items-center gap-3 rounded-2xl p-3 text-left transition duration-200",
              on ? "bg-zinc-900 text-white shadow-lg" : "bg-zinc-50 ring-1 ring-black/[0.06] hover:bg-zinc-100",
              FOCUS,
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {emoji}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">{title}</span>
              <span className={cx("block text-xs", on ? "text-white/70" : MUTED)}>{sub}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({ emoji, title, body, action }) {
  return (
    <div className="grid place-items-center rounded-3xl border-2 border-dashed border-black/[0.07] px-6 py-12 text-center">
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      {title && <p className="mt-3 text-[15px] font-bold">{title}</p>}
      {body && <p className={cx("mt-1 max-w-xs text-sm", MUTED)}>{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

function PageTitle({ title, lead, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em]">{title}</h1>
        {lead && <p className={cx("mt-1 text-[15px]", MUTED)}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Sign-up: one canvas, each step appears once the previous one is answered
 * ──────────────────────────────────────────────────────────────────────────── */

const EMPTY_CODE = ["", "", "", "", "", ""];

function Onboarding({ onDone, notice, backend }) {
  const { t, tx } = useI18n();
  const live = !!backend;
  const [mode, setMode] = useState("signup"); // signup | login (live only)
  const [uniId, setUniId] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [query, setQuery] = useState("");
  const [customUni, setCustomUni] = useState("");
  const [major, setMajor] = useState(null);
  const [minor, setMinor] = useState(null);
  const [semester, setSemester] = useState(1);
  const [birthYear, setBirthYear] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [local, setLocal] = useState("");
  const [domain, setDomain] = useState(null);
  const [fullEmail, setFullEmail] = useState("");
  const [phase, setPhase] = useState("email"); // email | sending | code | checking | done
  const [sentTo, setSentTo] = useState("");
  const [sendError, setSendError] = useState(null);
  const [digits, setDigits] = useState(EMPTY_CODE);
  const [codeError, setCodeError] = useState(null);
  const [shake, setShake] = useState(0);
  const [legalDoc, setLegalDoc] = useState(null);
  const [password, setPassword] = useState("");

  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const login = live && mode === "login";
  const reviewLogin = login && isReviewAddress(fullEmail);
  const custom = uniId === "custom";
  const uni = login
    ? null
    : custom
      ? customUni.trim().length >= 3
        ? { id: "custom", name: customUni.trim(), short: customUni.trim(), city: "" }
        : null
      : (UNI_BY_ID[uniId] ?? null);
  const ownDomain = (d) => !!uni && !custom && uni.domains.some((base) => d === base || d.endsWith(`.${base}`));
  const dom = uni && !custom ? (domain && ownDomain(domain) ? domain : uni.domains[0]) : null;
  const fullAddress = login || custom;

  let check = { error: "empty" };
  if (fullAddress) check = fullEmail.trim() ? (reviewLogin ? { ok: true } : checkAcademicEmail(fullEmail)) : check;
  else if (uni && local.includes("@")) check = { error: "errDomainEnd" };
  else if (uni && local) check = localPartError(local) ? { error: localPartError(local) } : { ok: true };
  const address = fullAddress ? fullEmail.trim().toLowerCase() : `${local.toLowerCase()}@${dom}`;
  const codeStep = ["code", "checking", "done"].includes(phase);
  const needsYear = !login && !birthYear;

  const steps = login ? 1 + (codeStep ? 1 : 0) : 1 + (uni ? 1 : 0) + (uni && major ? 1 : 0) + (codeStep ? 1 : 0);
  const stepRefs = useRef([]);
  const shownSteps = useRef(steps);
  useEffect(() => {
    if (steps > shownSteps.current) later(() => stepRefs.current[steps - 1]?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    shownSteps.current = steps;
  }, [steps]);

  const resetCode = () => {
    if (phase !== "email") setPhase("email");
    setDigits(EMPTY_CODE);
    setCodeError(null);
    setSendError(null);
    setPassword("");
  };
  const pickUni = (id) => {
    setUniId(id);
    setDomain(null);
    resetCode();
  };
  const pickMajor = (id) => {
    setMajor(id);
    if (minor === id) setMinor(null);
  };
  const onLocal = (value) => {
    resetCode();
    const at = value.indexOf("@");
    const typed = value
      .slice(at + 1)
      .trim()
      .toLowerCase();
    // A full address with the uni's domain (or a student subdomain like stud.…) fills both parts.
    if (at >= 0 && ownDomain(typed)) {
      setDomain(typed);
      setLocal(value.slice(0, at).trim());
    } else setLocal(value.trim());
  };
  const sendCode = async () => {
    setPhase("sending");
    setSendError(null);
    try {
      if (live) await backend.sendCode(address);
      else await new Promise((resolve) => later(resolve, 900));
      setSentTo(address);
      setPhase("code");
    } catch (error) {
      setPhase("email");
      setSendError(isBanned(error) ? "accountBanned" : "errCodeSend");
    }
  };
  const askPassword = () => {
    setSentTo(address);
    setPhase("code");
  };

  const fail = (key) => {
    setCodeError(key);
    setPhase("code");
    setShake((s) => s + 1);
    later(() => {
      setDigits(EMPTY_CODE);
      document.getElementById("uc-otp-0")?.focus();
    }, 520);
  };
  const finish = (profile) => {
    setPhase("done");
    later(() => onDone(profile), 1100);
  };
  // Unlisted universities: if the address belongs to a listed one after all, use that one.
  const newProfileRow = (id) => {
    const emailDomain = sentTo.split("@")[1];
    const listed = custom ? UNIVERSITIES.find((u) => u.domains.some((d) => emailDomain === d || emailDomain.endsWith(`.${d}`))) : uni;
    const source = listed ?? uni;
    return {
      id,
      name: nameFromEmail(sentTo.split("@")[0]),
      birth_year: Number(birthYear),
      uni_id: listed ? listed.id : `d:${emailDomain}`,
      uni_name: source.name.slice(0, 120),
      uni_short: source.short.slice(0, 60),
      major,
      minor,
      semester,
      interests: DEFAULT_INTERESTS[major] ?? ["coffee", "music", "travel"],
    };
  };
  // Signed in: open the profile, or create it at the end of sign-up.
  const enter = async (session) => {
    try {
      let row = await backend.profile(session.user.id);
      if (!row && login) {
        await backend.signOut();
        return fail("noProfileYet");
      }
      if (!row) row = await backend.createProfile(newProfileRow(session.user.id));
      finish(profileFromRow(row, session.user.email));
    } catch {
      await backend.signOut();
      fail("errUniMismatch");
    }
  };
  const verify = async (code) => {
    if (!live) {
      if (code !== DEMO_CODE) return fail("codeWrong");
      return finish({
        name: nameFromEmail(sentTo.split("@")[0]),
        email: sentTo,
        birthYear: Number(birthYear),
        uni: { id: uni.id, name: uni.name, short: uni.short, city: uni.city },
        major,
        minor,
        semester,
        interests: DEFAULT_INTERESTS[major] ?? ["coffee", "music", "travel"],
        photo: null,
        bio: null,
      });
    }
    setPhase("checking");
    let session;
    try {
      session = await backend.verifyCode(sentTo, code);
    } catch (error) {
      return fail(isBanned(error) ? "accountBanned" : "codeWrong");
    }
    enter(session);
  };
  const passwordLogin = async (event) => {
    event.preventDefault();
    setPhase("checking");
    setCodeError(null);
    let session;
    try {
      session = await backend.signInWithPassword(sentTo, password);
    } catch (error) {
      return fail(isBanned(error) ? "accountBanned" : "passwordWrong");
    }
    enter(session);
  };
  const onDigits = (next) => {
    setDigits(next);
    setCodeError(null);
    if (next.every(Boolean) && phase === "code") verify(next.join(""));
  };

  const results = searchUnis(query).slice(0, 60);
  const domains = dom ? [...new Set([dom, ...uni.domains])] : [];
  const crowd = !uni ? 0 : uni.students ? Math.max(40, Math.round(uni.students * 0.03)) : 140 + (Math.abs(hash(uni.name)) % 760);
  const showError = fullAddress ? fullEmail.includes("@") && fullEmail.includes(".") : local.length > 1;
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 45 }, (_, i) => thisYear - 16 - i);

  const emailBlock = (
    <>
      <p className={cx("-mt-1 mb-4 text-sm leading-relaxed", MUTED)}>{t("emailHint")}</p>
      <div
        className={cx(
          "flex items-center rounded-2xl bg-white ring-1 transition focus-within:ring-2",
          check.error && showError ? "ring-rose-300 focus-within:ring-rose-400" : "ring-black/[0.08] focus-within:ring-[#ff3d7f]/50",
        )}
      >
        <Mail className="ml-4 hidden size-4 shrink-0 text-zinc-400 sm:block" aria-hidden="true" />
        {fullAddress ? (
          <input
            id="uc-email"
            type="email"
            value={fullEmail}
            onChange={(e) => {
              resetCode();
              setFullEmail(e.target.value);
            }}
            placeholder={t("emailFullPh")}
            aria-label={t("s3Title")}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-zinc-400 sm:pl-3"
          />
        ) : (
          <>
            <input
              id="uc-email"
              value={local}
              onChange={(e) => onLocal(e.target.value)}
              placeholder={t("emailLocalPh")}
              aria-label={t("s3Title")}
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-zinc-400 sm:pl-3"
            />
            {domains.length > 1 ? (
              <label className="relative mr-1.5 shrink-0">
                <span className="sr-only">{t("domain")}</span>
                <select
                  value={dom}
                  onChange={(e) => {
                    resetCode();
                    setDomain(e.target.value);
                  }}
                  className="max-w-[11rem] appearance-none truncate rounded-xl bg-zinc-100 py-2 pl-3 pr-7 text-sm font-semibold text-zinc-700 outline-none"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      @{d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
              </label>
            ) : (
              <span className="mr-1.5 shrink-0 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700">@{dom}</span>
            )}
          </>
        )}
        {check.ok && <CheckBadge className="mr-2.5 size-7" />}
      </div>
      <div className="mt-2 min-h-5 text-sm">
        {check.ok ? (
          <p className="uc-fade font-semibold text-emerald-600">{t("emailOk")}</p>
        ) : showError || check.error === "errDomainEnd" ? (
          <p className="uc-fade text-rose-600">{t(check.error, { provider: check.provider, domain: dom })}</p>
        ) : (
          !fullAddress && <p className={MUTED}>{t("emailAltHint")}</p>
        )}
      </div>
      {!login && (
        <label className={cx("mt-3 flex items-start gap-2.5 text-xs leading-relaxed", MUTED)}>
          <input
            id="uc-consent"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-5 shrink-0 accent-[#ff3d7f]"
          />
          <span>
            {t("consentA")}
            <button type="button" onClick={() => setLegalDoc("terms")} className={cx("font-semibold text-zinc-700 underline", FOCUS)}>
              {t("legal_terms")}
            </button>
            {t("consentB")}
            <button type="button" onClick={() => setLegalDoc("privacy")} className={cx("font-semibold text-zinc-700 underline", FOCUS)}>
              {t("legal_privacy")}
            </button>
            {t("consentC")}
          </span>
        </label>
      )}
      <button
        type="button"
        onClick={reviewLogin ? askPassword : sendCode}
        disabled={!check.ok || phase !== "email" || needsYear || (!login && !agreed)}
        className={cx(btn.grad, btn.lg, "mt-3 w-full")}
      >
        {phase === "sending" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            {t("sending")}
          </>
        ) : reviewLogin ? (
          t("continueBtn")
        ) : codeStep ? (
          t("codeSent")
        ) : (
          t("sendCode")
        )}
      </button>
      {needsYear && check.ok && <p className="mt-2 text-center text-sm font-medium text-rose-600">{t("pickBirthYear")}</p>}
      {sendError && <p className="mt-2 text-center text-sm font-medium text-rose-600">{t(sendError)}</p>}
    </>
  );

  const codeCard = codeStep && (
    <StepCard
      n={login ? 2 : 4}
      title={reviewLogin ? t("passwordTitle") : t("s4Title")}
      done={phase === "done"}
      innerRef={(el) => (stepRefs.current[steps - 1] = el)}
      aside={
        !live &&
        phase !== "done" && (
          <button
            type="button"
            onClick={() => onDigits(DEMO_CODE.split(""))}
            className={cx(
              "uc-bounce inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-[12px] font-bold text-white shadow-lg",
              FOCUS,
            )}
          >
            🔑 <span className="uc-tnum tracking-wider">{DEMO_CODE}</span>
            <span className="font-medium text-white/60">· {t("tapToFill")}</span>
          </button>
        )
      }
    >
      {reviewLogin ? (
        <form onSubmit={passwordLogin}>
          <p className={cx("-mt-1 mb-4 text-sm", MUTED)}>{t("reviewHint")}</p>
          <input
            id="uc-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setCodeError(null);
            }}
            aria-label={t("passwordTitle")}
            autoComplete="current-password"
            autoFocus
            disabled={phase !== "code"}
            className={INPUT}
          />
          <button type="submit" disabled={!password || phase !== "code"} className={cx(btn.grad, btn.lg, "mt-3 w-full")}>
            {t("logIn")}
          </button>
        </form>
      ) : (
        <>
          <p className={cx("-mt-1 mb-4 text-sm", MUTED)}>{t("codeSentTo", { email: sentTo })}</p>
          <OtpBoxes value={digits} onChange={onDigits} error={!!codeError} shake={shake} disabled={phase === "done" || phase === "checking"} />
        </>
      )}
      <div className="mt-3 min-h-6 text-sm">
        {phase === "done" ? (
          <p className="flex items-center gap-2 font-bold text-emerald-600">
            <CheckBadge className="size-6" />
            {t("verified")}
          </p>
        ) : phase === "checking" ? (
          <p className={cx("flex items-center gap-2", MUTED)}>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            {t("checking")}
          </p>
        ) : codeError ? (
          <p className="font-medium text-rose-600">{t(codeError)}</p>
        ) : (
          !reviewLogin && (
            <ResendLink key={sentTo} onResend={live ? () => backend.sendCode(sentTo).catch(() => setSendError("errCodeSend")) : undefined} />
          )
        )}
      </div>
    </StepCard>
  );

  return (
    <div className="min-h-[100dvh] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="flex min-h-[100dvh] flex-col">
        <header
          className="flex items-center justify-between gap-4 px-5 pb-2 sm:px-10"
          style={{ paddingTop: "calc(1rem + env(safe-area-inset-top, 0px))" }}
        >
          <Logo />
          <LangToggle />
        </header>

        <main className="mx-auto w-full max-w-xl flex-1 px-5 pb-10 pt-6 sm:px-10">
          {notice && (
            <p
              role="status"
              className="uc-rise mb-6 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200"
            >
              <Check className="size-4 shrink-0" strokeWidth={3} />
              {t(notice)}
            </p>
          )}
          <div className="uc-rise">
            <div className="flex -space-x-3">
              {STUDENTS.slice(0, 5).map((s, i) => (
                <Avatar key={s.id} person={s} size="lg" ring glow={i === 2} className="ring-4 ring-[#FAFAFA]" />
              ))}
            </div>
            <h1 className="mt-5 text-[2.35rem] font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              {t("heroA")}
              <span className="uc-grad-text">{t("heroB")}</span>
              {t("heroC")}
            </h1>
            <p className={cx("mt-3 text-[16px] leading-relaxed", MUTED)}>{t("heroLead")}</p>
            {live && (
              <button
                type="button"
                onClick={() => {
                  setMode(login ? "signup" : "login");
                  setFullEmail("");
                  resetCode();
                }}
                className={cx("mt-4 rounded-full text-sm font-bold text-[#e11d63] hover:underline", FOCUS)}
              >
                {login ? t("backToSignup") : t("haveAccount")}
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {login ? (
              <StepCard key="login" n={1} title={t("loginTitle")} done={codeStep} innerRef={(el) => (stepRefs.current[0] = el)}>
                {emailBlock}
              </StepCard>
            ) : (
              <>
                <StepCard n={1} title={t("s1Title")} done={!!uni} innerRef={(el) => (stepRefs.current[0] = el)}>
                  <div className="flex flex-wrap gap-2">
                    {FEATURED_UNIS.map((id) => UNI_BY_ID[id]).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => pickUni(u.id)}
                        aria-pressed={uniId === u.id}
                        className={cx(PILL, "py-2.5", uniId === u.id ? PILL_ON : PILL_OFF)}
                      >
                        {u.name}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowMore((v) => !v)}
                      aria-expanded={showMore}
                      className={cx(PILL, "py-2.5", uni && !uni.featured ? PILL_ON : PILL_OFF)}
                    >
                      <span className="max-w-[13rem] truncate">{uni && !uni.featured ? uni.short : t("otherUni")}</span>
                      <ChevronDown className={cx("size-4 transition", showMore && "rotate-180")} aria-hidden="true" />
                    </button>
                  </div>
                  {showMore && (
                    <div className="uc-rise mt-4">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          autoFocus
                          placeholder={t("searchUni")}
                          aria-label={t("searchUni")}
                          className={cx(INPUT, "pl-10")}
                        />
                      </div>
                      {!query.trim() ? (
                        <p className={cx("mt-3 text-sm", MUTED)}>{t("uniSearchHint", { n: UNIVERSITIES.length })}</p>
                      ) : results.length ? (
                        <ul className="mt-2 max-h-72 overflow-y-auto overscroll-contain rounded-2xl bg-white p-1 ring-1 ring-black/[0.06]">
                          {results.map((u) => (
                            <li key={u.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  pickUni(u.id);
                                  setShowMore(false);
                                  setQuery("");
                                }}
                                aria-pressed={uniId === u.id}
                                className={cx(
                                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                                  uniId === u.id ? "bg-[#fff0f4]" : "hover:bg-zinc-50",
                                  FOCUS,
                                )}
                              >
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-bold">{u.name}</span>
                                  <span className={cx("block truncate text-xs", MUTED)}>
                                    {u.city} · {t(`uniType_${u.type}`)}
                                  </span>
                                </span>
                                {uniId === u.id && <Check className="size-4 shrink-0 text-[#e11d63]" strokeWidth={3} />}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={cx("mt-3 text-sm", MUTED)}>{t("noUniMatch")}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => pickUni("custom")}
                        aria-pressed={custom}
                        className={cx(PILL, "mt-3", custom ? "bg-zinc-900 text-white" : PILL_OFF)}
                      >
                        {t("notListed")}
                      </button>
                      {custom && (
                        <input
                          value={customUni}
                          onChange={(e) => setCustomUni(e.target.value)}
                          placeholder={t("customUniPh")}
                          aria-label={t("customUniPh")}
                          autoFocus
                          className={cx(INPUT, "uc-rise mt-3")}
                        />
                      )}
                    </div>
                  )}
                  {uni && !live && (
                    <p className="uc-fade mt-4 flex items-center gap-2.5 text-sm font-medium text-zinc-600">
                      <span className="flex -space-x-2">
                        {STUDENTS.slice(5, 8).map((s) => (
                          <Avatar key={s.id} person={s} size="sm" className="ring-2 ring-white" />
                        ))}
                      </span>
                      {t("crowd", { n: crowd })}
                    </p>
                  )}
                </StepCard>

                {uni && (
                  <StepCard n={2} title={t("s2Title")} done={!!major} innerRef={(el) => (stepRefs.current[1] = el)}>
                    <p className={LABEL}>{t("majorLabel")}</p>
                    <div className="flex flex-wrap gap-2">
                      {MAJORS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => pickMajor(m.id)}
                          aria-pressed={major === m.id}
                          className={cx(PILL, major === m.id ? PILL_ON : PILL_OFF)}
                        >
                          <span aria-hidden="true">{m.emoji}</span> {tx(m)}
                        </button>
                      ))}
                    </div>
                    {major && (
                      <div className="uc-rise mt-6">
                        <p className={LABEL}>{t("minorLabel")}</p>
                        <div className="uc-noscroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6">
                          <button
                            type="button"
                            onClick={() => setMinor(null)}
                            aria-pressed={!minor}
                            className={cx(PILL, !minor ? "bg-zinc-900 text-white" : PILL_OFF)}
                          >
                            {t("noMinor")}
                          </button>
                          {MAJORS.filter((m) => m.id !== major).map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setMinor(m.id)}
                              aria-pressed={minor === m.id}
                              className={cx(PILL, minor === m.id ? PILL_ON : PILL_OFF)}
                            >
                              <span aria-hidden="true">{m.emoji}</span> {tx(m)}
                            </button>
                          ))}
                        </div>
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                          <p className={cx(LABEL, "mb-0")}>{t("semesterLabel")}</p>
                          <Stepper
                            value={semester}
                            min={1}
                            max={14}
                            onChange={setSemester}
                            label={t("semesterLabel")}
                            render={(v) => (v === 1 ? t("ersti") : t("semesterN", { n: v }))}
                          />
                        </div>
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                          <label htmlFor="uc-birth" className={cx(LABEL, "mb-0")}>
                            {t("birthYear")}
                          </label>
                          <span className="relative">
                            <select
                              id="uc-birth"
                              value={birthYear}
                              onChange={(e) => setBirthYear(e.target.value)}
                              className={cx(
                                "appearance-none rounded-full bg-white py-2.5 pl-4 pr-9 text-sm font-bold outline-none ring-1 transition focus:ring-2 focus:ring-[#ff3d7f]/50",
                                birthYear ? "ring-black/[0.07]" : "text-zinc-400 ring-black/[0.07]",
                              )}
                            >
                              <option value="">{t("pickYear")}</option>
                              {years.map((y) => (
                                <option key={y} value={y}>
                                  {y}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </div>
                    )}
                  </StepCard>
                )}

                {uni && major && (
                  <StepCard n={3} title={t("s3Title")} done={codeStep} innerRef={(el) => (stepRefs.current[2] = el)}>
                    {emailBlock}
                  </StepCard>
                )}
              </>
            )}
            {codeCard}
          </div>
        </main>

        {!live && (
          <div
            className="uc-glass sticky bottom-0 z-10 border-t border-black/[0.04] px-5 pt-3 sm:px-10"
            style={{ paddingBottom: "max(0.875rem, env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="mx-auto flex max-w-xl items-center gap-3">
              <p className={cx("min-w-0 flex-1 text-[13px] leading-snug", MUTED)}>{t("quickDemoSub")}</p>
              <button type="button" onClick={() => onDone(DEMO_PROFILE)} className={cx(btn.dark, btn.md, "shrink-0")}>
                {t("quickDemo")}
              </button>
            </div>
          </div>
        )}
      </div>
      <SignupCollage />
      {legalDoc && <LegalSheet doc={legalDoc} onClose={() => setLegalDoc(null)} />}
    </div>
  );
}

function StepCard({ n, title, done, aside, innerRef, children }) {
  return (
    <section ref={innerRef} className={cx(CARD, "uc-rise scroll-mb-28 scroll-mt-6 p-5 sm:p-6")}>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        {done ? (
          <CheckBadge className="size-8" />
        ) : (
          <span className="uc-grad grid size-8 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white">{n}</span>
        )}
        <h2 className="min-w-0 flex-1 text-lg font-extrabold tracking-tight">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

function OtpBoxes({ value, onChange, error, shake, disabled }) {
  const { t } = useI18n();
  const refs = useRef([]);
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);
  const change = (i, raw) => {
    const typed = raw.replace(/\D/g, "");
    const next = [...value];
    if (!typed) {
      next[i] = "";
      onChange(next);
      return;
    }
    // One digit advances; a paste or SMS autofill spreads across the boxes.
    const chars = typed.length > 1 ? typed.slice(0, 6 - i) : typed;
    [...chars].forEach((c, k) => (next[i + k] = c));
    onChange(next);
    refs.current[Math.min(i + chars.length, 5)]?.focus();
  };
  const keyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      e.preventDefault();
      const next = [...value];
      next[i - 1] = "";
      onChange(next);
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };
  return (
    <div key={shake} className={cx("grid grid-cols-6 gap-2", shake > 0 && "uc-shake")}>
      {value.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          id={`uc-otp-${i}`}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={t("digit", { n: i + 1 })}
          disabled={disabled}
          onChange={(e) => change(i, e.target.value)}
          onKeyDown={(e) => keyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className={cx(
            "uc-tnum h-14 w-full min-w-0 rounded-2xl bg-white text-center text-2xl font-extrabold outline-none ring-1 transition focus:ring-2 focus:ring-[#ff3d7f]/60 disabled:bg-emerald-50 disabled:ring-emerald-300",
            error ? "ring-rose-400" : d ? "ring-[#ff3d7f]/40 shadow-[0_8px_18px_-12px_rgba(255,61,127,0.9)]" : "ring-black/[0.08]",
          )}
        />
      ))}
    </div>
  );
}

function ResendLink({ onResend }) {
  const { t } = useI18n();
  const [left, setLeft] = useState(30);
  useEffect(() => {
    if (left <= 0) return undefined;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return left > 0 ? (
    <p className={cx("uc-tnum", MUTED)}>{t("resendIn", { s: left })}</p>
  ) : (
    <button
      type="button"
      onClick={() => {
        onResend?.();
        setLeft(30);
      }}
      className={cx("inline-flex items-center gap-1.5 font-semibold text-[#e11d63] hover:underline", FOCUS)}
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      {t("resend")}
    </button>
  );
}

// Decorative preview on wide screens: what the app feels like once you're in.
function SignupCollage() {
  const { t, subject } = useI18n();
  const cards = [
    [STUDENTS[0], "left-[10%] top-[16%] -rotate-6", 96, "0ms"],
    [STUDENTS[1], "right-[8%] top-[10%] rotate-3", 92, "120ms"],
    [STUDENTS[4], "left-[30%] top-[44%] rotate-[4deg]", 88, "240ms"],
  ];
  return (
    <aside aria-hidden="true" className="sticky top-0 hidden h-[100dvh] overflow-hidden lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,89,0.22),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(139,61,255,0.2),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(255,61,127,0.18),transparent_50%)]" />
      {cards.map(([s, pos, score, delay]) => (
        <div key={s.id} className={cx("uc-rise absolute w-[44%] max-w-[260px]", pos)} style={{ animationDelay: delay }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)] ring-4 ring-white">
            <Photo src={s.photo} w={520} h={650} alt="" className="h-full w-full" />
            <div className="uc-scrim absolute inset-0" />
            <span className="uc-glass-dark uc-tnum absolute left-3 top-3 grid size-11 place-items-center rounded-full text-[13px] font-extrabold text-white">
              {score}%
            </span>
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="text-lg font-extrabold">
                {firstName(s.name)}, {s.age}
              </p>
              <p className="text-xs text-white/80">{subject(s.major)}</p>
            </div>
          </div>
        </div>
      ))}
      <div
        className="uc-rise absolute bottom-[9%] left-1/2 flex w-[78%] max-w-sm -translate-x-1/2 items-center gap-3 rounded-[22px] bg-white/90 p-3 shadow-2xl backdrop-blur-xl"
        style={{ animationDelay: "420ms" }}
      >
        <span className="flex -space-x-3">
          <Avatar person={STUDENTS[0]} size="md" className="ring-2 ring-white" />
          <Avatar person={DEMO_PROFILE} size="md" className="ring-2 ring-white" />
        </span>
        <span>
          <span className="block text-sm font-extrabold">{t("itsAMatch")}</span>
          <span className={cx("block text-xs", MUTED)}>{t("collageMatch")}</span>
        </span>
      </div>
    </aside>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Start: people only
 * ──────────────────────────────────────────────────────────────────────────── */

function PeopleView() {
  const app = useApp();
  const { t, subject } = useI18n();
  const me = app.me;
  const filters = [
    ["major", t("filterMajor", { subject: subject(me.major) })],
    me.minor && ["minor", t("filterMinor", { subject: subject(me.minor) })],
    ["interests", t("filterInterests")],
    ["all", t("filterAll")],
  ].filter(Boolean);

  const people = useMemo(() => {
    const list = app.students.map((s) => ({ s, m: matchInfo(s, me) }));
    const keep = {
      major: ({ s }) => s.major === me.major,
      minor: ({ s }) => !!me.minor && (s.major === me.minor || s.minor === me.minor),
      interests: ({ m }) => m.shared.length >= 1,
      all: () => true,
    }[app.filter];
    const order =
      app.filter === "interests" ? (a, b) => b.m.shared.length - a.m.shared.length || b.m.score - a.m.score : (a, b) => b.m.score - a.m.score;
    return list.filter(keep).sort(order);
  }, [app.students, app.filter, me]);

  return (
    <div>
      <StoryBar />
      {!me.photo && (
        <button
          type="button"
          onClick={() => app.openModal({ type: "me" })}
          className={cx(
            "mb-3 mt-1 flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-sm ring-1 ring-black/[0.05] transition hover:ring-black/10",
            FOCUS,
          )}
        >
          <span className="uc-grad grid size-10 shrink-0 place-items-center rounded-full text-white">
            <Camera className="size-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-semibold">{t("addPhotoPrompt")}</span>
          <ChevronRight className="size-4 shrink-0 text-zinc-300" />
        </button>
      )}
      <div className="uc-noscroll -mx-4 mb-4 mt-2 flex gap-2 overflow-x-auto px-4 py-1 lg:-mx-8 lg:px-8" role="tablist" aria-label={t("filters")}>
        {filters.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={app.filter === id}
            onClick={() => app.setFilter(id)}
            className={cx(PILL, app.filter === id ? PILL_ON : PILL_OFF)}
          >
            {label}
          </button>
        ))}
      </div>
      {people.length ? (
        <div key={app.filter} className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {people.map(({ s, m }, i) => (
            <PersonCard key={s.id} person={s} match={m} delay={Math.min(i, 8) * 45} />
          ))}
        </div>
      ) : (
        <EmptyState emoji="🫶" title={t("emptyFilter")} />
      )}
    </div>
  );
}

function StoryBar() {
  const app = useApp();
  const { t, tx } = useI18n();
  const me = app.me;
  const active = app.students
    .filter(
      (s) => s.online && s.status && (s.major === me.major || (me.minor && (s.major === me.minor || s.minor === me.minor)) || s.minor === me.major),
    )
    .sort((a, b) => Number(!!app.seen[a.id]) - Number(!!app.seen[b.id]) || a.ago - b.ago);
  const ids = active.map((s) => s.id);
  const myStatus = STATUS_BY_ID[me.status];
  return (
    <section aria-label={t("activeNow")} className="uc-noscroll -mx-4 flex gap-3.5 overflow-x-auto px-4 pb-2 pt-1 lg:-mx-8 lg:px-8">
      <button
        type="button"
        onClick={() => app.openModal({ type: "status" })}
        className={cx("flex w-[76px] shrink-0 flex-col items-center gap-1.5 rounded-2xl", FOCUS)}
      >
        <span className="relative">
          <Avatar person={me} size="xl" ring={!!myStatus} />
          <span className="uc-grad absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full text-white ring-[3px] ring-[#FAFAFA]">
            {myStatus ? <span className="text-[11px]">{myStatus.emoji}</span> : <Plus className="size-3.5" strokeWidth={3} />}
          </span>
        </span>
        <span className="w-full truncate text-center text-[11px] font-semibold text-zinc-500">{myStatus ? tx(myStatus) : t("yourStatus")}</span>
      </button>
      {active.map((s, i) => {
        const status = STATUS_BY_ID[s.status];
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => app.openStory(ids, i)}
            className={cx("uc-rise flex w-[76px] shrink-0 flex-col items-center gap-1.5 rounded-2xl", FOCUS)}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <Avatar person={s} size="xl" ring seen={!!app.seen[s.id]} glow={s.major === me.major} />
            <span className="w-full truncate text-center text-[11px] font-semibold text-zinc-700">
              {firstName(s.name)} · {status.emoji}
            </span>
          </button>
        );
      })}
    </section>
  );
}

function ConnectButton({ id, compact = false, onPhoto = true, className }) {
  const app = useApp();
  const { t } = useI18n();
  const rel = app.rels[id];
  const [pop, setPop] = useState(0);
  if (rel === "connected") {
    return (
      <span
        key={pop}
        className={cx(
          BTN,
          onPhoto ? "uc-glass-light text-white" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
          compact ? "h-8 px-3 text-[12px]" : btn.md,
          pop > 0 && "uc-pop",
          className,
        )}
      >
        <Check className={compact ? "size-3.5" : "size-4"} strokeWidth={3} />
        {t("connected")}
      </span>
    );
  }
  if (rel === "waved") {
    return (
      <span
        className={cx(
          BTN,
          onPhoto ? "uc-glass-light text-white/90" : "bg-zinc-100 text-zinc-500",
          compact ? "h-8 px-3 text-[12px]" : btn.md,
          className,
        )}
      >
        <Hand className={compact ? "size-3.5" : "size-4"} strokeWidth={2.4} />
        {t("waved")}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setPop((p) => p + 1);
        app.connect(id, e.currentTarget.getBoundingClientRect());
      }}
      className={cx(btn.grad, compact ? "h-8 px-3 text-[12px]" : btn.md, className)}
    >
      <Hand className={compact ? "size-3.5" : "size-4"} strokeWidth={2.4} />
      {rel === "incoming" ? t("waveBack") : t("connect")}
    </button>
  );
}

function PersonCard({ person: s, match, delay }) {
  const app = useApp();
  const { t, subject } = useI18n();
  return (
    <article
      className="uc-rise group relative aspect-[4/5] overflow-hidden rounded-3xl bg-zinc-200 shadow-[0_14px_30px_-18px_rgba(0,0,0,0.45)]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={() => app.openProfile(s.id)}
        aria-label={t("openProfile", { name: s.name })}
        className={cx("absolute inset-0 rounded-3xl", FOCUS)}
      >
        <Photo src={s.photo} w={600} h={750} alt="" zoom className="h-full w-full" />
      </button>
      <div className="uc-scrim pointer-events-none absolute inset-0" />
      <span className="uc-glass-dark uc-tnum pointer-events-none absolute left-2.5 top-2.5 grid size-10 place-items-center rounded-full text-[12px] font-extrabold tracking-tight text-white sm:size-11 sm:text-[13px]">
        {match.score}%<span className="sr-only"> Match</span>
      </span>
      {s.online && (
        <span
          className="pointer-events-none absolute right-3 top-3.5 size-2.5 rounded-full bg-emerald-400 ring-2 ring-white/80"
          aria-label={t("online")}
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
        <p className="truncate text-[15px] font-extrabold leading-tight sm:text-lg">
          {firstName(s.name)}
          {s.age ? `, ${s.age}` : ""}
          <span className="font-semibold text-white/75"> · {t("semShort", { n: s.semester })}</span>
        </p>
        <p className="mt-0.5 truncate text-[12px] font-medium text-white/85 sm:text-[13px]">
          {subject(s.major)}
          {s.minor && ` + ${subject(s.minor)}`}
        </p>
        <div className="pointer-events-auto mt-2.5 flex items-center gap-1.5">
          <ConnectButton id={s.id} compact className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              app.openChat(s.id);
            }}
            aria-label={t("messageTo", { name: firstName(s.name) })}
            className={cx(
              "uc-glass-light grid size-8 shrink-0 place-items-center rounded-full text-white transition hover:bg-white/30 active:scale-95",
              FOCUS,
            )}
          >
            <MessageCircle className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

const STORY_MS = 5000;

function StoryViewer({ ids, start, onClose }) {
  const app = useApp();
  const { t, tx, subject } = useI18n();
  const [index, setIndex] = useState(start);
  const [paused, setPaused] = useState(false);
  const downAt = useRef(0);
  const id = ids[index];
  const s = app.person(id);
  const status = STATUS_BY_ID[s.status];
  const { markSeen } = app;
  useEffect(() => markSeen(id), [id, markSeen]);

  const next = () => (index < ids.length - 1 ? setIndex(index + 1) : onClose());
  const prev = () => index > 0 && setIndex(index - 1);
  const keys = useRef({});
  useEffect(() => {
    keys.current = { next, prev, onClose };
  });
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") keys.current.onClose();
      if (e.key === "ArrowRight") keys.current.next();
      if (e.key === "ArrowLeft") keys.current.prev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Holding pauses the story; a quick tap moves on.
  const zone = (go) => ({
    onPointerDown: () => {
      downAt.current = Date.now();
      setPaused(true);
    },
    onPointerLeave: () => setPaused(false),
    onClick: () => {
      setPaused(false);
      if (Date.now() - downAt.current < 350) go();
    },
  });

  return (
    <div role="dialog" aria-modal="true" aria-label={t("storyOf", { name: s.name })} className="fixed inset-0 z-[60] bg-zinc-950">
      <div className="absolute inset-0 hidden overflow-hidden sm:block">
        <Photo src={s.photo} w={120} alt="" className="h-full w-full scale-110 opacity-40 blur-2xl" />
      </div>
      <div className="relative mx-auto h-full w-full max-w-md overflow-hidden sm:top-4 sm:h-[calc(100%-2rem)] sm:rounded-3xl">
        <Photo key={id} src={s.photo} w={900} h={1600} alt={s.name} className="uc-fade absolute inset-0 h-full w-full" />
        <div className="uc-scrim-top absolute inset-x-0 top-0 h-40" />
        <div className="uc-scrim absolute inset-0" />
        <button type="button" aria-label={t("prevStory")} className="absolute inset-y-0 left-0 w-1/3 outline-none" {...zone(prev)} />
        <button type="button" aria-label={t("nextStory")} className="absolute inset-y-0 right-0 w-2/3 outline-none" {...zone(next)} />

        <div className="absolute inset-x-0 top-0 px-3" style={{ paddingTop: "calc(0.625rem + env(safe-area-inset-top, 0px))" }}>
          <div className="flex gap-1">
            {ids.map((sid, i) => (
              <span key={sid} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                {i < index && <span className="uc-keep block h-full w-full bg-white" />}
                {i === index && (
                  <span
                    key={`${sid}-${index}`}
                    className="uc-progress uc-keep block h-full w-full bg-white"
                    style={{ animationDuration: `${STORY_MS}ms`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={next}
                  />
                )}
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5 text-white">
            <Avatar person={s} size="sm" />
            <p className="min-w-0 flex-1 truncate text-sm font-bold">
              {firstName(s.name)} <span className="font-medium text-white/70">· {fmtAgo(s.lastActive, app.now, t)}</span>
            </p>
            <IconButton dark label={t("close")} onClick={onClose}>
              <X className="size-5" />
            </IconButton>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 px-5"
          style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="flex justify-center">
            <span key={id} className="uc-bounce uc-glass-light rounded-full px-5 py-2.5 text-xl font-extrabold text-white shadow-xl">
              {status.emoji} {tx(status)}
            </span>
          </div>
          <p className="mt-6 text-2xl font-extrabold text-white">
            {s.name}
            {s.age ? `, ${s.age}` : ""}
          </p>
          <p className="text-sm text-white/80">
            {subject(s.major)}
            {s.minor && ` + ${subject(s.minor)}`} · {t("semShort", { n: s.semester })}
          </p>
          <div className="pointer-events-auto mt-4 flex gap-2">
            <button type="button" onClick={(e) => app.wave(s.id, e.currentTarget.getBoundingClientRect())} className={cx(btn.grad, btn.md, "flex-1")}>
              {t("wave")}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                app.openChat(s.id);
              }}
              aria-label={t("message")}
              className={cx(BTN, "uc-glass-light size-11 text-white")}
            >
              <MessageCircle className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                app.openProfile(s.id);
              }}
              className={cx(BTN, "uc-glass-light h-11 px-4 text-sm text-white")}
            >
              {t("profile")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSheet({ id, onClose }) {
  const app = useApp();
  const { t, tx, subject } = useI18n();
  const s = app.person(id);
  const me = app.me;
  const m = matchInfo(s, me);
  const [slide, setSlide] = useState(0);
  const status = STATUS_BY_ID[s.status];
  const heading = "mt-6 text-[12px] font-bold uppercase tracking-[0.08em] text-zinc-400";
  return (
    <Sheet
      onClose={onClose}
      title={s.name}
      bare
      footer={
        <div className="flex gap-2">
          <ConnectButton id={s.id} onPhoto={false} className="flex-1" />
          <button
            type="button"
            onClick={() => {
              onClose();
              app.openChat(s.id);
            }}
            className={cx(btn.soft, btn.md)}
          >
            <MessageCircle className="size-4" />
            {t("message")}
          </button>
        </div>
      }
    >
      <div className="relative">
        <div
          className="uc-noscroll flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        >
          {s.gallery.map((src, i) => (
            <Photo
              key={src}
              src={src}
              w={800}
              h={1000}
              alt={i === 0 ? s.name : ""}
              className="aspect-[4/5] max-h-[56dvh] w-full shrink-0 snap-center"
            />
          ))}
        </div>
        <div className="uc-scrim-top pointer-events-none absolute inset-x-0 top-0 h-24" />
        <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center gap-1.5">
          {s.gallery.map((src, i) => (
            <span
              key={src}
              className={cx("h-1 rounded-full transition-all duration-300", i === slide ? "uc-keep w-6 bg-white" : "w-1.5 bg-white/55")}
            />
          ))}
        </div>
        <IconButton dark label={t("close")} onClick={onClose} className="absolute right-3 top-3">
          <X className="size-5" />
        </IconButton>
        <span className="uc-grad uc-bounce absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate rounded-full px-3 py-1.5 text-[13px] font-extrabold text-white shadow-lg">
          ⚡ {t("matchLine", { n: m.score })}
          {m.subjects.length > 0 && ` · ${m.subjects.map(subject).join(" & ")}`}
        </span>
      </div>

      <div className="px-5 pb-6 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-2xl font-extrabold tracking-tight">
              {s.name}
              {s.age ? `, ${s.age}` : ""}
            </h2>
            <p className={cx("mt-0.5 text-sm", MUTED)}>
              {me.uni.short} · {subject(s.major)}
              {s.minor && ` + ${subject(s.minor)}`} · {t("semShort", { n: s.semester })}
            </p>
          </div>
          <span
            className={cx(
              "mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              s.online ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500",
            )}
          >
            {s.online && <span className="size-1.5 rounded-full bg-emerald-500" />}
            {s.online ? (status ? `${status.emoji} ${tx(status)}` : t("activeNow")) : t("activeAgo", { ago: fmtAgo(s.lastActive, app.now, t) })}
          </span>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-700">{tx(s.bio)}</p>

        {m.reasons.length > 0 && (
          <>
            <h3 className={heading}>{t("whyMatch")}</h3>
            <ul className="mt-2.5 space-y-2">
              {m.reasons.map(([key, vars]) => (
                <li key={key} className="flex items-center gap-2.5 text-sm font-semibold">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="size-3" strokeWidth={3.5} />
                  </span>
                  {t(key, { ...vars, subject: subject(vars.subject) })}
                </li>
              ))}
            </ul>
          </>
        )}

        <h3 className={heading}>{t("interests")}</h3>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {s.interests.map((i) => (
            <Tag key={i} id={i} highlight={me.interests.includes(i)} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => app.openModal({ type: "group", with: s.id })} className={cx(btn.soft, btn.md, "px-3")}>
            <Users className="size-4" />
            {t("createGroupWith")}
          </button>
          <button type="button" onClick={() => app.openModal({ type: "invitePerson", person: s.id })} className={cx(btn.soft, btn.md, "px-3")}>
            <UserPlus className="size-4" />
            {t("inviteToGroup")}
          </button>
        </div>
        <div className="mt-5 flex justify-center gap-6 text-[13px] font-semibold text-zinc-400">
          <button
            type="button"
            onClick={() => app.openOverlay({ type: "report", person: s.id })}
            className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:text-rose-600", FOCUS)}
          >
            <Flag className="size-4" />
            {t("report")}
          </button>
          <button
            type="button"
            onClick={() => app.block(s.id)}
            className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:text-rose-600", FOCUS)}
          >
            <Ban className="size-4" />
            {t("block")}
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function InvitePersonSheet({ id, onClose }) {
  const app = useApp();
  const { t, tx } = useI18n();
  const s = app.person(id);
  const mine = app.groups.filter((g) => g.members.includes(ME));
  return (
    <Sheet onClose={onClose} title={t("inviteNameTo", { name: firstName(s.name) })} z="z-[55]">
      <ul className="flex flex-col gap-2 px-5 pb-5 pt-2">
        {mine.map((g) => {
          const inside = g.members.includes(id) || g.invited?.includes(id);
          return (
            <li key={g.id} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-2.5 ring-1 ring-black/[0.04]">
              <GroupThumb group={g} />
              <span className="min-w-0 flex-1 truncate text-sm font-bold">{tx(g.name)}</span>
              <button
                type="button"
                disabled={inside}
                onClick={() => app.inviteToGroup(g.id, [id])}
                className={cx(inside ? btn.ghost : btn.grad, btn.sm)}
              >
                {inside ? t("invited") : t("invite")}
              </button>
            </li>
          );
        })}
        {!mine.length && <EmptyState emoji="👥" title={t("noMyGroups")} />}
      </ul>
    </Sheet>
  );
}

function StatusSheet({ onClose }) {
  const app = useApp();
  const { t, tx } = useI18n();
  return (
    <Sheet onClose={onClose} title={t("statusTitle")}>
      <div className="grid grid-cols-2 gap-2 px-5 pb-4 pt-2 sm:grid-cols-4">
        {STATUSES.map((st) => (
          <button
            key={st.id}
            type="button"
            onClick={() => {
              app.setStatus(st.id);
              onClose();
            }}
            className={cx(
              "flex flex-col items-center gap-1 rounded-2xl p-3 text-sm font-bold transition active:scale-95",
              app.me.status === st.id ? "uc-grad text-white shadow-lg" : "bg-zinc-50 ring-1 ring-black/[0.06] hover:bg-zinc-100",
              FOCUS,
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {st.emoji}
            </span>
            {tx(st)}
          </button>
        ))}
      </div>
      {app.me.status && (
        <div className="px-5 pb-5">
          <button
            type="button"
            onClick={() => {
              app.setStatus(null);
              onClose();
            }}
            className={cx(btn.ghost, btn.md, "w-full")}
          >
            {t("clearStatus")}
          </button>
        </div>
      )}
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Spontan: hangouts
 * ──────────────────────────────────────────────────────────────────────────── */

const HANGOUT_COVERS = {
  coffee: [VIBE.latte, VIBE.icedCoffee, VIBE.coffee],
  mensa: [VIBE.bowl, VIBE.salad, VIBE.mensa, VIBE.pizza],
  study: [VIBE.notes, VIBE.library, VIBE.studyGroup, VIBE.books],
  sport: [VIBE.tennis, VIBE.football, VIBE.climbing],
  party: [VIBE.party, VIBE.concert],
};
const coverFor = (h) => HANGOUT_COVERS[h.type][Math.abs(hash(h.id)) % HANGOUT_COVERS[h.type].length];

function SpontanView() {
  const app = useApp();
  const { t, subject } = useI18n();
  const me = app.me;
  const [filter, setFilter] = useState("all");
  const upcoming = app.hangouts.filter((h) => !isOver(h, app.now));
  const visible = upcoming.filter((h) => canAccess(h, me));
  const hidden = upcoming.length - visible.length;
  const keep = {
    all: () => true,
    today: (h) => isLive(h, app.now) || sameDay(h.start, app.now),
    major: (h) => !!h.audience,
    mine: (h) => h.host === ME || h.attendees.includes(ME) || h.pending.includes(ME),
  }[filter];
  const list = visible.filter(keep);
  const create = (
    <button type="button" onClick={() => app.openModal({ type: "hangout" })} className={cx(btn.grad, btn.md, "shrink-0")}>
      <Plus className="size-4" strokeWidth={3} />
      {t("newHangout")}
    </button>
  );
  return (
    <div>
      <PageTitle title={t("spontanTitle")} lead={t("spontanLead")} action={create} />
      <div className="uc-noscroll -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 py-1 lg:-mx-8 lg:px-8" role="tablist" aria-label={t("filters")}>
        {[
          ["all", t("hfAll")],
          ["today", t("hfToday")],
          ["major", t("hfMajor", { subject: subject(me.major) })],
          ["mine", t("hfMine")],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={cx(PILL, filter === id ? PILL_ON : PILL_OFF)}
          >
            {label}
          </button>
        ))}
      </div>
      {list.length ? (
        <div key={filter} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {list.map((h, i) => (
            <HangoutCard key={h.id} h={h} delay={Math.min(i, 6) * 50} />
          ))}
        </div>
      ) : (
        <EmptyState emoji="🌤️" title={t("noHangouts")} action={create} />
      )}
      {hidden > 0 && <p className={cx("mt-6 text-center text-sm", MUTED)}>🔒 {t("hiddenHangouts", { n: hidden })}</p>}
    </div>
  );
}

function HangoutCard({ h, delay }) {
  const app = useApp();
  const { t, tx, subject, lang } = useI18n();
  const type = HANGOUT_TYPE_BY_ID[h.type];
  const live = isLive(h, app.now);
  const availableUntil = h.start + durationOf(h) * MIN;
  const minutesLeft = Math.max(0, Math.ceil((availableUntil - app.now) / MIN));
  const availableUntilTime = fmtDate(availableUntil, lang) === fmtDate(h.start, lang)
    ? fmtTime(availableUntil, lang)
    : `${fmtDate(availableUntil, lang)} · ${fmtTime(availableUntil, lang)}`;
  const host = app.person(h.host);
  const going = h.attendees.includes(ME);
  const pending = h.pending.includes(ME);
  const full = h.attendees.length >= h.max;
  let action;
  if (h.host === ME) action = <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-600">{t("yourHangout")}</span>;
  else if (going)
    action = (
      <span className="uc-pop rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{t("joined")}</span>
    );
  else if (pending)
    action = <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 ring-1 ring-amber-200">{t("requested")}</span>;
  else if (full) action = <span className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-500">{t("full")}</span>;
  else
    action = (
      <button type="button" onClick={(e) => app.joinHangout(h.id, e.currentTarget.getBoundingClientRect())} className={cx(btn.grad, btn.sm)}>
        {h.approval ? t("requestJoin") : t("join")}
      </button>
    );
  return (
    <article className={cx(CARD, "uc-rise overflow-hidden")} style={{ animationDelay: delay + "ms" }}>
      <button type="button" onClick={() => app.openModal({ type: "hangoutDetail", hangoutId: h.id })} className="block w-full text-left">
        <div className="relative h-36 sm:h-40">
          <Photo src={coverFor(h)} w={800} h={400} alt="" className="h-full w-full" />
          <div className="uc-scrim absolute inset-0" />
          <span className="uc-glass-dark absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white">
            {live && <span className="size-2 animate-pulse rounded-full bg-rose-500" />}
            {live ? t("liveNow") : fmtWhen(h.start, app.now, t, lang)}
          </span>
          <span className="uc-glass-dark absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white">
            {h.audience ? t("audienceMajor", { subject: subject(h.audience) }) : t("audienceAll")}
          </span>
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-4 text-white">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-lg" aria-hidden="true">
              {type.emoji}
            </span>
            <h3 className="min-w-0 text-lg font-extrabold leading-tight">{tx(h.title)}</h3>
          </div>
        </div>
        <div className="flex flex-col gap-3 px-4 pb-1 pt-4">
          <p className={cx("flex min-w-0 items-center gap-1.5 text-sm", MUTED)}>
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{tx(h.place)}</span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0">{h.host === ME ? t("byYou") : t("hostedBy", { name: firstName(host.name) })}</span>
            {h.approval && h.host !== ME && <span className="shrink-0">· {t("approvalNote")}</span>}
          </p>
          <p className="flex flex-wrap items-center gap-x-1.5 text-xs font-semibold text-zinc-500">
            <span>{t("duration")} {fmtDuration(durationOf(h), t)}</span>
            <span aria-hidden="true">·</span>
            <span>{live ? t("minutesLeft", { n: minutesLeft }) : t("availableUntilShort", { time: availableUntilTime })}</span>
          </p>
        </div>
      </button>
      <div className="flex items-center justify-between gap-3 p-4 pt-3">
        <span className="flex min-w-0 items-center gap-2.5">
          <FacePile ids={h.attendees} max={4} />
          <span className="uc-tnum shrink-0 text-[13px] font-semibold text-zinc-600">{t("going", { n: h.attendees.length, max: h.max })}</span>
        </span>
        {action}
      </div>
    </article>
  );
}

function HangoutDetailSheet({ id, onClose }) {
  const app = useApp();
  const { t, tx, subject, lang } = useI18n();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const h = app.hangouts.find((item) => item.id === id);
  if (!h) return null;

  const type = HANGOUT_TYPE_BY_ID[h.type];
  const host = app.person(h.host);
  const joined = h.attendees.includes(ME);
  const pending = h.pending.includes(ME);
  const full = h.attendees.length >= h.max;
  const live = isLive(h, app.now);
  const availableUntil = h.start + durationOf(h) * MIN;
  const minutesLeft = Math.max(0, Math.ceil((availableUntil - app.now) / MIN));

  let footer;
  if (h.host === ME) {
    footer = confirmDelete ? (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-rose-600 shadow-sm" aria-hidden="true">
            <Trash2 className="size-4" />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-sm font-bold leading-5 text-zinc-900">{t("confirmDeleteHangout")}</p>
            <p className="mt-0.5 text-xs leading-5 text-zinc-600">{t("confirmDeleteHangoutBody")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setConfirmDelete(false)} className={cx(btn.soft, btn.md, "w-full px-3")}>
            {t("keepHangout")}
          </button>
          <button type="button" onClick={() => app.deleteHangout(h.id)} className={cx(BTN, "h-11 w-full bg-rose-600 px-3 text-sm text-white hover:bg-rose-700")}>
            <Trash2 className="size-4 shrink-0" />
            <span>{t("deleteHangout")}</span>
          </button>
        </div>
      </div>
    ) : (
      <button type="button" onClick={() => setConfirmDelete(true)} className={cx(BTN, "h-11 w-full bg-rose-50 px-4 text-sm text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100")}>
        <Trash2 className="size-4 shrink-0" />
        <span>{t("deleteHangout")}</span>
      </button>
    );
  } else if (joined) {
    footer = <span className="block rounded-full bg-emerald-50 px-4 py-3 text-center text-sm font-bold text-emerald-700">{t("joined")}</span>;
  } else if (pending) {
    footer = <span className="block rounded-full bg-amber-50 px-4 py-3 text-center text-sm font-bold text-amber-700">{t("requested")}</span>;
  } else if (full) {
    footer = <span className="block rounded-full bg-zinc-100 px-4 py-3 text-center text-sm font-bold text-zinc-500">{t("full")}</span>;
  } else {
    footer = (
      <button type="button" onClick={(e) => app.joinHangout(h.id, e.currentTarget.getBoundingClientRect())} className={cx(btn.grad, btn.lg, "w-full")}>
        {h.approval ? t("requestJoin") : t("join")}
      </button>
    );
  }

  return (
    <Sheet onClose={onClose} title={t("hangoutDetails")} wide footer={footer}>
      <div className="px-5 pb-6 pt-2">
        <div className="relative h-44 overflow-hidden rounded-2xl">
          <Photo src={coverFor(h)} w={900} h={480} alt="" className="h-full w-full" />
          <div className="uc-scrim absolute inset-0" />
          <span className="absolute bottom-3 left-4 grid size-11 place-items-center rounded-2xl bg-white text-2xl shadow-lg" aria-hidden="true">
            {type.emoji}
          </span>
        </div>
        <h3 className="mt-4 text-xl font-extrabold">{tx(h.title)}</h3>
        <p className="mt-1 text-sm text-zinc-500">
          {h.audience ? t("audienceMajor", { subject: subject(h.audience) }) : t("audienceAll")}
          {" · "}
          {h.host === ME ? t("byYou") : t("hostedBy", { name: firstName(host.name) })}
        </p>
        <div className="mt-5 space-y-3 rounded-2xl bg-zinc-50 p-4 text-sm">
          <p><span className="font-bold text-zinc-900">{t("startsAt")}:</span> <span className="text-zinc-600">{fmtDate(h.start, lang)} · {fmtTime(h.start, lang)}</span></p>
          <p>
            <span className="font-bold text-zinc-900">{t("duration")}:</span>{" "}
            <span className="text-zinc-600">
              {fmtDuration(durationOf(h), t)}
              {live && <span className="ml-1">({t("minutesLeft", { n: minutesLeft })})</span>}
            </span>
          </p>
          <p><span className="font-bold text-zinc-900">{t("availableUntil")}:</span> <span className="text-zinc-600">{fmtDate(availableUntil, lang)} · {fmtTime(availableUntil, lang)}</span></p>
          <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" /><span><span className="font-bold text-zinc-900">{t("meetAt")}:</span> <span className="text-zinc-600">{tx(h.place)}</span></span></p>
        </div>
        <h4 className="mt-6 flex items-baseline justify-between text-[12px] font-bold uppercase tracking-[0.08em] text-zinc-400">
          {t("whoIsComing")}
          <span className="uc-tnum normal-case tracking-normal">{t("going", { n: h.attendees.length, max: h.max })}</span>
        </h4>
        {/* Tap someone for their profile; people you're connected with can be messaged right away. */}
        <ul className="mt-2 flex flex-col gap-1">
          {h.attendees.map((pid) => {
            const p = app.person(pid);
            const isMe = pid === ME;
            return (
              <li key={pid} className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isMe}
                  onClick={() => {
                    onClose();
                    app.openProfile(pid);
                  }}
                  className={cx("flex min-w-0 flex-1 items-center gap-3 rounded-2xl p-1.5 text-left transition", !isMe && "hover:bg-zinc-50", FOCUS)}
                >
                  <Avatar person={p} size="md" online={!isMe && p.online} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">
                      {isMe ? t("you") : p.name}
                      {pid === h.host && <span className="ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] font-bold text-zinc-500">{t("hostTag")}</span>}
                    </span>
                    {p.major && <span className="block truncate text-xs text-zinc-500">{subject(p.major)}</span>}
                  </span>
                </button>
                {!isMe && app.rels[pid] === "connected" && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      app.openChat(pid);
                    }}
                    className={cx(btn.soft, btn.sm, "shrink-0")}
                  >
                    <MessageCircle className="size-4" />
                    {t("message")}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Sheet>
  );
}

const pad2 = (n) => String(n).padStart(2, "0");
const toHM = (d) => pad2(d.getHours()) + ":" + pad2(d.getMinutes());
const dateInputValue = (d) => d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());

function CreateHangoutSheet({ onClose }) {
  const app = useApp();
  const { t, tx, subject } = useI18n();
  const me = app.me;
  const soon = new Date(Math.ceil((Date.now() + 15 * MIN) / (15 * MIN)) * 15 * MIN);
  const [type, setType] = useState("mensa");
  const [title, setTitle] = useState(() => tx(HANGOUT_TYPE_BY_ID.mensa.title));
  const [edited, setEdited] = useState(false);
  const [date, setDate] = useState(() => dateInputValue(soon));
  const [time, setTime] = useState(toHM(soon));
  const [duration, setDuration] = useState(DEFAULT_HANGOUT_MINUTES);
  const [place, setPlace] = useState("");
  const [max, setMax] = useState(HANGOUT_TYPE_BY_ID.mensa.max);
  const [audience, setAudience] = useState("all");
  const [submitted, setSubmitted] = useState(false);

  const [year, month, dayOfMonth] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const startDate = new Date(year, month - 1, dayOfMonth, hh, mm, 0, 0);
  const start = startDate.getTime();
  const errors = {
    title: !title.trim() && t("errTitle"),
    place: !place.trim() && t("errPlace"),
    time: (!date || !time || Number.isNaN(start) || start < Date.now()) && t("errPast"),
  };
  const pickType = (id) => {
    setType(id);
    setMax(HANGOUT_TYPE_BY_ID[id].max);
    if (!edited) setTitle(tx(HANGOUT_TYPE_BY_ID[id].title));
  };
  const submit = () => {
    setSubmitted(true);
    if (errors.title || errors.place || errors.time) return;
    app.createHangout({
      type,
      title: title.trim(),
      start,
      duration,
      place: place.trim(),
      max,
      audience: audience === "major" ? me.major : null,
    });
    onClose();
  };

  return (
    <Sheet
      onClose={onClose}
      title={t("chTitle")}
      wide
      footer={
        <button type="button" onClick={submit} className={cx(btn.grad, btn.lg, "w-full")}>
          {t("post")}
        </button>
      }
    >
      <div className="flex flex-col gap-6 px-5 pb-6 pt-2">
        <div>
          <p className={LABEL}>{t("chWhat")}</p>
          <div className="uc-noscroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {HANGOUT_TYPES.map((ht) => (
              <button
                key={ht.id}
                type="button"
                onClick={() => pickType(ht.id)}
                aria-pressed={type === ht.id}
                className={cx(
                  "flex w-[84px] shrink-0 flex-col items-center gap-1 rounded-2xl py-3 text-[13px] font-bold transition active:scale-95",
                  type === ht.id ? "uc-grad text-white shadow-lg" : "bg-zinc-50 ring-1 ring-black/[0.06] hover:bg-zinc-100",
                  FOCUS,
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {ht.emoji}
                </span>
                {tx(ht)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="uc-ch-title" className={LABEL}>
            {t("chName")}
          </label>
          <input
            id="uc-ch-title"
            value={title}
            maxLength={60}
            onChange={(e) => {
              setTitle(e.target.value);
              setEdited(true);
            }}
            className={cx(INPUT, submitted && errors.title && "ring-rose-300")}
          />
          {submitted && errors.title && <p className="mt-1.5 text-sm text-rose-600">{errors.title}</p>}
        </div>

        <div>
          <p className={LABEL}>{t("chWhen")}</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="uc-ch-date" className="mb-1.5 block text-xs font-semibold text-zinc-500">{t("chDate")}</label>
              <input
                id="uc-ch-date"
                type="date"
                min={dateInputValue(new Date())}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={cx(INPUT, "appearance-none py-2", submitted && errors.time && "ring-rose-300")}
              />
            </div>
            <div>
              <label htmlFor="uc-ch-time" className="mb-1.5 block text-xs font-semibold text-zinc-500">{t("chTime")}</label>
              <input
                id="uc-ch-time"
                type="time"
                step={300}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={cx(INPUT, "appearance-none py-2", submitted && errors.time && "ring-rose-300")}
              />
            </div>
          </div>
          {submitted && errors.time && <p className="mt-1.5 text-sm text-rose-600">{errors.time}</p>}
        </div>

        <div>
          <label htmlFor="uc-ch-duration" className={LABEL}>{t("chDuration")}</label>
          <select id="uc-ch-duration" value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={cx(INPUT, "py-3")}>
            {Array.from({ length: MAX_HANGOUT_MINUTES / 30 }, (_, i) => (i + 1) * 30).map((minutes) => (
              <option key={minutes} value={minutes}>{fmtDuration(minutes, t)}</option>
            ))}
          </select>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{t("chDurationHint")}</p>
        </div>

        <div>
          <label htmlFor="uc-ch-place" className={LABEL}>
            {t("chWhere")}
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
            <input
              id="uc-ch-place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              maxLength={80}
              placeholder={t("placePlaceholder")}
              className={cx(INPUT, "pl-10", submitted && errors.place && "ring-rose-300")}
            />
          </div>
          {submitted && errors.place && <p className="mt-1.5 text-sm text-rose-600">{errors.place}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={cx(LABEL, "mb-0")}>{t("chMax")}</p>
          <Stepper value={max} min={2} max={30} onChange={setMax} label={t("chMax")} render={(v) => t("people", { n: v })} />
        </div>

        <div>
          <p className={LABEL}>{t("whoCanJoin")}</p>
          <AudienceToggle value={audience} onChange={setAudience} subject={subject(me.major)} />
        </div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Gruppen: circles
 * ──────────────────────────────────────────────────────────────────────────── */

function GroupsView() {
  const app = useApp();
  const { t } = useI18n();
  const [tab, setTab] = useState("mine");
  const visible = app.groups.filter((g) => g.members.includes(ME) || g.invited?.includes(ME) || canAccess(g, app.me));
  const hidden = app.groups.length - visible.length;
  const mine = visible.filter((g) => g.members.includes(ME) || g.invited?.includes(ME));
  const discover = visible.filter((g) => !g.members.includes(ME) && !g.invited?.includes(ME));
  const list = tab === "mine" ? mine : discover;
  const create = (
    <button type="button" onClick={() => app.openModal({ type: "group" })} className={cx(btn.grad, btn.md, "shrink-0")}>
      <Plus className="size-4" strokeWidth={3} />
      {t("newGroup")}
    </button>
  );
  return (
    <div>
      <PageTitle title={t("groupsTitle")} lead={t("groupsLead")} action={create} />
      <div className="mb-5 inline-flex rounded-full bg-black/[0.05] p-1" role="tablist" aria-label={t("groupsTitle")}>
        {[
          ["mine", t("tabMine"), mine.length],
          ["discover", t("tabDiscover"), discover.length],
        ].map(([id, label, n]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cx(
              "rounded-full px-4 py-1.5 text-sm font-bold transition",
              tab === id ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800",
              FOCUS,
            )}
          >
            {label} <span className="uc-tnum text-zinc-400">{n}</span>
          </button>
        ))}
      </div>
      {list.length ? (
        <div key={tab} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g, i) => (
            <GroupCard key={g.id} group={g} delay={Math.min(i, 6) * 50} />
          ))}
        </div>
      ) : (
        <EmptyState emoji="👥" title={tab === "mine" ? t("noMyGroups") : t("allJoined")} action={tab === "mine" && create} />
      )}
      {hidden > 0 && tab === "discover" && <p className={cx("mt-6 text-center text-sm", MUTED)}>🔒 {t("hiddenGroups", { n: hidden })}</p>}
    </div>
  );
}

function GroupThumb({ group, className = "size-11" }) {
  return (
    <span className={cx("relative grid shrink-0 place-items-center overflow-hidden rounded-2xl", className)}>
      {group.cover ? (
        <Photo src={group.cover} w={120} alt="" className="absolute inset-0 h-full w-full" />
      ) : (
        <span className="uc-grad absolute inset-0" />
      )}
      <span className="absolute inset-0 bg-black/15" />
      <span className="relative text-xl drop-shadow" aria-hidden="true">
        {group.emoji}
      </span>
    </span>
  );
}

function GroupCard({ group: g, delay }) {
  const app = useApp();
  const { t, tx, subject } = useI18n();
  const member = g.members.includes(ME);
  const invited = !member && g.invited?.includes(ME);
  const others = g.members.filter((id) => id !== ME);
  return (
    <article className={cx(CARD, "uc-rise flex flex-col overflow-hidden")} style={{ animationDelay: `${delay}ms` }}>
      <div className="relative h-32">
        {g.cover ? <Photo src={g.cover} w={700} h={320} alt="" className="h-full w-full" /> : <div className="uc-grad h-full w-full" />}
        <div className="uc-scrim-top absolute inset-0" />
        <span className="uc-glass-dark absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white">
          {g.audience ? t("audienceMajor", { subject: subject(g.audience) }) : t("audienceAll")}
        </span>
        <span
          className="absolute -bottom-6 left-4 grid size-14 place-items-center rounded-2xl bg-white text-3xl shadow-lg ring-4 ring-white"
          aria-hidden="true"
        >
          {g.emoji}
        </span>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
        <h3 className="text-[17px] font-extrabold leading-tight">{tx(g.name)}</h3>
        <p className={cx("mt-1 line-clamp-2 text-sm", MUTED)}>{tx(g.about)}</p>
        <div className="mt-auto flex items-center gap-2 pt-4">
          {others.length > 0 && <FacePile ids={others} max={4} />}
          <span className="uc-tnum text-[12px] font-semibold text-zinc-500">{t("members", { n: g.members.length + (g.extra ?? 0) })}</span>
        </div>
        <div className="mt-3 flex gap-2">
          {member ? (
            <>
              <button type="button" onClick={() => app.openGroupChat(g.id)} className={cx(btn.dark, btn.sm, "flex-1")}>
                <MessageCircle className="size-4" />
                {t("open")}
              </button>
              <button type="button" onClick={() => app.openModal({ type: "invite", groupId: g.id })} className={cx(btn.soft, btn.sm)}>
                <UserPlus className="size-4" />
                {t("invite")}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={(e) => app.joinGroup(g.id, e.currentTarget.getBoundingClientRect())}
              className={cx(btn.grad, btn.sm, "flex-1")}
            >
              {invited ? t("acceptInvite") : t("joinGroup")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function FriendPicker({ people, selected, onToggle }) {
  const { subject } = useI18n();
  return (
    <ul className="flex flex-col gap-1">
      {people.map((p) => {
        const on = selected.includes(p.id);
        return (
          <li key={p.id}>
            <button
              type="button"
              role="checkbox"
              aria-checked={on}
              onClick={() => onToggle(p.id)}
              className={cx(
                "flex w-full items-center gap-3 rounded-2xl p-2 text-left transition",
                on ? "bg-[#fff0f4] ring-1 ring-[#ff3d7f]/30" : "hover:bg-zinc-50",
                FOCUS,
              )}
            >
              <Avatar person={p} size="md" online={p.online} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">{p.name}</span>
                <span className={cx("block truncate text-xs", MUTED)}>{subject(p.major)}</span>
              </span>
              <span
                className={cx("grid size-6 shrink-0 place-items-center rounded-full transition", on ? "uc-grad text-white" : "ring-2 ring-zinc-200")}
              >
                {on && <Check className="size-3.5" strokeWidth={3.5} />}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function CreateGroupSheet({ withId, onClose }) {
  const app = useApp();
  const { t, subject } = useI18n();
  const me = app.me;
  const [emoji, setEmoji] = useState(GROUP_EMOJIS[0]);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [audience, setAudience] = useState("all");
  const [invited, setInvited] = useState(withId ? [withId] : []);
  const [submitted, setSubmitted] = useState(false);
  const friends = app.students.filter((s) => app.rels[s.id] === "connected" || s.id === withId);
  const submit = () => {
    setSubmitted(true);
    if (!name.trim()) return;
    app.createGroup({ emoji, name: name.trim(), about: about.trim(), audience: audience === "major" ? me.major : null, invited });
    onClose();
  };
  return (
    <Sheet
      onClose={onClose}
      title={t("cgTitle")}
      wide
      z="z-[55]"
      footer={
        <button type="button" onClick={submit} className={cx(btn.grad, btn.lg, "w-full")}>
          {t("cgCreate")}
        </button>
      }
    >
      <div className="flex flex-col gap-6 px-5 pb-6 pt-2">
        <div>
          <p className={LABEL}>{t("cgVibe")}</p>
          <div className="uc-noscroll -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {GROUP_EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                aria-pressed={emoji === e}
                className={cx(
                  "grid size-12 shrink-0 place-items-center rounded-2xl text-2xl transition active:scale-90",
                  emoji === e ? "uc-grad shadow-lg" : "bg-zinc-50 ring-1 ring-black/[0.06]",
                  FOCUS,
                )}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="uc-cg-name" className={LABEL}>
            {t("cgName")}
          </label>
          <input
            id="uc-cg-name"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("cgNamePh", { subject: subject(me.major) })}
            className={cx(INPUT, submitted && !name.trim() && "ring-rose-300")}
          />
          {submitted && !name.trim() && <p className="mt-1.5 text-sm text-rose-600">{t("errName")}</p>}
        </div>
        <div>
          <label htmlFor="uc-cg-about" className={LABEL}>
            {t("cgAbout")}
          </label>
          <input
            id="uc-cg-about"
            value={about}
            maxLength={80}
            onChange={(e) => setAbout(e.target.value)}
            placeholder={t("cgAboutPh")}
            className={INPUT}
          />
        </div>
        <div>
          <p className={LABEL}>{t("whoCanJoin")}</p>
          <AudienceToggle value={audience} onChange={setAudience} subject={subject(me.major)} />
        </div>
        <div>
          <p className={LABEL}>
            {t("cgInvite")}
            {invited.length > 0 && <span className="ml-1.5 text-[#e11d63]">· {invited.length}</span>}
          </p>
          {friends.length ? (
            <FriendPicker people={friends} selected={invited} onToggle={(id) => setInvited((list) => toggleIn(list, id))} />
          ) : (
            <p className={cx("text-sm", MUTED)}>{t("noFriends")}</p>
          )}
        </div>
      </div>
    </Sheet>
  );
}

function InviteSheet({ groupId, onClose }) {
  const app = useApp();
  const { t, tx } = useI18n();
  const group = app.groups.find((g) => g.id === groupId);
  const [selected, setSelected] = useState([]);
  const candidates = app.students.filter((s) => app.rels[s.id] === "connected" && !group.members.includes(s.id) && !group.invited?.includes(s.id));
  return (
    <Sheet
      onClose={onClose}
      title={t("inviteTitle", { name: tx(group.name) })}
      footer={
        candidates.length > 0 && (
          <button
            type="button"
            disabled={!selected.length}
            onClick={() => {
              app.inviteToGroup(groupId, selected);
              onClose();
            }}
            className={cx(btn.grad, btn.lg, "w-full")}
          >
            {t("sendInvites", { n: selected.length })}
          </button>
        )
      }
    >
      <div className="px-5 pb-5 pt-2">
        {candidates.length ? (
          <FriendPicker people={candidates} selected={selected} onToggle={(id) => setSelected((list) => toggleIn(list, id))} />
        ) : (
          <EmptyState emoji="🙌" title={t("allInGroup")} />
        )}
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Chats
 * ──────────────────────────────────────────────────────────────────────────── */

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    mq.addEventListener("change", update);
    update();
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Escape closes, and the page behind stops scrolling while the overlay is open.
function useOverlay(onClose) {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && latest.current();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, []);
}

const lastTs = (thread) => thread.messages.at(-1)?.ts ?? 0;

// Pull down at the top of a list to reload it. The page keeps its normal iOS bounce; the spinner grows with the pull.
const PULL_TRIGGER = 56;
function usePullToRefresh(atTop, onRefresh) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const from = useRef(null);
  const current = useRef(0);
  const latest = useRef({ atTop, onRefresh });
  useEffect(() => {
    latest.current = { atTop, onRefresh };
  });
  const move = (distance) => {
    if (distance >= PULL_TRIGGER && current.current < PULL_TRIGGER) tap(); // like iOS: a tick when letting go would reload
    current.current = distance;
    setPull(distance);
  };
  const bind = {
    onTouchStart: (e) => {
      from.current = e.touches.length === 1 && !busy && latest.current.atTop() ? e.touches[0].clientY : null;
    },
    onTouchMove: (e) => {
      if (from.current == null) return;
      const dy = e.touches[0].clientY - from.current;
      move(dy > 0 ? Math.min(dy * 0.5, 90) : 0);
    },
    onTouchEnd: () => {
      if (from.current == null) return;
      from.current = null;
      const reached = current.current >= PULL_TRIGGER;
      move(0);
      if (!reached) return;
      setBusy(true);
      Promise.resolve(latest.current.onRefresh()).finally(() => setTimeout(() => setBusy(false), 400));
    },
    onTouchCancel: () => {
      from.current = null;
      move(0);
    },
  };
  return { pull, busy, bind };
}

function PullIndicator({ pull, busy }) {
  const { t } = useI18n();
  return (
    <div
      className="flex items-end justify-center overflow-hidden"
      style={{ height: busy ? 44 : pull, transition: pull ? "none" : "height .25s ease" }}
      role={busy ? "status" : undefined}
      aria-label={busy ? t("refreshing") : undefined}
    >
      {(busy || pull > 8) && (
        <span
          className="mb-2 grid size-8 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.06]"
          style={{ opacity: busy ? 1 : Math.min(1, pull / 40) }}
        >
          {busy ? (
            <LoaderCircle className="size-4 animate-spin text-zinc-500" aria-hidden="true" />
          ) : (
            <ArrowDown
              className="size-4 text-zinc-500 transition-transform"
              style={{ transform: pull >= PULL_TRIGGER ? "rotate(180deg)" : "none" }}
              aria-hidden="true"
            />
          )}
        </span>
      )}
    </div>
  );
}

// Drag a screen with your finger from the left edge: it follows the finger, and letting go past a third of the width (or with a flick) closes it.
function useSwipeBack(ref, onClose) {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let drag = null;
    const settle = (x) => {
      el.style.transition = "transform .26s cubic-bezier(.22,1,.36,1)";
      el.style.transform = `translateX(${x}px)`;
    };
    const start = (e) => {
      const touch = e.touches[0];
      drag = e.touches.length === 1 && touch.clientX <= 32 ? { x: touch.clientX, y: touch.clientY, at: performance.now(), dx: 0, live: false } : null;
      if (drag) e.stopPropagation(); // the app-wide edge swipe stays out of it
    };
    const move = (e) => {
      if (!drag) return;
      const dx = e.touches[0].clientX - drag.x;
      const dy = e.touches[0].clientY - drag.y;
      if (!drag.live) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) drag = null;
        else if (dx > 8) {
          drag.live = true;
          el.style.animation = "none";
          el.style.transition = "none";
        }
        if (!drag?.live) return;
      }
      drag.dx = Math.max(0, dx);
      el.style.transform = `translateX(${drag.dx}px)`;
      e.preventDefault();
    };
    const end = (e) => {
      const done = drag;
      drag = null;
      if (!done?.live) return;
      const speed = done.dx / Math.max(1, performance.now() - done.at);
      if (e.type === "touchend" && (done.dx > el.offsetWidth * 0.35 || speed > 0.6)) {
        tap();
        settle(el.offsetWidth);
        setTimeout(() => latest.current(), 220);
      } else settle(0);
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [ref]);
}

// Drag a sheet down to close it, as on iOS: once its content is scrolled to the top it follows the finger, and letting go
// past a quarter of its height (or with a flick) closes it. Sideways swipes (photo galleries) and scrolling are left alone.
function useSwipeDown(panelRef, scrollerRef, backdropRef, onClose) {
  const latest = useRef(onClose);
  useEffect(() => {
    latest.current = onClose;
  });
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    let drag = null;
    const root = document.documentElement;
    const place = (y, animate) => {
      const backdrop = backdropRef.current;
      const progress = Math.min(1, y / Math.max(1, panel.offsetHeight));
      panel.style.transition = animate ? "transform .28s cubic-bezier(.22,1,.36,1)" : "none";
      panel.style.transform = y ? `translateY(${y}px)` : "";
      if (backdrop) {
        backdrop.style.transition = animate ? "opacity .28s ease" : "none";
        backdrop.style.opacity = String(1 - progress);
      }
      // The page behind (useCardStack) grows back as the sheet goes down.
      root.classList.toggle("uc-dragging", !animate);
      root.style.setProperty("--uc-drag", String(progress));
    };
    const start = (e) => {
      const touch = e.touches[0];
      drag = e.touches.length === 1 ? { x: touch.clientX, y: touch.clientY, at: performance.now(), dy: 0, live: false } : null;
    };
    const move = (e) => {
      if (!drag) return;
      const dx = e.touches[0].clientX - drag.x;
      const dy = e.touches[0].clientY - drag.y;
      if (!drag.live) {
        if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
        const scroller = scrollerRef.current;
        const atTop = !scroller || !scroller.contains(e.target) || scroller.scrollTop <= 0;
        // Decide on the first clear movement, before iOS starts scrolling: only a downward pull at the top moves the sheet.
        if (!atTop || dy <= 0 || Math.abs(dx) >= dy) {
          drag = null;
          return;
        }
        drag.live = true;
        panel.style.animation = "none";
        if (backdropRef.current) backdropRef.current.style.animation = "none";
      }
      drag.dy = Math.max(0, dy);
      place(drag.dy, false);
      e.preventDefault();
    };
    const end = (e) => {
      const done = drag;
      drag = null;
      if (!done?.live) return;
      const speed = done.dy / Math.max(1, performance.now() - done.at);
      if (e.type === "touchend" && (done.dy > panel.offsetHeight * 0.25 || (speed > 0.6 && done.dy > 40))) {
        tap();
        place(panel.offsetHeight + 40, true);
        setTimeout(() => latest.current(), 240);
      } else place(0, true);
    };
    panel.addEventListener("touchstart", start, { passive: true });
    panel.addEventListener("touchmove", move, { passive: false });
    panel.addEventListener("touchend", end);
    panel.addEventListener("touchcancel", end);
    return () => {
      panel.removeEventListener("touchstart", start);
      panel.removeEventListener("touchmove", move);
      panel.removeEventListener("touchend", end);
      panel.removeEventListener("touchcancel", end);
    };
  }, [panelRef, scrollerRef, backdropRef]);
}

// iOS card stack: while a sheet is open on a phone, the page behind shrinks back into a rounded card (styles in
// src/index.css). The page is pinned first, so it keeps its scroll position and its sticky top bar.
const cardStack = { open: 0, y: 0, timer: null };
function useCardStack() {
  useEffect(() => {
    const stage = document.querySelector(".uc-stage");
    if (!stage || window.innerWidth >= 640) return undefined;
    const root = document.documentElement;
    if (cardStack.open++ === 0) {
      if (cardStack.timer) {
        // Another sheet opens while the last one is still closing: the page is still pinned.
        clearTimeout(cardStack.timer);
        cardStack.timer = null;
      } else {
        cardStack.y = window.scrollY;
        stage.classList.add("uc-stage-fixed");
        stage.scrollTop = cardStack.y;
      }
      root.style.setProperty("--uc-drag", "0");
      requestAnimationFrame(() => root.classList.add("uc-sheet-open"));
    }
    return () => {
      if (--cardStack.open > 0) return;
      root.classList.remove("uc-sheet-open", "uc-dragging");
      cardStack.timer = setTimeout(() => {
        cardStack.timer = null;
        stage.classList.remove("uc-stage-fixed");
        window.scrollTo(0, cardStack.y);
        root.style.setProperty("--uc-drag", "0");
      }, 450);
    };
  }, []);
}

function messagePreview(m, thread, app, t, tx) {
  if (m.from === "sys") return t(m.key, m.vars);
  if (m.from === ME) return `${t("you")}: ${tx(m.text)}`;
  return thread.kind === "group" ? `${firstName(app.person(m.from).name)}: ${tx(m.text)}` : tx(m.text);
}

function ChatsView() {
  const app = useApp();
  const { t } = useI18n();
  const wide = useMediaQuery("(min-width: 1024px)");
  const threads = Object.values(app.threads)
    .filter((th) => th.messages.length && (th.kind === "group" || !app.blocked[th.with]))
    .sort((a, b) => lastTs(b) - lastTs(a));
  const online = app.students.filter((s) => app.rels[s.id] === "connected" && s.online);
  const active = wide ? (threads.some((th) => th.id === app.activeThread) ? app.activeThread : threads[0]?.id) : null;
  return (
    <div className="lg:grid lg:h-[calc(100dvh_-_7.5rem_-_env(safe-area-inset-top,0px))] lg:min-h-[520px] lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-5">
      <div className="flex min-h-0 flex-col">
        <PageTitle title={t("chatsTitle")} />
        {online.length > 0 && (
          <div className="uc-noscroll -mx-4 mb-3 flex gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
            {online.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => app.openChat(s.id)}
                className={cx("flex w-16 shrink-0 flex-col items-center gap-1 rounded-2xl", FOCUS)}
              >
                <Avatar person={s} size="lg" online />
                <span className="w-full truncate text-center text-[11px] font-semibold text-zinc-600">{firstName(s.name)}</span>
              </button>
            ))}
          </div>
        )}
        {threads.length ? (
          <ul className="flex min-h-0 flex-col gap-0.5 lg:-mx-1 lg:overflow-y-auto lg:px-1">
            {threads.map((th) => (
              <ThreadRow
                key={th.id}
                thread={th}
                active={th.id === active}
                onOpen={() => (wide ? app.setActiveThread(th.id) : app.openThread(th.id))}
              />
            ))}
          </ul>
        ) : (
          <EmptyState emoji="💬" title={t("noChats")} />
        )}
      </div>
      {wide && (
        <div className={cx(CARD, "flex min-h-0 overflow-hidden")}>
          {active ? <ChatThread key={active} threadId={active} /> : <EmptyState emoji="💬" title={t("pickChat")} />}
        </div>
      )}
    </div>
  );
}

function ThreadRow({ thread, active, onOpen }) {
  const app = useApp();
  const { t, tx } = useI18n();
  const last = thread.messages.at(-1);
  const typingId = app.typing[thread.id];
  const group = thread.kind === "group" ? app.groups.find((g) => g.id === thread.group) : null;
  const other = group ? null : app.person(thread.with);
  const preview = typingId ? t("typing", { name: firstName(app.person(typingId).name) }) : last ? messagePreview(last, thread, app, t, tx) : "";
  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        aria-current={active ? "true" : undefined}
        className={cx(
          "flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition",
          active ? "bg-white shadow-sm ring-1 ring-black/[0.05]" : "hover:bg-white/80",
          FOCUS,
        )}
      >
        {group ? <GroupThumb group={group} className="size-14" /> : <Avatar person={other} size="lg" online={other.online} />}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className={cx("min-w-0 truncate text-[15px]", thread.unread ? "font-extrabold" : "font-semibold")}>
              {group ? tx(group.name) : other.name}
            </span>
            {last && <span className="shrink-0 text-[11px] text-zinc-400">{fmtAgo(last.ts, app.now, t)}</span>}
          </span>
          <span className="mt-0.5 flex items-center gap-2">
            <span
              className={cx(
                "min-w-0 flex-1 truncate text-[13px]",
                typingId ? "font-semibold text-[#e11d63]" : thread.unread ? "font-semibold text-zinc-900" : MUTED,
              )}
            >
              {preview}
            </span>
            {thread.unread > 0 && <span className="uc-grad size-2.5 shrink-0 rounded-full" aria-label={t("unread")} />}
          </span>
        </span>
      </button>
    </li>
  );
}

function ChatThread({ threadId, onBack }) {
  const app = useApp();
  const { t, tx, lang, subject } = useI18n();
  const thread = app.threads[threadId];
  const [text, setText] = useState("");
  const listRef = useRef(null);
  const typingId = app.typing[threadId];
  const count = thread.messages.length;
  const { markRead, watch } = app;
  const refresh = usePullToRefresh(() => (listRef.current?.scrollTop ?? 1) <= 0, app.refreshAll);

  useEffect(() => watch(threadId), [threadId, watch]);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count, typingId]);
  // Keep the newest messages in view while the list gets shorter, e.g. as the keyboard slides up: if the list showed the
  // end before this resize, it shows the end after it. (Measured against the previous height, not scroll events, which
  // arrive a frame late during the slide.)
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    let lastHeight = el.clientHeight;
    const resized = new ResizeObserver(() => {
      const wasAtEnd = el.scrollHeight - el.scrollTop - lastHeight < 40;
      lastHeight = el.clientHeight;
      if (wasAtEnd) el.scrollTop = el.scrollHeight;
    });
    resized.observe(el);
    return () => resized.disconnect();
  }, []);
  useEffect(() => {
    if (thread.unread) markRead(threadId);
  }, [thread.unread, threadId, markRead]);

  const group = thread.kind === "group" ? app.groups.find((g) => g.id === thread.group) : null;
  const other = group ? null : app.person(thread.with);
  const typer = typingId ? app.person(typingId) : null;
  const send = (value) => {
    const message = (value ?? text).trim();
    if (!message) return;
    tap();
    app.sendMessage(threadId, message);
    if (value == null) setText("");
  };
  const subtitle = typer
    ? t("typing", { name: firstName(typer.name) })
    : group
      ? t("members", { n: group.members.length + (group.extra ?? 0) })
      : other.online
        ? t("activeNow")
        : t("activeAgo", { ago: fmtAgo(other.lastActive, app.now, t) });

  return (
    <section className="flex h-full min-h-0 w-full flex-col bg-white">
      <header
        className="flex items-center gap-1.5 border-b border-black/[0.05] px-2.5 pb-2.5"
        style={{ paddingTop: "max(0.625rem, env(safe-area-inset-top, 0px))" }}
      >
        {onBack && (
          <IconButton label={t("back")} onClick={onBack}>
            <ArrowLeft className="size-5" />
          </IconButton>
        )}
        <button
          type="button"
          onClick={() => other && app.openProfile(other.id)}
          className={cx("flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl p-1 text-left", other && "hover:bg-zinc-50", FOCUS)}
        >
          {group ? <GroupThumb group={group} /> : <Avatar person={other} size="md" online={other.online} />}
          <span className="min-w-0">
            <span className="block truncate font-extrabold leading-tight">{group ? tx(group.name) : other.name}</span>
            <span className={cx("block truncate text-xs", typer ? "font-semibold text-[#e11d63]" : MUTED)}>{subtitle}</span>
          </span>
        </button>
        {other && (
          <IconButton label={t("report")} onClick={() => app.openOverlay({ type: "report", person: other.id })}>
            <Flag className="size-[18px]" />
          </IconButton>
        )}
      </header>

      <div ref={listRef} {...refresh.bind} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <PullIndicator pull={refresh.pull} busy={refresh.busy} />
        {other && (
          <div className="mb-6 flex flex-col items-center text-center">
            <Avatar person={other} size="2xl" ring />
            <p className="mt-3 text-lg font-extrabold">{other.name}</p>
            <p className={cx("text-sm", MUTED)}>
              {subject(other.major)} · {app.me.uni.short}
            </p>
            {app.rels[other.id] !== "connected" && <ConnectButton id={other.id} onPhoto={false} className="mt-3" />}
          </div>
        )}
        <ol className="flex flex-col gap-1">
          {thread.messages.map((m, i) => {
            if (app.blocked[m.from]) return null;
            if (m.from === "sys") {
              return (
                <li key={m.id} className="my-2 self-center rounded-full bg-zinc-100 px-3 py-1 text-center text-xs font-semibold text-zinc-500">
                  {t(m.key, m.vars)}
                </li>
              );
            }
            const mine = m.from === ME;
            const body = tx(m.text);
            const prev = thread.messages[i - 1];
            const next = thread.messages[i + 1];
            const first = !prev || prev.from !== m.from;
            const lastOfRun = !next || next.from !== m.from;
            const sender = app.person(m.from);
            return (
              <li key={m.id} className={cx("flex items-end gap-2", mine ? "justify-end" : "justify-start", first && i > 0 && "mt-2.5")}>
                {!mine && (lastOfRun ? <Avatar person={sender} size="xs" /> : <span className="w-6 shrink-0" aria-hidden="true" />)}
                <div className={cx("flex max-w-[76%] flex-col", mine ? "items-end" : "items-start")}>
                  {group && !mine && first && <span className="mb-0.5 ml-3 text-[11px] font-semibold text-zinc-400">{firstName(sender.name)}</span>}
                  {isEmojiOnly(body) ? (
                    <span className="uc-pop text-4xl leading-tight">{body}</span>
                  ) : (
                    <span
                      className={cx(
                        "whitespace-pre-wrap break-words rounded-[20px] px-3.5 py-2 text-[15px] leading-snug",
                        mine ? "uc-grad text-white" : "bg-zinc-100 text-zinc-900",
                      )}
                    >
                      {body}
                    </span>
                  )}
                  {lastOfRun && <span className="mt-1 px-1 text-[10px] text-zinc-400">{fmtTime(m.ts, lang)}</span>}
                </div>
              </li>
            );
          })}
          {typer && (
            <li className="mt-2.5 flex items-end gap-2">
              <Avatar person={typer} size="xs" />
              <span className="flex gap-1 rounded-[20px] bg-zinc-100 px-3.5 py-3" aria-label={t("typing", { name: firstName(typer.name) })}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="uc-dot size-1.5 rounded-full bg-zinc-400" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </span>
            </li>
          )}
        </ol>
      </div>

      <div
        className="border-t border-black/[0.05] px-3 pt-2.5"
        style={{ paddingBottom: "max(0.75rem, calc(env(safe-area-inset-bottom, 0px) - var(--uc-kb)))" }}
      >
        <div className="uc-noscroll -mx-3 mb-2 flex gap-1.5 overflow-x-auto px-3">
          {QUICK_REPLIES[lang].map((reply) => (
            <button key={reply} type="button" onClick={() => send(reply)} className={cx(PILL, PILL_OFF, "py-1.5")}>
              {reply}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor={`uc-msg-${threadId}`} className="sr-only">
            {t("messagePh")}
          </label>
          <input
            id={`uc-msg-${threadId}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("messagePh")}
            autoComplete="off"
            maxLength={500}
            className="min-w-0 flex-1 rounded-full bg-zinc-100 px-4 py-2.5 text-base outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-2 focus:ring-[#ff3d7f]/40"
          />
          <button type="submit" disabled={!text.trim()} aria-label={t("send")} title={t("send")} className={cx(btn.grad, "size-11 shrink-0")}>
            <SendHorizontal className="size-5" />
          </button>
        </form>
      </div>
    </section>
  );
}

function ChatDrawer({ threadId, onClose }) {
  const { t } = useI18n();
  const panel = useRef(null);
  useOverlay(onClose);
  useSwipeBack(panel, onClose);
  return (
    <div role="dialog" aria-modal="true" aria-label={t("chatsTitle")} className="fixed inset-0 z-[45]">
      <div className="uc-fade absolute inset-0 hidden bg-zinc-950/30 sm:block" onClick={onClose} />
      <div ref={panel} className="uc-drawer uc-kb-pad absolute inset-0 flex bg-white sm:left-auto sm:w-[420px] sm:shadow-2xl">
        <ChatThread threadId={threadId} onBack={onClose} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * App shell
 * ──────────────────────────────────────────────────────────────────────────── */

const NAV = [
  { id: "start", icon: House, label: "navStart" },
  { id: "spontan", icon: Sparkles, label: "navSpontan" },
  { id: "groups", icon: Users, label: "navGroups" },
  { id: "chats", icon: MessageCircle, label: "navChats" },
];

// Page scroll position, rounded to whether it is past a few thresholds (cheap to re-render on scroll).
function useScrollState() {
  const [state, setState] = useState({ y: 0, down: false });
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setState({ y: y > 72 ? 2 : y > 6 ? 1 : 0, down: y > last && y > 72 });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return state;
}

const TAB_TITLES = { spontan: "spontanTitle", groups: "groupsTitle", chats: "chatsTitle" };

function TopBar() {
  const app = useApp();
  const { t, subject } = useI18n();
  const unread = app.notifications.some((n) => !n.read && !app.blocked[n.person]);
  const scroll = useScrollState();
  // Like iOS large titles: once the page title has scrolled away, a small one takes the place of the uni badge.
  const title = scroll.y === 2 && TAB_TITLES[app.tab] ? t(TAB_TITLES[app.tab]) : null;
  return (
    <header className={cx("uc-bar sticky top-0 z-30", scroll.y > 0 && "uc-bar-glass")} style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-2.5 px-4 lg:px-8">
        <span className="lg:hidden">
          <Logo compact />
        </span>
        <span className="relative grid min-w-0">
          <button
            type="button"
            onClick={() => app.openModal({ type: "me" })}
            aria-hidden={title ? "true" : undefined}
            tabIndex={title ? -1 : undefined}
            className={cx(
              "col-start-1 row-start-1 min-w-0 truncate rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-zinc-700 shadow-sm ring-1 ring-black/[0.06] transition duration-300 hover:ring-black/15",
              title && "pointer-events-none -translate-y-1 opacity-0",
              FOCUS,
            )}
          >
            🎓 {app.me.uni.short} · {subject(app.me.major)}
          </button>
          <span
            aria-hidden={title ? undefined : "true"}
            className={cx(
              "col-start-1 row-start-1 self-center truncate text-[17px] font-extrabold tracking-tight transition duration-300",
              title ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0",
            )}
          >
            {title}
          </span>
        </span>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <LangToggle />
          <IconButton label={t("notifications")} onClick={() => app.openModal({ type: "notifications" })} className="relative">
            <Heart className="size-[22px]" />
            {unread && <span className="absolute right-2 top-2 size-2.5 animate-pulse rounded-full bg-rose-500 ring-2 ring-[#FAFAFA]" />}
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ badges }) {
  const app = useApp();
  const { t } = useI18n();
  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 hidden w-[88px] flex-col items-center border-r border-black/[0.05] bg-white/70 px-3 backdrop-blur-xl lg:flex xl:w-64 xl:items-stretch"
      style={{ paddingTop: "calc(1.25rem + env(safe-area-inset-top, 0px))", paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="xl:px-2">
        <span className="xl:hidden">
          <LogoMark className="size-10" />
        </span>
        <span className="hidden xl:inline-flex">
          <Logo />
        </span>
      </div>
      <nav className="mt-10 flex flex-col gap-1.5" aria-label="ConnectUni">
        {NAV.map((item) => {
          const active = app.tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => app.setTab(item.id)}
              aria-current={active ? "page" : undefined}
              title={t(item.label)}
              className={cx(
                "relative flex size-12 items-center justify-center gap-3 rounded-2xl text-[15px] font-bold transition duration-200 xl:h-12 xl:w-full xl:justify-start xl:px-3.5",
                active
                  ? "uc-grad text-white shadow-[0_10px_24px_-10px_rgba(255,61,127,0.8)]"
                  : "text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-900",
                FOCUS,
              )}
            >
              <item.icon className="size-[22px] shrink-0" strokeWidth={active ? 2.4 : 2} />
              <span className="hidden xl:inline">{t(item.label)}</span>
              {badges[item.id] > 0 && (
                <span className="uc-tnum absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-white xl:static xl:ml-auto">
                  {badges[item.id]}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => app.openModal({ type: "hangout" })}
        title={t("newHangout")}
        className={cx(btn.grad, "mt-6 size-12 xl:h-12 xl:w-full")}
      >
        <Plus className="size-5" strokeWidth={3} />
        <span className="hidden xl:inline">{t("newHangout")}</span>
      </button>
      <button
        type="button"
        onClick={() => app.openModal({ type: "me" })}
        className={cx("mt-auto flex items-center gap-3 rounded-2xl p-1.5 text-left transition hover:bg-black/[0.04]", FOCUS)}
      >
        <Avatar person={app.me} size="md" ring={!!app.me.status} />
        <span className="hidden min-w-0 xl:block">
          <span className="block truncate text-sm font-bold">{app.me.name}</span>
          <span className={cx("block truncate text-xs", MUTED)}>{t("myProfile")}</span>
        </span>
      </button>
    </aside>
  );
}

// iOS 26 tab bar: a glass capsule floating above the home indicator, a lens that slides to the active tab, and a
// smaller bar without labels while you scroll down (styles in src/index.css).
function BottomNav({ badges }) {
  const app = useApp();
  const { t } = useI18n();
  const scroll = useScrollState();
  const index = NAV.findIndex((item) => item.id === app.tab);
  return (
    <nav
      aria-label="ConnectUni"
      className="pointer-events-none fixed inset-x-0 z-30 flex justify-center px-4 lg:hidden"
      style={{ bottom: "max(0.75rem, calc(env(safe-area-inset-bottom, 0px) - 0.5rem))" }}
    >
      <div
        className={cx("uc-liquid uc-tabbar pointer-events-auto relative grid grid-cols-4 rounded-full p-1", scroll.down && "uc-tabbar-compact")}
        style={{ "--i": index }}
      >
        <span className="uc-liquid-lens uc-tablens absolute rounded-full" aria-hidden="true" />
        {NAV.map((item) => {
          const active = app.tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (!active) tap();
                app.setTab(item.id);
              }}
              aria-current={active ? "page" : undefined}
              aria-label={t(item.label)}
              className={cx(
                "relative z-10 flex flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-300",
                active ? "text-[#e11d63]" : "text-zinc-500",
                FOCUS,
              )}
            >
              <item.icon className="size-[22px]" strokeWidth={active ? 2.4 : 2} />
              <span className="uc-tablabel overflow-hidden text-[10px] font-bold leading-[14px]">{t(item.label)}</span>
              {badges[item.id] > 0 && (
                <span className="uc-tnum absolute right-[18%] top-1 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {badges[item.id]}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function NotificationsSheet({ onClose }) {
  const app = useApp();
  const { t, tx } = useI18n();
  const close = () => {
    app.markAllRead();
    onClose();
  };
  const describe = (n) => {
    const p = n.person ? app.person(n.person) : null;
    const name = p ? firstName(p.name) : "";
    const group = n.groupId ? tx(app.groups.find((g) => g.id === n.groupId)?.name) : "";
    const open = {
      wave: () => app.openProfile(n.person),
      match: () => app.openChat(n.person),
      message: () => app.openThread(n.threadId),
      hangout: () => app.setTab("spontan"),
      accepted: () => app.setTab("spontan"),
      group: () => app.openGroupChat(n.groupId),
      invite: () => app.setTab("groups"),
      welcome: () => app.setTab("start"),
    }[n.kind];
    return { p, text: t(`n_${n.kind}`, { name, group, text: n.text, me: firstName(app.me.name) }), open };
  };
  return (
    <Sheet onClose={close} title={t("notifications")}>
      {app.notifications.length ? (
        <ul className="flex flex-col gap-1 px-3 pb-4 pt-1">
          {app.notifications
            .filter((n) => !app.blocked[n.person])
            .map((n) => {
              const { p, text, open } = describe(n);
              return (
                <li key={n.id} className={cx("flex items-center gap-3 rounded-2xl p-2.5 transition", !n.read && "bg-[#fff4f7]")}>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      open();
                    }}
                    className={cx("flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left", FOCUS)}
                  >
                    {p ? <Avatar person={p} size="lg" ring={n.kind === "wave"} /> : <LogoMark className="size-14" />}
                    <span className="min-w-0 flex-1">
                      <span className={cx("block text-sm leading-snug", !n.read ? "font-bold" : "font-medium")}>{text}</span>
                      <span className="mt-0.5 block text-xs text-zinc-400">{fmtAgo(n.ts, app.now, t)}</span>
                    </span>
                  </button>
                  {n.kind === "wave" && app.rels[n.person] === "incoming" && (
                    <button
                      type="button"
                      onClick={(e) => app.connect(n.person, e.currentTarget.getBoundingClientRect())}
                      className={cx(btn.grad, btn.sm, "shrink-0")}
                    >
                      <Hand className="size-4" />
                      {t("waveBack")}
                    </button>
                  )}
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="px-5 pb-6">
          <EmptyState emoji="🌙" title={t("noNotifications")} />
        </div>
      )}
    </Sheet>
  );
}

function MeSheet({ onClose }) {
  const app = useApp();
  const { t, tx, subject } = useI18n();
  const me = app.me;
  const [showAllInterests, setShowAllInterests] = useState(false);
  const fileRef = useRef(null);
  const pickPhoto = () => fileRef.current?.click();
  const blockedList = Object.keys(app.blocked).map(app.person);
  const visibleInterests = showAllInterests
    ? INTERESTS
    : INTERESTS.filter((interest, index) => index < 12 || me.interests.includes(interest.id));
  const hiddenInterestCount = INTERESTS.length - visibleInterests.length;
  return (
    <Sheet onClose={onClose} title={t("myProfile")}>
      <div className="flex flex-col items-center px-5 pt-2 text-center">
        <button
          type="button"
          onClick={pickPhoto}
          aria-label={me.photo ? t("changePhoto") : t("addPhoto")}
          className={cx("relative rounded-full", FOCUS)}
        >
          <Avatar person={me} size="2xl" ring />
          <span className="uc-grad absolute bottom-1 right-1 grid size-9 place-items-center rounded-full text-white ring-4 ring-white">
            <Camera className="size-4" />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) app.setPhoto(file);
          }}
        />
        <button type="button" onClick={pickPhoto} className={cx("mt-2 rounded-full px-2 text-sm font-bold text-[#e11d63] hover:underline", FOCUS)}>
          {me.photo ? t("changePhoto") : t("addPhoto")}
        </button>
        <h3 className="mt-3 text-xl font-extrabold tracking-tight">{me.name}</h3>
        <p className={cx("text-sm", MUTED)}>
          {me.uni.name} · {subject(me.major)}
          {me.minor && ` + ${subject(me.minor)}`} · {t("semShort", { n: me.semester })}
        </p>
        <p className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{t("verifiedVia", { email: me.email })}</span>
        </p>
      </div>
      <div className="px-5 pb-6 pt-6">
        <p className={LABEL}>{t("myStatus")}</p>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => app.setStatus(me.status === st.id ? null : st.id)}
              aria-pressed={me.status === st.id}
              className={cx(PILL, "py-1.5", me.status === st.id ? PILL_ON : PILL_OFF)}
            >
              {st.emoji} {tx(st)}
            </button>
          ))}
        </div>
        <p className={cx(LABEL, "mt-6")}>{t("myInterests")}</p>
        <div id="profile-interests" className="flex flex-wrap gap-1.5">
          {visibleInterests.map((i) => {
            const on = me.interests.includes(i.id);
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => app.updateMe({ interests: on ? me.interests.filter((x) => x !== i.id) : [...me.interests, i.id] })}
                aria-pressed={on}
                className={cx(PILL, "py-1.5", on ? PILL_ON : PILL_OFF)}
              >
                {i.emoji} {tx(i)}
              </button>
            );
          })}
        </div>
        {(showAllInterests || hiddenInterestCount > 0) && (
          <button
            type="button"
            aria-controls="profile-interests"
            aria-expanded={showAllInterests}
            onClick={() => setShowAllInterests((shown) => !shown)}
            className={cx("mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900", FOCUS)}
          >
            {showAllInterests ? t("seeFewerInterests") : t("seeMoreInterests", { n: hiddenInterestCount })}
            <ChevronDown className={cx("size-3.5 transition", showAllInterests && "rotate-180")} aria-hidden="true" />
          </button>
        )}
        <div className="mt-6 flex items-center justify-between gap-3">
          <p className={cx(LABEL, "mb-0")}>{t("language")}</p>
          <LangToggle />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className={cx(LABEL, "mb-0")}>{t("theme")}</p>
          <ThemeToggle />
        </div>
        <PushRow />
        {blockedList.length > 0 && (
          <>
            <p className={cx(LABEL, "mt-6")}>{t("blockedPeople")}</p>
            <ul className="flex flex-col gap-1.5">
              {blockedList.map((p) => (
                <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-zinc-50 p-2">
                  <Avatar person={p} size="md" />
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">{p.name}</span>
                  <button type="button" onClick={() => app.unblock(p.id)} className={cx(btn.soft, btn.sm)}>
                    {t("unblock")}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        <p className={cx(LABEL, "mt-6")}>{t("legalTitle")}</p>
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.06]">
          {[
            ["terms", FileText],
            ["privacy", ShieldCheck],
            ["imprint", Info],
            ["licenses", Scale],
          ].map(([doc, Icon]) => (
            <button
              key={doc}
              type="button"
              onClick={() => app.openOverlay({ type: "legal", doc })}
              className={cx(
                "flex w-full items-center gap-3 border-b border-black/[0.05] px-4 py-3 text-left text-sm font-semibold transition hover:bg-zinc-50",
                FOCUS,
              )}
            >
              <Icon className="size-4 shrink-0 text-zinc-400" />
              {t(`legal_${doc}`)}
              <ChevronRight className="ml-auto size-4 shrink-0 text-zinc-300" />
            </button>
          ))}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className={cx("flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50", FOCUS)}
          >
            <Mail className="size-4 shrink-0 text-zinc-400" />
            {t("support")}
            <ChevronRight className="ml-auto size-4 shrink-0 text-zinc-300" />
          </a>
        </div>
        <button
          type="button"
          onClick={app.logout}
          className={cx(btn.ghost, btn.md, "mt-6 w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700")}
        >
          <LogOut className="size-4" />
          {t("logout")}
        </button>
        <button
          type="button"
          onClick={() => app.openOverlay({ type: "deleteAccount" })}
          className={cx(btn.ghost, btn.md, "mt-1 w-full text-zinc-400 hover:bg-rose-50 hover:text-rose-600")}
        >
          <Trash2 className="size-4" />
          {t("deleteAccount")}
        </button>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Legal & safety
 * ──────────────────────────────────────────────────────────────────────────── */

const REPORT_REASONS = ["fake", "harassment", "inappropriate", "spam", "other"];

const LICENSES = [
  ["React, React DOM, Scheduler", "MIT", "Copyright (c) Meta Platforms, Inc. and affiliates."],
  ["Lucide (lucide-react)", "ISC", "Copyright (c) 2026 Lucide Icons and Contributors"],
  ["Capacitor (Core, iOS, Keyboard)", "MIT", "Copyright (c) 2017-present Drifty Co."],
  ["Tailwind CSS", "MIT", "Copyright (c) Tailwind Labs, Inc."],
  ["Plus Jakarta Sans", "OFL-1.1", "Copyright 2020 The Plus Jakarta Sans Project Authors (https://github.com/tokotype/PlusJakartaSans)"],
  ["Demo photos", "Unsplash", "Photos from unsplash.com, used for the demo profiles only."],
];
const LICENSE_TEXTS = {
  MIT: `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`,
  ISC: `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  "OFL-1.1":
    "This Font Software is licensed under the SIL Open Font License, Version 1.1. This license is available with a FAQ at: https://openfontlicense.org",
  Unsplash: "Unsplash License: https://unsplash.com/license",
};

function LegalSheet({ doc, onClose }) {
  const { t, lang } = useI18n();
  return (
    <Sheet onClose={onClose} title={t(`legal_${doc}`)} z="z-[56]">
      <div className={cx("px-5 pb-6 pt-1 leading-relaxed text-zinc-600", doc === "imprint" ? "text-xs" : "text-sm")}>
        {doc === "licenses" ? (
          <>
            <ul className="space-y-3">
              {LICENSES.map(([name, license, notice]) => (
                <li key={name}>
                  <p className="font-bold text-zinc-900">{name}</p>
                  <p className="text-xs">
                    {license} · {notice}
                  </p>
                </li>
              ))}
            </ul>
            {Object.entries(LICENSE_TEXTS).map(([name, text]) => (
              <details key={name} className="mt-3 rounded-2xl bg-zinc-50 px-3 py-2">
                <summary className="cursor-pointer text-xs font-bold text-zinc-700">{name}</summary>
                <p className="mt-2 whitespace-pre-line text-xs">{text}</p>
              </details>
            ))}
          </>
        ) : (
          <>
            {LEGAL[doc][lang].map(([heading, body]) => (
              <section key={heading} className="mt-5 first:mt-1">
                <h3 className="font-bold text-zinc-900">{heading}</h3>
                <p className="mt-1 whitespace-pre-line">{body}</p>
              </section>
            ))}
          </>
        )}
      </div>
    </Sheet>
  );
}

function ReportSheet({ id, onClose }) {
  const app = useApp();
  const { t } = useI18n();
  const name = firstName(app.person(id).name);
  const [reason, setReason] = useState(null);
  const [note, setNote] = useState("");
  const [alsoBlock, setAlsoBlock] = useState(true);
  return (
    <Sheet
      onClose={onClose}
      title={t("reportTitle", { name })}
      z="z-[56]"
      footer={
        <button
          type="button"
          disabled={!reason}
          onClick={() => {
            app.report(id, reason, note.trim(), alsoBlock);
            onClose();
          }}
          className={cx(btn.dark, btn.lg, "w-full")}
        >
          <Flag className="size-4" />
          {t("reportSend")}
        </button>
      }
    >
      <div className="px-5 pb-5 pt-1">
        <p className={LABEL}>{t("reportWhy")}</p>
        <div role="radiogroup" aria-label={t("reportWhy")} className="flex flex-col gap-1.5">
          {REPORT_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={reason === r}
              onClick={() => setReason(r)}
              className={cx(
                "flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition",
                reason === r ? "bg-zinc-900 text-white" : "bg-zinc-50 ring-1 ring-black/[0.06] hover:bg-zinc-100",
                FOCUS,
              )}
            >
              {t(`reason_${r}`)}
              {reason === r && <Check className="size-4 shrink-0" strokeWidth={3} />}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder={t("reportNotePh")}
          aria-label={t("reportNotePh")}
          className={cx(INPUT, "mt-4 resize-none")}
        />
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold">
          <input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} className="size-5 accent-[#ff3d7f]" />
          {t("reportAlsoBlock", { name })}
        </label>
      </div>
    </Sheet>
  );
}

function DeleteAccountSheet({ onClose }) {
  const app = useApp();
  const { t } = useI18n();
  return (
    <Sheet onClose={onClose} title={t("deleteTitle")} z="z-[56]">
      <div className="px-5 pb-5 pt-1">
        <p className="text-[15px] leading-relaxed text-zinc-600">{t("deleteBody")}</p>
        <button type="button" onClick={app.deleteAccount} className={cx(BTN, btn.lg, "mt-6 w-full bg-rose-600 text-white hover:bg-rose-700")}>
          <Trash2 className="size-4" />
          {t("deleteConfirm")}
        </button>
        <button type="button" onClick={onClose} className={cx(btn.ghost, btn.md, "mt-2 w-full")}>
          {t("cancel")}
        </button>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Main app (state + actions)
 * ──────────────────────────────────────────────────────────────────────────── */

const isWide = () => window.matchMedia("(min-width: 1024px)").matches;
const newId = (prefix) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const BURST = ["✨", "💜", "🎉", "👋", "💖", "⚡"];

// Screen state shared by the demo and the live app: tabs, sheets, toasts and confetti.
function useAppUi() {
  const [toasts, setToasts] = useState([]);
  const [bursts, setBursts] = useState([]);
  const [tab, setTabState] = useState("start");
  const [filter, setFilter] = useState("major");
  const [seen, setSeen] = useState({});
  const [story, setStory] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [modal, setModal] = useState(null);
  const [overlay, setOverlay] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const tabHistory = useRef([]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Timers (toasts, simulated replies) die with the app.
  const timers = useRef(new Set());
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  // Threads currently on screen: incoming messages there are read right away and don't toast.
  const visible = useRef(new Set());
  const watch = useCallback((threadId) => {
    visible.current.add(threadId);
    return () => visible.current.delete(threadId);
  }, []);
  const markSeen = useCallback((id) => setSeen((s) => (s[id] ? s : { ...s, [id]: true })), []);

  const dismissToast = useCallback((id) => setToasts((list) => list.filter((x) => x.id !== id)), []);
  const toast = (item) => {
    const id = newId("t");
    setToasts((list) => [...list.slice(-1), { ...item, id }]);
    later(() => dismissToast(id), item.ms ?? 4200);
  };
  const burst = (rect, emojis = BURST) => {
    if (!rect) return;
    success();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const batch = Array.from({ length: 12 }, (_, i) => ({
      id: newId("b"),
      x,
      y,
      emoji: emojis[i % emojis.length],
      dx: Math.round((Math.random() - 0.5) * 170),
      dy: 80 + Math.round(Math.random() * 120),
      rot: Math.round((Math.random() - 0.5) * 80),
      delay: Math.round(Math.random() * 140),
    }));
    setBursts((list) => [...list, ...batch]);
    later(() => setBursts((list) => list.filter((p) => !batch.includes(p))), 1700);
  };

  const openThread = (threadId) => {
    if (isWide()) {
      setDrawer(null);
      if (tab !== "chats") tabHistory.current.push(tab);
      setTabState("chats");
      setActiveThread(threadId);
    } else setDrawer(threadId);
  };
  const setTab = (id) => {
    if (id !== tab) tabHistory.current.push(tab);
    setTabState(id);
    setDrawer(null);
    window.scrollTo({ top: 0 });
  };
  const goBack = () => {
    if (modal) return setModal(null);
    if (overlay) return setOverlay(null);
    if (story) return setStory(null);
    if (profileId) return setProfileId(null);
    if (drawer) return setDrawer(null);
    if (activeThread) return setActiveThread(null);
    const previous = tabHistory.current.pop();
    if (previous) {
      setTabState(previous);
      setDrawer(null);
      window.scrollTo({ top: 0 });
    } else if (tab !== "start") {
      setTabState("start");
      window.scrollTo({ top: 0 });
    }
  };

  return {
    toasts,
    bursts,
    story,
    setStory,
    profileId,
    setProfileId,
    drawer,
    setDrawer,
    modal,
    setModal,
    overlay,
    setOverlay,
    now,
    later,
    visible,
    toast,
    dismissToast,
    burst,
    openThread,
    // What every app object hands to the screens.
    shared: {
      now,
      seen,
      tab,
      setTab,
      goBack,
      filter,
      setFilter,
      activeThread,
      setActiveThread,
      watch,
      markSeen,
      openThread,
      openProfile: setProfileId,
      openStory: (ids, index) => setStory({ ids, index }),
      openModal: setModal,
      openOverlay: setOverlay,
    },
  };
}

function AppFrame({ app, ui, badges }) {
  const { tab, goBack } = ui.shared;
  const { drawer, profileId, modal, overlay, story } = ui;
  const touchStart = useRef(null);
  // Pull down at the top of any tab (people, hangouts, groups, chats) to reload.
  const refresh = usePullToRefresh(() => window.scrollY <= 0, app.refreshAll);
  // The top bar covers the status bar while the app is shown (src/index.css → html.uc-app).
  useEffect(() => {
    document.documentElement.classList.add("uc-app");
    return () => document.documentElement.classList.remove("uc-app");
  }, []);
  const closeModal = () => ui.setModal(null);
  const closeOverlay = () => ui.setOverlay(null);
  const onTouchStart = (event) => {
    if (event.touches.length !== 1) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = touch.clientX <= 28 ? { x: touch.clientX, y: touch.clientY } : null;
  };
  const onTouchEnd = (event) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    if (touch.clientX - start.x >= 72 && Math.abs(touch.clientY - start.y) < 100) goBack();
  };
  return (
    <AppContext.Provider value={app}>
      <div className="min-h-[100dvh]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
        {/* The page; sheets and overlays stay outside, so only this shrinks back behind a sheet (useCardStack). */}
        <div className="uc-stage min-h-[100dvh] bg-[#FAFAFA]">
          <Sidebar badges={badges} />
          <div className="lg:pl-[88px] xl:pl-64">
            <TopBar />
            <main {...refresh.bind} className="mx-auto max-w-5xl px-4 pb-28 pt-4 lg:px-8 lg:pb-8 lg:pt-6">
              <PullIndicator pull={refresh.pull} busy={refresh.busy} />
              <div key={tab} className="uc-fade">
                {tab === "start" && <PeopleView />}
                {tab === "spontan" && <SpontanView />}
                {tab === "groups" && <GroupsView />}
                {tab === "chats" && <ChatsView />}
              </div>
            </main>
          </div>
          <BottomNav badges={badges} />
        </div>
        {drawer && app.threads[drawer] && <ChatDrawer threadId={drawer} onClose={() => ui.setDrawer(null)} />}
        {profileId && <ProfileSheet id={profileId} onClose={() => ui.setProfileId(null)} />}
        {modal?.type === "hangout" && <CreateHangoutSheet onClose={closeModal} />}
        {modal?.type === "hangoutDetail" && <HangoutDetailSheet id={modal.hangoutId} onClose={closeModal} />}
        {modal?.type === "group" && <CreateGroupSheet withId={modal.with} onClose={closeModal} />}
        {modal?.type === "invite" && <InviteSheet groupId={modal.groupId} onClose={closeModal} />}
        {modal?.type === "invitePerson" && <InvitePersonSheet id={modal.person} onClose={closeModal} />}
        {modal?.type === "status" && <StatusSheet onClose={closeModal} />}
        {modal?.type === "notifications" && <NotificationsSheet onClose={closeModal} />}
        {modal?.type === "me" && <MeSheet onClose={closeModal} />}
        {overlay?.type === "legal" && <LegalSheet doc={overlay.doc} onClose={closeOverlay} />}
        {overlay?.type === "report" && <ReportSheet id={overlay.person} onClose={closeOverlay} />}
        {overlay?.type === "deleteAccount" && <DeleteAccountSheet onClose={closeOverlay} />}
        {story && <StoryViewer ids={story.ids} start={story.index} onClose={() => ui.setStory(null)} />}
        <Toasts toasts={ui.toasts} onDismiss={ui.dismissToast} />
        <Bursts bursts={ui.bursts} />
      </div>
    </AppContext.Provider>
  );
}

function Splash() {
  return (
    <div className="grid min-h-[100dvh] place-items-center">
      <span className="flex flex-col items-center gap-5">
        <LogoMark className="uc-bounce size-16" />
        <LoaderCircle className="size-5 animate-spin text-zinc-400" aria-hidden="true" />
      </span>
    </div>
  );
}

function MainApp({ profile, onLogout, onDeleteAccount }) {
  const { t, tx, lang } = useI18n();
  const [world] = useState(() => buildWorld(profile, Date.now()));
  const students = world.students;
  const [me, setMe] = useState(() => ({ ...profile, id: ME, status: null, online: true, lastActive: Date.now() }));
  const [rels, setRels] = useState(world.rels);
  const [hangouts, setHangouts] = useState(world.hangouts);
  const [groups, setGroups] = useState(world.groups);
  const [threads, setThreads] = useState(world.threads);
  const [typing, setTyping] = useState({});
  const [notifications, setNotifications] = useState(world.notifications);
  const [blocked, setBlocked] = useState({});
  const ui = useAppUi();
  const { later, toast, burst, setDrawer, setProfileId, openThread, visible } = ui;

  const byId = useMemo(() => Object.fromEntries(students.map((s) => [s.id, s])), [students]);
  const visibleStudents = useMemo(() => students.filter((s) => !blocked[s.id]), [students, blocked]);
  const person = (id) => (id === ME ? me : byId[id]);
  const first = (id) => firstName(person(id).name);

  const blockedRef = useRef(blocked);
  useEffect(() => {
    blockedRef.current = blocked;
  });
  const markRead = useCallback(
    (threadId) => setThreads((all) => (all[threadId]?.unread ? { ...all, [threadId]: { ...all[threadId], unread: 0 } } : all)),
    [],
  );
  const notify = (n) => setNotifications((list) => [{ id: newId("n"), ts: Date.now(), read: false, ...n }, ...list]);

  const pushMessage = (threadId, msg, unread = false) =>
    setThreads((all) => {
      const th = all[threadId];
      if (!th) return all;
      return {
        ...all,
        [threadId]: { ...th, messages: [...th.messages, { id: newId("m"), ts: Date.now(), ...msg }], unread: unread ? th.unread + 1 : th.unread },
      };
    });
  const ensureDm = (id) => {
    const threadId = `dm-${id}`;
    setThreads((all) => (all[threadId] ? all : { ...all, [threadId]: { id: threadId, kind: "dm", with: id, unread: 0, messages: [] } }));
    return threadId;
  };
  const ensureGroupThread = (groupId) => {
    const threadId = `grp-${groupId}`;
    setThreads((all) => (all[threadId] ? all : { ...all, [threadId]: { id: threadId, kind: "group", group: groupId, unread: 0, messages: [] } }));
    return threadId;
  };

  const openChat = (id) => {
    setProfileId(null);
    setDrawer(ensureDm(id));
  };
  const openGroupChat = (groupId) => openThread(ensureGroupThread(groupId));

  // Someone types for a moment, then their message lands.
  const receive = (threadId, from, text, delay) => {
    later(() => setTyping((ty) => ({ ...ty, [threadId]: from })), Math.max(300, delay - 1300));
    later(() => {
      setTyping((ty) => {
        const next = { ...ty };
        delete next[threadId];
        return next;
      });
      if (blockedRef.current[from]) return;
      const onScreen = visible.current.has(threadId);
      pushMessage(threadId, { from, text }, !onScreen);
      if (!onScreen) {
        notify({ kind: "message", person: from, threadId, text });
        toast({ people: [from], title: first(from), body: tx(text), action: { label: t("reply"), run: () => openThread(threadId) } });
      }
    }, delay);
  };

  const connect = (id, rect) => {
    if (rels[id] === "connected") return;
    setRels((r) => ({ ...r, [id]: "connected" }));
    burst(rect);
    const threadId = ensureDm(id);
    pushMessage(threadId, { from: "sys", key: "sysConnected", vars: {} });
    setNotifications((list) => list.map((n) => (n.kind === "wave" && n.person === id ? { ...n, read: true } : n)));
    notify({ kind: "match", person: id, read: true });
    toast({
      people: [ME, id],
      title: t("itsAMatch"),
      body: t("matchBody", { name: first(id) }),
      action: { label: t("chatCta"), run: () => openChat(id) },
      ms: 5200,
    });
    receive(threadId, id, MATCH_HELLO, 3200);
  };

  const wave = (id, rect) => {
    burst(rect, ["👋", "✨", "💜", "👋"]);
    const threadId = ensureDm(id);
    pushMessage(threadId, { from: ME, text: "👋" });
    toast({ people: [id], title: t("waveSent", { name: first(id) }) });
    receive(threadId, id, pickReply("👋"), 2600);
  };

  const sendMessage = (threadId, text) => {
    pushMessage(threadId, { from: ME, text });
    const th = threads[threadId];
    if (th.kind === "dm") {
      receive(threadId, th.with, pickReply(text), 1900 + Math.random() * 900);
      return;
    }
    const others = groups.find((g) => g.id === th.group).members.filter((m) => m !== ME);
    if (others.length) receive(threadId, others[Math.floor(Math.random() * others.length)], pickReply(text), 2100 + Math.random() * 900);
  };

  const joinHangout = (id, rect) => {
    const h = hangouts.find((x) => x.id === id);
    const update = (fn) => setHangouts((list) => list.map((x) => (x.id === id ? fn(x) : x)));
    if (h.approval) {
      update((x) => ({ ...x, pending: [...x.pending, ME] }));
      toast({ emoji: "🙋", title: t("requestSent"), body: tx(h.title) });
      later(() => {
        update((x) => ({ ...x, pending: x.pending.filter((p) => p !== ME), attendees: [...x.attendees, ME] }));
        notify({ kind: "accepted", person: h.host });
        toast({ people: [h.host], title: t("n_accepted", { name: first(h.host) }), body: tx(h.title) });
      }, 2800);
      return;
    }
    update((x) => ({ ...x, attendees: [...x.attendees, ME] }));
    burst(rect, ["🙌", "🎉", "✨", HANGOUT_TYPE_BY_ID[h.type].emoji]);
    toast({
      emoji: HANGOUT_TYPE_BY_ID[h.type].emoji,
      title: t("joinedToast"),
      body: `${tx(h.title)} · ${isLive(h, Date.now()) ? t("liveNow") : fmtWhen(h.start, Date.now(), t, lang)}`,
    });
  };

  const createHangout = (data) => {
    const id = newId("h");
    setHangouts((list) => [{ id, host: ME, attendees: [ME], pending: [], ...data }, ...list].sort((a, b) => a.start - b.start));
    toast({ emoji: "🚀", title: t("posted"), body: data.title });
    const pool = students.filter((s) => s.online && (!data.audience || s.major === data.audience || s.minor === data.audience));
    const joiner = pool[Math.floor(Math.random() * pool.length)];
    if (!joiner) return;
    later(() => {
      setHangouts((list) => list.map((x) => (x.id === id && x.attendees.length < x.max ? { ...x, attendees: [...x.attendees, joiner.id] } : x)));
      notify({ kind: "hangout", person: joiner.id });
      toast({ people: [joiner.id], title: t("n_hangout", { name: firstName(joiner.name) }), body: data.title });
    }, 3600);
  };
  const deleteHangout = (id) => {
    setHangouts((list) => list.filter((h) => h.id !== id));
    ui.setModal(null);
    toast({ emoji: "🗑️", title: t("hangoutDeleted") });
  };

  const memberJoins = (groupId, pid, groupName) => {
    setGroups((list) =>
      list.map((g) =>
        g.id === groupId && !g.members.includes(pid)
          ? { ...g, members: [...g.members, pid], invited: (g.invited ?? []).filter((v) => v !== pid) }
          : g,
      ),
    );
    pushMessage(ensureGroupThread(groupId), { from: "sys", key: "sysMemberJoined", vars: { name: first(pid) } });
    notify({ kind: "group", person: pid, groupId });
    toast({ people: [pid], title: t("n_group", { name: first(pid), group: tx(groupName) }) });
  };

  const joinGroup = (id, rect) => {
    const g = groups.find((x) => x.id === id);
    setGroups((list) => list.map((x) => (x.id === id ? { ...x, members: [...x.members, ME] } : x)));
    const threadId = ensureGroupThread(id);
    pushMessage(threadId, { from: "sys", key: "sysJoined", vars: {} });
    burst(rect, ["🎉", "✨", "💜", g.emoji]);
    toast({ emoji: g.emoji, title: t("joinedGroup", { name: tx(g.name) }), action: { label: t("open"), run: () => openGroupChat(id) } });
    const greeter = g.members.find((m) => m !== ME);
    if (greeter) receive(threadId, greeter, { en: "Welcome! 🎉 Glad you're here", de: "Willkommen! 🎉 Schön, dass du da bist" }, 2400);
  };

  const createGroup = ({ emoji, name, about, audience, invited }) => {
    const id = newId("g");
    setGroups((list) => [{ id, emoji, name, about: about || t("cgAboutDefault"), cover: null, members: [ME], invited, extra: 0, audience }, ...list]);
    pushMessage(ensureGroupThread(id), { from: "sys", key: "sysCreated", vars: {} });
    toast({
      emoji,
      title: t("created"),
      body: invited.length ? t("invitesSent", { n: invited.length }) : name,
      action: { label: t("open"), run: () => openGroupChat(id) },
    });
    invited.forEach((pid, i) => later(() => memberJoins(id, pid, name), 2400 + i * 1500));
  };

  const inviteToGroup = (groupId, ids) => {
    const g = groups.find((x) => x.id === groupId);
    setGroups((list) => list.map((x) => (x.id === groupId ? { ...x, invited: [...(x.invited ?? []), ...ids] } : x)));
    toast({ emoji: "💌", title: t("invitesSent", { n: ids.length }), body: tx(g.name) });
    ids.forEach((pid, i) => later(() => memberJoins(groupId, pid, g.name), 2600 + i * 1500));
  };

  const setStatus = (id) => {
    setMe((m) => ({ ...m, status: id }));
    if (id) toast({ emoji: STATUS_BY_ID[id].emoji, title: t("statusSet"), body: tx(STATUS_BY_ID[id]) });
  };

  const unblock = (id) => {
    setBlocked((b) => {
      const next = { ...b };
      delete next[id];
      return next;
    });
    toast({ people: [id], title: t("unblockedToast", { name: first(id) }) });
  };
  const block = (id, quiet = false) => {
    setBlocked((b) => ({ ...b, [id]: true }));
    setRels((r) => {
      const next = { ...r };
      delete next[id];
      return next;
    });
    setProfileId(null);
    setDrawer((d) => (d === `dm-${id}` ? null : d));
    if (!quiet) toast({ people: [id], title: t("blockedToast", { name: first(id) }), action: { label: t("undo"), run: () => unblock(id) } });
  };
  // A real backend files this in the moderation queue; the prototype only confirms it.
  const report = (id, reason, note, alsoBlock) => {
    toast({ emoji: "🛡️", title: t("reportThanks"), body: t("reportThanksBody") });
    if (alsoBlock) block(id, true);
  };
  const deleteAccount = () => {
    if (me.photo?.startsWith("blob:")) URL.revokeObjectURL(me.photo);
    onDeleteAccount();
  };

  const app = {
    ...ui.shared,
    me,
    students: visibleStudents,
    blocked,
    person,
    rels,
    hangouts,
    groups,
    threads,
    typing,
    notifications,
    markRead,
    connect,
    wave,
    sendMessage,
    joinHangout,
    createHangout,
    deleteHangout,
    joinGroup,
    createGroup,
    inviteToGroup,
    openChat,
    openGroupChat,
    setStatus,
    updateMe: (patch) => setMe((m) => ({ ...m, ...patch })),
    setPhoto: (file) => setMe((m) => ({ ...m, photo: URL.createObjectURL(file) })),
    markAllRead: () => setNotifications((list) => (list.some((n) => !n.read) ? list.map((n) => ({ ...n, read: true })) : list)),
    logout: onLogout,
    refreshAll: () => new Promise((resolve) => setTimeout(resolve, 700)),
    deleteAccount,
    block,
    unblock,
    report,
  };
  const badges = { chats: Object.values(threads).reduce((n, th) => n + (th.kind === "dm" && blocked[th.with] ? 0 : th.unread), 0) };
  return <AppFrame app={app} ui={ui} badges={badges} />;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Live app: the same screens on real data from the backend
 * ──────────────────────────────────────────────────────────────────────────── */

const STATUS_MS = 12 * 60 * MIN;
const freshStatus = (status, at, now) => (status && at && now - Date.parse(at) < STATUS_MS ? status : null);

// A profile row from the database in the shape the screens use.
const profileFromRow = (row, email) => ({
  id: row.id,
  name: row.name,
  email,
  birthYear: row.birth_year,
  uni: { id: row.uni_id, name: row.uni_name, short: row.uni_short, city: "" },
  major: row.major,
  minor: row.minor,
  semester: row.semester,
  interests: row.interests ?? [],
  bio: row.bio,
  photo: row.photo_url,
  status: freshStatus(row.status, row.status_at, Date.now()),
});

const NOTIFICATION_KINDS = { wave: "wave", match: "match", hangout: "hangout", group_invite: "invite", group_join: "group" };

// Raw rows → students, connections, hangouts, groups, chats and activity. My own id becomes ME.
function fromDb(db, uid, now) {
  const norm = (id) => (id === uid ? ME : id);
  const year = new Date(now).getFullYear();
  const students = db.profiles
    .filter((p) => p.id !== uid)
    .map((p) => {
      const last = Date.parse(p.last_active);
      return {
        id: p.id,
        name: p.name,
        age: p.birth_year ? year - p.birth_year : null,
        photo: p.photo_url,
        gallery: p.photo_url ? [p.photo_url] : [],
        major: p.major,
        minor: p.minor,
        semester: p.semester,
        interests: p.interests ?? [],
        bio: p.bio ?? "",
        online: now - last < 5 * MIN,
        status: freshStatus(p.status, p.status_at, now),
        ago: Math.max(0, Math.round((now - last) / MIN)),
        lastActive: last,
      };
    });
  const known = new Set(students.map((s) => s.id));
  const sent = new Set(db.waves.filter((w) => w.from_id === uid).map((w) => w.to_id));
  const got = new Set(db.waves.filter((w) => w.to_id === uid).map((w) => w.from_id));
  const rels = {};
  for (const id of new Set([...sent, ...got])) rels[id] = sent.has(id) && got.has(id) ? "connected" : sent.has(id) ? "waved" : "incoming";

  const hangouts = db.hangouts.map((h) => ({
    id: h.id,
    type: h.type,
    title: h.title,
    start: Date.parse(h.starts_at),
    duration: h.duration_minutes ?? DEFAULT_HANGOUT_MINUTES,
    place: h.place,
    max: h.max_people,
    host: norm(h.host_id),
    audience: h.audience,
    pending: [],
    attendees: db.hangoutMembers.filter((m) => m.hangout_id === h.id).map((m) => norm(m.user_id)),
  }));
  const groups = db.groups.map((g) => {
    const rows = db.groupMembers.filter((m) => m.group_id === g.id);
    return {
      id: g.id,
      emoji: g.emoji,
      name: g.name,
      about: g.about ?? "",
      cover: null,
      audience: g.audience,
      extra: 0,
      members: rows.filter((m) => m.status === "member").map((m) => norm(m.user_id)),
      invited: rows.filter((m) => m.status === "invited").map((m) => norm(m.user_id)),
    };
  });

  const threads = {};
  for (const c of db.conversations) {
    const members = db.conversationMembers.filter((m) => m.conversation_id === c.id);
    const other = members.find((m) => m.user_id !== uid)?.user_id;
    if (c.kind === "dm" && !known.has(other)) continue;
    const mine = members.find((m) => m.user_id === uid);
    const lastRead = mine ? Date.parse(mine.last_read_at) : 0;
    const messages = db.messages
      .filter((m) => m.conversation_id === c.id && m.kind === "text")
      .map((m) => ({ id: m.id, from: norm(m.sender_id), text: m.body, ts: Date.parse(m.created_at) }))
      .sort((a, b) => a.ts - b.ts);
    threads[c.id] = {
      id: c.id,
      kind: c.kind,
      with: c.kind === "dm" ? other : undefined,
      group: c.group_id ?? undefined,
      messages,
      unread: messages.filter((m) => m.from !== ME && m.ts > lastRead).length,
    };
  }
  const notifications = db.notifications
    .filter((n) => NOTIFICATION_KINDS[n.kind])
    .map((n) => ({
      id: n.id,
      kind: NOTIFICATION_KINDS[n.kind],
      person: n.actor_id ? norm(n.actor_id) : null,
      groupId: n.ref_id,
      ts: Date.parse(n.created_at),
      read: n.read,
    }));
  const blocked = Object.fromEntries(db.blocks.map((b) => [b.blocked_id, true]));
  return { students, rels, blocked, hangouts, groups, threads, notifications };
}

function LiveApp({ profile, backend, onLogout, onDeleteAccount }) {
  const { t, tx, lang } = useI18n();
  const ui = useAppUi();
  const { toast, burst, setDrawer, setProfileId, openThread, visible } = ui;
  const uid = profile.id;
  const [me, setMe] = useState(() => ({ ...profile, id: ME, online: true, lastActive: Date.now() }));
  const [db, setDb] = useState(null);

  const reload = useCallback(
    () =>
      backend.load().then((next) => {
        setDb(next);
        return next;
      }),
    [backend],
  );
  useEffect(() => {
    reload().catch(() => {});
  }, [reload]);

  // Presence, plus a regular refresh for new people, statuses and who's online.
  useEffect(() => {
    backend.touch(uid);
    const id = setInterval(() => {
      backend.touch(uid);
      reload().catch(() => {});
    }, 60_000);
    return () => clearInterval(id);
  }, [backend, uid, reload]);

  const world = useMemo(() => (db ? fromDb(db, uid, ui.now) : null), [db, uid, ui.now]);
  const byId = useMemo(() => Object.fromEntries((world?.students ?? []).map((s) => [s.id, s])), [world]);
  const person = (id) => (id === ME ? me : (byId[id] ?? { id, name: t("someone"), interests: [], photo: null, gallery: [] }));
  const first = (id) => firstName(person(id).name);
  const fail = (error) => toast({ emoji: "⚠️", title: t("errGeneric"), body: error?.message });
  const refresh = () => reload().catch(() => {});
  // The server replaced words (word filter): tell the author, so it doesn't look like a typo.
  const filtered = (changed) => changed && toast({ emoji: "🙊", title: t("filteredTitle"), body: t("filteredBody") });

  // New rows from the server. Values from the latest render come in through a ref.
  const latest = useRef(null);
  useEffect(() => {
    latest.current = { db, t, toast, openThread };
  });
  useEffect(
    () =>
      backend.subscribe(uid, (kind, row) => {
        const { db: current, t: tr, toast: show, openThread: open } = latest.current;
        const nameIn = (d, id) => firstName(d?.profiles.find((p) => p.id === id)?.name ?? tr("someone"));
        if (kind === "message") {
          if (!current?.conversations.some((c) => c.id === row.conversation_id)) return void reload().catch(() => {});
          setDb((d) => (d.messages.some((m) => m.id === row.id) ? d : { ...d, messages: [row, ...d.messages] }));
          if (row.sender_id !== uid && !visible.current.has(row.conversation_id)) {
            show({
              people: [row.sender_id],
              title: nameIn(current, row.sender_id),
              body: row.body,
              action: { label: tr("reply"), run: () => open(row.conversation_id) },
            });
          }
        } else if (kind === "notification") {
          reload()
            .then((d) => {
              const name = nameIn(d, row.actor_id);
              const group = d.groups.find((g) => g.id === row.ref_id)?.name ?? "";
              if (row.kind === "match") show({ people: [row.actor_id], title: tr("itsAMatch"), body: tr("matchBody", { name }), ms: 5200 });
              else if (row.kind === "wave") show({ people: [row.actor_id], title: tr("n_wave", { name }) });
              else if (row.kind === "hangout") show({ people: [row.actor_id], title: tr("n_hangout", { name }) });
              else if (row.kind === "group_invite") show({ people: [row.actor_id], title: tr("n_invite", { name, group }) });
              else if (row.kind === "group_join") show({ people: [row.actor_id], title: tr("n_group", { name, group }) });
            })
            .catch(() => {});
        } else reload().catch(() => {});
      }),
    [backend, uid, reload, visible],
  );

  // Push notifications (iOS app): the phone's token goes to the server, and tapping a notification opens its chat.
  const pushLang = useRef(lang);
  useEffect(() => {
    pushLang.current = lang;
  });
  useEffect(() => {
    const started = startPush(backend, { lang: () => pushLang.current, onOpen: (id) => latest.current.openThread(id) }).catch(() => () => {});
    return () => void started.then((stop) => stop());
  }, [backend]);

  const markRead = useCallback(
    (threadId) => {
      const at = new Date().toISOString();
      setDb((d) => ({
        ...d,
        conversationMembers: d.conversationMembers.map((m) => (m.conversation_id === threadId && m.user_id === uid ? { ...m, last_read_at: at } : m)),
      }));
      backend.markRead(threadId, uid).catch(() => {});
    },
    [backend, uid],
  );

  if (!world) return <Splash />;
  const real = (id) => (id === ME ? uid : id);
  const run = (promise, then) => promise.then(then).catch(fail).finally(refresh);

  const openChat = (id) => {
    setProfileId(null);
    const existing = Object.values(world.threads).find((th) => th.kind === "dm" && th.with === id);
    if (existing) return setDrawer(existing.id);
    backend
      .startDm(id)
      .then((conversation) => reload().then(() => setDrawer(conversation)))
      .catch(fail);
  };
  const openGroupChat = (groupId) => {
    const thread = Object.values(world.threads).find((th) => th.group === groupId);
    if (thread) openThread(thread.id);
  };

  const connect = (id, rect) => {
    const rel = world.rels[id];
    if (rel === "connected" || rel === "waved") return;
    burst(rect);
    setDb((d) => ({ ...d, waves: [...d.waves, { from_id: uid, to_id: id }] }));
    toast(
      rel === "incoming"
        ? {
            people: [ME, id],
            title: t("itsAMatch"),
            body: t("matchBody", { name: first(id) }),
            action: { label: t("chatCta"), run: () => openChat(id) },
            ms: 5200,
          }
        : { people: [id], title: t("waveSent", { name: first(id) }), body: t("waveBody", { name: first(id) }) },
    );
    run(backend.wave(uid, id));
  };

  const sendMessage = (threadId, text) => {
    const row = {
      id: crypto.randomUUID(),
      conversation_id: threadId,
      sender_id: uid,
      kind: "text",
      body: text,
      created_at: new Date().toISOString(),
    };
    setDb((d) => ({ ...d, messages: [row, ...d.messages] }));
    backend
      .sendMessage({ id: row.id, conversation_id: threadId, sender_id: uid, body: text })
      .then((saved) => {
        setDb((d) => ({ ...d, messages: d.messages.map((m) => (m.id === saved.id ? saved : m)) }));
        filtered(saved.body !== text);
      })
      .catch((error) => {
        setDb((d) => ({ ...d, messages: d.messages.filter((m) => m.id !== row.id) }));
        fail(error);
      });
  };

  const joinHangout = (id, rect) => {
    const h = world.hangouts.find((x) => x.id === id);
    backend
      .joinHangout(id, uid)
      .then(() => {
        burst(rect, ["🙌", "🎉", "✨", HANGOUT_TYPE_BY_ID[h.type].emoji]);
        toast({ emoji: HANGOUT_TYPE_BY_ID[h.type].emoji, title: t("joinedToast"), body: `${h.title} · ${fmtWhen(h.start, Date.now(), t, lang)}` });
      })
      .catch((error) => (/hangout_full/.test(error.message) ? toast({ emoji: "🙈", title: t("errFull") }) : fail(error)))
      .finally(refresh);
  };
  const createHangout = (data) =>
    run(
      backend.createHangout({
        host_id: uid,
        uni_id: me.uni.id,
        type: data.type,
        title: data.title,
        place: data.place,
        starts_at: new Date(data.start).toISOString(),
        duration_minutes: data.duration,
        max_people: data.max,
        audience: data.audience,
      }),
      (saved) => {
        toast({ emoji: "🚀", title: t("posted"), body: saved.title });
        filtered(saved.title !== data.title || saved.place !== data.place);
      },
    );
  const deleteHangout = (id) =>
    run(backend.deleteHangout(id), () => {
      ui.setModal(null);
      toast({ emoji: "🗑️", title: t("hangoutDeleted") });
    });

  const joinGroup = (id, rect) => {
    const g = world.groups.find((x) => x.id === id);
    run(g.invited.includes(ME) ? backend.acceptInvite(id, uid) : backend.joinGroup(id, uid), () => {
      burst(rect, ["🎉", "✨", "💜", g.emoji]);
      toast({ emoji: g.emoji, title: t("joinedGroup", { name: g.name }), action: { label: t("open"), run: () => openGroupChat(id) } });
    });
  };
  const createGroup = ({ emoji, name, about, audience, invited }) =>
    run(
      backend.createGroup({ owner_id: uid, uni_id: me.uni.id, emoji, name, about: about || null, audience }).then(async (saved) => {
        await backend.invite(saved.id, uid, invited.map(real));
        return saved;
      }),
      (saved) => {
        toast({ emoji, title: t("created"), body: invited.length ? t("invitesSent", { n: invited.length }) : saved.name });
        filtered(saved.name !== name || (saved.about ?? "") !== (about || ""));
      },
    );
  const inviteToGroup = (groupId, ids) =>
    run(backend.invite(groupId, uid, ids.map(real)), () => toast({ emoji: "💌", title: t("invitesSent", { n: ids.length }) }));

  const setStatus = (id) => {
    setMe((m) => ({ ...m, status: id }));
    run(backend.updateProfile(uid, { status: id, status_at: id ? new Date().toISOString() : null }), () => {
      if (id) toast({ emoji: STATUS_BY_ID[id].emoji, title: t("statusSet"), body: tx(STATUS_BY_ID[id]) });
    });
  };
  const updateMe = (patch) => {
    setMe((m) => ({ ...m, ...patch }));
    if (patch.interests) run(backend.updateProfile(uid, { interests: patch.interests }));
  };
  const setPhoto = (file) => {
    toast({ emoji: "📸", title: t("uploading") });
    run(
      backend.uploadPhoto(uid, file).then((url) => backend.updateProfile(uid, { photo_url: url }).then(() => url)),
      (url) => setMe((m) => ({ ...m, photo: url })),
    );
  };

  const unblock = (id) => {
    setDb((d) => ({ ...d, blocks: d.blocks.filter((b) => b.blocked_id !== id) }));
    run(backend.unblock(uid, id), () => toast({ people: [id], title: t("unblockedToast", { name: first(id) }) }));
  };
  const block = (id, quiet = false) => {
    setDb((d) => ({ ...d, blocks: [...d.blocks, { blocked_id: id }] }));
    setProfileId(null);
    setDrawer((open) => (world.threads[open]?.with === id ? null : open));
    run(backend.block(uid, id));
    if (!quiet) toast({ people: [id], title: t("blockedToast", { name: first(id) }), action: { label: t("undo"), run: () => unblock(id) } });
  };
  const report = (id, reason, note, alsoBlock) => {
    run(backend.report(uid, id, reason, note), () => toast({ emoji: "🛡️", title: t("reportThanks"), body: t("reportThanksBody") }));
    if (alsoBlock) block(id, true);
  };

  const app = {
    ...ui.shared,
    me,
    students: world.students.filter((s) => !world.blocked[s.id]),
    blocked: world.blocked,
    person,
    rels: world.rels,
    hangouts: world.hangouts,
    groups: world.groups,
    threads: world.threads,
    typing: {},
    notifications: world.notifications,
    markRead,
    connect,
    wave: connect,
    sendMessage,
    joinHangout,
    createHangout,
    deleteHangout,
    joinGroup,
    createGroup,
    inviteToGroup,
    openChat,
    openGroupChat,
    setStatus,
    updateMe,
    setPhoto,
    markAllRead: () => {
      setDb((d) => ({ ...d, notifications: d.notifications.map((n) => ({ ...n, read: true })) }));
      backend.markNotificationsRead(uid).catch(() => {});
    },
    logout: () =>
      forgetPush(backend)
        .then(() => backend.signOut())
        .finally(onLogout),
    refreshAll: () => reload().catch(() => {}),
    deleteAccount: () => backend.deleteAccount(uid).then(onDeleteAccount).catch(fail),
    block,
    unblock,
    report,
  };
  const badges = { chats: Object.values(world.threads).reduce((n, th) => n + th.unread, 0) };
  return <AppFrame app={app} ui={ui} badges={badges} />;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Root
 * ──────────────────────────────────────────────────────────────────────────── */

export default function ConnectUni({ backend = null }) {
  const [lang, setLang] = useState(initialLang);
  const [profile, setProfile] = useState(null);
  const [notice, setNotice] = useState(null);
  const [booting, setBooting] = useState(!!backend);
  const i18n = useMemo(() => makeI18n(lang, setLang), [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("connectuni.lang", lang);
    } catch {
      // Storage can be unavailable (private mode, sandboxed frames).
    }
    document.documentElement.lang = lang;
  }, [lang]);

  // Live mode: continue an existing session if its profile exists.
  useEffect(() => {
    if (!backend) return undefined;
    let alive = true;
    backend
      .session()
      .then(async (session) => {
        if (!session) return;
        const row = await backend.profile(session.user.id);
        if (!row) await backend.signOut();
        else if (alive) setProfile(profileFromRow(row, session.user.email));
      })
      .catch(() => {})
      .finally(() => alive && setBooting(false));
    const stop = backend.onSignOut(() => setProfile(null));
    return () => {
      alive = false;
      stop();
    };
  }, [backend]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [profile]);

  const deleted = () => {
    setProfile(null);
    setNotice("accountDeleted");
  };

  return (
    <I18nContext.Provider value={i18n}>
      <div className="uc-root min-h-[100dvh] overflow-x-clip bg-[#FAFAFA] text-zinc-900">
        <GlobalStyles />
        {booting ? (
          <Splash />
        ) : profile ? (
          backend ? (
            <LiveApp key={profile.id} profile={profile} backend={backend} onLogout={() => setProfile(null)} onDeleteAccount={deleted} />
          ) : (
            <MainApp key={profile.email} profile={profile} onLogout={() => setProfile(null)} onDeleteAccount={deleted} />
          )
        ) : (
          <Onboarding
            backend={backend}
            notice={notice}
            onDone={(p) => {
              setNotice(null);
              setProfile(p);
            }}
          />
        )}
      </div>
    </I18nContext.Provider>
  );
}
