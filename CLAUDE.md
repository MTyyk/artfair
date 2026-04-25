# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

This is a competition project — a mobile-first web app for the Riga Contemporary Art Fair. Still in active development. A demo to be submitted to judges.

- Full technical requirements: `artfair.md`
- Current status, stack, and file structure: `README.md`

## Rules

- Ask clarifying questions before making assumptions about features or direction
- When unsure, say so — don't guess at requirements
- Don't add features, abstractions, or refactors beyond what's asked
- Keep the project simple: no heavy dependencies, no overengineering
- Explain code in a basic, begginer friendly way, with comments and documentation
- App must load fast and run smoothly on mobile devices, so optimize for performance

## Stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Database & Storage:** Supabase (PostgreSQL + Storage bucket `artwork-images`)
- **Deployment:** Vercel — project `riga-art-viewer`, deploy manually with `npx vercel --prod`
- **CLI tools installed:** `supabase` and `vercel` (both as dev dependencies, use via `npx`)

## Key commands

```bash
npm run dev                   # local dev server
npm run build                 # production build + type check
npm run import data/file.csv  # import artworks from CSV
npx vercel --prod             # deploy to production
npx supabase db query --linked "SELECT ..."  # run SQL on remote DB
```

## Environment

Two env vars required — already set in Vercel, copy `.env.local.example` to `.env.local` locally:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

No service role key needed. No auth — the app is fully anonymous.
