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
      <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-pop soft-card p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Decorate</h2>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-ink-faint">
            Done
          </button>
        </div>

        <label className="mt-5 block text-sm font-semibold">
          Title
          <input
            value={book.title}
            onChange={(e) => updateBook(book.id, { title: e.target.value })}
            className="mt-1.5 w-full border border-line bg-paper px-3 py-2 outline-none focus:border-forest"
          />
        </label>

        <p className="mt-4 text-sm font-semibold">Cover</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COVER_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              className="h-8 w-8 border border-line"
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
            className="h-8 w-10 cursor-pointer"
          />
        </div>

        <p className="mt-4 text-sm font-semibold">Stickers</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STICKER_PACK.filter((s) => book.unlockedStickers.includes(s)).map((s) => (
            <button
              key={s}
              type="button"
              className={`flex h-9 w-9 items-center justify-center border border-line bg-paper ${
                book.style.sticker === s ? "ring-1 ring-forest" : ""
              }`}
              onClick={() =>
                updateBook(book.id, { style: { ...book.style, sticker: s } })
              }
            >
              {s}
            </button>
          ))}
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={book.locked}
            onChange={(e) => {
              if (e.target.checked) {
                const code = prompt("Set a passcode for this book");
                if (!code) return;
                updateBook(book.id, { locked: true, passcode: code });
              } else {
                updateBook(book.id, { locked: false, passcode: undefined });
              }
            }}
          />
          Private — require passcode
        </label>
        {book.locked && (
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-burgundy"
            onClick={() => {
              const code = prompt("New passcode", book.passcode ?? "");
              if (code == null) return;
              updateBook(book.id, { passcode: code });
            }}
          >
            Change passcode
          </button>
        )}
      </div>
    </div>
  );
}
