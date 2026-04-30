# A digital guide for the Riga Contemporary Art Fair

A mobile-first web application built for the **Riga Contemporary Art Fair**.

The platform helps fair visitors explore artworks, learn about artists, save favourites, and express buying interest — no account required. The focus is on accessibility, speed, and confidence-building for first-time art buyers.

**Live:** [riga-art-viewer.vercel.app](https://riga-art-viewer.vercel.app)

**Team (Start School):** Jānis Vedļa, Oskars Zvingulis, Līva Birkava

---

## Problem

Visitors at an art fair may genuinely like an artwork but still feel uncertain — about the artist, the technique, the price, or what the next step is. Without easy access to clear information and a low-friction way to express interest, that moment of connection is often lost.

---

## Solution

A digital exhibition guide that supports the full visitor journey: **browse → discover → save → enquire.**

The experience is structured around three moments of the art fair journey:

1. **Before** — a visitor can browse artworks and artists ahead of the fair
2. **During** — they can explore the catalogue on their phone, save pieces they like, and ask about buying
3. **After** — their saved list and expressed interests remain accessible

The goal is not to build a marketplace. It is to help visitors discover, understand, remember, and take action on artworks they care about — without friction, without an account, in the 2–3 taps it takes to reach a detail page.

---

## Key Features

- **Artwork catalogue** — browseable grid with real images, pricing, technique, and dimensions
- **Artist profiles** — biographical information with full artwork listings
- **Style browsing** — explore works by artistic style or medium
- **Two-level descriptions** — a simple and an in-depth explanation on every artwork, written for both first-time buyers and experienced collectors
- **Transparent pricing** — price shown on every artwork; enquiry is always one tap away
- **Favourites** — saved instantly with no login; synced to the backend in the background
- **Interest enquiry** — a low-pressure form to capture buying intent (optional contact info + notes)
- **Personalised recommendations** — behaviour-based suggestions derived from view and favourites history
- **Bilingual (EN / LV)** — full interface translation with a one-tap language toggle
- **Anonymous sessions** — all interaction is stateful without requiring an account

---

## Design Approach

The interface is intentionally simple and visual — the focus is kept entirely on the artworks. Large imagery, clear serif typography, short text blocks, and minimal navigation make it feel closer to an exhibition guide than a traditional marketplace.

The visual system avoids unnecessary complexity. Every screen has one clear purpose, and every action is reachable quickly.

**Visual identity:**
- Background: `#F4F0EB` (cream)
- Text: `#1A1A1A` (near-black)
- Accent: `#E8291C` (red — hero circle, heart fill, hover states)
- Display font: Cormorant Garamond (serif, large headings)
- Body font: Inter (sans-serif, labels, nav, metadata)

Design mockups are in `design-reference/` (15 PNG references).

---

## UX Principles

- **Clarity over complexity** — every screen has one obvious action
- **Mobile-first** — optimised for phones; most visitors will use their own device during the fair
- **Low friction** — no login, no setup; browse, save, and enquire in seconds
- **Confidence building** — descriptions, pricing, and artist context make buying feel approachable
- **Fast access** — any artwork detail reachable within 2–3 taps from the homepage

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.3 (App Router, TypeScript 5) |
| Styling | Tailwind CSS 3.4, shadcn/ui, Radix UI |
| Icons | Lucide React |
| Animation | GSAP 3 |
| Database / Storage | Supabase (PostgreSQL + Storage) |
| Deployment | Vercel (`riga-art-viewer`) |
| Fonts | Cormorant Garamond (serif display) + Inter (body) |
| State | React local state + localStorage (no global store) |

No auth library. No login required.

---

## File Structure

```
Artfair/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout: fonts, Header, body bg
│   ├── globals.css                   # Tailwind base + CSS custom properties
│   ├── manifest.ts                   # PWA web app manifest
│   ├── page.tsx                      # / — Landing hero
│   ├── artworks/
│   │   ├── page.tsx                  # /artworks — Masonry grid + browse section
│   │   └── [id]/
│   │       ├── page.tsx              # /artworks/[id] — Detail: image + metadata
│   │       ├── ArtworkDetailClient.tsx       # Client: description toggle, interest modal
│   │       └── ArtworkDetailPageClient.tsx   # Client: page-level interactivity
│   ├── artists/
│   │   ├── page.tsx                  # /artists — A–Z directory with jump nav
│   │   ├── ArtistsPageClient.tsx     # Client: search + filter
│   │   └── [id]/
│   │       ├── page.tsx              # /artists/[id] — Profile + artwork grid
│   │       ├── ArtistDetailClient.tsx        # Client: bio accordion
│   │       └── ArtistDetailPageClient.tsx    # Client: page-level interactivity
│   ├── style/
│   │   ├── page.tsx                  # /style — Style category index
│   │   ├── StylePageClient.tsx       # Client: style browsing
│   │   └── [slug]/
│   │       ├── page.tsx              # /style/[slug] — Filtered artwork grid
│   │       └── StyleCategoryHeader.tsx
│   ├── wishlist/
│   │   ├── page.tsx                  # /wishlist — Saved favourites
│   │   └── WishlistPageClient.tsx    # Client: wishlist state
│   └── embed/
│       ├── layout.tsx                # Minimal layout for embeds
│       ├── page.tsx                  # /embed — Embeddable artwork view
│       └── EmbedWrapper.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # RC logo + desktop nav + mobile hamburger
│   │   ├── MobileMenu.tsx            # Full-screen overlay nav (mobile)
│   │   └── LanguageToggle.tsx        # EN / LV switcher
│   ├── artworks/
│   │   ├── ArtworkCard.tsx           # Image + title + artist + FavoriteButton
│   │   ├── ArtworkGrid.tsx           # CSS columns masonry layout
│   │   ├── ArtworkBrowseSection.tsx  # Sort, filter, and pagination controls
│   │   ├── InterestModal.tsx         # "Interested?" drawer — posts to Supabase
│   │   └── RecommendedSection.tsx    # Behaviour-based recommendation strip
│   ├── favorites/
│   │   └── FavoriteButton.tsx        # Heart icon toggle (localStorage-backed)
│   ├── home/
│   │   └── HomeHero.tsx              # Landing hero with scattered artworks
│   ├── ui/
│   │   └── button.tsx                # shadcn/ui base button component
│   ├── LanguageProvider.tsx          # Context provider for EN / LV translations
│   ├── draw-random-underline.tsx     # Animated SVG underline on headings
│   └── SquiggleSVG.tsx               # Decorative squiggle graphic
│
├── lib/
│   ├── types.ts                      # TypeScript types: Artwork, Artist, etc.
│   ├── i18n.ts                       # Translation strings + useTranslation hook
│   ├── favorites.ts                  # getFavorites(), isFavorite(), toggleFavorite()
│   ├── session.ts                    # getSessionId() — anonymous UUID in localStorage
│   ├── styleCategories.ts            # Style category definitions for /style
│   ├── image.ts                      # Image URL helpers
│   ├── utils.ts                      # Shared utility functions (cn, etc.)
│   └── supabase/
│       ├── client.ts                 # Browser Supabase client ("use client" components)
│       └── server.ts                 # Server Supabase client (Server Components)
│
├── scripts/
│   ├── import.mjs                    # CSV importer: creates artists + inserts artworks
│   ├── enrich-artists.mjs            # Scrapes artist bios from Artsy
│   ├── upload-images.mjs             # Uploads artwork images to Supabase Storage
│   ├── upload-style-images.mjs       # Uploads style category images to Supabase Storage
│   ├── download-images.mjs           # Downloads images from remote URLs
│   ├── backfill-thumbs.mjs           # Backfills missing optimised thumbnails
│   ├── retry-small-images.mjs        # Retries failed/undersized image uploads
│   ├── generate-import-sql.mjs       # Generates SQL insert statements from CSV
│   └── artworks-template.csv         # Column reference for the import script
│
├── supabase/
│   ├── schema.sql                    # Full reference schema
│   ├── seed.sql                      # Seed data
│   ├── migrations/                   # Applied migrations (in order)
│   │   ├── 20260426_add_description_levels.sql
│   │   ├── 20260427_add_style_tags.sql
│   │   ├── 20260427_fix_anon_rls.sql
│   │   ├── 20260429_create_style_images_bucket.sql
│   │   ├── 20260429_resize_image_webhook.sql
│   │   └── 20260430_add_artist_bio_source_fields.sql
│   └── functions/
│       └── resize-image/index.ts     # Edge function: auto-resizes uploaded images
│
├── design-reference/                 # Designer PNG mockups (read-only reference)
├── artfair.md                        # Original technical requirements document
├── CLAUDE.md                         # Guidance for Claude Code
├── next.config.ts                    # Image remote patterns + embed iframe headers
└── tailwind.config.ts                # Custom colours + font families
```

---

## Database (Supabase)

| Table | Purpose |
|---|---|
| `artists` | Artist profiles (name, bio, Artsy enrichment fields) |
| `artworks` | Artwork records (FK → artists), includes `description_beginner`, `description_advanced`, `style_tags`, `seq` |
| `favorites` | `(session_id, artwork_id)` pairs — anonymous, no auth |
| `interests` | Enquiry submissions (optional contact info + notes) |
| `sessions` | Anonymous session preferences (JSONB) |
| `event_logs` | Event tracking: `view`, `favorite`, `unfavorite`, `interest_click` |

Storage buckets:

| Bucket | Purpose |
|---|---|
| `artwork-images` | Original uploaded artwork images |
| `artwork-images-optimized` | Auto-generated thumbnails (via resize-image edge function) |
| `hero-images` | Homepage hero images |
| `style-images` | Style category card images |

RLS is enabled on all tables. All operations use the anon key — no service role key needed at runtime.

---

## Data Model

```typescript
type Artwork = {
  id: string
  seq: number            // display ordering sequence
  title: string
  artist_id: string
  year: number
  size: string           // e.g. "120 × 90 cm"
  technique: string      // e.g. "Oil on canvas"
  price: number          // in EUR
  description?: string
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
  artsy_profile_url?: string    // from Artsy enrichment
  bio_source_url?: string
  bio_last_synced_at?: string
  artworks?: Artwork[]
}
```

---

## Favourites & Session

No login. Three `localStorage` keys:

| Key | Value |
|---|---|
| `rc_artfair_favorites` | JSON array of artwork IDs — source of truth, synced to Supabase in background |
| `rc_artfair_session_id` | UUID generated on first visit, passed to all API routes |
| `rc_artfair_lang` | `"en"` or `"lv"` — language preference |

`FavoriteButton` hydrates state client-side via `useEffect` (avoids SSR mismatch). Every toggle fires `POST /api/favorites` as a background sync (fire-and-forget).

---

## Key Patterns

- **Server Components by default** — only interactive components use `"use client"`.
- **`@/` alias** maps to project root (`tsconfig.json` paths).
- **`params` is a Promise in Next.js 16** — pages use `const { id } = await params`.
- **Images** use `next/image` with `loading="lazy"` on cards, `priority` on detail/hero.
- **Masonry** is CSS `columns-*` with `break-inside-avoid` — no JS library.
- **All writes** go through `app/api/` route handlers — never write to Supabase directly from client components.
- **Translations** — wrap every UI string in `t("key")` from `useTranslation()`. Add missing keys to `lib/i18n.ts`.
- **Image resizing** — uploading to `artwork-images` bucket triggers the `resize-image` edge function automatically via a database webhook.

---

## Running Locally

```bash
cp .env.local.example .env.local   # add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run dev
# → http://localhost:3000
```

Scripts that write to Storage also need:
```bash
SUPABASE_SERVICE_ROLE_KEY=...
```

Build + type check:
```bash
npm run build
```

---

## Importing Artwork Data

```bash
npm run import scripts/artworks-template.csv   # import artworks from CSV
npm run enrich:artists                         # scrape artist bios from Artsy
npm run upload:style-images                    # upload style card images
npm run upload:style-images -- "C:/path/to/images"  # upload from custom path
```

The import script looks up artists by name (creates them if new) and inserts artworks. Images go into the `artwork-images` bucket; thumbnails are generated automatically by the `resize-image` edge function.

---

## Deployment

```bash
npx vercel --prod
```

Env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are set in Vercel — do not commit `.env.local`.

---

## API Routes

| Route | Method | Body / Query | Purpose |
|---|---|---|---|
| `/api/favorites` | POST | `{ session_id, artwork_id, action: "add"\|"remove" }` | Add or remove a favourite |
| `/api/favorites` | GET | `?session_id=...` | List favourite IDs for a session |
| `/api/interest` | POST | `{ session_id, artwork_id, contact_info?, notes? }` | Submit an interest enquiry |
| `/api/views` | POST | `{ session_id, artwork_id }` | Log a view event |
| `/api/recommendations` | GET | `?session_id=...&exclude=id1,id2` | Get personalised artwork suggestions |
| `/api/artworks` | GET | `?ids=id1,id2` or `?offset=0&limit=24` | Fetch artworks by ID or paginated |

