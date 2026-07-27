"use client";

import { AvatarBubble } from "./HumanAvatar";
import type { AvatarConfig } from "@/data/types";
import { IconPhone, IconVideo, IconClose } from "./Icons";

export function CallOverlay({
  kind,
  name,
  avatar,
  onEnd,
}: {
  kind: "voice" | "video";
  name: string;
  avatar: AvatarConfig;
  onEnd: () => void;
}) {
  return (
    <div className="call-overlay">
      <div className="flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-white/15 bg-[#14151c] p-8 text-white shadow-2xl">
        <div className={`rounded-full call-pulse ${kind === "video" ? "p-1" : ""}`}>
          <AvatarBubble config={avatar} size={96} />
        </div>
        <p className="mt-5 font-display text-2xl font-bold">{name}</p>
        <p className="mt-1 text-sm text-white/60">{kind === "video" ? "Video calling…" : "Calling…"}</p>
        <div className="mt-8 flex gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
            {kind === "video" ? <IconVideo /> : <IconPhone />}
          </span>
          <button
            type="button"
            onClick={onEnd}
            className="grid h-12 w-12 place-items-center rounded-full bg-[#e2556d]"
            aria-label="End call"
          >
            <IconClose />
          </button>
        </div>
      </div>
    </div>
  );
}
