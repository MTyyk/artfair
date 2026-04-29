export type StyleCategorySlug =
  | "painting"
  | "abstract"
  | "figurative"
  | "landscape"
  | "photography"
  | "prints"
  | "street-art-pop"
  | "mixed-media";

type LocalizedStyleCopy = {
  label: string;
  description: string;
};

type StyleCategoryDefinition = {
  slug: StyleCategorySlug;
  filterLabel: string;
  imageObjectPath: string;
  copy: {
    en: LocalizedStyleCopy;
    lv: LocalizedStyleCopy;
  };
};

export const STYLE_IMAGE_BUCKET = "style-images";

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map(encodeURIComponent)
    .join("/");
}

export function getStyleImageUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/${STYLE_IMAGE_BUCKET}/${encodeStoragePath(path)}`;
}

export const STYLE_CATEGORIES: StyleCategoryDefinition[] = [
  {
    slug: "painting",
    filterLabel: "Painting",
    imageObjectPath: "categories/painting.png",
    copy: {
      en: {
        label: "Painting",
        description: "Oil, acrylic, egg tempera on canvas, panel and linen",
      },
      lv: {
        label: "Glezniecība",
        description: "Eļļa, akrils un olu tempera uz audekla, paneļa un lina",
      },
    },
  },
  {
    slug: "abstract",
    filterLabel: "Abstract",
    imageObjectPath: "categories/abstract.png",
    copy: {
      en: {
        label: "Abstract",
        description: "Non-representational and gestural works",
      },
      lv: {
        label: "Abstrakcija",
        description: "Nereprezentatīvi un žestiski darbi",
      },
    },
  },
  {
    slug: "figurative",
    filterLabel: "Figurative",
    imageObjectPath: "categories/figurative.png",
    copy: {
      en: {
        label: "Figurative",
        description: "Portraits, figures, and the human form",
      },
      lv: {
        label: "Figuratīvs",
        description: "Portreti, figūras un cilvēka forma",
      },
    },
  },
  {
    slug: "landscape",
    filterLabel: "Landscape",
    imageObjectPath: "categories/landscape.png",
    copy: {
      en: {
        label: "Landscape",
        description: "Nature, seascape, and the natural world",
      },
      lv: {
        label: "Ainava",
        description: "Daba, jūras ainavas un dabas pasaule",
      },
    },
  },
  {
    slug: "photography",
    filterLabel: "Photography",
    imageObjectPath: "categories/photography.png",
    copy: {
      en: {
        label: "Photography",
        description: "C-print, archival pigment, and photographic works",
      },
      lv: {
        label: "Fotogrāfija",
        description: "C-print, arhīva pigmenta un fotogrāfiski darbi",
      },
    },
  },
  {
    slug: "prints",
    filterLabel: "Prints",
    imageObjectPath: "categories/prints.png",
    copy: {
      en: {
        label: "Prints",
        description: "Screenprint, inkjet, watercolor, and works on paper",
      },
      lv: {
        label: "Grafika",
        description: "Sietspiede, inkjet, akvarelis un darbi uz papīra",
      },
    },
  },
  {
    slug: "street-art-pop",
    filterLabel: "Street Art & Pop",
    imageObjectPath: "categories/street-art-pop.png",
    copy: {
      en: {
        label: "Street Art & Pop",
        description: "Spray paint, skate culture, and bold graphic works",
      },
      lv: {
        label: "Ielu māksla un pops",
        description: "Krāsu aerosols, skeitkultūra un drosmīgi grafiski darbi",
      },
    },
  },
  {
    slug: "mixed-media",
    filterLabel: "Mixed Media",
    imageObjectPath: "categories/mixed-media.png",
    copy: {
      en: {
        label: "Mixed Media",
        description: "Collage, polymer, multi-material, and experimental",
      },
      lv: {
        label: "Jauktā tehnika",
        description: "Kolāža, polimēri, dažādi materiāli un eksperimenti",
      },
    },
  },
];

export const STYLE_CATEGORY_FILTER_LABELS = Object.fromEntries(
  STYLE_CATEGORIES.map((category) => [category.slug, category.filterLabel])
) as Record<StyleCategorySlug, string>;

export function getStyleCategory(slug: string) {
  return STYLE_CATEGORIES.find((category) => category.slug === slug);
}