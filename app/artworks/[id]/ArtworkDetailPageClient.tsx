"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import RecommendedSection from "@/components/artworks/RecommendedSection";
import InterestModal from "@/components/artworks/InterestModal";
import { useTranslation } from "@/lib/i18n";
import { getSessionId } from "@/lib/session";
import type { Artwork } from "@/lib/types";
import { getThumbUrl } from "@/lib/image";

type NavigationArtwork = Pick<Artwork, "seq"> & {
  artist?: Artwork["artist"];
};

interface Props {
  artwork: Artwork;
  prevArtwork: NavigationArtwork | null;
  nextArtwork: NavigationArtwork | null;
}

export default function ArtworkDetailPageClient({ artwork, prevArtwork, nextArtwork }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [interestOpen, setInterestOpen] = useState(false);
  const [mainImgSrc, setMainImgSrc] = useState(getThumbUrl(artwork.image_url));
  const [descLevel, setDescLevel] = useState<"simple" | "advanced">("simple");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; ox: number; oy: number } | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [imageLeft, setImageLeft] = useState<number | null>(null);
  const enquireRef = useRef<HTMLDivElement>(null);
  const [enquireLeft, setEnquireLeft] = useState<number | null>(null);
  const nextNavRef = useRef<HTMLDivElement>(null);
  const [hrMarginRight, setHrMarginRight] = useState<number | null>(null);
  const { t } = useTranslation();

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setHighResLoaded(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    setZoom(prev => {
      const next = Math.min(5, Math.max(1, prev * factor));
      if (next <= 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, ox: offset.x, oy: offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.startX),
      y: dragRef.current.oy + (e.clientY - dragRef.current.startY),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  // Pass 1: measure image and enquire positions — deferred to after paint so image has its rendered size
  useEffect(() => {
    const measure = () => {
      const img = imgContainerRef.current?.querySelector("img");
      if (img) setImageLeft(img.getBoundingClientRect().left);
      if (enquireRef.current) setEnquireLeft(enquireRef.current.getBoundingClientRect().left);
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.documentElement);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  // Pass 2: measure Next nav's right edge — runs after enquireLeft is set and Next has moved into place
  useEffect(() => {
    if (enquireLeft == null) return;
    const raf = requestAnimationFrame(() => {
      if (nextNavRef.current) {
        setHrMarginRight(window.innerWidth - 40 - nextNavRef.current.getBoundingClientRect().right);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [enquireLeft]);

  // Escape key closes lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  // Log one view per session+artwork
  useEffect(() => {
    const sessionId = getSessionId();
    if (!sessionId || !artwork.id) return;
    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, artwork_id: artwork.id }),
    }).catch(() => {/* silent */});
  }, [artwork.id]);

  const hasLevels = !!(artwork.description_beginner || artwork.description_advanced);
  const displayedDescription = hasLevels
    ? descLevel === "simple"
      ? artwork.description_beginner ?? artwork.description
      : artwork.description_advanced ?? artwork.description
    : artwork.description;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      await navigator.share({ title: artwork.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex-shrink-0 h-16" />
      <div className="flex flex-col md:flex-row">

        {/* Left column: image + actions pinned to bottom-right of image */}
        <div className="w-full md:w-[58%] flex items-center justify-center p-6 md:p-10">
          <div ref={imgContainerRef} className="flex items-end gap-6">
            <Image
              src={mainImgSrc}
              alt={artwork.title}
              width={900}
              height={1100}
              className="h-auto max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              onError={() => setMainImgSrc(artwork.image_url)}
              onLoad={(e) => setImageLeft((e.target as HTMLImageElement).getBoundingClientRect().left)}
              priority
            />

            {/* Actions pinned to bottom of image */}
            <div className="flex flex-col gap-5 pb-0.5">
              <div className="flex items-center gap-3 group">
                <FavoriteButton artworkId={artwork.id} className="text-ink hover:text-accent" />
                <span className="font-sans text-xs text-ink-light">{t("save")}</span>
              </div>

              <button onClick={() => setLightboxOpen(true)} className="flex items-center gap-3 group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink group-hover:text-accent transition-colors">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
                </svg>
                <span className="font-sans text-xs text-ink-light">{t("view")}</span>
              </button>

              <button onClick={handleShare} className="flex items-center gap-3 group">
                <svg width="20" height="20" viewBox="0 0 46 47.5" fill="currentColor" className="text-ink group-hover:text-accent transition-colors">
                  <path d="M33,33c-1.2,0-2.3.4-3.2,1.1l-14.2-9c0-.4.1-.7.1-1.1s0-.7-.1-1.1l14.2-8.9c.9.7,2,1.1,3.2,1.1,2.9,0,5.3-2.4,5.3-5.3s-2.4-5.3-5.3-5.3-5.3,2.4-5.3,5.3,0,.8.1,1.1l-14.2,8.9c-.9-.7-2-1.1-3.2-1.1-2.9,0-5.3,2.4-5.3,5.3s2.4,5.3,5.3,5.3,2.3-.4,3.2-1.1l14.2,9c0,.4-.1.7-.1,1.1,0,2.9,2.4,5.3,5.3,5.3s5.3-2.4,5.3-5.3-2.4-5.3-5.3-5.3Z"/>
                </svg>
                <span className="font-sans text-xs text-ink-light">{t("share")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right column: artwork info */}
        <div className="w-full md:w-[42%] px-6 py-10 md:px-10 md:py-14 flex flex-col" style={{ transform: "translateX(-100px)" }}>

          {/* Artist link */}
          <Link href={`/artists/${artwork.artist_id}`} className="flex items-center gap-2 mb-6 group">
            <span className="font-sans text-sm text-ink-muted">⊕</span>
            <span className="font-sans text-base font-bold text-ink group-hover:text-accent transition-colors">
              {artwork.artist?.name}
            </span>
          </Link>

          <hr className="border-ink/15 mb-6" style={{ marginRight: hrMarginRight ?? undefined }} />

          {/* Title */}
          <h1 className="font-sans font-normal text-3xl md:text-[2rem] italic leading-tight mb-1">{artwork.title}</h1>
          {artwork.year && <p className="font-sans text-sm text-ink-muted mb-5">{artwork.year}</p>}

          {/* Technique, size, description */}
          <div className="space-y-1 font-sans text-sm text-ink-light">
            {artwork.technique && <p>{artwork.technique}</p>}
            {artwork.size && <p>{artwork.size}</p>}
          </div>

          {/* Description with optional level toggle */}
          {displayedDescription && (
            <div className="mt-4">
              {hasLevels && (
                <div className="flex gap-1 mb-3">
                  <button
                    onClick={() => setDescLevel("simple")}
                    className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1 border transition-colors ${
                      descLevel === "simple"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-ink-muted hover:border-ink"
                    }`}
                  >
                    {t("simple")}
                  </button>
                  <button
                    onClick={() => setDescLevel("advanced")}
                    className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1 border transition-colors ${
                      descLevel === "advanced"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/20 text-ink-muted hover:border-ink"
                    }`}
                  >
                    {t("inDepth")}
                  </button>
                </div>
              )}
              <p className="font-sans text-sm text-ink-light leading-relaxed">{displayedDescription}</p>
            </div>
          )}

          {/* Price */}
          <hr className="border-ink/15 mt-8" style={{ marginRight: hrMarginRight ?? undefined }} />
          <div className="flex items-center py-4">
            <span className="font-sans text-sm text-ink-muted w-24">Price</span>
            <span className="font-sans text-sm text-ink">
              {typeof artwork.price === "number"
                ? `€${artwork.price.toLocaleString("en-US")}`
                : t("priceOnRequest")}
            </span>
          </div>
          <hr className="border-ink/15" style={{ marginRight: hrMarginRight ?? undefined }} />

          {/* Enquire */}
          <div ref={enquireRef} className="mt-14 pl-44">
            <button
              onClick={() => setInterestOpen(true)}
              className="flex items-center gap-4 group text-ink hover:text-accent transition-colors"
            >
              <svg
                viewBox="0 0 101.5 70.3"
                fill="currentColor"
                className="w-10 h-auto transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M86.2,38H5.9c-3.5,0-3.4-5.9,0-5.9h80.3L62,7.8c-3-3,.3-7.2,3.7-4.5l31.7,31.7-31.6,31.9c-3.4,2.5-6.8-1.6-3.7-4.5l24.2-24.3Z" />
              </svg>
              <span className="font-sans text-base">{t("interested")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="md:flex-shrink-0">
        <div className="flex md:hidden">
          <div className="flex-1 border-r border-ink/10 p-6">
            {prevArtwork && (
              <Link href={`/artworks/${prevArtwork.seq}`} className="flex flex-col gap-1 group">
                <span className="font-sans text-[10px] tracking-widest uppercase text-ink-muted">‹ {t("prev")}</span>
                <span className="font-sans text-sm text-ink-light group-hover:text-ink transition-colors">
                  {prevArtwork.artist?.name}
                </span>
              </Link>
            )}
          </div>
          <div className="flex flex-1 flex-col items-end gap-1 p-6">
            {nextArtwork && (
              <Link href={`/artworks/${nextArtwork.seq}`} className="flex flex-col items-end gap-1 group">
                <span className="font-sans text-[10px] tracking-widest uppercase text-ink-muted">{t("next")} ›</span>
                <span className="font-sans text-sm text-ink-light group-hover:text-ink transition-colors">
                  {nextArtwork.artist?.name}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop footer: PREV aligns with left edge of artwork image, NEXT aligns with Enquire */}
        <div className="relative hidden md:flex">
          {/* Continuous line only when both exist; individual underlines handle the single-button cases */}
          {prevArtwork && nextArtwork && imageLeft != null && hrMarginRight != null && (
            <div className="absolute bottom-0 h-px bg-ink/10" style={{ left: imageLeft - 20, right: hrMarginRight + 40 }} />
          )}
          <div className="border-b border-ink/10" style={{ marginLeft: (imageLeft ?? 40) - 20, paddingLeft: 20, paddingRight: 20 }}>
            {prevArtwork && (
              <Link href={`/artworks/${prevArtwork.seq}`} className="group flex items-center gap-4 py-6">
                <svg width="12" height="22" viewBox="0 0 12 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-ink-muted transition-colors group-hover:text-ink flex-shrink-0">
                  <polyline points="10,2 3,11 10,20" />
                </svg>
                <span className="flex flex-col gap-0.5">
                  <span className="font-sans text-[10px] tracking-[0.32em] uppercase text-ink-muted">
                    {t("prev")}
                  </span>
                  <span className="font-sans text-base leading-tight text-ink-light transition-colors group-hover:text-ink">
                    {prevArtwork.artist?.name}
                  </span>
                </span>
              </Link>
            )}
          </div>

          <div ref={nextNavRef} className="absolute top-0 flex border-b border-ink/10" style={{ left: enquireLeft != null ? enquireLeft + 190 : undefined, paddingLeft: 20, paddingRight: 20 }}>
            {nextArtwork && (
              <Link href={`/artworks/${nextArtwork.seq}`} className="group flex items-center gap-4 py-6">
                <span className="flex flex-col items-end gap-0.5">
                  <span className="font-sans text-[10px] tracking-[0.32em] uppercase text-ink-muted">
                    {t("next")}
                  </span>
                  <span className="font-sans text-base leading-tight text-ink-light transition-colors group-hover:text-ink">
                    {nextArtwork.artist?.name}
                  </span>
                </span>
                <svg width="12" height="22" viewBox="0 0 12 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-ink-muted transition-colors group-hover:text-ink flex-shrink-0">
                  <polyline points="2,2 9,11 2,20" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
          onWheel={handleWheel}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 z-10 text-white/60 hover:text-white text-3xl font-light leading-none transition-colors"
            onClick={closeLightbox}
            aria-label={t("close")}
          >
            ×
          </button>

          {/* Image container — transform scales the whole thing, so zoom never causes a size discontinuity */}
          <div
            className="relative select-none"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.12s ease-out",
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={resetZoom}
          >
            {/* Thumbnail — loads first, establishes the box size */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getThumbUrl(artwork.image_url)}
              alt={artwork.title}
              style={{ display: "block", maxWidth: "90vw", maxHeight: "85vh", width: "auto", height: "auto" }}
              onError={(e) => { e.currentTarget.src = artwork.image_url; }}
              draggable={false}
            />
            {/* Full-res fades in on top once downloaded */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image_url}
              alt=""
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: highResLoaded ? 1 : 0,
                transition: "opacity 0.5s",
              }}
              onLoad={() => setHighResLoaded(true)}
              draggable={false}
            />
          </div>

          {/* Zoom slider */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            <span className="font-sans text-2xl text-white/70 select-none leading-none">−</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.02}
              value={zoom}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setZoom(val);
                if (val <= 1) setOffset({ x: 0, y: 0 });
              }}
              className="w-44 h-px appearance-none bg-white/20 rounded-full cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-grab
                [&::-webkit-slider-thumb]:active:cursor-grabbing"
            />
            <span className="font-sans text-2xl text-white/70 select-none leading-none">+</span>
          </div>
        </div>
      )}

      {/* Interest Modal */}
      {interestOpen && (
        <InterestModal artwork={artwork} onClose={() => setInterestOpen(false)} />
      )}
    </div>
  );
}
