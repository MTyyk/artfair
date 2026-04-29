import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Riga Contemporary Art Fair",
    short_name: "Riga Art Fair",
    description:
      "Browse and collect artworks from Riga Contemporary Art Fair. 2–5 July 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF4EF",
    theme_color: "#FAF4EF",
    orientation: "portrait",
    icons: [
      {
        src: "/header_logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/header_logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    categories: ["entertainment", "lifestyle"],
    lang: "en",
    dir: "ltr",
  };
}
