"use client";

import type { AvatarConfig, Presence } from "@/data/mock";
import { ME, PRESENCE_META } from "@/data/mock";
import { AvatarBubble, HumanAvatar } from "./HumanAvatar";
import { makeAvatar } from "@/data/mock";

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
    <div className="space-y-6">
      <div className="panel overflow-hidden">
        <div
          className="h-32"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklab, #67e8f9 55%, #1e1b4b), color-mix(in oklab, #c4b5fd 50%, #1e1b4b), color-mix(in oklab, #fda4af 45%, #1e1b4b))",
          }}
        />
        <div className="-mt-12 px-6 pb-6">
          <button type="button" onClick={onOpenAvatar} className="relative">
            <span className="avatar-round inline-flex bg-surface p-1">
              <HumanAvatar config={avatar} size={96} />
            </span>
            <span className="absolute -bottom-1 -right-1 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-bold text-paper">
              Edit
            </span>
          </button>
          <label className="mt-5 block">
            <span className="text-xs font-bold text-ink-faint">Display name</span>
            <input
              value={displayName}
              onChange={(e) => onDisplayName(e.target.value)}
              className="mt-1 w-full rounded-2xl border border-line bg-paper/70 px-4 py-2.5 font-display text-2xl font-bold outline-none focus:border-violet"
            />
          </label>
          <p className="mt-1 text-sm text-ink-faint">@{ME.username}</p>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{ME.bio}</p>
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

      <div className="grid gap-5 md:grid-cols-2">
        <div className="panel p-6">
          <h3 className="font-display text-xl font-bold">Friends</h3>
          <ul className="mt-4 space-y-3">
            {ME.friends.map((f, i) => (
              <li key={f} className="flex items-center gap-3 rounded-2xl border border-line bg-paper/60 px-3 py-2.5">
                <AvatarBubble
                  config={makeAvatar({
                    hairStyle: (["braids", "buzz", "sleek", "pixie"] as const)[i % 4],
                    clothingColor: ["#be123c", "#0d9488", "#0f172a", "#fbbf24"][i % 4],
                    skin: ["#8d5524", "#f3c7a6", "#5c3a21", "#f6e0d0"][i % 4],
                  })}
                  size={44}
                />
                <span className="text-sm font-bold">{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-6">
          <h3 className="font-display text-xl font-bold">Favorites</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {ME.favoriteThemes.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["#ccfbf1", "#fde68a", "#fecaca", "#ddd6fe", "#bbf7d0", "#e2e8f0"].map((c) => (
              <div key={c} className="aspect-square rounded-2xl" style={{ background: c }} />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={onOpenAvatar} className="btn btn-primary !text-xs">
              ✨ Avatar
            </button>
            <button type="button" onClick={onOpenCalendar} className="btn btn-ghost !text-xs">
              📅 Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
