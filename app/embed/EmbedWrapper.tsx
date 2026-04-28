"use client";

// Shows the embed snippet when visited directly in a browser (not inside an iframe).
// When loaded inside an iframe, only the artwork grid is shown.

import { useEffect, useState } from "react";

const EMBED_SNIPPET = `<iframe
  src="https://riga-art-viewer.vercel.app/embed"
  width="100%"
  height="700"
  style="border:none;border-radius:8px;"
  title="Riga Contemporary Art Fair — Browse Artworks"
  loading="lazy"
></iframe>`;

export default function EmbedWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [inIframe, setInIframe] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInIframe(window.self !== window.top);
  }, []);

  function handleCopy() {
    navigator.clipboard.writeText(EMBED_SNIPPET).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (inIframe) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Embed instructions banner */}
      <div className="border-b border-ink/10 bg-ink px-4 py-5 text-cream">
        <div className="mx-auto max-w-3xl">
          <p className="font-sans text-xs uppercase tracking-widest text-cream/60">
            Embed Widget
          </p>
          <h1 className="mt-1 font-display text-xl font-light">
            Riga Contemporary Art Fair
          </h1>
          <p className="mt-2 font-sans text-sm text-cream/70">
            Paste this snippet into your website to embed the artwork browser:
          </p>
          <div className="mt-3 flex items-start gap-3">
            <pre className="flex-1 overflow-x-auto rounded border border-cream/20 bg-cream/10 p-3 font-mono text-xs text-cream/90 whitespace-pre-wrap break-all">
              {EMBED_SNIPPET}
            </pre>
            <button
              onClick={handleCopy}
              className="mt-0 shrink-0 rounded border border-cream/30 px-3 py-2 font-sans text-xs text-cream/80 transition-colors hover:bg-cream/10 active:bg-cream/20"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-3 font-sans text-xs text-cream/50">
            Or link directly:{" "}
            <a
              href="https://riga-art-viewer.vercel.app"
              className="underline underline-offset-2"
            >
              riga-art-viewer.vercel.app
            </a>
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <p className="mb-4 font-sans text-xs uppercase tracking-widest text-ink-muted">
          Live preview
        </p>
        {children}
      </div>
    </div>
  );
}
