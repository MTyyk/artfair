import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { ImageMagick, initializeImageMagick } from "npm:@imagemagick/magick-wasm@0.0.30";

// Initialize ImageMagick WASM once at cold-start
const wasmBytes = await Deno.readFile(
  new URL("magick.wasm", import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30"))
);
await initializeImageMagick(wasmBytes);

const THUMB_BUCKET = "artwork-images-optimized";
const MAX_WIDTH = 1200;
const QUALITY = 85;

serve(async (req) => {
  try {
    const payload = await req.json();
    // Supports both storage webhook payload ({ record: { ... } }) and direct call ({ bucket_id, name })
    const record = payload.record ?? payload;

    if (record.bucket_id !== "artwork-images") {
      return new Response("Not target bucket", { status: 200 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const filePath = record.name; // e.g. "images/artist-title.jpg"

    // 1. Download original from artwork-images bucket
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("artwork-images")
      .download(filePath);
    if (downloadError) {
      console.error("Download error:", downloadError.message);
      return new Response(downloadError.message, { status: 500 });
    }

    const content = new Uint8Array(await fileData.arrayBuffer());

    // 2. Resize with ImageMagick WASM — max MAX_WIDTH wide, preserve aspect ratio, JPEG at QUALITY
    const resized = await new Promise<Uint8Array>((resolve, reject) => {
      try {
        ImageMagick.read(content, (img) => {
          if (img.width > MAX_WIDTH) {
            img.resize(MAX_WIDTH, Math.round(img.height * (MAX_WIDTH / img.width)));
          }
          img.quality = QUALITY;
          img.write((data) => resolve(new Uint8Array(data)));
        });
      } catch (e) {
        reject(e);
      }
    });

    // 3. Upload thumbnail to optimized bucket at the same path
    const { error: uploadError } = await supabase.storage
      .from(THUMB_BUCKET)
      .upload(filePath, resized, { contentType: "image/jpeg", upsert: true });
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return new Response(uploadError.message, { status: 500 });
    }

    console.log(`✓ ${filePath} (${content.length} → ${resized.length} bytes)`);
    return new Response(JSON.stringify({ ok: true, path: filePath }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(String(err), { status: 500 });
  }
});
