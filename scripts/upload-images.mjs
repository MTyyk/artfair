/**
 * Upload artwork images to Supabase Storage
 * Usage: node --env-file=.env.local scripts/upload-images.mjs
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * (Dashboard → Project Settings → API → service_role secret)
 *
 * Uploads all .jpg files from data/images/ to the artwork-images bucket.
 * Safe to re-run — uses upsert so existing files are overwritten.
 */

import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync } from "fs";
import { resolve, extname, basename } from "path";

const IMAGES_DIR = resolve("data/images");
const BUCKET = "artwork-images";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
    console.error("Get it from: Supabase Dashboard → Project Settings → API → service_role");
    process.exit(1);
  }

  const files = readdirSync(IMAGES_DIR).filter(f => extname(f).toLowerCase() === ".jpg");
  console.log(`Uploading ${files.length} images to bucket "${BUCKET}"...\n`);

  let ok = 0, failed = 0;

  for (const file of files) {
    const filePath = resolve(IMAGES_DIR, file);
    const buffer = readFileSync(filePath);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(file, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error(`  ✗ ${file}: ${error.message}`);
      failed++;
    } else {
      console.log(`  ✓ ${file}`);
      ok++;
    }
  }

  console.log(`\nDone. ${ok} uploaded, ${failed} failed.`);
  if (ok > 0) {
    console.log(`\nPublic URL pattern:`);
    console.log(`  ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/<filename>`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
