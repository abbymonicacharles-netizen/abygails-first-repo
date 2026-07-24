"use client";

import { useEffect } from "react";
import { useBookshelf } from "@/context/BookshelfContext";

const COLORS = ["#E8A0A8", "#7BA38A", "#A8C5D4", "#F0C987", "#C4A8D4", "#FFB4A2", "#B5EAD7"];

export function CelebrateOverlay() {
  const { celebrate, clearCelebrate } = useBookshelf();

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(clearCelebrate, 2800);
    return () => clearTimeout(t);
  }, [celebrate, clearCelebrate]);

  if (!celebrate) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-0 h-3 w-3 rounded-full"
          style={{
            left: `${(i * 17) % 100}%`,
            backgroundColor: COLORS[i % COLORS.length],
            animationDelay: `${(i % 8) * 0.08}s`,
          }}
        />
      ))}
      <div className="pointer-events-auto absolute left-1/2 top-1/3 w-[min(90vw,22rem)] -translate-x-1/2 animate-pop soft-card px-6 py-5 text-center">
        <p className="font-display text-xl font-bold text-ink">{celebrate}</p>
        <button
          type="button"
          onClick={clearCelebrate}
          className="mt-3 text-sm font-bold text-sage"
        >
          Yay!
        </button>
      </div>
    </div>
  );
}
