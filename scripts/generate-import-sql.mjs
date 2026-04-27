/**
 * Generates import.sql from artworks-enriched.csv
 * Usage: node --env-file=.env.local scripts/generate-import-sql.mjs
 * Then:  npx supabase db query --linked -f import.sql
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!SUPABASE_URL) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL"); process.exit(1); }

function parseCSV(content) {
  const lines = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim().split("\n");
  const headers = parseLine(lines[0]).map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.every(v => !v.trim())) continue;
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
    if (ch === '"' && !inQuotes) { inQuotes = true; }
    else if (ch === '"' && inQuotes) {
      if (line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = false;
    } else if (ch === "," && !inQuotes) { result.push(current); current = ""; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

function escape(str) {
  return str.replace(/'/g, "''");
}

const rows = parseCSV(readFileSync(resolve("data/artworks-enriched.csv"), "utf-8"));

// Collect unique artist names
const artistNames = [...new Set(rows.map(r => r.artist_name.trim()).filter(Boolean))];

const lines = [];
lines.push("-- Auto-generated import SQL");
lines.push("-- Artists");
for (const name of artistNames) {
  lines.push(`INSERT INTO artists (name) VALUES ('${escape(name)}') ON CONFLICT DO NOTHING;`);
}

lines.push("");
lines.push("-- Artworks");
for (const row of rows) {
  const artistName = row.artist_name?.trim();
  const title = row.title?.trim();
  if (!artistName || !title) continue;

  const imageUrl = row.image_file?.trim()
    ? `${SUPABASE_URL}/storage/v1/object/public/artwork-images/images/${row.image_file.trim()}`
    : (row.image_url?.trim() || null);

  const styleTags = row.style_tags
    ? row.style_tags.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const year = row.year ? parseInt(row.year) : null;
  const price = row.price ? parseFloat(row.price) : null;
  const size = row.size?.trim() || null;
  const technique = row.technique?.trim() || null;
  const description = row.description?.trim() || null;

  const styleTagsSQL = styleTags.length > 0
    ? `ARRAY[${styleTags.map(t => `'${escape(t)}'`).join(",")}]`
    : "ARRAY[]::text[]";

  lines.push(
    `INSERT INTO artworks (title, artist_id, year, size, technique, price, description, image_url, style_tags) VALUES (` +
    `'${escape(title)}', ` +
    `(SELECT id FROM artists WHERE name='${escape(artistName)}' LIMIT 1), ` +
    `${year ?? "NULL"}, ` +
    `${size ? `'${escape(size)}'` : "NULL"}, ` +
    `${technique ? `'${escape(technique)}'` : "NULL"}, ` +
    `${price ?? "NULL"}, ` +
    `${description ? `'${escape(description)}'` : "NULL"}, ` +
    `${imageUrl ? `'${escape(imageUrl)}'` : "NULL"}, ` +
    `${styleTagsSQL}` +
    `);`
  );
}

const sql = lines.join("\n");
writeFileSync("import.sql", sql, "utf-8");
console.log(`Generated import.sql with ${artistNames.length} artists and ${rows.length} artworks.`);
console.log(`Run: npx supabase db query --linked -f import.sql`);
