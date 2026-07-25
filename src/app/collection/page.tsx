"use client";

import Link from "next/link";
import { FishBowl } from "@/components/scrapbook/FishBowl";
import { useBookshelf } from "@/context/BookshelfContext";
import { AQUARIUM_PETS, grownPets } from "@/data/sea";

export default function CollectionPage() {
  const { settings, ready } = useBookshelf();
  const pets = grownPets(settings.seaCollection);
  const owned = new Set(settings.seaCollection);

  if (!ready) return <div className="room min-h-[100svh]" />;

  return (
    <div className="room min-h-[100svh] px-5 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-plum">
          ← Shelf
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Your aquarium</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Only fully grown pets live here. Hatch them in each project’s Progress chart, then visit the bowl.
        </p>

        <div className="mt-8 flex justify-center">
          <FishBowl />
        </div>

        <h2 className="mt-10 font-display text-2xl">Pets you have</h2>
        {pets.length === 0 ? (
          <p className="mt-3 text-sm text-ink-faint">
            No grown pets yet. Finish all tasks on a project to hatch your egg into the aquarium.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pets.map((p) => (
              <div key={p.id} className="soft-card p-4 text-center">
                <p className="creature-bob text-4xl">{p.emoji}</p>
                <p className="mt-2 font-display text-lg">{p.name}</p>
                <p className="mt-1 text-xs text-ink-faint">In your bowl</p>
              </div>
            ))}
          </div>
        )}

        <h2 className="mt-10 font-display text-2xl">Still to grow</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {AQUARIUM_PETS.filter((p) => !owned.has(p.id)).map((p) => (
            <div key={p.id} className="soft-card p-4 text-center opacity-50">
              <p className="grayscale text-4xl">{p.emoji}</p>
              <p className="mt-2 font-display text-lg">???</p>
              <p className="mt-1 text-xs text-ink-faint">Complete a project egg</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
