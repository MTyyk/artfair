ALTER TABLE artworks ADD COLUMN IF NOT EXISTS style_tags text[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS artworks_style_tags_idx ON artworks USING GIN(style_tags);
