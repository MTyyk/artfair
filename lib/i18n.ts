"use client";

import { createContext, useContext } from "react";

export type Language = "en" | "lv";

export const translations = {
  en: {
    // Nav
    artwork: "Artwork",
    artist: "Artist",
    style: "Style",
    wishlist: "Wishlist",
    // Browse
    gridView: "Grid view",
    listView: "List view",
    // Detail page
    save: "Save",
    view: "View",
    share: "Share",
    interested: "Enquire",
    technique: "Technique",
    size: "Size",
    prev: "Previous",
    next: "Next",
    by: "by",
    contactGallery: "Contact gallery",
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
    close: "Close",
    reset: "Reset",
    // Artists page
    findArtist: "Find an Artist",
    aboutArtist: "About the artist",
    alphabeticalIndex: "Alphabetical index",
    // Home
    heroHeadlineLine1: "Fall in to the art.",
    heroHeadlineLine2: "Own the extraordinary.",
    // Mobile-only headline split (4 lines)
    heroHeadlineMobile1: "Fall in",
    heroHeadlineMobile2: "to the art.",
    heroHeadlineMobile3: "Own the",
    heroHeadlineMobile4: "extraordinary.",
    heroDiveIn: "dive in to art",
    rigaContemporaryArtFair: "Riga Contemporary Art Fair",
    eventDates: "2–5 July 2026",
    eventVenue: "Hanzas Perons, Riga",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    // Recommendations
    recommendedForYou: "Recommended for you",
    discoverMore: "Discover more",
    // Artwork listing
    worksSingular: "work",
    worksPlural: "works",
    noArtworks: "No artworks found.",
    wishlistEmpty: "No saved artworks yet.",
    browseArtworks: "Browse artworks",
    // Style page
    browseByStyle: "Browse by medium and aesthetic direction.",
    // Price
    priceOnRequest: "Price on request",
  },
  lv: {
    // Nav
    artwork: "Mākslas darbi",
    artist: "Mākslinieks",
    style: "Stils",
    wishlist: "Atlase",
    // Browse
    gridView: "Režģa skats",
    listView: "Saraksta skats",
    // Detail page
    save: "Saglabāt",
    view: "Skatīt",
    share: "Dalīties",
    interested: "Interesē",
    technique: "Tehnika",
    size: "Izmērs",
    prev: "Iepriekš",
    next: "Nākamais",
    by: "autors",
    contactGallery: "Sazināties ar galeriju",
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
    close: "Aizvērt",
    reset: "Atiestatīt",
    // Artists page
    findArtist: "Atrast mākslinieku",
    aboutArtist: "Par mākslinieku",
    alphabeticalIndex: "Alfabētiskais rādītājs",
    // Home
    heroHeadlineLine1: "Iekrītiet mākslā.",
    heroHeadlineLine2: "Iegūstiet neparasto.",
    // Mobile-only headline split (4 lines)
    heroHeadlineMobile1: "Iekrītiet",
    heroHeadlineMobile2: "mākslā.",
    heroHeadlineMobile3: "Iegūstiet",
    heroHeadlineMobile4: "neparasto.",
    heroDiveIn: "ielekt mākslā",
    rigaContemporaryArtFair: "Riga Contemporary Art Fair",
    eventDates: "2.–5. jūlijs 2026",
    eventVenue: "Hanzas Perons, Rīga",
    openMenu: "Atvērt izvēlni",
    closeMenu: "Aizvērt izvēlni",
    // Recommendations
    recommendedForYou: "Ieteikts jums",
    discoverMore: "Atklājiet vairāk",
    // Artwork listing
    worksSingular: "darbs",
    worksPlural: "darbi",
    noArtworks: "Mākslas darbi nav atrasti.",
    wishlistEmpty: "Vēl nav saglabātu mākslas darbu.",
    browseArtworks: "Pārlūkot mākslas darbus",
    // Style page
    browseByStyle: "Pārlūkojiet pēc tehnikas un estētiskā virziena.",
    // Price
    priceOnRequest: "Cena pēc pieprasījuma",
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
