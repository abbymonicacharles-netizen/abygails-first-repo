"use client";

import { useBookshelf } from "@/context/BookshelfContext";
import type { ThemeMode } from "@/data/types";

const THEMES: { id: ThemeMode; label: string; hint: string }[] = [
  { id: "light", label: "Light", hint: "Soft paper daylight" },
  { id: "light-hc", label: "High contrast light", hint: "Strong black on white" },
  { id: "dark", label: "Dark", hint: "Evening shelf with warm light" },
  { id: "dark-hc", label: "High contrast dark", hint: "Bright text on black" },
];

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, setSettings, books } = useBookshelf();
  if (!open) return null;

  const friendKeys = Array.from(
    new Set(books.flatMap((b) => b.members).filter((m) => m && m !== "You")),
  );

  async function enableNotifications() {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }
    const perm = await Notification.requestPermission();
    setSettings({ notificationsEnabled: perm === "granted" });
    if (perm === "granted") {
      new Notification("Brainstorm reminders on", {
        body: "We'll nudge you about open tasks on reminder-enabled projects.",
        icon: "/brainstorm-logo.png",
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/35" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[90svh] w-full max-w-md overflow-y-auto animate-pop soft-card p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-butter">Preferences</p>
            <h2 className="mt-1 font-display text-2xl">General settings</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm font-semibold text-ink-faint">
            Done
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <section>
            <h3 className="text-sm font-semibold">Appearance</h3>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSettings({ theme: t.id })}
                  className={`border px-3 py-2.5 text-left ${
                    settings.theme === t.id
                      ? "border-forest bg-forest text-surface"
                      : "border-line bg-paper"
                  }`}
                >
                  <span className="block text-sm font-semibold">{t.label}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      settings.theme === t.id ? "text-surface/80" : "text-ink-faint"
                    }`}
                  >
                    {t.hint}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="border border-line bg-paper px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">Study music</span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  Soft room tones while you scrapbook
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.musicOn}
                onClick={() => setSettings({ musicOn: !settings.musicOn })}
                className={`relative h-7 w-12 shrink-0 border border-line transition-colors ${
                  settings.musicOn ? "bg-forest" : "bg-surface"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 bg-butter shadow transition-transform ${
                    settings.musicOn ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </section>

          <section className="border border-line bg-paper px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-sm font-semibold">Send notifications</span>
                <span className="mt-0.5 block text-xs text-ink-faint">
                  Reminders for projects and the task you are on
                </span>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.notificationsEnabled}
                onClick={() => {
                  if (!settings.notificationsEnabled) void enableNotifications();
                  else setSettings({ notificationsEnabled: false });
                }}
                className={`relative h-7 w-12 shrink-0 border border-line transition-colors ${
                  settings.notificationsEnabled ? "bg-forest" : "bg-surface"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 bg-butter shadow transition-transform ${
                    settings.notificationsEnabled ? "left-6" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-semibold">Friend names (only on your account)</h3>
            <p className="mt-1 text-xs text-ink-faint">
              Rename how classmates appear to you. Others still see their own names.
            </p>
            <div className="mt-3 space-y-2">
              {friendKeys.length === 0 && (
                <p className="text-xs text-ink-faint">Join a group book to nickname friends.</p>
              )}
              {friendKeys.map((friend) => (
                <label key={friend} className="block text-xs font-semibold">
                  {friend}
                  <input
                    value={settings.friendNicknames[friend] ?? ""}
                    placeholder="Nickname"
                    onChange={(e) =>
                      setSettings({
                        friendNicknames: {
                          ...settings.friendNicknames,
                          [friend]: e.target.value,
                        },
                      })
                    }
                    className="mt-1 w-full border border-line bg-surface px-2 py-1.5 text-sm outline-none focus:border-forest"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
