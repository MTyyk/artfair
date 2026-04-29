/**
 * Upload style category images to Supabase Storage.
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-style-images.mjs
 *   node --env-file=.env.local scripts/upload-style-images.mjs "C:/path/to/local/style-images"
 *
 * Defaults to the local design-reference folder so the current designer PNGs
 * can be uploaded once without making them runtime assets.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "fs";
import { extname, resolve } from "path";

const SOURCE_DIR = resolve(process.argv[2] ?? "design-reference");
const BUCKET = "style-images";

const STYLE_ASSETS = [
  { source: "S_painting.png", objectPath: "categories/painting.png" },
  { source: "S_abstract.png", objectPath: "categories/abstract.png" },
  { source: "S_figurative.png", objectPath: "categories/figurative.png" },
  { source: "S_landscape.png", objectPath: "categories/landscape.png" },
  { source: "S_photography.png", objectPath: "categories/photography.png" },
  { source: "S_print.png", objectPath: "categories/prints.png" },
  { source: "S_street art.png", objectPath: "categories/street-art-pop.png" },
  { source: "S_mixed_media.png", objectPath: "categories/mixed-media.png" },
];

const CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
    process.exit(1);
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in .env.local");
    console.error("Get it from: Supabase Dashboard -> Project Settings -> API -> service_role");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log(`Uploading ${STYLE_ASSETS.length} style images from ${SOURCE_DIR} to bucket \"${BUCKET}\"...\n`);

  let uploaded = 0;
  let failed = 0;

  for (const asset of STYLE_ASSETS) {
    const filePath = resolve(SOURCE_DIR, asset.source);

    if (!existsSync(filePath)) {
      console.error(`  x ${asset.source}: file not found`);
      failed++;
      continue;
    }

    const buffer = readFileSync(filePath);
    const contentType = CONTENT_TYPES[extname(filePath).toLowerCase()] ?? "application/octet-stream";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(asset.objectPath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error(`  x ${asset.source} -> ${asset.objectPath}: ${error.message}`);
      failed++;
      continue;
    }

    console.log(`  ok ${asset.source} -> ${asset.objectPath}`);
    uploaded++;
  }

  console.log(`\nDone. ${uploaded} uploaded, ${failed} failed.`);

  if (uploaded > 0) {
    console.log("\nPublic URL pattern:");
    console.log(`  ${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/categories/<slug>.png`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});