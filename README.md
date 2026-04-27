# Riga Contemporary Art Fair — Web App

A mobile-first web application for the **Riga Contemporary Art Fair** (2–5 July 2026, Hanzas Perons, Riga). Built as a competition project. Allows visitors to browse artworks, save favorites, and express interest — no account required.

---

## Project Status

| Feature | Status |
|---|---|
| Project scaffold (Next.js 16, Tailwind, TypeScript) | ✅ Done |
| All page routes (/, /artworks, /artworks/[id], /artists, /artists/[id], /style, /style/[slug]) | ✅ Done |
| Supabase connected — real artwork + artist data | ✅ Done |
| Vercel deployed (`riga-art-viewer`) | ✅ Done |
| Real artwork images in Supabase Storage | ✅ Done |
| Localization (EN / LV) via `lib/i18n.ts` | ✅ Done |
| Anonymous session ID (localStorage UUID) | ✅ Done |
| Favorites — localStorage + Supabase backend sync | ✅ Done |
| Interest modal — submits via `/api/interest` | ✅ Done |
| View tracking analytics (`/api/views` → `event_logs`) | ✅ Done |
| Behavior-based recommendations (`/api/recommendations`) | ✅ Done |
| Personalized recommendations UI (`RecommendedSection`) | ✅ Done |
| List / Grid layout toggle | ✅ Done |
| Style browsing (`/style`, `/style/[slug]`) | ✅ Done |
| Description levels (simple / in-depth) on detail page | ✅ Done |
| RLS policies — anon writes to interaction tables | ✅ Done |
| CSV import script | ✅ Done |

---

## Competition Criteria Checklist (from `artfair.md`)

| Requirement | Implementation |
|---|---|
| §1 — Artwork catalogue with images | `/artworks` + detail pages, real images from Supabase Storage |
| §2 — Artist profiles | `/artists` + `/artists/[id]` with full bio and artwork grid |
| §3 — Style/medium browsing | `/style` category index + `/style/[slug]` filtered grid |
| §4.1 — Save / favourite artworks | `FavoriteButton` — instant localStorage + async Supabase sync |
| §4.2 — Express interest | `InterestModal` → `POST /api/interest` → `interests` table |
| §4.3 — Bilingual (EN / LV) | `lib/i18n.ts` + `LanguageProvider` — all UI strings translated |
| §4.4 — Description depth levels | Simple / In-depth toggle on artwork detail client |
| §4.5 — Personalization / recommendations | `GET /api/recommendations` — behavior-based (style tag matching from views + favorites history); `RecommendedSection` component on every detail page |
| §5 — Mobile-first responsive design | Tailwind mobile-first breakpoints throughout |
| §6 — Anonymous sessions (no login) | UUID in localStorage, passed to all API routes |
| §7 — Analytics / event tracking | View events logged to `event_logs` on every detail page load |

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 3.x |
| Database / Storage | Supabase (PostgreSQL + Storage) |
| Deployment | Vercel (`riga-art-viewer`) |
| Fonts | Cormorant Garamond (serif display) + Inter (body) |
| State | React local state + localStorage (no global store) |

No auth library. No login. No heavy dependencies beyond the above.

Live URL: **https://riga-art-viewer.vercel.app**

---

## Design

Design references are in `design-reference/` (15 PNG mockups, `artviewer-01.png` through `artviewer-15.png`).

