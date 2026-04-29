-- Enable pg_net for async HTTP calls from database triggers
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Trigger function: fires after every INSERT on storage.objects
-- If the new file lands in artwork-images, calls the resize-image edge function
CREATE OR REPLACE FUNCTION public.trigger_resize_on_upload()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NEW.bucket_id = 'artwork-images' THEN
    PERFORM net.http_post(
      url := 'https://xrdftojixjbtmuvqjbbp.supabase.co/functions/v1/resize-image',
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := row_to_json(NEW)::text
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_artwork_image_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_resize_on_upload();
