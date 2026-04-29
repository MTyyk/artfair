-- ============================================================
-- Create storage bucket for style category card images.
-- These are design assets, so keep them separate from artwork-images
-- and its resize/optimized thumbnail pipeline.
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('style-images', 'style-images', true)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    name = EXCLUDED.name;

DROP POLICY IF EXISTS "Public read style-images" ON storage.objects;

CREATE POLICY "Public read style-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'style-images');