"use client";

import { useEffect } from "react";
import { useBookshelf } from "@/context/BookshelfContext";

const COLORS = ["#6b3fa0", "#f5e6a8", "#8e2458", "#ce93d8", "#c4a056", "#fffaf4"];

export function CelebrateOverlay() {
  const { celebrate, clearCelebrate } = useBookshelf();

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(clearCelebrate, 2600);
    return () => clearTimeout(t);
  }, [celebrate, clearCelebrate]);

  if (!celebrate) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className={`confetti-piece absolute top-0 ${
            i % 3 === 0 ? "h-3 w-2 rounded-sm" : "h-2.5 w-2.5 rounded-[2px]"
          }`}
          style={{
            left: `${(i * 13 + 7) % 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${(i % 9) * 0.06}s`,
            animationDuration: `${2 + (i % 4) * 0.25}s`,
          }}
        />
      ))}
      <div className="pointer-events-auto absolute left-1/2 top-1/3 w-[min(90vw,22rem)] -translate-x-1/2 animate-pop soft-card px-6 py-5 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-plum">Milestone</p>
        <p className="mt-2 font-display text-xl text-ink">{celebrate}</p>
        <button type="button" onClick={clearCelebrate} className="mt-3 text-sm font-semibold text-plum">
          Continue
        </button>
      </div>
    </div>
  );
}
