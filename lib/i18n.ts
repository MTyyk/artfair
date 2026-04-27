"use client";

import { createContext, useContext } from "react";

export type Language = "en" | "lv";

export const translations = {
  en: {
    // Nav
    artwork: "Artwork",
    artist: "Artist",
    style: "Style",
    // Browse
    sortFilter: "Sort & Filter",
    // Detail page
    save: "Save",
    view: "View",
    share: "Share",
    interested: "Interested",
    technique: "Technique",
    size: "Size",
    prev: "Prev",
    next: "Next",
    // Description toggle
    simple: "Simple",
    inDepth: "In depth",
    // Interest modal
    expressInterest: "Express Interest",
    interestDescription: "Leave your contact details and our team will reach out.",
    yourName: "Your name (optional)",
    yourEmail: "Your email (optional)",
    send: "Send",
    sending: "Sending…",
    thankYou: "Thank you — we'll be in touch.",
    cancel: "Cancel",
    // Artists page
    aboutArtist: "About the artist",
    // Mobile menu footer
    eventDates: "2–5 July 2026",
    eventVenue: "Hanzas Perons, Riga",
  },
  lv: {
    // Nav
    artwork: "Mākslas darbi",
    artist: "Mākslinieks",
    style: "Stils",
    // Browse
    sortFilter: "Kārtot un filtrēt",
    // Detail page
    save: "Saglabāt",
    view: "Skatīt",
    share: "Dalīties",
    interested: "Interesē",
    technique: "Tehnika",
    size: "Izmērs",
    prev: "Iepriekš",
    next: "Nākamais",
    // Description toggle
    simple: "Vienkārši",
    inDepth: "Padziļināti",
    // Interest modal
    expressInterest: "Paust interesi",
    interestDescription: "Atstājiet savus kontaktus un mūsu komanda sazināsies ar jums.",
    yourName: "Jūsu vārds (nav obligāts)",
    yourEmail: "Jūsu e-pasts (nav obligāts)",
    send: "Sūtīt",
    sending: "Sūta…",
    thankYou: "Paldies — mēs sazināsimies.",
    cancel: "Atcelt",
    // Artists page
    aboutArtist: "Par mākslinieku",
    // Mobile menu footer
    eventDates: "2.–5. jūlijs 2026",
    eventVenue: "Hanzas Perons, Rīga",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export const LanguageContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
}>({ lang: "en", setLang: () => {} });

export function useTranslation() {
  const { lang, setLang } = useContext(LanguageContext);
  const t = (key: TranslationKey): string => translations[lang][key];
  return { t, lang, setLang };
}
