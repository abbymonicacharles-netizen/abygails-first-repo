"use client";

import type { GlitterUser } from "@/data/types";
import { HumanAvatar } from "./HumanAvatar";
import { getUser } from "@/data/auth";
import { AvatarBubble } from "./HumanAvatar";
import { makeAvatar } from "@/data/types";

export function ProfilePanel({
  user,
  onPatchUser,
  onOpenAvatar,
  onSignOut,
}: {
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
  onOpenAvatar: () => void;
  onSignOut: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="panel overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-[#c7eaf2] via-[#ddd6fe] to-[#fbcfe8]" />
        <div className="-mt-10 px-5 pb-5">
          <button type="button" onClick={onOpenAvatar}>
            <span className="avatar-round inline-flex bg-surface p-1">
              <HumanAvatar config={user.avatar} size={88} showChair={false} />
            </span>
          </button>
          <input
            value={user.displayName}
            onChange={(e) => onPatchUser({ displayName: e.target.value })}
            className="mt-4 w-full rounded-2xl border border-line bg-paper px-3 py-2 font-display text-2xl font-bold outline-none"
          />
          <p className="mt-1 text-sm text-ink-faint">@{user.username}</p>
          <textarea
            value={user.bio}
            onChange={(e) => onPatchUser({ bio: e.target.value })}
            placeholder="Bio"
            rows={2}
            className="mt-3 w-full rounded-2xl border border-line bg-paper px-3 py-2 text-sm outline-none"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{user.mood}</span>
            <span className="chip">{user.friends.length} friends</span>
            <span className="chip">{user.joined}</span>
          </div>
        </div>
      </div>

      <div className="panel p-5">
        <h3 className="font-display text-lg font-bold">Friends</h3>
        <ul className="mt-3 space-y-2">
          {user.friends.length === 0 && (
            <li className="py-6 text-center text-sm text-ink-faint">0 friends</li>
          )}
          {user.friends.map((uname) => {
            const f = getUser(uname);
            return (
              <li key={uname} className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-2">
                <AvatarBubble config={f?.avatar ?? makeAvatar()} size={40} />
                <div>
                  <p className="text-sm font-bold">{user.nicknames[uname] || f?.displayName || uname}</p>
                  <p className="text-xs text-ink-faint">@{uname}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={onOpenAvatar}>
          Edit avatar
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (!user.contactsLinked) onPatchUser({ contactsLinked: true });
          }}
        >
          {user.contactsLinked ? "Contacts linked" : "Link contacts"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
