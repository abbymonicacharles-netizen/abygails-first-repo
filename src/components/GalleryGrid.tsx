"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { galleryPhotos, type GalleryPhoto } from "@/data/content";

const GALLERY_STORAGE_KEY = "ac-gallery-photos";

function PlaceholderPhoto({ caption, alt }: { caption: string; alt: string }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center bg-cream-dark p-6 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center border border-blush-muted">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-7 w-7 text-blush">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">Photo coming soon</p>
      <p className="sr-only">{alt}</p>
      <p className="mt-2 text-sm text-ink-muted">{caption}</p>
    </div>
  );
}

export function GalleryGrid() {
  const [localPhotos, setLocalPhotos] = useState<GalleryPhoto[]>([]);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
      if (stored) setLocalPhotos(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const allPhotos = [...galleryPhotos, ...localPhotos];

  const handleFile = (file: File | null) => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !caption.trim()) return;

    const newPhoto: GalleryPhoto = {
      id: `local-${Date.now()}`,
      src: preview,
      alt: caption.trim(),
      caption: caption.trim(),
    };

    const updated = [...localPhotos, newPhoto];
    setLocalPhotos(updated);
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(updated));
    setCaption("");
    setPreview(null);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allPhotos.map((photo) => (
          <figure key={photo.id} className="border border-cream-dark bg-surface overflow-hidden">
            {photo.src ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  unoptimized={photo.src.startsWith("data:")}
                />
              </div>
            ) : (
              <PlaceholderPhoto caption={photo.caption} alt={photo.alt} />
            )}
            {photo.src && (
              <figcaption className="border-t border-cream-dark px-4 py-3 text-sm text-ink-muted">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <form onSubmit={handleAddPhoto} className="mt-10 border border-cream-dark bg-surface p-6">
        <h3 className="font-display text-xl font-semibold text-ink">Add a picture</h3>
        <p className="mt-1 text-sm text-ink-faint">
          Upload a photo with a caption. Saved on this device until you add permanent images to the
          site.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-ink-muted">
            Choose image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full text-sm file:mr-3 file:border file:border-cream-dark file:bg-cream file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-ink"
            />
          </label>
          <label className="block text-sm text-ink-muted">
            Caption
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this moment..."
              className="mt-1 w-full border border-cream-dark bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-blush"
              required
            />
          </label>
        </div>

        {preview && (
          <div className="relative mt-4 h-32 w-48 overflow-hidden border border-cream-dark">
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
          </div>
        )}

        <button
          type="submit"
          disabled={!preview || !caption.trim()}
          className="btn-solid mt-5 px-6 py-2 text-xs font-semibold uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add picture
        </button>
      </form>
    </div>
  );
}
