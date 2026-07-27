"use client";

import { useState } from "react";
import { MOODS, PRESENCE_META, STATUSES, type Presence } from "@/data/mock";
import { AvatarBubble } from "./HumanAvatar";

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
    <div className="space-y-6">
      <div className="panel p-6 sm:p-8">
        <h2 className="font-display text-3xl font-bold">
          Status <span className="iri-text">now</span>
        </h2>
        <p className="mt-2 text-sm text-ink-soft">Quick updates with room to breathe.</p>

        <div className="mt-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">Mood</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MOODS.map((m) => {
              const value = `${m.emoji} ${m.text}`;
              return (
                <button
                  key={m.text}
                  type="button"
                  onClick={() => onMood(value)}
                  className={`chip ${mood === value ? "border-transparent bg-ink text-paper" : ""}`}
                >
                  {m.emoji} {m.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">Availability</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(PRESENCE_META) as Presence[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onPresence(key)}
                className={`chip ${presence === key ? "border-transparent bg-ink text-paper" : ""}`}
              >
                <span className="status-dot" style={{ background: PRESENCE_META[key].color }} />
                {PRESENCE_META[key].label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setExpires("24h")}
            className={`btn ${expires === "24h" ? "btn-primary" : "btn-ghost"} !text-xs`}
          >
            Disappear in 24h
          </button>
          <button
            type="button"
            onClick={() => setExpires("forever")}
            className={`btn ${expires === "forever" ? "btn-primary" : "btn-ghost"} !text-xs`}
          >
            Stay on profile
          </button>
        </div>

        <div className="iri-border mt-6 p-5">
          <p className="text-xs font-bold text-ink-faint">Preview</p>
          <p className="mt-2 text-lg font-bold">
            {mood} · {PRESENCE_META[presence].emoji} {PRESENCE_META[presence].label}
          </p>
        </div>
      </div>

      <div className="panel p-6">
        <h3 className="font-display text-xl font-bold">Friends</h3>
        <ul className="mt-4 space-y-3">
          {STATUSES.map((s) => (
            <li key={s.id} className="flex items-center gap-3 rounded-2xl border border-line bg-paper/60 px-3 py-3">
              <AvatarBubble config={s.avatar} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{s.user}</p>
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
