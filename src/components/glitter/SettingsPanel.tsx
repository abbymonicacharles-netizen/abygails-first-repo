"use client";

import type { GlitterUser, ThemeMode } from "@/data/types";
import { Modal } from "./ui";

export function SettingsPanel({
  theme,
  onTheme,
  user,
  onPatchUser,
  onOpenAvatar,
  onOpenSafety,
  onClose,
}: {
  theme: ThemeMode;
  onTheme: (t: ThemeMode) => void;
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
  onOpenAvatar: () => void;
  onOpenSafety: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">Theme</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {(
          [
            ["light", "Light"],
            ["dark", "Dark"],
            ["hc", "High contrast"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onTheme(id)}
            className={`chip ${theme === id ? "border-transparent bg-ink text-paper" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-5 space-y-2">
        {[
          ["Notifications", "Messages, rooms, calendar"],
          ["Privacy", "Mentions & invites"],
          ["Language", "English"],
          ["Accessibility", "Motion & contrast"],
          ["Mic & camera", "Defaults"],
          ["Storage", "Cache"],
          ["Linked devices", "This device"],
        ].map(([title, sub]) => (
          <li key={title} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3">
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="text-xs text-ink-faint">{sub}</p>
            </div>
            <button type="button" className="btn btn-ghost !py-1.5 !text-xs">
              Open
            </button>
          </li>
        ))}
      </ul>

      <label className="mt-4 block text-xs font-bold text-ink-faint">
        Group adds
        <select
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm font-semibold"
          value={user.groupAddPolicy}
          onChange={(e) => onPatchUser({ groupAddPolicy: e.target.value as GlitterUser["groupAddPolicy"] })}
        >
          <option value="friends">Friends only</option>
          <option value="public">Anyone</option>
        </select>
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={onOpenAvatar}>
          Avatar
        </button>
        <button type="button" className="btn btn-ghost" onClick={onOpenSafety}>
          Safety
        </button>
      </div>
    </Modal>
  );
}
