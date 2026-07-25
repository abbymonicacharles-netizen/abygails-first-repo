"use client";

import { useEffect } from "react";
import { useBookshelf } from "@/context/BookshelfContext";

const COLORS = ["#1f3a2f", "#5c2430", "#b8975a", "#1e2a38", "#f3efe6"];

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
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-0 h-2.5 w-2.5 rounded-[2px]"
          style={{
            left: `${(i * 19) % 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${(i % 7) * 0.07}s`,
          }}
        />
      ))}
      <div className="pointer-events-auto absolute left-1/2 top-1/3 w-[min(90vw,22rem)] -translate-x-1/2 animate-pop soft-card px-6 py-5 text-center">
        <p className="font-display text-xl text-ink">{celebrate}</p>
        <button type="button" onClick={clearCelebrate} className="mt-3 text-sm font-semibold text-forest">
          Continue
        </button>
      </div>
    </div>
  );
}
