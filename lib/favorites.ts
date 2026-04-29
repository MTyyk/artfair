const FAVORITES_KEY = "rc_artfair_favorites";
const FAVORITES_EVENT = "rc_artfair:favorites_change";

function parseFavorites(stored: string | null): string[] {
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeFavorites(favorites: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent<string[]>(FAVORITES_EVENT, { detail: favorites }));
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  return parseFavorites(localStorage.getItem(FAVORITES_KEY));
}

export function subscribeToFavorites(listener: (favorites: string[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleFavoritesChange = (event: Event) => {
    const customEvent = event as CustomEvent<string[]>;
    listener(Array.isArray(customEvent.detail) ? customEvent.detail : getFavorites());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === FAVORITES_KEY) {
      listener(parseFavorites(event.newValue));
    }
  };

  window.addEventListener(FAVORITES_EVENT, handleFavoritesChange as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(FAVORITES_EVENT, handleFavoritesChange as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function isFavorite(artworkId: string): boolean {
  return getFavorites().includes(artworkId);
}

export function toggleFavorite(artworkId: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(artworkId);

  if (index === -1) {
    favorites.push(artworkId);
    writeFavorites(favorites);
    return true; // now favorited
  }

  favorites.splice(index, 1);
  writeFavorites(favorites);
  return false; // now unfavorited
}
