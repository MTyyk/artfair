ALTER TABLE artists
  ADD COLUMN IF NOT EXISTS artsy_profile_url TEXT,
  ADD COLUMN IF NOT EXISTS bio_source_url TEXT,
  ADD COLUMN IF NOT EXISTS bio_last_synced_at TIMESTAMPTZ;

COMMENT ON COLUMN artists.artsy_profile_url IS 'Canonical Artsy artist profile chosen during enrichment.';
COMMENT ON COLUMN artists.bio_source_url IS 'Public source URL used to populate the current biography text.';
COMMENT ON COLUMN artists.bio_last_synced_at IS 'Timestamp of the last successful biography enrichment update.';