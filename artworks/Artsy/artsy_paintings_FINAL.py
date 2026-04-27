# ─────────────────────────────────────────────
#  Artsy Painting Downloader — v2
#
#  Strategy:
#   Phase 1 — Scroll https://www.artsy.net/collection/painting
#             to collect 100 artwork slugs (page links + GraphQL)
#   Phase 2 — Visit each artwork page individually for full
#             metadata (medium, dimensions, price, description)
#             and highest-quality image (og:image)
#   Phase 3 — Download all images and save CSV
#
#  Already-downloaded images are skipped automatically.
# ─────────────────────────────────────────────

DOWNLOAD_FOLDER = "./paintings"
CSV_FILE        = "./paintings.csv"
HOW_MANY        = 100
COLLECTION_URL  = "https://www.artsy.net/collection/painting"

# The collection page is a curated showcase (~30 artworks, then stops loading).
# When it stalls we fall through to the full gene page, which has real infinite
# scroll and thousands of paintings.
SCROLL_URLS = [
    "https://www.artsy.net/collection/painting",
    "https://www.artsy.net/gene/painting",
]

import asyncio, re, os, csv, html, urllib.request, random
from playwright.async_api import async_playwright

os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)


def clean_filename(s):
    """Remove characters that are not allowed in filenames."""
    return re.sub(r'[\\/*?:"<>|]', "_", str(s))[:80].strip()


def strip_html(s):
    """Remove HTML tags and decode HTML entities (e.g. &amp; → &)."""
    if not s:
        return ""
    s = re.sub(r'<[^>]+>', '', str(s))
    return html.unescape(s).strip()


def upgrade_url(url):
    """
    Artsy image URLs contain a version name like /medium/ or /normalized/.
    Replace it with /larger/ to get the highest available resolution.
    """
    if not url:
        return url
    for v in ["normalized", "large_rectangle", "medium_rectangle",
              "medium", "small", "square", "thumb", "tall"]:
        url = url.replace(f"/{v}.", "/larger.")
    url = url.replace(":version", "larger")
    return url


def extract_artworks(data, found=None, seen=None):
    """
    Recursively walk a JSON response from Artsy's GraphQL API and
    collect all artwork objects into a list of clean dicts.

    'seen' is an optional set of slugs to skip (avoids duplicates
    across multiple API calls during Phase 1 scrolling).
    """
    if found is None:
        found = []
    if seen is None:
        seen = set()

    if isinstance(data, dict):
        # Detect artwork objects by __typename or by the presence of key fields
        is_artwork = (
            data.get("__typename") == "Artwork" or
            ("internalID" in data and "title" in data and "image" in data)
        )
        if is_artwork:
            # Artist name — try nested object first, then plain string
            artist = ""
            if isinstance(data.get("artist"), dict):
                artist = data["artist"].get("name", "")
            if not artist:
                artist = data.get("artistNames", "")

            slug  = data.get("slug") or data.get("internalID")
            title = data.get("title", "")

            # Image URL — several possible field names depending on API version
            img   = data.get("image") or {}
            thumb = ""
            for k in ["url", "imageURL", "imageUrl"]:
                if img.get(k):
                    thumb = img[k]; break
            for k in ["resized", "large", "medium"]:
                if isinstance(img.get(k), dict):
                    thumb = img[k].get("url", thumb); break

            # Dimensions — prefer cm, fall back to inches
            dims = ""
            d = data.get("dimensions")
            if isinstance(d, dict):
                dims = d.get("cm") or d.get("in") or ""
                if isinstance(dims, dict):
                    dims = dims.get("text", "")

            # Price — try listPrice object first, then plain string fields
            price = ""
            lp = data.get("listPrice")
            if isinstance(lp, dict):
                price = lp.get("display", "")
            if not price:
                price = data.get("saleMessage", "") or data.get("priceLabel", "")

            if slug and slug not in seen and thumb:
                seen.add(slug)
                found.append({
                    "slug":           slug,
                    "artist":         artist,
                    "title":          title,
                    "year":           data.get("date", ""),
                    "medium":         data.get("medium", ""),
                    "dimensions":     str(dims),
                    "price":          price,
                    "description":    strip_html(
                                          data.get("description") or
                                          data.get("additionalInformation", "")
                                      ),
                    "artsy_url":      f"https://www.artsy.net/artwork/{slug}",
                    "image_url":      upgrade_url(thumb),
                    "image_filename": "",
                })

        # Recurse into every value in the dict
        for v in data.values():
            extract_artworks(v, found, seen)

    elif isinstance(data, list):
        for item in data:
            extract_artworks(item, found, seen)

    return found


