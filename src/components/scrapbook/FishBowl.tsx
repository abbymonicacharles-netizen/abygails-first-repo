"use client";

import Link from "next/link";
import { SEA_CREATURES } from "@/data/sea";
import { useBookshelf } from "@/context/BookshelfContext";

export function FishBowl({ compact = false }: { compact?: boolean }) {
  const { settings } = useBookshelf();
  const owned = SEA_CREATURES.filter(
    (c) => settings.seaCollection.includes(c.id) && c.id !== "egg" && c.id !== "crack",
  );
  const swimmers = owned.length ? owned.slice(-4) : SEA_CREATURES.filter((c) => c.id === "hatchling").slice(0, 0);

  const bowl = (
    <div className={`fishbowl ${compact ? "fishbowl-compact" : ""}`} aria-label="Sea collection fish bowl">
      <div className="fishbowl-glass">
        <div className="fishbowl-water">
          <span className="fishbowl-bubble b1" />
          <span className="fishbowl-bubble b2" />
          <span className="fishbowl-bubble b3" />
          {swimmers.length === 0 ? (
            <span className="fishbowl-empty-egg" aria-hidden>
              🥚
            </span>
          ) : (
            swimmers.map((c, i) => (
              <span
                key={c.id}
                className={`fishbowl-fish fish-${i + 1}`}
                style={{ color: c.color }}
                aria-hidden
              >
                {c.emoji}
              </span>
            ))
          )}
        </div>
        <div className="fishbowl-plants" aria-hidden>
          <span>🌿</span>
          <span>🌱</span>
        </div>
        <div className="fishbowl-sand" />
      </div>
      <p className="fishbowl-label">Collection</p>
    </div>
  );

  if (compact) {
    return (
      <Link href="/collection" className="inline-flex flex-col items-center">
        {bowl}
      </Link>
    );
  }

  return bowl;
}
