"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { getSessionId } from "@/lib/session";

interface Props {
  artworkId: string;
  className?: string;
}

export default function FavoriteButton({ artworkId, className = "" }: Props) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(artworkId));
  }, [artworkId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Update localStorage immediately for instant feedback
    const newState = toggleFavorite(artworkId);
    setFavorited(newState);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 350);

    // Sync to backend in the background (fire-and-forget)
    const sessionId = getSessionId();
    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        artwork_id: artworkId,
        action: newState ? "add" : "remove",
      }),
    }).catch(() => {/* silent fail — localStorage is the source of truth */});
  };

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      style={{ transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
      className={`${animating ? "scale-125" : "scale-100"} ${className}`}
    >
      {favorited ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="#E8291C"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )}
    </button>
  );
}
