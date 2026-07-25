"use client";

export function RaceTrack({ progress, label }: { progress: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-soft">
        <span>{label ?? "Race progress"}</span>
        <span>{pct}%</span>
      </div>
      <div className="race-track" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} role="progressbar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/stickers/car.svg"
          alt=""
          className="race-car"
          style={{ left: `${Math.max(8, Math.min(92, pct))}%` }}
        />
      </div>
    </div>
  );
}
