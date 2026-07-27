"use client";

import type { AvatarConfig, Presence } from "@/data/mock";
import { ME, PRESENCE_META } from "@/data/mock";
import { Initials } from "./ui";

export function ProfilePanel({
  displayName,
  onDisplayName,
  mood,
  presence,
  avatar,
  onOpenAvatar,
  onOpenCalendar,
}: {
  displayName: string;
  onDisplayName: (v: string) => void;
  mood: string;
  presence: Presence;
  avatar: AvatarConfig;
  onOpenAvatar: () => void;
  onOpenCalendar: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="panel overflow-hidden">
        <div
          className="h-28"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, var(--g-mint) 55%, #0f172a), color-mix(in oklab, var(--g-gold) 50%, #1e293b))",
          }}
        />
        <div className="-mt-8 px-5 pb-5">
          <button type="button" onClick={onOpenAvatar} className="relative">
            <span
              className="avatar-bubble !h-16 !w-16 !text-lg ring-4 ring-surface"
              style={{ background: avatar.skin }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-ink px-2 py-0.5 text-[0.6rem] font-semibold text-surface">
              Edit
            </span>
          </button>
          <label className="mt-4 block">
            <span className="text-xs font-semibold text-ink-faint">Display name</span>
            <input
              value={displayName}
              onChange={(e) => onDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 font-display text-2xl font-bold outline-none focus:border-accent"
            />
          </label>
          <p className="mt-1 text-sm text-ink-faint">@{ME.username}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{ME.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip">{mood}</span>
            <span className="chip">
              <span className="status-dot" style={{ background: PRESENCE_META[presence].color }} />
              {PRESENCE_META[presence].label}
            </span>
            <span className="chip">Joined {ME.joined}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="panel p-5">
          <h3 className="font-display text-lg font-bold">Friends</h3>
          <ul className="mt-3 space-y-2">
            {ME.friends.map((f, i) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2">
                <Initials name={f} color={["#f9736a", "#e8b84a", "#0d9488", "#6366f1"][i % 4]} />
                <span className="text-sm font-semibold">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <h3 className="font-display text-lg font-bold">Favorites & media</h3>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Favorite room themes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ME.favoriteThemes.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Shared media
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {["#ccfbf1", "#fde68a", "#fecaca", "#ddd6fe", "#bbf7d0", "#e2e8f0"].map((c) => (
              <div key={c} className="aspect-square rounded-xl" style={{ background: c }} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={onOpenAvatar} className="chip">
              ✨ Avatar
            </button>
            <button type="button" onClick={onOpenCalendar} className="chip">
              📅 Calendar
            </button>
            <span className="chip">🏅 Early Glitter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
