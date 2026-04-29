"use client";

import { useTranslation } from "@/lib/i18n";
import { getStyleCategory } from "@/lib/styleCategories";

interface Props {
  slug: string;
  count: number;
}

export default function StyleCategoryHeader({ slug, count }: Props) {
  const { lang, t } = useTranslation();
  const category = getStyleCategory(slug);

  if (!category) return null;

  return (
    <div className="pt-28 pb-4 px-5 md:px-8">
      <h1 className="font-sans font-light text-4xl md:text-5xl">{category.copy[lang].label}</h1>
      <p className="font-sans text-sm text-ink-muted mt-1">
        {count} {count === 1 ? t("worksSingular") : t("worksPlural")}
      </p>
    </div>
  );
}