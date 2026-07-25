"use client";

import Link from "next/link";
import { FishBowl } from "@/components/scrapbook/FishBowl";
import { useBookshelf } from "@/context/BookshelfContext";
import { SEA_CREATURES } from "@/data/sea";

export default function CollectionPage() {
  const { settings, ready } = useBookshelf();
  const owned = new Set(settings.seaCollection);

  if (!ready) return <div className="room min-h-[100svh]" />;

  return (
    <div className="room min-h-[100svh] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-plum">
          ← Shelf
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Sea collection</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Finish tasks to hatch your egg into colourful sea friends. Track them in the fish bowl.
        </p>

        <div className="mt-8 flex justify-center">
          <FishBowl />
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SEA_CREATURES.map((c) => {
            const have = owned.has(c.id);
            return (
              <div
                key={c.id}
                className={`soft-card p-4 text-center ${have ? "" : "opacity-45"}`}
              >
                <p className={`text-4xl ${have ? "creature-bob" : "grayscale"}`}>{c.emoji}</p>
                <p className="mt-2 font-display text-lg">{have ? c.name : "???"}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {have ? c.stage : `Unlock at ${c.unlockAt}%`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
