"use client";

import { useState } from "react";
import { getSessionId } from "@/lib/session";
import type { Artwork } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface Props {
  artwork: Artwork;
  onClose: () => void;
}

export default function InterestModal({ artwork, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sessionId = getSessionId();
    const contactInfo = [name, email].filter(Boolean).join(" — ") || undefined;

    await fetch("/api/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        artwork_id: artwork.id,
        contact_info: contactInfo ?? null,
      }),
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full md:max-w-md bg-cream p-8 md:p-10">
        {submitted ? (
          <div className="text-center py-4">
            <p className="font-sans font-normal text-2xl mb-3">{t("thankYou")}</p>
            <p className="font-sans text-sm text-ink-light mb-8 leading-relaxed">
              {artwork.title}
              {artwork.artist ? ` — ${artwork.artist.name}` : ""}
            </p>
            <button
              onClick={onClose}
              className="font-sans text-xs tracking-widest uppercase border border-ink px-8 py-3 hover:bg-ink hover:text-cream transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2 className="font-sans font-normal text-2xl leading-tight">
                  {t("expressInterest")}
                </h2>
                <p className="font-sans text-xs text-ink-muted mt-1">
                  {artwork.title}
                  {artwork.artist ? ` — ${artwork.artist.name}` : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-2xl font-light text-ink-muted hover:text-ink transition-colors leading-none"
                aria-label={t("close")}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder={t("yourName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-2 font-sans text-sm placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
              />
              <input
                type="email"
                placeholder={t("yourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-2 font-sans text-sm placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
              />
              <p className="font-sans text-xs text-ink-muted pt-1">
                {t("interestDescription")}
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-sans text-xs tracking-widest uppercase bg-ink text-cream py-4 hover:bg-accent disabled:opacity-50 transition-colors"
              >
                {loading ? t("sending") : t("send")}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