**Visual identity:**
- Background: `#F4F0EB` (cream)
- Text: `#1A1A1A` (near-black)
- Accent: `#E8291C` (red — hero circle, heart fill, hover states)
- Display font: Cormorant Garamond (serif, large headings)
- Body font: Inter (sans-serif, labels, nav, metadata)
- RC logo: two-line serif "R / C" top-left
- Nav: "Artwork | Artist | Style" — centered desktop, hamburger on mobile

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
│       └── page.tsx              # /style — Placeholder
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # RC logo + desktop nav + mobile hamburger
│   │   └── MobileMenu.tsx        # Full-screen overlay nav (mobile)
│   ├── artworks/
│   │   ├── ArtworkCard.tsx       # Image + title + artist + FavoriteButton
│   │   ├── ArtworkGrid.tsx       # CSS columns masonry layout
│   │   └── InterestModal.tsx     # "Interested?" drawer — inserts to Supabase
│   └── favorites/
│       └── FavoriteButton.tsx    # Heart icon toggle (localStorage-backed)
│
├── lib/
│   ├── types.ts                  # TypeScript types: Artwork, Artist, etc.
│   ├── mock-data.ts              # 12 artworks, 6 artists (used on homepage hero only)
│   ├── favorites.ts              # getFavorites(), isFavorite(), toggleFavorite()
│   ├── session.ts                # getSessionId() — anonymous UUID in localStorage
│   └── supabase/
│       ├── client.ts             # Browser client (use in "use client" components)
│       └── server.ts             # Server client (use in server components)
│
├── scripts/
│   ├── import.mjs                # CSV importer: creates artists + inserts artworks
│   └── artworks-template.csv     # Column reference for the import script
│
├── supabase/
│   ├── schema.sql                # Reference schema (actual DB may differ — see below)
│   └── seed.sql                  # Mock data seed (6 artists, 12 artworks)
│
├── design-reference/             # Designer PNG mockups (read-only reference)
├── artfair.md                    # Original technical requirements document
├── CLAUDE.md                     # Guidance for Claude Code
├── next.config.ts                # Image remote patterns (picsum + supabase)
└── tailwind.config.ts            # Custom colors + font families
```

---

## Database (Supabase)

Actual tables in the live DB:

| Table | Purpose |
|---|---|
| `artists` | Artist profiles |
| `artworks` | Artwork records (FK → artists). Has extra columns: `description_beginner`, `description_advanced`, `style_tags` |
| `favorites` | session_id + artwork_id pairs (anonymous, no id column) |
| `interests` | "Interested" button submissions (optional contact + notes) |
| `sessions` | Anonymous session preferences (jsonb) |
| `event_logs` | Generic event tracking: views, clicks, etc. |

RLS is enabled. All operations use the anon key — no service role key needed.

---

## Data Model

Types in `lib/types.ts`:

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
  description_beginner?: string
  description_advanced?: string
  image_url: string
  style_tags?: string[]
  artist?: Artist        // joined, optional
}

type Artist = {
  id: string
  name: string
  bio?: string
  artworks?: Artwork[]
}
```

---

## Favorites & Session

No login. Three localStorage keys:
- `rc_artfair_favorites` — JSON array of artwork IDs (instant UI, synced to Supabase in background)
- `rc_artfair_session_id` — UUID generated on first visit, anonymous identifier in API calls
- `rc_artfair_lang` — `"en"` or `"lv"`, language preference

`FavoriteButton` uses `useEffect` to hydrate state client-side (avoids SSR mismatch). Favorites sync to the `favorites` Supabase table via `POST /api/favorites` after every toggle (fire-and-forget — localStorage is source of truth).

---

## Key Patterns

- **Server Components by default.** Only components with interactivity use `"use client"`.
- **`@/` alias** maps to project root (e.g. `@/lib/types`, `@/components/...`).
- **`params` is a Promise in Next.js 16** — pages use `const { id } = await params`.
- **Images** use `next/image` with `loading="lazy"` on cards, `priority` on detail/hero.
- **Masonry** is CSS `columns-*` with `break-inside-avoid` — no JS library.
- **All writes** go through `app/api/` route handlers — never write to Supabase directly from client components.
- **Localization**: wrap every UI string in `t("key")` from `useTranslation()`. Add missing keys to `lib/i18n.ts`.

---

## Running Locally

```bash
cp .env.local.example .env.local   # add your Supabase URL + anon key
npm install
npm run dev
# → http://localhost:3000
```

Build check:
```bash
npm run build
```

---

## Importing Artwork Data

Fill in `scripts/artworks-template.csv` with real data, then:

```bash
npm run import scripts/artworks-template.csv
```

The script looks up artists by name (creates them if new) and inserts artworks. Images should be uploaded to the `artwork-images` Supabase Storage bucket and the public URL placed in the `image_url` column.

---

## Deployment

Manual deploy to Vercel:
```bash
npx vercel --prod --scope aidesignqa-6662s-projects
```

Env vars are set in Vercel — do not commit `.env.local`.

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/favorites` | POST | Add/remove favorite. Body: `{ session_id, artwork_id, action: "add"\|"remove" }` |
| `/api/favorites` | GET | List favorites for session. Query: `?session_id=...` |
| `/api/interest` | POST | Submit interest form. Body: `{ session_id, artwork_id, contact_info?, notes? }` |
| `/api/views` | POST | Log a view event. Body: `{ session_id, artwork_id }` |
| `/api/recommendations` | GET | Get personalized artworks. Query: `?session_id=...&exclude=id1,id2` |

---

## What Still Needs Building

All mandatory competition criteria are implemented. Optional improvements:

1. **Sort & Filter UI** — the filter button in `ArtworkBrowseSection` shows but has no dropdown yet
2. **Onboarding** — first-time tooltip or swipe hint for new visitors
5. **Onboarding / personalization** — style/interest selection on first visit
6. **Analytics** — wire `event_logs` table for view/click tracking
7. **Style page** — placeholder, not yet designed
8. **PWA manifest** — `public/manifest.json` for installability
