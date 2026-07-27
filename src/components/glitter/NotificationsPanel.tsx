"use client";

import type { GlitterUser } from "@/data/types";
import { getUser } from "@/data/auth";
import { AvatarBubble } from "./HumanAvatar";
import { makeAvatar } from "@/data/types";

export function NotificationsPanel({
  user,
  onAccept,
}: {
  user: GlitterUser;
  onAccept: (username: string) => void;
}) {
  return (
    <div className="panel p-5 sm:p-6">
      <h2 className="font-display text-2xl font-bold">Alerts</h2>
      <ul className="mt-5 space-y-2">
        {user.friendRequestsIn.length === 0 && (
          <li className="rounded-2xl border border-line bg-paper px-4 py-8 text-center text-sm text-ink-faint">
            No alerts
          </li>
        )}
        {user.friendRequestsIn.map((uname) => {
          const u = getUser(uname);
          return (
            <li
              key={uname}
              className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-3 py-3"
            >
              <AvatarBubble config={u?.avatar ?? makeAvatar()} size={44} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">@{uname}</p>
                <p className="text-xs text-ink-faint">Friend request</p>
              </div>
              <button type="button" className="btn btn-primary !py-2 !text-xs" onClick={() => onAccept(uname)}>
                Accept
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
