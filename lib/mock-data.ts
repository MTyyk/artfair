import type { Artist, Artwork } from "./types";

export const mockArtists: Artist[] = [
  {
    id: "artist-1",
    name: "Maija Tabaka",
    bio: "Maija Tabaka (born 1939) is one of Latvia's most celebrated painters, known for her expressive figurative works that blend symbolism with bold colour. Her paintings explore themes of femininity, identity, and the human condition, rendered in a distinctive style drawing from both Western modernism and Latvian folk tradition.",
  },
  {
    id: "artist-2",
    name: "Vija Celmiņš",
    bio: "Vija Celmiņš (born 1938, Riga) is a Latvian-American artist renowned for meticulous graphite and oil renderings of natural phenomena — ocean surfaces, star fields, desert floors. Her work is held in major collections including MoMA, the Tate, and the Whitney Museum.",
  },
  {
    id: "artist-3",
    name: "Kristaps Ģelzis",
    bio: "Kristaps Ģelzis (born 1962) is a Latvian painter and professor whose works move between figuration and abstraction. His large-format canvases depict dreamlike interiors and psychological landscapes rendered with layered, atmospheric colour.",
  },
  {
    id: "artist-4",
    name: "Arnis Balčus",
    bio: "Arnis Balčus (born 1978) is a Latvian photographer and editor-in-chief of FK Magazine. His photographic practice spans portraiture, documentary, and staged photography, examining post-Soviet identity, masculinity, and social ritual.",
  },
  {
    id: "artist-5",
    name: "Ieva Baklāne",
    bio: "Ieva Baklāne is a Latvian contemporary artist working primarily with sculpture, installation, and textile. Her works involve repetition, accumulation, and transformation of everyday materials into contemplative objects.",
  },
  {
    id: "artist-6",
    name: "Andris Eglītis",
    bio: "Andris Eglītis is a Latvian painter known for richly textured abstract works. Drawing from landscape and interior, his canvases balance spontaneity with structured composition, earning recognition across Baltic and European exhibitions.",
  },
];

