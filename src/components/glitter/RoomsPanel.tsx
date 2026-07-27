"use client";

import { useMemo, useState } from "react";
import type { AvatarConfig, GlitterUser, Room, RoomKind } from "@/data/types";
import { HumanAvatar } from "./HumanAvatar";
import { IconHand, IconPlus, IconScreen } from "./Icons";

function emptySeats(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: String(i + 1) }));
}

export function RoomsPanel({
  user,
  onPatchUser,
}: {
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
}) {
  const [rooms, setRooms] = useState<Room[]>(() => [
    {
      id: "personal-1",
      name: "My lounge",
      kind: "personal",
      inviteOnly: true,
      browserUrl: "https://www.google.com",
      seats: [
        {
          id: "1",
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          micOn: true,
          camOn: false,
        },
        ...emptySeats(3).slice(1),
      ],
    },
  ]);
  const [activeId, setActiveId] = useState(rooms[0].id);
  const [hand, setHand] = useState(false);
  const [urlDraft, setUrlDraft] = useState("https://www.google.com");

  const personal = useMemo(() => rooms.filter((r) => r.kind === "personal"), [rooms]);
  const meetings = useMemo(() => rooms.filter((r) => r.kind === "meeting"), [rooms]);
  const room = rooms.find((r) => r.id === activeId) ?? rooms[0];

  function createRoom(kind: RoomKind) {
    const id = `${kind}-${Date.now().toString(36)}`;
    const next: Room = {
      id,
      name: kind === "personal" ? "My lounge" : "Meeting",
      kind,
      inviteOnly: true,
      browserUrl: "https://www.google.com",
      seats: [
        {
          id: "1",
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          micOn: true,
        },
        ...emptySeats(kind === "personal" ? 4 : 6).slice(1),
      ],
    };
    setRooms((r) => [...r, next]);
    setActiveId(id);
    setUrlDraft(next.browserUrl);
  }

  function setBrowser(url: string) {
    const clean = url.startsWith("http") ? url : `https://${url}`;
    setUrlDraft(clean);
    setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, browserUrl: clean } : r)));
  }

  // keep seated avatar in sync with user avatar
  const seats = room.seats.map((s) =>
    s.username === user.username ? { ...s, avatar: user.avatar, displayName: user.displayName } : s,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <List
            title="My rooms"
            rooms={personal}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              const r = rooms.find((x) => x.id === id);
              if (r) setUrlDraft(r.browserUrl);
            }}
            onCreate={() => createRoom("personal")}
          />
          <List
            title="Meetings"
            rooms={meetings}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              const r = rooms.find((x) => x.id === id);
              if (r) setUrlDraft(r.browserUrl);
            }}
            onCreate={() => createRoom("meeting")}
          />
          <label className="panel block p-3 text-xs font-bold text-ink-faint">
            Who can add you to groups
            <select
              className="mt-2 w-full rounded-xl border border-line bg-paper px-2 py-2 text-sm font-semibold text-ink"
              value={user.groupAddPolicy}
              onChange={(e) =>
                onPatchUser({ groupAddPolicy: e.target.value as GlitterUser["groupAddPolicy"] })
              }
            >
              <option value="friends">Friends only</option>
              <option value="public">Anyone</option>
            </select>
          </label>
        </aside>

        <section className="panel overflow-hidden p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
            <div>
              <h2 className="font-display text-xl font-bold">{room.name}</h2>
              <p className="text-xs text-ink-faint">
                {room.kind === "personal" ? "Personal" : "One-time meeting"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn ${hand ? "btn-primary" : "btn-ghost"} !py-2 !text-xs`}
                onClick={() => setHand((h) => !h)}
              >
                <IconHand size={16} /> {hand ? "Raised" : "Raise hand"}
              </button>
            </div>
          </div>

          <Lounge seats={seats} browserUrl={room.browserUrl} />

          <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
            <IconScreen size={16} />
            <input
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onBlur={() => setBrowser(urlDraft)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setBrowser(urlDraft);
              }}
              className="min-w-0 flex-1 rounded-full border border-line bg-paper px-3 py-2 text-xs font-semibold outline-none focus:border-violet"
              placeholder="https://www.google.com"
            />
            <button type="button" className="btn btn-ink !py-2 !text-xs" onClick={() => setBrowser(urlDraft)}>
              Share on TV
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function List({
  title,
  rooms,
  activeId,
  onSelect,
  onCreate,
}: {
  title: string;
  rooms: Room[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="panel p-3">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">{title}</p>
        <button type="button" className="btn btn-ghost !p-1.5" onClick={onCreate} aria-label="Create">
          <IconPlus size={16} />
        </button>
      </div>
      <ul className="space-y-1">
        {rooms.length === 0 && (
          <li className="px-2 py-3 text-xs text-ink-faint">None yet</li>
        )}
        {rooms.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              data-active={activeId === r.id}
              onClick={() => onSelect(r.id)}
              className="tab-btn w-full px-3 py-2.5 text-left text-sm font-bold"
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lounge({
  seats,
  browserUrl,
}: {
  seats: {
    id: string;
    username?: string;
    displayName?: string;
    avatar?: AvatarConfig;
    speaking?: boolean;
    micOn?: boolean;
  }[];
  browserUrl: string;
}) {
  const host = (() => {
    try {
      return new URL(browserUrl).hostname.replace(/^www\./, "");
    } catch {
      return "google.com";
    }
  })();

  const filled = seats.filter((s) => s.username && s.avatar);
  const bagPositions = [
    { left: "10%", bottom: "18%", color: "#c5c9d6" },
    { left: "28%", bottom: "14%", color: "#b7bfe0" },
    { left: "58%", bottom: "14%", color: "#9eb6e8" },
    { left: "76%", bottom: "18%", color: "#c9c3e8" },
  ];

  return (
    <div className="lounge-scene">
      <div className="lounge-wall" />
      <div className="lounge-floor" />
      <div className="lounge-rug" />

      {/* plants / art hints */}
      <div className="absolute left-[8%] top-[18%] h-16 w-3 rounded-full bg-[#7d9b78] opacity-80" />
      <div className="absolute right-[10%] top-[22%] h-12 w-8 rounded-full bg-[#8fa88c] opacity-70" />
      <div className="absolute left-[18%] top-[12%] flex gap-2">
        <span className="h-7 w-7 rounded-md bg-[#d7e3f4]" />
        <span className="h-7 w-7 rounded-md bg-[#c9d8f0]" />
        <span className="h-7 w-7 rounded-md bg-[#dfe7f5]" />
      </div>

      <div className="lounge-tv">
        <div className="browser-chrome">
          <div className="browser-bar">
            <span className="browser-dot bg-[#ff5f57]" />
            <span className="browser-dot bg-[#febc2e]" />
            <span className="browser-dot bg-[#28c840]" />
            <div className="browser-url">{browserUrl}</div>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 bg-gradient-to-b from-white to-[#f3f6fb] p-3 text-center">
            <p className="text-[11px] font-bold tracking-wide text-[#5f6368]">Google</p>
            <div className="w-[78%] rounded-full border border-[#dfe1e5] px-3 py-1.5 text-left text-[9px] text-[#80868b]">
              Search {host}
            </div>
            <p className="text-[8px] text-[#80868b]">Shared browser · everyone sees this</p>
          </div>
        </div>
      </div>
      <div className="lounge-console" />

      {bagPositions.map((bag, i) => {
        const seat = filled[i];
        return (
          <div key={bag.left} className="absolute" style={{ left: bag.left, bottom: bag.bottom }}>
            <div className="beanbag" style={{ background: bag.color }} />
            {seat?.avatar ? (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <HumanAvatar config={seat.avatar} size={78} showChair={false} />
                <p className="mt-0.5 rounded-full bg-white/85 px-2 py-0.5 text-[0.65rem] font-bold text-ink shadow-sm">
                  @{seat.username}
                </p>
              </div>
            ) : (
              <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold text-ink-faint">
                Open
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
