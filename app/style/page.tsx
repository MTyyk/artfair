import Link from "next/link";

export const metadata = {
  title: "Style — Riga Contemporary Art Fair",
};

const categories = [
  { slug: "painting",       label: "Painting",         description: "Oil, acrylic, egg tempera on canvas, panel & linen" },
  { slug: "abstract",       label: "Abstract",         description: "Non-representational and gestural works" },
  { slug: "figurative",     label: "Figurative",       description: "Portraits, figures, and the human form" },
  { slug: "landscape",      label: "Landscape",        description: "Nature, seascape, and the natural world" },
  { slug: "photography",    label: "Photography",      description: "C-print, archival pigment, and photographic works" },
  { slug: "prints",         label: "Prints",           description: "Screenprint, inkjet, watercolor, and works on paper" },
  { slug: "street-art-pop", label: "Street Art & Pop", description: "Spray paint, skate culture, and bold graphic works" },
  { slug: "mixed-media",    label: "Mixed Media",      description: "Collage, polymer, multi-material, and experimental" },
];

export default function StylePage() {
  return (
    <div className="pt-28 pb-20 px-5 md:px-8 max-w-5xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-light mb-2">Style</h1>
      <p className="font-sans text-sm text-ink-muted mb-12">
        Browse artworks by medium and aesthetic direction.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/style/${cat.slug}`}
            className="group flex flex-col border border-ink/10 p-5 hover:border-ink/30 transition-colors bg-cream"
          >
            <span className="font-serif text-xl font-light leading-tight mb-2 group-hover:text-accent transition-colors">
              {cat.label}
            </span>
            <span className="font-sans text-[11px] text-ink-muted leading-snug">
              {cat.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
