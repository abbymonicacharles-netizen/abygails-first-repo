"use client";

import { useState } from "react";
import {
  MOODS,
  PRESENCE_META,
  STATUSES,
  type Presence,
} from "@/data/mock";
import { Initials } from "./ui";

export function StatusPanel({
  mood,
  presence,
  onMood,
  onPresence,
}: {
  mood: string;
  presence: Presence;
  onMood: (m: string) => void;
  onPresence: (p: Presence) => void;
}) {
  const [expires, setExpires] = useState<"24h" | "forever">("24h");

  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <h2 className="font-display text-2xl font-bold">Status</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Quick updates friends can see — with availability that stays professional.
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Your mood</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const value = `${m.emoji} ${m.text}`;
              return (
                <button
                  key={m.text}
                  type="button"
                  onClick={() => onMood(value)}
                  className={`chip ${mood === value ? "border-accent bg-accent-soft" : ""}`}
                >
                  {m.emoji} {m.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Availability</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(Object.keys(PRESENCE_META) as Presence[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onPresence(key)}
                className={`chip ${presence === key ? "border-ink bg-ink text-surface" : ""}`}
              >
                <span className="status-dot" style={{ background: PRESENCE_META[key].color }} />
                {PRESENCE_META[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Visibility</p>
          <button
            type="button"
            onClick={() => setExpires("24h")}
            className={`chip ${expires === "24h" ? "border-accent bg-accent-soft" : ""}`}
          >
            Disappear in 24 hours
          </button>
          <button
            type="button"
            onClick={() => setExpires("forever")}
            className={`chip ${expires === "forever" ? "border-accent bg-accent-soft" : ""}`}
          >
            Stay on profile
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-line bg-paper p-4">
          <p className="text-xs font-semibold text-ink-faint">Preview</p>
          <p className="mt-2 text-lg font-semibold">
            {mood} · {PRESENCE_META[presence].emoji} {PRESENCE_META[presence].label}
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            {expires === "24h" ? "Expires in 24 hours" : "Pinned to your profile"}
          </p>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-lg font-bold">Friends’ status</h3>
        <ul className="mt-4 space-y-3">
          {STATUSES.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-3">
              <Initials name={s.user} color={s.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.user}</p>
                <p className="text-sm text-ink-soft">
                  {s.emoji} {s.text}
                </p>
              </div>
              <span className="chip">
                <span className="status-dot" style={{ background: PRESENCE_META[s.presence].color }} />
                {PRESENCE_META[s.presence].label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
