"use client";

import { useBookshelf } from "@/context/BookshelfContext";

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, setSettings } = useBookshelf();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md animate-pop soft-card p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Preferences</p>
            <h2 className="mt-1 font-display text-2xl">General settings</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-ink-faint">
            Done
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between gap-4 border border-line bg-paper px-4 py-3">
            <span>
              <span className="block text-sm font-semibold">Dark mode</span>
              <span className="mt-0.5 block text-xs text-ink-faint">
                Soft evening palette for the whole app
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.darkMode}
              onClick={() => setSettings({ darkMode: !settings.darkMode })}
              className={`relative h-7 w-12 shrink-0 border border-line transition-colors ${
                settings.darkMode ? "bg-forest" : "bg-surface"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 bg-surface shadow transition-transform ${
                  settings.darkMode ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between gap-4 border border-line bg-paper px-4 py-3">
            <span>
              <span className="block text-sm font-semibold">Show archive</span>
              <span className="mt-0.5 block text-xs text-ink-faint">
                Browse books you’ve set aside
              </span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showArchived}
              onClick={() => setSettings({ showArchived: !settings.showArchived })}
              className={`relative h-7 w-12 shrink-0 border border-line transition-colors ${
                settings.showArchived ? "bg-forest" : "bg-surface"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 bg-surface shadow transition-transform ${
                  settings.showArchived ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
