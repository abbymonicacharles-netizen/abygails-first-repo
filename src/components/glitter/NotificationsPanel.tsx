"use client";

import { NOTIFS } from "@/data/mock";

const ICONS: Record<string, string> = {
  room: "🏠",
  message: "💬",
  social: "♥",
  calendar: "📅",
  friend: "👤",
};

export function NotificationsPanel() {
  return (
    <div className="panel p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-3xl font-bold">
            Alerts <span className="iri-text">live</span>
          </h2>
          <p className="mt-2 text-sm text-ink-soft">One calm list — not a pile of noise.</p>
        </div>
        <button type="button" className="btn btn-ghost !text-xs">
          Mark all read
        </button>
      </div>
      <ul className="mt-6 space-y-3">
        {NOTIFS.map((n) => (
          <li
            key={n.id}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-4 ${
              n.unread ? "border-violet/30 bg-accent-soft/60" : "border-line bg-paper/60"
            }`}
          >
            <span className="float-icon grid h-11 w-11 place-items-center rounded-full bg-surface text-lg shadow-sm">
              {ICONS[n.kind] ?? "🔔"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{n.text}</p>
              <p className="mt-1 text-xs text-ink-faint">{n.time}</p>
            </div>
            {n.unread && <span className="mt-2 status-dot bg-coral" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
