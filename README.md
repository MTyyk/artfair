# Riga Contemporary Art Fair — Web App

A mobile-first web application for the **Riga Contemporary Art Fair** (2–5 July 2026, Hanzas Perons, Riga). Built as a school project. Allows visitors to browse artworks, save favorites, and express interest — no account required.

---

## Project Status

**Phase: Base setup complete. Mock data wired. Build passing. Not yet connected to Supabase.**

| Area | Status |
|---|---|
| Project scaffold (Next.js, Tailwind, TS) | Done |
| All page routes | Done |
| Components (Header, ArtworkCard, Grid, Modal) | Done |
| Mock data (12 artworks, 6 artists) | Done |
| Favorites (localStorage) | Done |
| Anonymous session ID | Done |
| Supabase schema SQL | Done |
| Supabase client wired up | Done (env vars needed) |
| Supabase connected with real data | Not started |
| Real artwork images | Not started |
| Localization (LV / EN) | Not started |
| Onboarding / personalization | Not started |
| Analytics | Not started |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.3 (App Router, TypeScript) |
| Styling | Tailwind CSS 3.x |
| Database / Storage | Supabase (PostgreSQL + Storage) |
| Deployment target | Vercel |
| Fonts | Cormorant Garamond (serif display) + Inter (body) |
| State | React local state + localStorage (no global store) |

No auth library. No login. No heavy dependencies beyond the above.

---

## Design

Design references are in `design-reference/` (15 PNG mockups from the designer, files `artviewer-01.png` through `artviewer-15.png`).

**Visual identity:**
- Background: `#F4F0EB` (cream)
- Text: `#1A1A1A` (near-black)
- Accent: `#E8291C` (red — used for decorative circle on hero, heart fill, hover states)
- Display font: Cormorant Garamond (serif, large headings)
- Body font: Inter (sans-serif, labels, nav, metadata)
- RC logo: two-line serif "R / C" top-left
- Nav: "Artwork | Artist | Style" — centered desktop, hamburger on mobile

**Screens implemented (matching designer mockups):**
- `artviewer-01` → Landing hero
- `artviewer-02`, `09`, `10`, `13` → Artwork grid (masonry)
- `artviewer-03`, `11`, `12` → Artwork detail + lightbox
- `artviewer-04` → Image fullscreen lightbox
- `artviewer-05`, `06` → Artist profile
- `artviewer-07`, `08` → Mobile hero / grid
- `artviewer-14`, `15` → Artist A–Z directory

---

## File Structure

```
Artfair/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout: fonts, Header, body bg
│   ├── globals.css               # Tailwind base + CSS custom properties
│   ├── page.tsx                  # / — Landing hero with scattered artworks
│   ├── artworks/
│   │   ├── page.tsx              # /artworks — Masonry grid, Sort & Filter bar
│   │   └── [id]/
│   │       ├── page.tsx          # /artworks/[id] — Detail: image + metadata
│   │       └── ArtworkDetailClient.tsx  # Client: lightbox + interest modal
│   ├── artists/
│   │   ├── page.tsx              # /artists — A–Z directory with jump nav
│   │   └── [id]/
│   │       ├── page.tsx          # /artists/[id] — Profile + artwork grid
│   │       └── ArtistDetailClient.tsx   # Client: bio accordion (mobile)
│   └── style/
│       └── page.tsx              # /style — Placeholder (not yet designed)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # RC logo + desktop nav + mobile hamburger
│   │   └── MobileMenu.tsx        # Full-screen overlay nav (mobile)
│   ├── artworks/
│   │   ├── ArtworkCard.tsx       # Image + title + artist + FavoriteButton
│   │   ├── ArtworkGrid.tsx       # CSS columns masonry layout
│   │   └── InterestModal.tsx     # "Interested?" drawer: optional name/email
│   └── favorites/
│       └── FavoriteButton.tsx    # Heart icon toggle (localStorage-backed)
│
├── lib/
│   ├── types.ts                  # TypeScript types: Artwork, Artist, Favorite, InterestSubmission
│   ├── mock-data.ts              # 12 artworks, 6 artists (Latvian names, picsum images)
│   ├── favorites.ts              # getFavorites(), isFavorite(), toggleFavorite()
│   ├── session.ts                # getSessionId() — anonymous UUID in localStorage
│   └── supabase/
│       ├── client.ts             # createBrowserClient (use in Client Components)
│       └── server.ts             # createServerClient (use in Server Components / Route Handlers)
│
├── supabase/
│   └── schema.sql                # Full schema + RLS policies (run this in Supabase SQL editor)
│
├── design-reference/             # Designer PNG mockups (read-only reference)
├── artfair.md                    # Original technical requirements document
├── next.config.ts                # Image remote patterns (picsum + supabase)
├── tailwind.config.ts            # Custom colors (cream, ink, accent) + font families
├── tsconfig.json                 # Strict TS, @/* path alias maps to project root
├── .env.local.example            # Environment variable template
└── package.json
```

