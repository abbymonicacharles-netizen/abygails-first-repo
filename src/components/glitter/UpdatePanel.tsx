"use client";

import { MOODS, type GlitterUser, type Presence } from "@/data/types";

const PRESENCE: { id: Presence; label: string; color: string }[] = [
  { id: "available", label: "Available", color: "#22c55e" },
  { id: "busy", label: "Busy", color: "#eab308" },
  { id: "dnd", label: "Do not disturb", color: "#ef4444" },
  { id: "in-room", label: "In a room", color: "#a855f7" },
  { id: "offline", label: "Offline", color: "#64748b" },
];

export function UpdatePanel({
  user,
  onPatchUser,
}: {
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
}) {
  return (
    <div className="panel max-w-xl space-y-6 p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold">Update</h2>

      <section>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">Mood</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onPatchUser({ mood: m })}
              className={`chip ${user.mood === m ? "border-transparent bg-ink text-paper" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      <section>
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">Availability</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESENCE.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPatchUser({ presence: p.id })}
              className={`chip ${user.presence === p.id ? "border-transparent bg-ink text-paper" : ""}`}
            >
              <span className="status-dot" style={{ background: p.color }} />
              {p.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
