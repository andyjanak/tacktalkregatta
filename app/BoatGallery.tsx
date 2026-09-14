"use client";

import { useEffect, useState } from "react";

// Galéria fotiek lode s lightboxom. Lazy-load; keď nie sú fotky, zobrazí sa
// placeholder. Fotky sú cesty z data/boats.json (ideálne WebP).
export default function BoatGallery({
  photos,
  name,
  emptyLabel,
  closeLabel,
}: {
  photos: string[];
  name: string;
  emptyLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!photos || photos.length === 0) {
    return <p className="boat-gallery-empty">{emptyLabel}</p>;
  }

  return (
    <>
      <div className="boat-gallery">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            className="boat-thumb"
            onClick={() => setOpen(i)}
            aria-label={`${name} — ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${name} — ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {open !== null ? (
        <div className="boat-lightbox" role="dialog" aria-modal="true">
          <button
            type="button"
            className="boat-lightbox-backdrop"
            aria-label={closeLabel}
            onClick={() => setOpen(null)}
          />
          <button
            type="button"
            className="boat-lightbox-close"
            aria-label={closeLabel}
            onClick={() => setOpen(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[open]} alt={`${name} — ${open + 1}`} />
        </div>
      ) : null}
    </>
  );
}
