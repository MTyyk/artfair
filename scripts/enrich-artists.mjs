/**
 * Artist enrichment script.
 *
 * Artsy-first workflow:
 * 1. Query artists from Supabase.
 * 2. Resolve an Artsy artist profile URL, starting with a deterministic slug.
 * 3. Scrape biography text from the resolved artist page.
 * 4. Persist bio + source metadata back to Supabase.
 *
 * Optional explicit overrides live in data/artist-source-overrides.json.
 * Use them for low-confidence matches or non-Artsy fallback biographies.
 *
 * Usage:
 *   npm run enrich:artists
 *   npm run enrich:artists -- --limit=5 --dry-run
 *   npm run enrich:artists -- --artist="Damien Hirst" --headed --force
 */

import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ARTSY_BASE_URL = "https://www.artsy.net";
const DEFAULT_OVERRIDES_PATH = resolve("data/artist-source-overrides.json");
const DEFAULT_REPORT_PATH = resolve("data/artist-enrichment-report.json");
const BROWSER_TIMEOUT = 35_000;

function parseArgs(argv) {
  return argv.reduce(
    (options, argument) => {
      if (argument === "--dry-run") options.dryRun = true;
      else if (argument === "--force") options.force = true;
      else if (argument === "--headed") options.headed = true;
      else if (argument === "--fresh-browser-per-artist") options.freshBrowserPerArtist = true;
      else if (argument.startsWith("--limit=")) options.limit = Number(argument.split("=")[1]);
      else if (argument.startsWith("--cooldown-ms=")) options.cooldownMs = Number(argument.split("=")[1]);
      else if (argument.startsWith("--artist=")) options.artist = argument.slice("--artist=".length);
      else if (argument.startsWith("--overrides=")) options.overridesPath = resolve(argument.slice("--overrides=".length));
      else if (argument.startsWith("--report=")) options.reportPath = resolve(argument.slice("--report=".length));
      return options;
    },
    {
      dryRun: false,
      force: false,
      headed: false,
      freshBrowserPerArtist: false,
      limit: undefined,
      cooldownMs: 1200,
      artist: undefined,
      overridesPath: DEFAULT_OVERRIDES_PATH,
      reportPath: DEFAULT_REPORT_PATH,
    }
  );
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name} in environment.`);
  }
  return value;
}

function loadOverrides(filePath) {
  if (!existsSync(filePath)) return {};
  return JSON.parse(readFileSync(filePath, "utf-8"));
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function looksLikeArtsyBoilerplate(value) {
  const normalized = normalizeWhitespace(value);

  return (
    /^explore .*?(biography|achievements|artworks|auction results|shows).*?on artsy\.?/i.test(normalized) ||
    /^discover artworks/i.test(normalized) ||
    /^buy and bid on art/i.test(normalized)
  );
}

function bioNeedsRefresh(value) {
  if (!value) return true;
  return looksLikeArtsyBoilerplate(value);
}

function stripArtsyBoilerplatePrefix(value) {
  const normalized = normalizeWhitespace(value);

  return normalized.replace(
    /^Explore .*?(?:biography|achievements|artworks|auction results|shows).*?on Artsy\.\s*/i,
    ""
  );
}

function normalizeName(value) {
  return normalizeWhitespace(
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/&/g, " and ")
      .replace(/[’']/g, "")
      .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
      .toLowerCase()
  );
}

function tokenizeName(value) {
  return normalizeName(value).split(" ").filter(Boolean);
}

function slugifyName(value) {
  return tokenizeName(value).join("-");
}

function buildSlugCandidates(name) {
  const baseTokens = tokenizeName(name);
  const candidates = new Set();

  if (baseTokens.length) candidates.add(baseTokens.join("-"));

  const withoutAnd = baseTokens.filter((token) => token !== "and");
  if (withoutAnd.length) candidates.add(withoutAnd.join("-"));

  const withoutInitials = baseTokens.filter((token) => token.length > 1);
  if (withoutInitials.length) candidates.add(withoutInitials.join("-"));

  return [...candidates].filter(Boolean);
}

function cleanArtsyTitle(value) {
  return normalizeWhitespace(
    value
      .replace(/\|\s*Artsy.*$/i, "")
      .replace(/^Buy\s+/i, "")
      .replace(/^Discover\s+/i, "")
  );
}

function scoreNameMatch(expected, candidate) {
  const expectedTokens = tokenizeName(expected);
  const candidateTokens = tokenizeName(candidate);

  if (!expectedTokens.length || !candidateTokens.length) return 0;
  if (expectedTokens.join(" ") === candidateTokens.join(" ")) return 1;

  const matches = expectedTokens.filter((token) => candidateTokens.includes(token)).length;
  const expectedCoverage = matches / expectedTokens.length;
  const candidateCoverage = matches / candidateTokens.length;

  return Number(((expectedCoverage * 0.7) + (candidateCoverage * 0.3)).toFixed(3));
}

function parseJsonLdBlocks(blocks) {
  const objects = [];

  function collect(value) {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(collect);
      return;
    }
    if (typeof value === "object") {
      objects.push(value);
      for (const nested of Object.values(value)) collect(nested);
    }
  }

  for (const block of blocks) {
    try {
      collect(JSON.parse(block));
    } catch {
      // Ignore invalid JSON-LD blocks.
    }
  }

  return objects;
}

function chooseBioCandidate(...candidates) {
  for (const candidate of candidates) {
    if (!candidate) continue;

    const normalized = normalizeWhitespace(candidate);
    const cleaned = stripArtsyBoilerplatePrefix(normalized);

    if (cleaned.length >= 80 && !looksLikeArtsyBoilerplate(cleaned)) {
      return cleaned;
    }

    if (normalized.length < 80) continue;
    if (looksLikeArtsyBoilerplate(normalized)) continue;

    return normalized;
  }

  return "";
}

function buildVisibleBio(paragraphs) {
  const selectedParagraphs = [];

  for (const paragraph of paragraphs) {
    const normalized = normalizeWhitespace(paragraph);
    if (!normalized || looksLikeArtsyBoilerplate(normalized)) continue;
    if (selectedParagraphs.includes(normalized)) continue;

    selectedParagraphs.push(normalized);
    if (selectedParagraphs.length === 3) break;
  }

  return selectedParagraphs.join(" ");
}

async function settlePage(page) {
  await page.waitForLoadState("domcontentloaded", { timeout: BROWSER_TIMEOUT }).catch(() => {});
  await page.waitForTimeout(1500);
}

async function extractPageSnapshot(page) {
  return page.evaluate(() => {
    const meta = (selector) => document.querySelector(selector)?.getAttribute("content")?.trim() || "";
    const ldJsonBlocks = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((node) => node.textContent?.trim() || "")
      .filter(Boolean);

    const visibleBioParagraphs = [...document.querySelectorAll("main p, article p, section p, div p")]
      .map((node) => node.textContent?.trim() || "")
      .filter((text) => text.length > 80)
      .slice(0, 12);

    const artistLinks = [...new Set(
      [...document.querySelectorAll('a[href^="/artist/"]')]
        .map((link) => link.getAttribute("href") || "")
        .filter(Boolean)
    )].slice(0, 12);

    return {
      title: document.title,
      heading: document.querySelector("h1")?.textContent?.trim() || "",
      description: meta('meta[name="description"]'),
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      bodyText: document.body?.innerText?.slice(0, 4000) || "",
      ldJsonBlocks,
      visibleBioParagraphs,
      artistLinks,
    };
  });
}

function getJsonLdArtistInfo(snapshot) {
  const objects = parseJsonLdBlocks(snapshot.ldJsonBlocks);

  for (const object of objects) {
    const type = object["@type"];
    const types = Array.isArray(type) ? type : [type];
    if (!types.filter(Boolean).some((value) => /person/i.test(String(value)))) continue;

    return {
      name: typeof object.name === "string" ? object.name : "",
      description: typeof object.description === "string" ? object.description : "",
      url: typeof object.url === "string" ? object.url : "",
    };
  }

  return {
    name: "",
    description: "",
    url: "",
  };
}

function isChallengePage(snapshot) {
  const combinedText = `${snapshot.title} ${snapshot.bodyText}`;
  return /just a moment/i.test(combinedText) || /checking your browser/i.test(combinedText);
}

async function inspectArtistProfile(page, profileUrl, artistName) {
  try {
    await page.goto(profileUrl, { waitUntil: "domcontentloaded", timeout: BROWSER_TIMEOUT });
    await settlePage(page);
  } catch (error) {
    return {
      ok: false,
      status: "load-error",
      error: error instanceof Error ? error.message : String(error),
      profileUrl,
    };
  }

  const snapshot = await extractPageSnapshot(page);

  if (isChallengePage(snapshot)) {
    return {
      ok: false,
      status: "challenge",
      profileUrl,
    };
  }

  const jsonLdInfo = getJsonLdArtistInfo(snapshot);
  const candidateName = cleanArtsyTitle(jsonLdInfo.name || snapshot.heading || snapshot.ogTitle || snapshot.title);
  const matchScore = Math.max(
    scoreNameMatch(artistName, candidateName),
    scoreNameMatch(artistName, cleanArtsyTitle(snapshot.heading))
  );
  const visibleBio = buildVisibleBio(snapshot.visibleBioParagraphs);

  const bio = chooseBioCandidate(
    visibleBio,
    jsonLdInfo.description,
    snapshot.ogDescription,
    snapshot.description
  );

  return {
    ok: matchScore >= 0.85,
    status: matchScore >= 0.85 ? "matched" : "mismatch",
    profileUrl: jsonLdInfo.url || profileUrl.split("?")[0],
    candidateName,
    matchScore,
    bio,
  };
}

async function resolveFromSlug(profilePage, artistName) {
  for (const slug of buildSlugCandidates(artistName)) {
    const profileUrl = `${ARTSY_BASE_URL}/artist/${slug}`;
    const result = await inspectArtistProfile(profilePage, profileUrl, artistName);
    if (result.ok) {
      return {
        ...result,
        resolution: "slug",
      };
    }
  }

  return null;
}

async function resolveFromSearch(searchPage, profilePage, artistName) {
  try {
    await searchPage.goto(`${ARTSY_BASE_URL}/search?term=${encodeURIComponent(artistName)}`, {
      waitUntil: "domcontentloaded",
      timeout: BROWSER_TIMEOUT,
    });
    await settlePage(searchPage);
  } catch (error) {
    return {
      ok: false,
      status: "search-error",
      error: error instanceof Error ? error.message : String(error),
    };
  }

  const snapshot = await extractPageSnapshot(searchPage);
  if (isChallengePage(snapshot)) {
    return {
      ok: false,
      status: "challenge",
    };
  }

  let bestResult = null;

  for (const href of snapshot.artistLinks) {
    const profileUrl = new URL(href, ARTSY_BASE_URL).toString();
    const result = await inspectArtistProfile(profilePage, profileUrl, artistName);
    if (!bestResult || (result.matchScore ?? 0) > (bestResult.matchScore ?? 0)) {
      bestResult = result;
    }
    if (result.ok) {
      return {
        ...result,
        resolution: "search",
      };
    }
  }

  return bestResult;
}

async function resolveArtsyProfile(pages, artistName, existingProfileUrl) {
  if (existingProfileUrl) {
    const result = await inspectArtistProfile(pages.profilePage, existingProfileUrl, artistName);
    if (result.ok) {
      return {
        ...result,
        resolution: "existing-url",
      };
    }
  }

  const slugResult = await resolveFromSlug(pages.profilePage, artistName);
  if (slugResult) return slugResult;

  const searchResult = await resolveFromSearch(pages.searchPage, pages.profilePage, artistName);
  if (searchResult?.ok) return searchResult;

  return searchResult ?? {
    ok: false,
    status: "not-found",
  };
}

function buildUpdatePayload(artist, enrichmentResult) {
  const nextBio = enrichmentResult.bio || artist.bio || null;
  const nextProfileUrl = enrichmentResult.profileUrl || artist.artsy_profile_url || null;
  const nextSourceUrl = enrichmentResult.sourceUrl || enrichmentResult.profileUrl || artist.bio_source_url || null;

  return {
    bio: nextBio,
    artsy_profile_url: nextProfileUrl,
    bio_source_url: nextSourceUrl,
    bio_last_synced_at: new Date().toISOString(),
  };
}

function payloadChanged(artist, payload) {
  return (
    (payload.bio ?? null) !== (artist.bio ?? null) ||
    (payload.artsy_profile_url ?? null) !== (artist.artsy_profile_url ?? null) ||
    (payload.bio_source_url ?? null) !== (artist.bio_source_url ?? null)
  );
}

function applyOverride(override, artist) {
  if (!override) return null;

  const bio = typeof override.bio === "string" ? normalizeWhitespace(override.bio) : artist.bio || "";
  const profileUrl = typeof override.artsyProfileUrl === "string" ? override.artsyProfileUrl : artist.artsy_profile_url || "";
  const sourceUrl = typeof override.bioSourceUrl === "string"
    ? override.bioSourceUrl
    : (profileUrl || artist.bio_source_url || "");

  if (!bio && !profileUrl && !sourceUrl) return null;

  return {
    ok: true,
    status: "override",
    resolution: "override",
    bio,
    profileUrl,
    sourceUrl,
    matchScore: 1,
    candidateName: artist.name,
  };
}

function ensureReportDirectory(filePath) {
  mkdirSync(resolve(filePath, ".."), { recursive: true });
}

async function createBrowserPages(options) {
  const browser = await chromium.launch({ headless: !options.headed });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
    locale: "en-GB",
  });

  await context.route("**/*", (route) => {
    const resourceType = route.request().resourceType();
    if (["image", "media", "font"].includes(resourceType)) {
      return route.abort();
    }
    return route.continue();
  });

  return {
    browser,
    pages: {
      searchPage: await context.newPage(),
      profilePage: await context.newPage(),
    },
  };
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return "NULL";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function runLinkedSql(sql) {
  if (process.platform === "win32") {
    const escapedSql = sql.replace(/"/g, '\\"');
    return execSync(`cmd.exe /c npx supabase db query --linked "${escapedSql}"`, {
      stdio: "pipe",
      encoding: "utf-8",
    });
  }

  return execSync(`npx supabase db query --linked ${JSON.stringify(sql)}`, {
    stdio: "pipe",
    encoding: "utf-8",
  });
}

function updateArtistViaLinkedDb(artist, payload, schemaHasEnrichmentFields) {
  const assignments = [
    `bio = ${sqlLiteral(payload.bio ?? null)}`,
  ];

  if (schemaHasEnrichmentFields) {
    assignments.push(`artsy_profile_url = ${sqlLiteral(payload.artsy_profile_url ?? null)}`);
    assignments.push(`bio_source_url = ${sqlLiteral(payload.bio_source_url ?? null)}`);
    assignments.push(`bio_last_synced_at = ${sqlLiteral(payload.bio_last_synced_at ?? null)}::timestamptz`);
  }

  const sql = `update artists set ${assignments.join(", ")} where id = ${sqlLiteral(artist.id)}::uuid;`;
  runLinkedSql(sql);
}

async function enrichArtist(supabase, artist, pages, options, override) {
  const overrideResult = applyOverride(override, artist);
  const result = overrideResult ?? await resolveArtsyProfile(pages, artist.name, artist.artsy_profile_url);

  if (!result?.ok) {
    return {
      artist: artist.name,
      status: result?.status ?? "not-found",
      matchScore: result?.matchScore ?? 0,
      profileUrl: result?.profileUrl ?? artist.artsy_profile_url ?? null,
      reason: result?.error ?? null,
    };
  }

  const payload = buildUpdatePayload(artist, result);
  const changed = payloadChanged(artist, payload);

  if (!changed && !options.force) {
    return {
      artist: artist.name,
      status: "unchanged",
      matchScore: result.matchScore ?? 0,
      profileUrl: payload.artsy_profile_url,
      resolution: result.resolution,
    };
  }

  if (!options.dryRun) {
    try {
      if (options.writeMode === "service-role") {
        const { error } = await supabase
          .from("artists")
          .update(payload)
          .eq("id", artist.id);

        if (error) throw error;
      } else if (options.writeMode === "linked-db") {
        updateArtistViaLinkedDb(artist, payload, options.schemaHasEnrichmentFields);
      }
    } catch (error) {
      return {
        artist: artist.name,
        status: "update-error",
        matchScore: result.matchScore ?? 0,
        profileUrl: payload.artsy_profile_url,
        resolution: result.resolution,
        reason: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return {
    artist: artist.name,
    status: options.dryRun ? "dry-run" : "updated",
    matchScore: result.matchScore ?? 0,
    profileUrl: payload.artsy_profile_url,
    resolution: result.resolution,
    bioLength: payload.bio?.length ?? 0,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const writeMode = options.dryRun
    ? "none"
    : (process.env.SUPABASE_SERVICE_ROLE_KEY ? "service-role" : "linked-db");

  const supabaseKey = options.dryRun || writeMode === "linked-db"
    ? (process.env.SUPABASE_SERVICE_ROLE_KEY || requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
    : requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const overrides = loadOverrides(options.overridesPath);

  let schemaHasEnrichmentFields = true;

  let { data: artists, error } = await supabase
    .from("artists")
    .select("id, name, bio, artsy_profile_url, bio_source_url")
    .order("name", { ascending: true });

  if (error?.code === "42703") {
    schemaHasEnrichmentFields = false;

    const fallback = await supabase
      .from("artists")
      .select("id, name, bio")
      .order("name", { ascending: true });

    artists = (fallback.data ?? []).map((artist) => ({
      ...artist,
      artsy_profile_url: null,
      bio_source_url: null,
    }));
    error = fallback.error;
  }

  if (error) throw error;

  options.writeMode = writeMode;
  options.schemaHasEnrichmentFields = schemaHasEnrichmentFields;

  let queue = artists ?? [];

  if (options.artist) {
    queue = queue.filter((artist) => normalizeName(artist.name) === normalizeName(options.artist));
  }

  if (!options.force) {
    queue = queue.filter((artist) => {
      if (overrides[artist.name]) return true;
      if (bioNeedsRefresh(artist.bio)) return true;
      if (!schemaHasEnrichmentFields) return false;
      return !artist.artsy_profile_url;
    });
  }

  if (typeof options.limit === "number" && Number.isFinite(options.limit)) {
    queue = queue.slice(0, options.limit);
  }

  if (!queue.length) {
    console.log("No artists matched the current filters.");
    return;
  }

  console.log(`Enriching ${queue.length} artist(s)...\n`);

  const report = [];

  let sharedRuntime = null;

  try {
    if (!options.freshBrowserPerArtist) {
      sharedRuntime = await createBrowserPages(options);
    }

    for (const [index, artist] of queue.entries()) {
      console.log(`[${index + 1}/${queue.length}] ${artist.name}`);

      const runtime = sharedRuntime ?? await createBrowserPages(options);

      try {
        const result = await enrichArtist(supabase, artist, runtime.pages, options, overrides[artist.name]);
        report.push(result);

        console.log(`  -> ${result.status}${result.profileUrl ? ` (${result.profileUrl})` : ""}`);
        if (result.reason) console.log(`     ${result.reason}`);
      } finally {
        if (!sharedRuntime) {
          await runtime.browser.close();
        }
      }

      await sleep(options.cooldownMs + Math.floor(Math.random() * 500));
    }
  } finally {
    if (sharedRuntime) {
      await sharedRuntime.browser.close();
    }
  }

  ensureReportDirectory(options.reportPath);
  writeFileSync(
    options.reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        options: {
          dryRun: options.dryRun,
          force: options.force,
          writeMode,
          freshBrowserPerArtist: options.freshBrowserPerArtist,
          cooldownMs: options.cooldownMs,
          artist: options.artist ?? null,
          limit: options.limit ?? null,
        },
        summary: report.reduce(
          (summary, item) => {
            summary[item.status] = (summary[item.status] ?? 0) + 1;
            return summary;
          },
          {}
        ),
        results: report,
      },
      null,
      2
    )
  );

  console.log(`\nReport written to ${options.reportPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});