async def visit_artwork(page, artwork):
    """
    Visit a single artwork page (e.g. artsy.net/artwork/some-slug) and
    enrich the artwork dict with full metadata + best image URL.

    - Metadata comes from Artsy's GraphQL (metaphysics) response,
      which fires automatically when the page loads.
    - Best image comes from the og:image meta tag in the page HTML.

    Updates the artwork dict in-place and returns it.
    """
    slug     = artwork["slug"]
    url      = f"https://www.artsy.net/artwork/{slug}"
    enriched = {}
    got_data = asyncio.Event()  # set when we've received matching GraphQL data

    async def on_response(response):
        if "metaphysics" in response.url and response.status == 200:
            try:
                data  = await response.json()
                found = extract_artworks(data)   # fresh dedup set per page visit
                for a in found:
                    if a.get("slug") == slug:
                        enriched.update(a)
                        got_data.set()           # signal that we have the data
                        break
            except Exception:
                pass

    # Attach listener BEFORE goto so we don't miss any responses
    page.on("response", on_response)
    try:
        await page.goto(url, wait_until="load", timeout=35000)
        # Wait up to 6s for the GraphQL response to arrive after page load
        try:
            await asyncio.wait_for(got_data.wait(), timeout=6.0)
        except asyncio.TimeoutError:
            pass  # GraphQL may not have fired — og:image fallback below
    except Exception as e:
        print(f"  ⚠  Load error for {slug}: {e}")
    finally:
        page.remove_listener("response", on_response)

    # og:image is often higher-resolution than the thumbnail from the listing
    try:
        og_img = await page.get_attribute('meta[property="og:image"]', "content")
        if og_img:
            enriched["image_url"] = og_img
    except Exception:
        pass

    # Merge enriched data into the artwork dict (only overwrite if non-empty)
    for k in ["artist", "title", "year", "medium", "dimensions",
              "price", "description", "image_url"]:
        val = enriched.get(k, "")
        if val:
            artwork[k] = val

    return artwork


async def download_image(item):
    """
    Download an artwork's image into DOWNLOAD_FOLDER.
    Skips the download if the file already exists on disk.
    """
    if not item.get("image_url"):
        print(f"  ✗  No image URL: {item.get('title') or item['slug']}")
        return

    artist_part = clean_filename(item["artist"]) if item.get("artist") else ""
    title_part  = clean_filename(item.get("title") or item["slug"])
    name        = f"{artist_part}_{title_part}" if artist_part else title_part

    url      = item["image_url"]
    ext      = "png" if ".png" in url.lower() else "jpg"
    filename = f"{name}.{ext}"
    path     = os.path.join(DOWNLOAD_FOLDER, filename)
    item["image_filename"] = filename

    if os.path.exists(path):
        print(f"  →  Skipping (exists): {filename}")
        return

    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "Referer":    "https://www.artsy.net/",
            }
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        with open(path, "wb") as f:
            f.write(data)
        print(f"  ✓  {filename}  ({len(data) // 1024:,} KB)")
    except Exception as e:
        print(f"  ✗  {filename} — {e}")


def save_csv(items):
    """Write all collected artwork data to a CSV file."""
    fields = [
        "artist", "title", "year", "medium", "dimensions",
        "price", "description", "image_filename", "image_url", "artsy_url",
    ]
    with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for item in items:
            w.writerow({k: item.get(k, "") for k in fields})
    print(f"  ✓  CSV saved → {CSV_FILE}")


