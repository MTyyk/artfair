-- ============================================================
-- Riga Contemporary Art Fair — reference schema
-- Matches the linked production project as of 2026-04-27.
-- ============================================================

CREATE TABLE IF NOT EXISTS artists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  bio TEXT,
  artsy_profile_url TEXT,
  bio_source_url TEXT,
  bio_last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  year INTEGER,
  size TEXT,
  technique TEXT,
  price NUMERIC(10, 2),
  description TEXT,
  description_beginner TEXT,
  description_advanced TEXT,
  image_url TEXT,
  style_tags TEXT[] NOT NULL DEFAULT '{}'::text[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  seq INTEGER NOT NULL DEFAULT nextval('artworks_seq_seq'::regclass),
  CONSTRAINT artworks_seq_unique UNIQUE (seq)
);

CREATE TABLE IF NOT EXISTS favorites (
  session_id TEXT NOT NULL,
  artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT favorites_pkey PRIMARY KEY (session_id, artwork_id)
);

CREATE TABLE IF NOT EXISTS interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  session_id TEXT,
  contact_info TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  artwork_id UUID REFERENCES artworks(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (
    event_type = ANY (ARRAY['view'::text, 'favorite'::text, 'unfavorite'::text, 'interest_click'::text])
  ),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id TEXT PRIMARY KEY,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read artists"
  ON artists FOR SELECT USING (true);

CREATE POLICY "Public read artworks"
  ON artworks FOR SELECT USING (true);

CREATE POLICY "Service role full access favorites"
  ON favorites FOR ALL USING (true);

CREATE POLICY "Anon can read favorites"
  ON favorites FOR SELECT USING (true);

CREATE POLICY "Anon can insert favorites"
  ON favorites FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can delete favorites"
  ON favorites FOR DELETE USING (true);

CREATE POLICY "Service role full access interests"
  ON interests FOR ALL USING (true);

CREATE POLICY "Anon can insert interests"
  ON interests FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access event_logs"
  ON event_logs FOR ALL USING (true);

CREATE POLICY "Anon can insert event_logs"
  ON event_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role full access sessions"
  ON sessions FOR ALL USING (true);

CREATE POLICY "Session owner access"
  ON sessions FOR ALL USING (session_id = current_setting('app.session_id'::text, true));

CREATE POLICY "Anon can insert sessions"
  ON sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Anon can read sessions"
  ON sessions FOR SELECT USING (true);

CREATE POLICY "Anon can update sessions"
  ON sessions FOR UPDATE USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS artworks_artist_id_idx ON artworks(artist_id);
CREATE INDEX IF NOT EXISTS favorites_session_id_idx ON favorites(session_id);
CREATE INDEX IF NOT EXISTS favorites_artwork_id_idx ON favorites(artwork_id);
CREATE INDEX IF NOT EXISTS event_logs_artwork_id_idx ON event_logs(artwork_id);
CREATE INDEX IF NOT EXISTS event_logs_session_id_idx ON event_logs(session_id);