export const mockArtworks: Artwork[] = [
  {
    id: "artwork-1",
    title: "Sieviete sarkanā",
    artist_id: "artist-1",
    year: 2019,
    size: "120 × 90 cm",
    technique: "Oil on canvas",
    price: 8500,
    description:
      "A commanding figure study in deep reds and warm ochres. The subject gazes past the viewer with quiet authority, rendered in Tabaka's characteristic gestural brushwork.",
    image_url: "https://picsum.photos/seed/artwork1/600/780",
  },
  {
    id: "artwork-2",
    title: "Zilā silueta",
    artist_id: "artist-1",
    year: 2021,
    size: "80 × 100 cm",
    technique: "Oil on canvas",
    price: 6200,
    description:
      "An abstracted female form dissolves into a field of deep cobalt and ultramarine, the figure's edges softening into pure colour.",
    image_url: "https://picsum.photos/seed/artwork2/600/720",
  },
  {
    id: "artwork-3",
    title: "Ocean Surface Study #7",
    artist_id: "artist-2",
    year: 2018,
    size: "45 × 60 cm",
    technique: "Graphite on paper",
    price: 14000,
    description:
      "One of a series of intensely observed ocean surfaces, each wave recorded with painstaking precision. The graphite hatching creates a shimmering, near-photographic quality.",
    image_url: "https://picsum.photos/seed/artwork3/600/450",
  },
  {
    id: "artwork-4",
    title: "Galaxy Field III",
    artist_id: "artist-2",
    year: 2020,
    size: "50 × 50 cm",
    technique: "Oil on linen",
    price: 18500,
    description:
      "Stars rendered with obsessive care, each point of light built up from dozens of layers of oil paint. The deep black ground is achieved through multiple transparent glazes.",
    image_url: "https://picsum.photos/seed/artwork4/600/600",
  },
  {
    id: "artwork-5",
    title: "Rozā jumti",
    artist_id: "artist-3",
    year: 2022,
    size: "150 × 200 cm",
    technique: "Acrylic on canvas",
    price: 11000,
    description:
      "A panoramic cityscape dissolves into fields of rose and violet. Rooftops emerge and recede in a luminous haze, the architecture both specific and dreamlike.",
    image_url: "https://picsum.photos/seed/artwork5/800/600",
  },
  {
    id: "artwork-6",
    title: "Dzeltenā telpa",
    artist_id: "artist-3",
    year: 2023,
    size: "100 × 120 cm",
    technique: "Oil and acrylic on canvas",
    price: 9800,
    description:
      "An interior bathed in golden afternoon light. The painting collapses the boundary between room and memory, between observation and invention.",
    image_url: "https://picsum.photos/seed/artwork6/600/720",
  },
  {
    id: "artwork-7",
    title: "Baznīcas svētki",
    artist_id: "artist-4",
    year: 2021,
    size: "60 × 90 cm",
    technique: "C-print, edition of 5",
    price: 3200,
    description:
      "From the series 'Latvian Rituals'. A parish festival photographed with intimate distance — the festive and the melancholic held in equal tension.",
    image_url: "https://picsum.photos/seed/artwork7/900/600",
  },
  {
    id: "artwork-8",
    title: "Portrets #12",
    artist_id: "artist-4",
    year: 2022,
    size: "40 × 50 cm",
    technique: "Archival pigment print, edition of 3",
    price: 2400,
    description:
      "A direct, unguarded portrait from the ongoing 'Faces' series. The subject's gaze creates an immediate, uncomfortable intimacy.",
    image_url: "https://picsum.photos/seed/artwork8/500/625",
  },
  {
    id: "artwork-9",
    title: "Acumura I",
    artist_id: "artist-5",
    year: 2023,
    size: "Dimensions variable",
    technique: "Handwoven wool, steel armature",
    price: 5600,
    description:
      "Wound threads accumulate into a dense, nest-like form. The work speaks to labour, patience, and the act of slow making as a counter to contemporary speed.",
    image_url: "https://picsum.photos/seed/artwork9/600/800",
  },
  {
    id: "artwork-10",
    title: "Atgriešanās",
    artist_id: "artist-5",
    year: 2022,
    size: "30 × 40 × 20 cm",
    technique: "Ceramic, thread",
    price: 2800,
    description:
      "A ceramic vessel partially unravelled into thread — the object mid-transformation, returning to its material origins.",
    image_url: "https://picsum.photos/seed/artwork10/600/500",
  },
  {
    id: "artwork-11",
    title: "Laukums",
    artist_id: "artist-6",
    year: 2020,
    size: "140 × 160 cm",
    technique: "Oil on canvas",
    price: 7400,
    description:
      "An abstracted field or plaza — the ground plane tilted up into a sea of layered textures. Raw umber and sage push against each other in compressed space.",
    image_url: "https://picsum.photos/seed/artwork11/800/900",
  },
  {
    id: "artwork-12",
    title: "Vakara ainava",
    artist_id: "artist-6",
    year: 2023,
    size: "90 × 110 cm",
    technique: "Oil on canvas",
    price: 6900,
    description:
      "An evening landscape reduced to its essential light: the last glow on the horizon rendered in transparent glazes of amber and deep violet.",
    image_url: "https://picsum.photos/seed/artwork12/700/850",
  },
];

// Artworks enriched with their artist
export const artworksWithArtists: Artwork[] = mockArtworks.map((artwork) => ({
  ...artwork,
  artist: mockArtists.find((a) => a.id === artwork.artist_id),
}));

// Artists enriched with their artworks
export const artistsWithArtworks: Artist[] = mockArtists.map((artist) => ({
  ...artist,
  artworks: mockArtworks
    .filter((a) => a.artist_id === artist.id)
    .map((a) => ({ ...a, artist })),
}));
