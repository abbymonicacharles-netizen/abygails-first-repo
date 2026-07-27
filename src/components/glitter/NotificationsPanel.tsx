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
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Notifications</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Messages, invites, mentions, likes, and calendar reminders — in one calm list.
          </p>
        </div>
        <button type="button" className="chip">
          Mark all read
        </button>
      </div>
      <ul className="mt-5 space-y-2">
        {NOTIFS.map((n) => (
          <li
            key={n.id}
            className={`flex items-start gap-3 rounded-2xl border px-3 py-3 ${
              n.unread ? "border-accent/40 bg-accent-soft/50" : "border-line bg-paper"
            }`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-surface text-lg">
              {ICONS[n.kind] ?? "🔔"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{n.text}</p>
              <p className="mt-1 text-xs text-ink-faint">{n.time}</p>
            </div>
            {n.unread && <span className="mt-1 status-dot bg-coral" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
