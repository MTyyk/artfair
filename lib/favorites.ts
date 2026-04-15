const FAVORITES_KEY = "rc_artfair_favorites";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isFavorite(artworkId: string): boolean {
  return getFavorites().includes(artworkId);
}

export function toggleFavorite(artworkId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(artworkId);
  if (index === -1) {
    favorites.push(artworkId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return true; // now favorited
  } else {
    favorites.splice(index, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return false; // now unfavorited
  }
}
