"use client";

import { useState } from "react";
import { ROOM_THEMES, ROOMS, type Room } from "@/data/mock";
import { Initials } from "./ui";

export function RoomsPanel() {
  const [activeId, setActiveId] = useState(ROOMS[0].id);
  const [hand, setHand] = useState(false);
  const [tool, setTool] = useState("Whiteboard");
  const room = ROOMS.find((r) => r.id === activeId) ?? ROOMS[0];
  const theme = ROOM_THEMES.find((t) => t.id === room.theme);

  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Shared Rooms</h2>
            <p className="mt-1 max-w-xl text-sm text-ink-soft">
              Invite-only virtual rooms for hanging out, meetings, studying, movie nights, gaming, and brainstorming.
              Avatars sit in fixed seats — clear, calm, and intentional.
            </p>
          </div>
          <button type="button" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-surface">
            + Create room
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {ROOM_THEMES.map((t) => (
            <span key={t.id} className="chip">
              {t.emoji} {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="panel p-3">
          <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            Your rooms
          </p>
          <ul className="space-y-1">
            {ROOMS.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(r.id)}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                    activeId === r.id ? "bg-ink text-surface" : "hover:bg-paper"
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="truncate">{r.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="panel overflow-hidden">
          <RoomStage
            room={room}
            themeLabel={`${theme?.emoji ?? room.emoji} ${theme?.label ?? "Room"}`}
            hand={hand}
            onHand={() => setHand((h) => !h)}
            tool={tool}
            onTool={setTool}
          />
        </section>
      </div>
    </div>
  );
}

function RoomStage({
  room,
  themeLabel,
  hand,
  onHand,
  tool,
  onTool,
}: {
  room: Room;
  themeLabel: string;
  hand: boolean;
  onHand: () => void;
  tool: string;
  onTool: (t: string) => void;
}) {
  const tools = [
    "Voice",
    "Video",
    "Screen",
    "Browser",
    "YouTube",
    "Whiteboard",
    "Notes",
    "Reactions",
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <h3 className="font-display text-xl font-bold">{room.name}</h3>
          <p className="text-xs text-ink-faint">
            {themeLabel} · {room.inviteOnly ? "Invite-only" : "Open"} · fixed seats
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onHand}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              hand ? "bg-gold text-ink" : "border border-line bg-paper"
            }`}
          >
            ✋ {hand ? "Hand raised" : "Raise hand"}
          </button>
          <button type="button" className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold">
            Copy invite
          </button>
        </div>
      </div>

      <div
        className="p-4"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--g-mint) 16%, transparent), transparent 40%), var(--g-room)",
        }}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {room.seats.map((seat) => (
            <div
              key={seat.id}
              className="seat"
              data-empty={!seat.user}
              data-speaking={!!seat.speaking}
            >
              {seat.user ? (
                <>
                  <Initials name={seat.user} color={seat.color || "#0d9488"} />
                  <p className="truncate text-xs font-semibold">{seat.user}</p>
                  <div className="flex gap-1 text-[0.65rem] text-ink-faint">
                    <span>{seat.micOn ? "🎙" : "🔇"}</span>
                    <span>{seat.camOn ? "📷" : "🚫"}</span>
                    {seat.speaking && <span className="font-semibold text-accent">Speaking</span>}
                  </div>
                </>
              ) : (
                <>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-dashed border-line text-ink-faint">
                    +
                  </span>
                  <p className="text-xs text-ink-faint">Empty seat</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">Room tools</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {tools.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTool(t)}
                className={`chip ${tool === t ? "border-ink bg-ink text-surface" : ""}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 min-h-28 rounded-xl border border-dashed border-line bg-paper p-4">
            <p className="text-sm font-semibold">{tool} canvas</p>
            <p className="mt-1 text-sm text-ink-soft">
              {tool === "Whiteboard" && "Sketch flows together — markers, sticky notes, export."}
              {tool === "Notes" && "Shared notes sync live for everyone in the room."}
              {tool === "YouTube" && "Watch the same video in sync with play/pause control."}
              {tool === "Browser" && "Browse a shared tab for research or docs."}
              {tool === "Screen" && "Present your screen while seats stay fixed."}
              {tool === "Voice" && "Crystal-clear voice chat with speaking indicators."}
              {tool === "Video" && "Camera tiles stay mapped to seats — no wandering avatars."}
              {tool === "Reactions" && "Drop emoji reactions that float above seats."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
