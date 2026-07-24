"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { genres } from "@/data/genres";
import type { GenreId } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";

const coverSwatches = ["#0f6e62", "#9a3412", "#1e3a5f", "#3d5a40", "#1f2937", "#7c2d12"];

export function NewProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createProject } = useBrainstorm();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState<GenreId>("software");
  const [collection, setCollection] = useState("Studio");
  const [coverColor, setCoverColor] = useState(coverSwatches[0]);

  if (!open) return null;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const id = createProject({
      title: title.trim(),
      genre,
      collection,
      coverColor,
    });
    onClose();
    router.push(`/book/${id}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        onSubmit={handleCreate}
        className="relative z-10 w-full max-w-lg bg-surface p-6 shadow-[0_20px_50px_rgba(20,32,28,0.35)] sm:p-8"
      >
        <h2 className="font-display text-2xl font-bold text-ink">New project book</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Pick a genre to seed chapters, then customize the cover.
        </p>

        <label className="mt-6 block text-sm font-medium text-ink">
          Title
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-teal"
            placeholder="e.g. River Bridge Study"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-ink">
          Genre
          <select
            value={genre}
            onChange={(e) => {
              const next = e.target.value as GenreId;
              setGenre(next);
              const accent = genres.find((g) => g.id === next)?.accent;
              if (accent) setCoverColor(accent);
            }}
            className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-teal"
          >
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label} — {g.description}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block text-sm font-medium text-ink">
          Collection
          <input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-teal"
          />
        </label>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium text-ink">Cover color</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {coverSwatches.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCoverColor(c)}
                className="h-8 w-8 border-2 transition"
                style={{
                  backgroundColor: c,
                  borderColor: coverColor === c ? "#14201c" : "transparent",
                }}
                aria-label={`Cover ${c}`}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-ink px-5 py-2.5 text-sm font-semibold text-surface hover:bg-teal-deep"
          >
            Create book
          </button>
        </div>
      </form>
    </div>
  );
}
