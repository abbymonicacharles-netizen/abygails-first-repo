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
import { AvatarBubble } from "./HumanAvatar";

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
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
        <header className="fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <span className="float-icon absolute -right-8 -top-3 text-xl opacity-70">✧</span>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-ink-faint">Dashboard</p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="iri-text">Glitter</span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">
              <span className="status-dot" style={{ background: PRESENCE_META[presence].color }} />
              {PRESENCE_META[presence].label}
            </span>
            <button type="button" className="btn btn-ghost !py-2 !text-xs" onClick={() => setOverlay("calendar")}>
              📅 Calendar
            </button>
            <button type="button" className="btn btn-ghost !py-2 !text-xs" onClick={() => setOverlay("settings")}>
              ⚙️ Settings
            </button>
            <button type="button" onClick={() => setOverlay("avatar")} className="ml-1">
              <AvatarBubble config={avatar} size={44} />
            </button>
          </div>
        </header>

        <div className="fade-up grid flex-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <nav className="panel hidden h-fit space-y-2 p-3 lg:block">
            <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ink-faint">
              Navigate
            </p>
            <ul className="space-y-1">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    data-active={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className="tab-btn flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold"
                  >
                    <span className="float-icon text-base" aria-hidden>
                      {t.icon}
                    </span>
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
            <div className="space-y-2 border-t border-line pt-3">
              <button type="button" className="btn btn-ghost w-full !justify-start" onClick={() => setOverlay("avatar")}>
                ✨ Avatar
              </button>
              <button type="button" className="btn btn-ghost w-full !justify-start" onClick={() => setOverlay("safety")}>
                🛡️ Safety
              </button>
            </div>
          </nav>

          <main className="min-h-[68svh]">
            {tab === "messages" && <MessagesPanel />}
            {tab === "foryou" && <ForYouPanel />}
            {tab === "status" && (
              <StatusPanel mood={mood} presence={presence} onMood={setMood} onPresence={setPresence} />
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 px-2 py-2 backdrop-blur-xl lg:hidden">
        <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
          {TABS.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                data-active={tab === t.id}
                onClick={() => setTab(t.id)}
                className="tab-btn flex w-full flex-col items-center px-1 py-2 text-[0.62rem] font-bold"
              >
                <span className="text-base">{t.icon}</span>
                <span className="mt-0.5 truncate">{t.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {overlay === "avatar" && (
        <AvatarCreator value={avatar} onChange={setAvatar} onClose={() => setOverlay("none")} />
      )}
      {overlay === "calendar" && <CalendarPanel events={EVENTS} onClose={() => setOverlay("none")} />}
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
      <p className="text-sm text-ink-soft">Keep hangouts kind, invite-only, and under your control.</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center justify-between rounded-2xl border border-line bg-paper/70 px-4 py-3 text-sm font-bold"
          >
            {item}
            <button type="button" className="btn btn-ghost !py-1.5 !text-xs">
              Manage
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
