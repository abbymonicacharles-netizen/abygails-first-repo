"use client";

import { useEffect, useMemo, useState } from "react";
import type { AvatarConfig, Presence, TabId, ThemeMode } from "@/data/mock";
import { EVENTS, ME, NOTIFS, PRESENCE_META, TABS } from "@/data/mock";
import { MessagesPanel } from "./MessagesPanel";
import { ForYouPanel } from "./ForYouPanel";
import { StatusPanel } from "./StatusPanel";
import { RoomsPanel } from "./RoomsPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfilePanel } from "./ProfilePanel";
import { AvatarCreator } from "./AvatarCreator";
import { CalendarPanel } from "./CalendarPanel";
import { SettingsPanel } from "./SettingsPanel";
import { Modal } from "./ui";

type Overlay = "none" | "avatar" | "calendar" | "settings" | "safety";

export function GlitterApp() {
  const [tab, setTab] = useState<TabId>("rooms");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [presence, setPresence] = useState<Presence>(ME.presence);
  const [mood, setMood] = useState(ME.mood);
  const [avatar, setAvatar] = useState<AvatarConfig>(ME.avatar);
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [displayName, setDisplayName] = useState(ME.displayName);
  const unread = useMemo(() => NOTIFS.filter((n) => n.unread).length, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-28 pt-5 sm:px-6 lg:pb-8 lg:pt-8">
        <header className="fade-up mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ink-faint">
              Your dashboard
            </p>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Glitter
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">
              <span
                className="status-dot"
                style={{ background: PRESENCE_META[presence].color }}
              />
              {PRESENCE_META[presence].label}
            </span>
            <button
              type="button"
              className="chip hover:border-accent"
              onClick={() => setOverlay("calendar")}
            >
              📅 Calendar
            </button>
            <button
              type="button"
              className="chip hover:border-accent"
              onClick={() => setOverlay("settings")}
            >
              ⚙️ Settings
            </button>
          </div>
        </header>

        <div className="fade-up grid flex-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="panel hidden h-fit p-3 lg:block">
            <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-faint">
              Navigate
            </p>
            <ul className="space-y-1">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    data-active={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className="tab-btn flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold"
                  >
                    <span aria-hidden>{t.icon}</span>
                    <span className="flex-1">{t.label}</span>
                    {t.id === "notifications" && unread > 0 && (
                      <span className="rounded-full bg-coral px-1.5 py-0.5 text-[0.65rem] text-white">
                        {unread}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <button
                type="button"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-left text-sm font-semibold"
                onClick={() => setOverlay("avatar")}
              >
                ✨ Avatar creator
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-left text-sm font-semibold"
                onClick={() => setOverlay("safety")}
              >
                🛡️ Safety & privacy
              </button>
            </div>
          </nav>

          <main className="min-h-[70svh]">
            {tab === "messages" && <MessagesPanel />}
            {tab === "foryou" && <ForYouPanel />}
            {tab === "status" && (
              <StatusPanel
                mood={mood}
                presence={presence}
                onMood={setMood}
                onPresence={setPresence}
              />
            )}
            {tab === "rooms" && <RoomsPanel />}
            {tab === "notifications" && <NotificationsPanel />}
            {tab === "profile" && (
              <ProfilePanel
                displayName={displayName}
                onDisplayName={setDisplayName}
                mood={mood}
                presence={presence}
                avatar={avatar}
                onOpenAvatar={() => setOverlay("avatar")}
                onOpenCalendar={() => setOverlay("calendar")}
              />
            )}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-2 py-2 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
          {TABS.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                data-active={tab === t.id}
                onClick={() => setTab(t.id)}
                className="tab-btn flex w-full flex-col items-center rounded-xl px-1 py-2 text-[0.65rem] font-semibold"
              >
                <span className="text-base">{t.icon}</span>
                <span className="mt-0.5 truncate">{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {overlay === "avatar" && (
        <AvatarCreator
          value={avatar}
          onChange={setAvatar}
          onClose={() => setOverlay("none")}
        />
      )}
      {overlay === "calendar" && (
        <CalendarPanel events={EVENTS} onClose={() => setOverlay("none")} />
      )}
      {overlay === "settings" && (
        <SettingsPanel
          theme={theme}
          onTheme={setTheme}
          onOpenAvatar={() => setOverlay("avatar")}
          onOpenSafety={() => setOverlay("safety")}
          onClose={() => setOverlay("none")}
        />
      )}
      {overlay === "safety" && <SafetyPanel onClose={() => setOverlay("none")} />}
    </div>
  );
}

function SafetyPanel({ onClose }: { onClose: () => void }) {
  const items = [
    "Block users",
    "Report users",
    "Mute users",
    "Invite-only rooms",
    "Room passwords",
    "Two-factor authentication",
    "Login history",
    "Device management",
    "Privacy controls",
    "Camera & microphone permissions",
  ];
  return (
    <Modal title="Safety & privacy" onClose={onClose}>
      <p className="text-sm text-ink-soft">
        Tools to keep hangouts professional, kind, and invite-only when you want them to be.
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between rounded-xl border border-line bg-paper px-3 py-3 text-sm font-semibold"
          >
            {item}
            <button type="button" className="text-xs font-semibold text-accent">
              Manage
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
