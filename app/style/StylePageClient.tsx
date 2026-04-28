"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { STYLE_CATEGORIES } from "@/lib/styleCategories";

export default function StylePageClient() {
  const { t, lang } = useTranslation();

  return (
    <div className="pt-28 pb-20 px-5 md:px-8 max-w-5xl mx-auto">
      <h1 className="font-ivy text-4xl md:text-5xl font-light mb-2">{t("style")}</h1>
      <p className="font-sans text-sm text-ink-muted mb-12">{t("browseByStyle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {STYLE_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/style/${category.slug}`}
            className="group flex flex-col border border-ink/10 p-5 hover:border-ink/30 transition-colors bg-cream"
          >
            <span className="font-ivy text-xl font-light leading-tight mb-2 group-hover:text-accent transition-colors">
              {category.copy[lang].label}
            </span>
            <span className="font-sans text-[11px] text-ink-muted leading-snug">
              {category.copy[lang].description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}