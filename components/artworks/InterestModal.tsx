"use client";

import { useState } from "react";
import { getSessionId } from "@/lib/session";
import type { Artwork } from "@/lib/types";

interface Props {
  artwork: Artwork;
  onClose: () => void;
}

export default function InterestModal({ artwork, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sessionId = getSessionId();
    const contactInfo = [name, email].filter(Boolean).join(" — ") || undefined;

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.from("interests").insert({
      artwork_id: artwork.id,
      session_id: sessionId,
      contact_info: contactInfo ?? null,
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
            <p className="font-serif text-2xl mb-3">Thank you.</p>
            <p className="font-sans text-sm text-ink-light mb-8 leading-relaxed">
              Your interest in <em>{artwork.title}</em> has been noted.
              The gallery will be in touch.
            </p>
            <button
              onClick={onClose}
              className="font-sans text-xs tracking-widest uppercase border border-ink px-8 py-3 hover:bg-ink hover:text-cream transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-7">
              <div>
                <h2 className="font-serif text-2xl leading-tight">
                  Interested?
                </h2>
                <p className="font-sans text-xs text-ink-muted mt-1">
                  {artwork.title}
                  {artwork.artist ? ` — ${artwork.artist.name}` : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-2xl font-light text-ink-muted hover:text-ink transition-colors leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-2 font-sans text-sm placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
              />
              <input
                type="email"
                placeholder="Email address (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-ink/20 py-2 font-sans text-sm placeholder:text-ink-muted focus:outline-none focus:border-ink transition-colors"
              />
              <p className="font-sans text-xs text-ink-muted pt-1">
                Your details will be shared with the gallery only. No account needed.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full font-sans text-xs tracking-widest uppercase bg-ink text-cream py-4 hover:bg-accent disabled:opacity-50 transition-colors"
              >
                {loading ? "Sending…" : "Express Interest"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