async def main():
    print(f"\n{'─'*55}")
    print(f"  Artsy Painting Downloader — v2")
    print(f"  Target : {HOW_MANY} artworks")
    print(f"  Source : {COLLECTION_URL}  (+gene fallback)")
    print(f"  Images : {DOWNLOAD_FOLDER}/")
    print(f"  CSV    : {CSV_FILE}")
    print(f"{'─'*55}\n")

    artworks   = {}   # slug → artwork dict
    seen_slugs = set()

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
            viewport={"width": 1280, "height": 900},
        )
        page = await context.new_page()

        # ── Phase 1: Scroll collection page, collect slugs ───────────────────
        print("─── Phase 1: Collecting artwork slugs ───────────────────\n")

        async def on_collection_response(response):
            """
            Fires for every network response while scrolling.
            Artsy sends artwork data via its internal GraphQL API (metaphysics).
            We extract any artworks found and add them to our dict.
            """
            if "metaphysics" in response.url and response.status == 200:
                try:
                    found = extract_artworks(await response.json(), seen=seen_slugs)
                    for a in found:
                        if a["slug"] not in artworks:
                            artworks[a["slug"]] = a
                            seen_slugs.add(a["slug"])
                            print(f"  [{len(artworks):>3}/{HOW_MANY}]  "
                                  f"{a['artist'] or '?'} — {a['title']}")
                except Exception:
                    pass

        page.on("response", on_collection_response)

        for scroll_url in SCROLL_URLS:
            if len(artworks) >= HOW_MANY:
                break

            print(f"  Loading {scroll_url} ...\n")
            try:
                await page.goto(scroll_url, wait_until="load", timeout=45000)
            except Exception as e:
                print(f"  ⚠  Page load warning (continuing): {e}")
            await asyncio.sleep(4)

            stall = 0
            last  = len(artworks)

            for attempt in range(400):
                if len(artworks) >= HOW_MANY:
                    break

                # Scroll to absolute bottom every 4 attempts; random scroll otherwise
                if attempt % 4 == 0:
                    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                else:
                    await page.evaluate(f"window.scrollBy(0, {random.randint(400, 900)})")
                await asyncio.sleep(2.5)

                # ── DOM fallback: scrape slugs from rendered <a> tags ────────────
                # Catches artworks that may not have triggered a GraphQL response.
                # These get placeholder entries; Phase 2 will fill in the details.
                try:
                    links = await page.eval_on_selector_all(
                        'a[href*="/artwork/"]',
                        "els => els.map(e => e.getAttribute('href'))"
                    )
                    for href in (links or []):
                        m = re.match(r"^/artwork/([^/?#]+)", href or "")
                        if m:
                            slug = m.group(1)
                            if slug not in seen_slugs:
                                seen_slugs.add(slug)
                                artworks[slug] = {
                                    "slug": slug, "artist": "", "title": slug,
                                    "year": "", "medium": "", "dimensions": "",
                                    "price": "", "description": "",
                                    "artsy_url": f"https://www.artsy.net/artwork/{slug}",
                                    "image_url": "", "image_filename": "",
                                }
                                print(f"  [{len(artworks):>3}/{HOW_MANY}]  (link) {slug}")
                except Exception:
                    pass

                # Click "Load More" button when visible
                if attempt % 6 == 0:
                    try:
                        btn = page.locator(
                            "button",
                            has_text=re.compile(r"load more|show more|view more", re.I)
                        )
                        if await btn.count() > 0:
                            await btn.first.click()
                            print("  → Clicked Load More")
                            await asyncio.sleep(4)
                    except Exception:
                        pass

                # Stall detection — try extra hard scrolls, then move to next URL
                if len(artworks) == last:
                    stall += 1
                    if stall in (10, 15):
                        print(f"  ⚠  Stall {stall} — hard scroll...")
                        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                        await asyncio.sleep(5)
                    if stall >= 20:
                        print(f"\n  Stalled at {len(artworks)} on {scroll_url}. Trying next source...\n")
                        break
                else:
                    stall = 0
                    last  = len(artworks)

        page.remove_listener("response", on_collection_response)
        items = list(artworks.values())[:HOW_MANY]
        print(f"\n  Collected {len(items)} slugs.\n")

        # ── Phase 2: Visit each artwork page for full data + best image ───────
        print("─── Phase 2: Visiting artwork pages ─────────────────────\n")

        for i, artwork in enumerate(items):
            print(f"  [{i+1:>3}/{len(items)}]  {artwork['slug']}")
            await visit_artwork(page, artwork)
            # Polite delay between requests (1.0–2.5 s, random to avoid patterns)
            await asyncio.sleep(random.uniform(1.0, 2.5))

        await browser.close()

    # ── Phase 3: Download images + save CSV ──────────────────────────────────
    print(f"\n─── Phase 3: Downloading images ─────────────────────────\n")
    for i in range(0, len(items), 5):
        await asyncio.gather(*[download_image(a) for a in items[i:i+5]])

    save_csv(items)

    saved = len([
        f for f in os.listdir(DOWNLOAD_FOLDER)
        if os.path.isfile(os.path.join(DOWNLOAD_FOLDER, f))
    ])
    print(f"\n{'─'*55}")
    print(f"  ALL DONE  —  {saved} images  /  {len(items)} CSV rows")
    print(f"{'─'*55}\n")


asyncio.run(main())
