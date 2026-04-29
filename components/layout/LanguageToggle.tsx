"use client";

import { useTranslation } from "@/lib/i18n";

interface Props {
  className?: string;
  buttonClassName?: string;
}

export default function LanguageToggle({
  className = "",
  buttonClassName = "text-ink hover:text-accent transition-colors",
}: Props) {
  const { lang, setLang } = useTranslation();

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setLang(lang === "en" ? "lv" : "en")}
        className={buttonClassName}
        aria-label={lang === "en" ? "Switch language to Latvian" : "Switch language to English"}
      >
        {lang === "en" ? "EN" : "LV"}
      </button>
    </div>
  );
}