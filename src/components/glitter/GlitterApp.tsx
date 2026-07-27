"use client";

import { useEffect, useMemo, useState } from "react";
import {
  acceptFriend,
  getSessionUsername,
  getUser,
  setSession,
  updateUser,
} from "@/data/auth";
import type { GlitterUser, TabId, ThemeMode } from "@/data/types";
import { TABS } from "@/data/types";
import { AuthGate } from "./AuthGate";
import { MessagesPanel } from "./MessagesPanel";
import { ForYouPanel } from "./ForYouPanel";
import { UpdatePanel } from "./UpdatePanel";
import { RoomsPanel } from "./RoomsPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { ProfilePanel } from "./ProfilePanel";
import { AvatarCreator } from "./AvatarCreator";
import { CalendarPanel } from "./CalendarPanel";
import { SettingsPanel } from "./SettingsPanel";
import { Modal } from "./ui";
import { AvatarBubble } from "./HumanAvatar";
import {
  IconBell,
  IconCalendar,
  IconFeed,
  IconLock,
  IconMessages,
  IconProfile,
  IconRooms,
  IconSettings,
  IconUpdate,
} from "./Icons";

type Overlay = "none" | "avatar" | "calendar" | "settings" | "safety";

const TAB_ICONS: Record<TabId, React.ReactNode> = {
  messages: <IconMessages size={20} />,
  foryou: <IconFeed size={20} />,
  update: <IconUpdate size={20} />,
  rooms: <IconRooms size={20} />,
  notifications: <IconBell size={20} />,
  profile: <IconProfile size={20} />,
};

export function GlitterApp() {
  const [user, setUser] = useState<GlitterUser | null>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<TabId>("rooms");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [overlay, setOverlay] = useState<Overlay>("none");

  useEffect(() => {
    const session = getSessionUsername();
    if (session) setUser(getUser(session) ?? null);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function patchUser(p: Partial<GlitterUser>) {
    if (!user) return;
    const next = updateUser(user.username, p);
    if (next) setUser({ ...next });
  }

  function refresh() {
    if (!user) return;
    const next = getUser(user.username);
    if (next) setUser({ ...next });
  }

  const unread = useMemo(() => user?.friendRequestsIn.length ?? 0, [user]);

  if (!ready) return <div className="app-shell min-h-[100svh]" />;
  if (!user) return <AuthGate onAuthed={setUser} />;

  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-28 pt-6 sm:px-8 lg:pb-10 lg:pt-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            <span className="iri-text">Glitter</span>
          </h1>
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost !p-2" onClick={() => setOverlay("calendar")} aria-label="Calendar">
              <IconCalendar size={18} />
            </button>
            <button type="button" className="btn btn-ghost !p-2" onClick={() => setOverlay("settings")} aria-label="Settings">
              <IconSettings size={18} />
            </button>
            <button type="button" onClick={() => setOverlay("avatar")} aria-label="Avatar">
              <AvatarBubble config={user.avatar} size={40} />
            </button>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
          <nav className="panel hidden h-fit p-2 lg:block">
            <ul className="space-y-1">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    data-active={tab === t.id}
                    onClick={() => setTab(t.id)}
                    className="tab-btn flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-bold"
                  >
                    {TAB_ICONS[t.id]}
                    <span className="flex-1">{t.label}</span>
                    {t.id === "notifications" && unread > 0 && (
                      <span className="rounded-full bg-coral px-1.5 text-[0.65rem] text-white">{unread}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-2 space-y-1 border-t border-line pt-2">
              <button type="button" className="tab-btn flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold" onClick={() => setOverlay("avatar")}>
                <IconProfile size={20} /> Avatar
              </button>
              <button type="button" className="tab-btn flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold" onClick={() => setOverlay("safety")}>
                <IconLock size={20} /> Safety
              </button>
            </div>
          </nav>

          <main className="min-h-[65svh]">
            {tab === "messages" && <MessagesPanel user={user} onPatchUser={patchUser} />}
            {tab === "foryou" && <ForYouPanel />}
            {tab === "update" && <UpdatePanel user={user} onPatchUser={patchUser} />}
            {tab === "rooms" && <RoomsPanel user={user} onPatchUser={patchUser} />}
            {tab === "notifications" && (
              <NotificationsPanel
                user={user}
                onAccept={(uname) => {
                  acceptFriend(user.username, uname);
                  refresh();
                }}
              />
            )}
            {tab === "profile" && (
              <ProfilePanel
                user={user}
                onPatchUser={patchUser}
                onOpenAvatar={() => setOverlay("avatar")}
                onSignOut={() => {
                  setSession(null);
                  setUser(null);
                }}
              />
            )}
          </main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 px-1 py-2 backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-lg justify-between">
          {TABS.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                data-active={tab === t.id}
                onClick={() => setTab(t.id)}
                className="tab-btn flex w-full flex-col items-center gap-0.5 px-1 py-2 text-[0.6rem] font-bold"
              >
                {TAB_ICONS[t.id]}
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {overlay === "avatar" && (
        <AvatarCreator
          value={user.avatar}
          onChange={(avatar) => patchUser({ avatar })}
          onClose={() => setOverlay("none")}
        />
      )}
      {overlay === "calendar" && <CalendarPanel onClose={() => setOverlay("none")} />}
      {overlay === "settings" && (
        <SettingsPanel
          theme={theme}
          onTheme={setTheme}
          user={user}
          onPatchUser={patchUser}
          onOpenAvatar={() => setOverlay("avatar")}
          onOpenSafety={() => setOverlay("safety")}
          onClose={() => setOverlay("none")}
        />
      )}
      {overlay === "safety" && (
        <SafetyPanel user={user} onPatchUser={patchUser} onClose={() => setOverlay("none")} />
      )}
    </div>
  );
}

function SafetyPanel({
  user,
  onPatchUser,
  onClose,
}: {
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
  onClose: () => void;
}) {
  return (
    <Modal title="Safety" onClose={onClose}>
      <ul className="space-y-2">
        {[
          "Block",
          "Report",
          "Mute",
          "Invite-only rooms",
          "Room passwords",
          "Two-factor authentication",
          "Login history",
          "Devices",
          "Camera & mic permissions",
        ].map((item) => (
          <li key={item} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3 text-sm font-bold">
            {item}
            <button type="button" className="btn btn-ghost !py-1.5 !text-xs">
              Manage
            </button>
          </li>
        ))}
      </ul>
      <label className="mt-4 block text-xs font-bold text-ink-faint">
        Group adds
        <select
          className="mt-2 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm font-semibold text-ink"
          value={user.groupAddPolicy}
          onChange={(e) => onPatchUser({ groupAddPolicy: e.target.value as GlitterUser["groupAddPolicy"] })}
        >
          <option value="friends">Friends only</option>
          <option value="public">Anyone</option>
        </select>
      </label>
    </Modal>
  );
}