---

## Data Model

All types are in `lib/types.ts`.

```typescript
type Artwork = {
  id: string
  title: string
  artist_id: string
  year: number
  size: string           // e.g. "120 × 90 cm"
  technique: string      // e.g. "Oil on canvas"
  price: number          // in EUR
  description: string
  image_url: string
  artist?: Artist        // joined, optional
}

type Artist = {
  id: string
  name: string
  bio?: string
  artworks?: Artwork[]   // joined, optional
}

type Favorite = {
  session_id: string
  artwork_id: string
}

type InterestSubmission = {
  artwork_id: string
  contact_info?: string  // optional "Name — email" string
  session_id: string
}
```

---

## Database (Supabase)

Schema is in `supabase/schema.sql`. Tables:

| Table | Purpose |
|---|---|
| `artists` | Artist profiles |
| `artworks` | Artwork records (FK → artists) |
| `favorites` | session_id + artwork_id pairs (anonymous) |
| `interest_submissions` | "Interested" button submissions (optional contact) |
| `artwork_views` | View events per session (analytics) |

RLS is enabled on all tables. Anonymous users can:
- Read `artists` and `artworks`
- Insert/read/delete `favorites` (by session_id)
- Insert `interest_submissions`
- Insert `artwork_views`

---

## Mock Data

`lib/mock-data.ts` exports:
- `mockArtists` — 6 artists: Maija Tabaka, Vija Celmiņš, Kristaps Ģelzis, Arnis Balčus, Ieva Baklāne, Andris Eglītis
- `mockArtworks` — 12 artworks, 2 per artist. Images from `picsum.photos/seed/artworkN/W/H`
- `artworksWithArtists` — artworks with their `artist` relation pre-joined
- `artistsWithArtworks` — artists with their `artworks` array pre-joined

All pages currently use mock data directly (imported at build time). When Supabase is connected, replace the direct imports with `await supabase.from('artworks').select(...)` calls in the Server Components.

---

## Favorites & Session

No login. Two localStorage keys:
- `rc_artfair_favorites` — JSON array of artwork IDs (strings)
- `rc_artfair_session_id` — UUID generated on first visit

`lib/favorites.ts` functions are synchronous and safe to call only on the client (guard: `typeof window === "undefined"`).

`FavoriteButton` uses `useEffect` to hydrate state client-side, avoiding SSR mismatch.

---

## Key Patterns

- **Server Components by default.** Only components with interactivity (`useState`, event handlers, browser APIs) use `"use client"`.
- **`@/` alias** maps to the project root (e.g. `@/lib/types`, `@/components/...`).
- **`params` is a Promise in Next.js 16** — pages use `const { id } = await params`.
- **`generateStaticParams`** is defined on `/artworks/[id]` and `/artists/[id]` for static generation.
- **Images** use `next/image` with `loading="lazy"` on cards, `priority` on detail/hero.
- **Masonry** is CSS `columns-*` with `break-inside-avoid` on each card — no JS library.

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The app runs without these (uses mock data). Supabase client will throw only if you call it.

---

## Running Locally

```bash
npm install
npm run dev
# → http://localhost:3000
```

Build check:
```bash
npm run build
```

---

## What Still Needs Building

In rough priority order:

1. **Connect Supabase** — replace mock-data imports in Server Components with real DB queries. Start with `app/artworks/page.tsx` and `app/artists/page.tsx`.
2. **Image upload flow** — upload artwork images to Supabase Storage, update `image_url` in DB, update `next.config.ts` hostname if needed.
3. **CSV import script** — script or admin route to seed `artists` + `artworks` from Excel/CSV (requirement 6 in `artfair.md`).
4. **Interest submission wired** — `InterestModal.tsx` has a `// TODO` comment; replace with `supabase.from('interest_submissions').insert(...)`.
5. **View tracking** — log to `artwork_views` table when detail page loads (Server Component or Route Handler).
6. **Localization (LV/EN)** — requirement 10. Suggested: `next-intl` library with `/lv` and `/en` route prefixes, or a simple context-based approach.
7. **Onboarding / personalization** — requirement 4.5. Minimum: style/interest selection on first visit stored in localStorage.
8. **Sort & Filter** — the filter bar UI exists but is not wired. Add filter state, URL params, and Supabase query params.
9. **Style page** — currently a placeholder. Not yet designed.
10. **PWA manifest** — add `public/manifest.json` for installability (requirement 1).

---

## Requirements Reference

Full technical requirements are in `artfair.md`. Key constraints:
- Works without login (anonymous usage throughout)
- Page load < 2s, image lazy loading, no heavy blocking scripts
- Must support Latvian and English
- Max 2–3 taps to reach artwork detail
- Deployable standalone or embeddable in Riga Contemporary website
