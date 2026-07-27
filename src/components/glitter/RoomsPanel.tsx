"use client";

import { useMemo, useState } from "react";
import { ROOM_THEMES, ROOMS, type Room } from "@/data/mock";
import { HumanAvatar } from "./HumanAvatar";

export function RoomsPanel() {
  const personal = useMemo(() => ROOMS.filter((r) => r.kind === "personal"), []);
  const meetings = useMemo(() => ROOMS.filter((r) => r.kind === "meeting"), []);
  const [activeId, setActiveId] = useState(personal[0]?.id ?? meetings[0]?.id);
  const [hand, setHand] = useState(false);
  const [tool, setTool] = useState("Notes");
  const room = ROOMS.find((r) => r.id === activeId) ?? ROOMS[0];
  const theme = ROOM_THEMES.find((t) => t.id === room.theme);

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <span className="float-icon absolute right-8 top-6 text-3xl opacity-70">✨</span>
        <span className="float-icon absolute right-20 top-16 text-2xl opacity-50">🪐</span>
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Shared <span className="iri-text">Rooms</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Lounge spaces with fixed chairs — not a grid of video tiles. Hang out, meet once, or keep a personal room of your own.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <RoomList
            title="My Rooms"
            subtitle="Personal spaces you keep"
            rooms={personal}
            activeId={activeId}
            onSelect={setActiveId}
          />
          <RoomList
            title="One-time meetings"
            subtitle="Invites that don’t linger"
            rooms={meetings}
            activeId={activeId}
            onSelect={setActiveId}
          />
          <button type="button" className="btn btn-primary w-full">
            + New room
          </button>
        </aside>

        <section className="panel overflow-hidden p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-2 pt-1">
            <div>
              <h3 className="font-display text-xl font-bold">{room.name}</h3>
              <p className="text-xs text-ink-faint">
                {theme?.emoji} {theme?.label} · {room.kind === "personal" ? "Personal" : "One-time meeting"} ·
                invite-only
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setHand((h) => !h)}
                className={`btn ${hand ? "btn-primary" : "btn-ghost"} !py-2 !text-xs`}
              >
                ✋ {hand ? "Hand raised" : "Raise hand"}
              </button>
              <button type="button" className="btn btn-ghost !py-2 !text-xs">
                Copy invite
              </button>
            </div>
          </div>

          <Lounge room={room} />

          <div className="mt-4 px-2 pb-2">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-faint">Room tools</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Voice", "Video", "Screen", "Browser", "YouTube", "Whiteboard", "Notes", "Reactions"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTool(t)}
                  className={`chip ${tool === t ? "border-transparent bg-ink text-paper" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-[1.4rem] border border-line bg-paper/70 px-4 py-4">
              <p className="text-sm font-bold">{tool}</p>
              <p className="mt-1 text-sm text-ink-soft">
                Shared quietly beside the lounge — avatars stay seated while you collaborate.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function RoomList({
  title,
  subtitle,
  rooms,
  activeId,
  onSelect,
}: {
  title: string;
  subtitle: string;
  rooms: Room[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="panel p-3">
      <div className="px-2 pb-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink-faint">{title}</p>
        <p className="mt-1 text-xs text-ink-soft">{subtitle}</p>
      </div>
      <ul className="space-y-1">
        {rooms.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(r.id)}
              data-active={activeId === r.id}
              className="tab-btn flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-semibold"
            >
              <span className="float-icon text-base">{r.emoji}</span>
              <span className="truncate">{r.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lounge({ room }: { room: Room }) {
  return (
    <div className="lounge">
      <div className="lounge-wall" />
      <div className="lounge-floor" />
      <div className="relative z-[1] grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-8 pt-10 sm:grid-cols-3 md:grid-cols-4">
        {room.seats.map((seat) => (
          <div key={seat.id} className="chair-spot" data-speaking={!!seat.speaking}>
            {seat.user && seat.avatar ? (
              <>
                <div className="chair-back" />
                <HumanAvatar config={seat.avatar} size={92} />
                <div className="chair-base" />
                <div className="mt-2 text-center">
                  <p className="text-xs font-bold">{seat.user}</p>
                  <p className="mt-0.5 text-[0.65rem] font-semibold text-ink-faint">
                    {seat.speaking ? "Speaking · " : ""}
                    {seat.micOn ? "Mic on" : "Muted"}
                    {seat.camOn ? " · Cam" : ""}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="chair-back opacity-40" />
                <div className="grid h-[110px] w-[88px] place-items-center rounded-[1.2rem] border border-dashed border-line/80 bg-white/20 text-ink-faint">
                  Empty
                </div>
                <div className="chair-base opacity-40" />
                <p className="mt-2 text-xs text-ink-faint">Open chair</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
