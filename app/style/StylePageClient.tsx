"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import { getStyleImageUrl, STYLE_CATEGORIES } from "@/lib/styleCategories";

interface StyleCategoryCardProps {
  slug: string;
  label: string;
  imageObjectPath: string;
}

function StyleCategoryCard({ slug, label, imageObjectPath }: StyleCategoryCardProps) {
  const [showImage, setShowImage] = useState(true);

  return (
    <Link
      href={`/style/${slug}`}
      aria-label={`Browse ${label}`}
      className="group block overflow-hidden border border-ink/10 bg-cream transition-colors hover:border-ink/30"
    >
      <div className={`relative aspect-[920/1066] overflow-hidden ${showImage ? "bg-ink/5" : "bg-ink/60"}`}>
        {showImage ? (
          <Image
            src={getStyleImageUrl(imageObjectPath)}
            alt={`${label} category image`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={() => setShowImage(false)}
          />
        ) : null}
        <div className="absolute inset-0 bg-[#1A1A1A]/30 transition-opacity duration-300 group-hover:bg-[#1A1A1A]/35" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
          <span className="max-w-[11ch] font-sans text-[21px] font-medium leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
            {label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function StylePageClient() {
  const { t, lang } = useTranslation();

  return (
    <div className="pt-28 pb-20 px-5 md:px-0 md:w-[60%] md:mx-auto">
      <h1 className="font-sans font-light text-3xl md:text-5xl mb-2">{t("style")}</h1>
      <p className="font-sans text-sm text-ink-muted mb-12">{t("browseByStyle")}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STYLE_CATEGORIES.map((category) => (
          <StyleCategoryCard
            key={category.slug}
            slug={category.slug}
            label={category.copy[lang].label}
            imageObjectPath={category.imageObjectPath}
          />
        ))}
      </div>
    </div>
  );
}