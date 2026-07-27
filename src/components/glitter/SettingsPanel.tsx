"use client";

import type { ThemeMode } from "@/data/mock";
import { Modal } from "./ui";

export function SettingsPanel({
  theme,
  onTheme,
  onOpenAvatar,
  onOpenSafety,
  onClose,
}: {
  theme: ThemeMode;
  onTheme: (t: ThemeMode) => void;
  onOpenAvatar: () => void;
  onOpenSafety: () => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Settings" onClose={onClose}>
      <p className="text-sm text-ink-soft">Personalize Glitter — polished by default, playful when you want it.</p>

      <section className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Themes</p>
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
      </section>

      <ul className="mt-5 space-y-3">
        {[
          ["Room appearance", "Lounge lighting & chair style"],
          ["Notification settings", "Messages, rooms, calendar"],
          ["Privacy settings", "Who can invite & mention you"],
          ["Language", "English"],
          ["Accessibility", "Motion, contrast, captions"],
          ["Mic & camera", "Defaults for rooms and calls"],
          ["Storage management", "Clear cache & media"],
          ["Data saver mode", "Lighter feed & rooms"],
          ["Linked devices", "2 devices signed in"],
        ].map(([title, sub]) => (
          <li
            key={title}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-paper/70 px-4 py-3"
          >
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

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={onOpenAvatar} className="btn btn-primary">
          Avatar editor
        </button>
        <button type="button" onClick={onOpenSafety} className="btn btn-ghost">
          Safety & privacy
        </button>
      </div>
    </Modal>
  );
}
