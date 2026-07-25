"use client";

import { stageForProgress } from "@/data/sea";

export function EggProgress({ progress, label }: { progress: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, progress));
  const stage = stageForProgress(pct);
  const scale = 0.85 + (pct / 100) * 0.45;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-soft">
        <span>{label ?? "Egg growth"}</span>
        <span>{pct}%</span>
      </div>
      <div className="egg-stage soft-card flex flex-col items-center justify-center px-4 py-6">
        <div
          className={`egg-critter egg-${stage.stage}`}
          style={{ transform: `scale(${scale})`, color: stage.color }}
          aria-hidden
        >
          <span className="egg-emoji">{stage.emoji}</span>
        </div>
        <p className="mt-3 font-display text-lg">{stage.name}</p>
        <p className="mt-1 text-center text-xs text-ink-faint">
          {pct < 15 && "Keep going: the egg is warming up"}
          {pct >= 15 && pct < 30 && "A crack! Something cute is coming"}
          {pct >= 30 && pct < 80 && "Your sea friend is growing"}
          {pct >= 80 && pct < 100 && "Almost a legend of the reef"}
          {pct >= 100 && "Fully grown: add them to your fish bowl"}
        </p>
        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-plum transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
