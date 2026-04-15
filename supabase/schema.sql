-- ============================================================
-- Riga Contemporary Art Fair — Supabase Schema
-- ============================================================

-- Artists
CREATE TABLE IF NOT EXISTS artists (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  bio        TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artworks
CREATE TABLE IF NOT EXISTS artworks (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT         NOT NULL,
  artist_id   UUID         REFERENCES artists(id) ON DELETE CASCADE,
  year        INTEGER,
  size        TEXT,
  technique   TEXT,
  price       NUMERIC(10, 2),
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Favorites (no auth — identified by anonymous session_id)
CREATE TABLE IF NOT EXISTS favorites (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT        NOT NULL,
  artwork_id UUID        REFERENCES artworks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, artwork_id)
);

-- Interest submissions
CREATE TABLE IF NOT EXISTS interest_submissions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id   UUID        REFERENCES artworks(id) ON DELETE CASCADE,
  session_id   TEXT        NOT NULL,
  contact_info TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Artwork views (analytics)
CREATE TABLE IF NOT EXISTS artwork_views (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID        REFERENCES artworks(id) ON DELETE CASCADE,
  session_id TEXT        NOT NULL,
  viewed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE artists             ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites           ENABLE ROW LEVEL SECURITY;
ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE artwork_views       ENABLE ROW LEVEL SECURITY;

-- Public read on artists and artworks
CREATE POLICY "Public can read artists"
  ON artists FOR SELECT USING (true);

CREATE POLICY "Public can read artworks"
  ON artworks FOR SELECT USING (true);

-- Anonymous favorites (read, insert, delete — no login needed)
CREATE POLICY "Public can read favorites"
  ON favorites FOR SELECT USING (true);

CREATE POLICY "Public can insert favorites"
  ON favorites FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can delete own favorites"
  ON favorites FOR DELETE USING (true);

-- Anonymous interest submissions
CREATE POLICY "Public can submit interest"
  ON interest_submissions FOR INSERT WITH CHECK (true);

-- Anonymous view tracking
CREATE POLICY "Public can log views"
  ON artwork_views FOR INSERT WITH CHECK (true);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX IF NOT EXISTS artworks_artist_id_idx    ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS favorites_session_id_idx  ON favorites(session_id);
CREATE INDEX IF NOT EXISTS favorites_artwork_id_idx  ON favorites(artwork_id);
CREATE INDEX IF NOT EXISTS views_artwork_id_idx      ON artwork_views(artwork_id);
