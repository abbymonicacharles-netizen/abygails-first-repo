"use client";

import { useState } from "react";
import { useBrainstorm } from "@/context/BrainstormContext";

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, updateSettings, openOnboarding } = useBrainstorm();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close settings"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Settings</h2>
          <button type="button" onClick={onClose} className="text-sm text-ink-faint">
            Close
          </button>
        </div>

        <label className="mt-6 block text-sm font-medium">
          Accent color
          <input
            type="color"
            value={settings.accent}
            onChange={(e) => updateSettings({ accent: e.target.value })}
            className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-transparent"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Bookshelf tone
          <input
            type="color"
            value={settings.shelfTone}
            onChange={(e) => updateSettings({ shelfTone: e.target.value })}
            className="mt-2 h-10 w-full cursor-pointer rounded-lg bg-transparent"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Font scale
          <select
            value={settings.fontScale}
            onChange={(e) =>
              updateSettings({
                fontScale: e.target.value as "sm" | "md" | "lg",
              })
            }
            className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </select>
        </label>

        <button
          type="button"
          onClick={() => {
            openOnboarding();
            onClose();
          }}
          className="mt-6 w-full rounded-xl border border-line px-4 py-3 text-sm font-semibold"
        >
          Replay onboarding tutorial
        </button>
      </div>
    </div>
  );
}

export function useSettingsOpen() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
