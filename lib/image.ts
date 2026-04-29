const KNOWN_MISSING_OPTIMIZED_PATHS = new Set([
  "images/alex-breaux-do-you-feel-it.jpg",
  "images/amber-goldhammer-love-moves-me.jpg",
  "images/andy-burgess-red-spin-southwest.jpg",
  "images/burton-morris-pop-in-bloom.jpg",
  "images/hunt-slonem-migration-2.jpg",
  "images/jacopo-pagin-prova-tutte-le-cose.jpg",
  "images/james-lumsden-fugal-painting.jpg",
  "images/james-lumsden-open-painting-north-light.jpg",
  "images/james-lumsden-resonance.jpg",
  "images/robert-longo-study-for-culture-culture.jpg",
  "images/shiri-phillips-for-the-love-of-art.jpg",
  "images/tomas-sanchez-el-anochecer.jpg",
]);

/**
 * Returns the thumbnail URL for an artwork image.
 * Thumbnails live in artwork-images-optimized at the same path as the original.
 * For the small set of known-missing optimized files, return the original URL instead
 * so Next.js doesn't request a thumbnail that will fail before the client fallback runs.
 */
export function getThumbUrl(imageUrl: string): string {
  const match = imageUrl.match(/\/artwork-images\/(.+)$/);
  const storagePath = match?.[1];

  if (storagePath && KNOWN_MISSING_OPTIMIZED_PATHS.has(storagePath)) {
    return imageUrl;
  }

  return imageUrl.replace("/artwork-images/", "/artwork-images-optimized/");
}
