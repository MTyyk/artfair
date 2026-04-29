// node --env-file=.env.local scripts/backfill-thumbs.mjs
// Calls the resize-image edge function for every artwork that has an image_url.
// Safe to re-run — the edge function uses upsert:true.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/resize-image`;

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY);

const { data: artworks, error } = await supabase
  .from("artworks")
  .select("id, image_url")
  .not("image_url", "is", null);

if (error) {
  console.error("Failed to fetch artworks:", error.message);
  process.exit(1);
}

console.log(`Processing ${artworks.length} artworks...`);

let ok = 0, fail = 0;

for (const artwork of artworks) {
  // Derive the storage path from the public URL
  // e.g. ".../artwork-images/images/abc.jpg" → "images/abc.jpg"
  const match = artwork.image_url.match(/artwork-images\/(.+)$/);
  if (!match) {
    console.warn(`  ⚠ Could not parse path from: ${artwork.image_url}`);
    fail++;
    continue;
  }
  const name = match[1]; // e.g. "images/abc.jpg"

  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bucket_id: "artwork-images", name }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log(`  ✓ ${name}`);
    ok++;
  } else {
    console.error(`  ✗ ${name}: ${text}`);
    fail++;
  }
}

console.log(`\nDone — ${ok} succeeded, ${fail} failed.`);
