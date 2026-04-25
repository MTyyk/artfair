/**
 * Artwork CSV importer
 * Usage: node --env-file=.env.local scripts/import.mjs path/to/artworks.csv
 *
 * CSV headers (first row):
 *   artist_name, title, year, size, technique, price, description, image_url
 *
 * - artist_name: matched by name; creates a new artist row if not found
 * - image_url: use a full URL (https://...) or a Supabase Storage public URL
 * - All fields except artist_name and title are optional
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// RFC 4180 CSV parser (handles quoted fields with embedded commas/newlines)
function parseCSV(content) {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
  const headers = parseLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.every((v) => !v.trim())) continue; // skip blank rows
    const row = {};
    headers.forEach((h, idx) => (row[h] = (values[idx] ?? "").trim()));
    rows.push(row);
  }
  return rows;
}

function parseLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inQuotes) {
      inQuotes = true;
    } else if (ch === '"' && inQuotes) {
      if (line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = false;
    } else if (ch === "," && !inQuotes) {
      result.push(current); current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node --env-file=.env.local scripts/import.mjs path/to/artworks.csv");
    process.exit(1);
  }

  const content = readFileSync(resolve(csvPath), "utf-8");
  const rows = parseCSV(content);
  console.log(`Importing ${rows.length} artworks…\n`);

  const artistCache = {};

  for (const row of rows) {
    const artistName = row.artist_name?.trim();
    if (!artistName || !row.title?.trim()) {
      console.warn(`  Skipping row with missing artist or title:`, row);
      continue;
    }

    // Resolve artist ID (cache to avoid repeated lookups)
    if (!artistCache[artistName]) {
      const { data: existing } = await supabase
        .from("artists")
        .select("id")
        .eq("name", artistName)
        .maybeSingle();

      if (existing) {
        artistCache[artistName] = existing.id;
      } else {
        const { data: created, error } = await supabase
          .from("artists")
          .insert({ name: artistName })
          .select("id")
          .single();
        if (error) { console.error(`  ✗ Could not create artist "${artistName}":`, error.message); continue; }
        artistCache[artistName] = created.id;
        console.log(`  + Artist created: ${artistName}`);
      }
    }

    const { error } = await supabase.from("artworks").insert({
      title: row.title.trim(),
      artist_id: artistCache[artistName],
      year: row.year ? parseInt(row.year) : null,
      size: row.size || null,
      technique: row.technique || null,
      price: row.price ? parseFloat(row.price) : null,
      description: row.description || null,
      image_url: row.image_url || null,
    });

    if (error) {
      console.error(`  ✗ "${row.title}":`, error.message);
    } else {
      console.log(`  ✓ ${row.title} — ${artistName}`);
    }
  }

  console.log("\nDone.");
}

main().catch((err) => { console.error(err); process.exit(1); });
