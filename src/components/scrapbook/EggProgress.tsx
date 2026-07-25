"use client";

import { eggStageForProgress, petById } from "@/data/sea";

export function EggProgress({
  progress,
  petId,
  label,
}: {
  progress: number;
  petId?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, progress));
  const stage = eggStageForProgress(pct);
  const pet = petId ? petById(petId) : undefined;
  const scale = 0.9 + (pct / 100) * 0.35;
  const showPet = pct >= 55;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-soft">
        <span>{label ?? "Egg growth"}</span>
        <span>{pct}%</span>
      </div>
      <div className="egg-stage soft-card flex flex-col items-center justify-center px-4 py-6">
        <div
          className={`egg-critter egg-${stage.id}`}
          style={{ transform: `scale(${scale})` }}
          aria-hidden
        >
          <div
            className="pastel-egg"
            style={{
              background: `radial-gradient(circle at 35% 30%, #fff8, transparent 40%), linear-gradient(160deg, ${stage.shell}, ${stage.accent})`,
              boxShadow: `0 8px 18px ${stage.accent}88`,
            }}
          >
            {stage.id === "crack" || stage.id === "peek" || stage.id === "almost" ? (
              <span className="egg-crack-line" />
            ) : null}
            {showPet && pet ? (
              <span className="egg-peek">{pet.emoji}</span>
            ) : (
              <span className="egg-heart">♡</span>
            )}
          </div>
        </div>
        <p className="mt-3 font-display text-lg">{stage.name}</p>
        <p className="mt-1 text-center text-xs text-ink-faint">
          {pct < 100 && pet
            ? `Growing into ${pet.name}… finish tasks to hatch them into your aquarium.`
            : pct < 100
              ? "Finish tasks to hatch your pastel egg."
              : pet
                ? `${pet.name} is fully grown and joined your aquarium!`
                : "Fully grown!"}
        </p>
        <div className="mt-4 h-2 w-full max-w-xs overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${stage.shell}, ${stage.accent})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
