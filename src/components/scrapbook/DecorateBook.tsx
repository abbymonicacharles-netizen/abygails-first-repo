"use client";

import type { ProjectBook } from "@/data/types";
import { COVER_SWATCHES, STICKER_PACK } from "@/data/factory";
import { useBookshelf } from "@/context/BookshelfContext";

export function DecorateBook({
  book,
  onClose,
}: {
  book: ProjectBook | null;
  onClose: () => void;
}) {
  const { updateBook } = useBookshelf();
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/25" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-pop soft-card p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Decorate</h2>
          <button type="button" onClick={onClose} className="text-sm font-bold text-ink-faint">
            Done
          </button>
        </div>

        <label className="mt-5 block text-sm font-bold">
          Title
          <input
            value={book.title}
            onChange={(e) => updateBook(book.id, { title: e.target.value })}
            className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-4 py-2.5 outline-none"
          />
        </label>

        <p className="mt-4 text-sm font-bold">Cover color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COVER_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              className="h-9 w-9 rounded-full shadow-sm"
              style={{ backgroundColor: c }}
              onClick={() =>
                updateBook(book.id, {
                  style: { ...book.style, coverColor: c, spineColor: c },
                })
              }
            />
          ))}
          <input
            type="color"
            value={book.style.coverColor}
            onChange={(e) =>
              updateBook(book.id, {
                style: {
                  ...book.style,
                  coverColor: e.target.value,
                  spineColor: e.target.value,
                },
              })
            }
            className="h-9 w-9 cursor-pointer rounded-full"
          />
        </div>

        <p className="mt-4 text-sm font-bold">Stickers</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STICKER_PACK.filter((s) => book.unlockedStickers.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-paper text-lg ${
                book.style.sticker === s ? "ring-2 ring-sage" : ""
              }`}
              onClick={() =>
                updateBook(book.id, {
                  style: { ...book.style, sticker: s },
                })
              }
            >
              {s}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={book.locked}
            onChange={(e) => updateBook(book.id, { locked: e.target.checked })}
          />
          Private (lock)
        </label>
      </div>
    </div>
  );
}
