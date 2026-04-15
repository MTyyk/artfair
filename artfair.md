Project Technical Requirements

1. # Platform

- Mobile-first web application (PWA preferred)

- Must work on:

  - iOS Safari

  - Android Chrome

- No install required

- Fast load (2s initial load target)

2. # Core System Architecture


## Frontend

- Framework: React / Next.js (recommended)

- Responsive (mobile-first mandatory)

- State management (local or server)


## Backend

- Database (required):

  - artworks

  - artists

  - user interactions (views, favorites, interest)

- API layer (REST or RPC)


## Storage

- Images stored in:

  - cloud storage (Supabase / S3 / similar)

3. # Data Model (minimum)


## Artwork

- id

- title

- artist\_id

- year

- size

- technique

- price

- description

- image\_url


## Artist

- id

- name

- bio (optional)


## User Session (no login required)

- session\_id

- preferences (optional)


## Favorites

- session\_id

- artwork\_id


## Interest

- artwork\_id

- contact info (optional)

4. # Core Features (MANDATORY)


## 4.1 Artwork Listing

- Grid/list view

- Image + basic info

- Fast loading (lazy load)


## 4.2 Artwork Detail Page

- Full info:

  - artist

  - title

  - price

  - description

- Clear CTA:

  - “Save”

  - “Interested”


## 4.3 Favorites System

- Save/remove artworks

- Must work WITHOUT login

- Persistence options:

  - localStorage (OK)

  - backend (better)


## 4.4 Interest / Contact Flow

- Simple interaction:

  - button → form OR trigger

- Data captured:

  - artwork\_id

  - optional contact


## 4.5 Personalization (minimum level)

    At least ONE:

- onboarding (style / interest selection)

- or behavior-based (based on viewed/saved)


# 5. Optional

## 5.1 Recommendation System

- Based on:

  - viewed artworks

  - saved artworks

- Output:

  - “Similar works”


## 5.2 AI Content

- Simplified explanations

- Multi-level:

  - beginner

  - advanced


## 5.3 AR / Preview (optional)

- Show artwork in room (mock acceptable)


## 5.4 Analytics

    Track:

- views

- favorites

- interest clicks


# 6. Data Input Requirements

## Minimum

- Manual import supported


## Input format:

- Excel / CSV:

  - artist

  - title

  - year

  - size

  - technique

  - price


## Images:

- uploaded separately or linked


## Bonus:

- import script / admin panel


# 7. Performance Requirements

- Page load < 2s

- Image optimization required

- No heavy blocking scripts

- Must work on average mobile network


# 8. UX Requirements

- No confusing flows

- Max 2–3 taps to reach artwork detail

- Clear actions:

  - Save

  - Learn

  - Interested

- Readability:

  - simple language

  - short text blocks


# 9. Authentication

- NOT required

- Must support anonymous usage

<!---->

    Optional:

- lightweight session tracking


# 10. Localization

- Must support:

  - Latvian

  - English

<!---->

    Optional:

- dynamic switching


# 11. Integration

- Must be deployable as:

  - standalone app

  - or embedded in Riga Contemporary website(simple embed or button to app)


# 12. Deployment

- Must be publicly accessible via URL

<!---->

    Recommended:

- Vercel / Netlify


# 13. Deliverables

- Live working app (URL)

- Source code (GitHub)

- Short demo / walkthrough

- Basic documentation:

  - how it works

  - tech stack

  - key decisions


# 14. Constraints

- No overengineering

- No unnecessary features

- Focus on:

  - usability

  - clarity

  - speed


# 15. Success Criteria (TECH)

- Works without login

- Handles real dataset

- No crashes on mobile

- Clear user flow:

  - browse → understand → save → express interest
