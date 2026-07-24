"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBookshelf } from "@/context/BookshelfContext";
import { bookProgress, daysUntil, TASK_COLORS, makeId } from "@/data/factory";
import type { BookTab, StickyTask, ScrapItem, DeskFile, MeetingCard } from "@/data/types";
import { CelebrateOverlay } from "./CelebrateOverlay";

const TABS: { id: BookTab; label: string; tint: string }[] = [
  { id: "notes", label: "Notes", tint: "#FFF3C4" },
  { id: "tasks", label: "Tasks", tint: "#FFD6E0" },
  { id: "files", label: "Files", tint: "#D4F1F4" },
  { id: "team", label: "Team", tint: "#E2F0CB" },
  { id: "progress", label: "Progress", tint: "#F5E6FF" },
];

export function BookHub({ bookId }: { bookId: string }) {
  const { getBook, updateBook, addSubgroup, updateSubgroup, ready } = useBookshelf();
  const book = getBook(bookId);
  const [tab, setTab] = useState<BookTab>("home");
  const [subgroupId, setSubgroupId] = useState<string | null>(null);

  const subgroup = useMemo(
    () => book?.subgroups.find((s) => s.id === subgroupId) ?? null,
    [book, subgroupId],
  );

  if (!ready) return <div className="room min-h-[100svh]" />;
  if (!book) {
    return (
      <div className="room flex min-h-[100svh] items-center justify-center">
        <Link href="/" className="font-bold text-sage">
          Back to shelf
        </Link>
      </div>
    );
  }

  const progress = bookProgress(book);
  const days = daysUntil(book.dueDate);
  const left = book.tasks.filter((t) => !t.done).length;

  const encouragement =
    left === 0 && book.tasks.length > 0
      ? "Everything’s done — take a breath!"
      : left > 0 && left <= 3
        ? `Only ${left} task${left === 1 ? "" : "s"} left!`
        : progress > 0
          ? "Nice pace — keep going."
          : "Open a page and start scribbling.";

  return (
    <div className="room min-h-[100svh]">
      <CelebrateOverlay />
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-bold text-ink-soft">
            ← Shelf
          </Link>
          {subgroup && (
            <button
              type="button"
              onClick={() => {
                setSubgroupId(null);
                setTab("team");
              }}
              className="text-sm font-bold text-sage"
            >
              ← Main book
            </button>
          )}
        </div>

        <header className="soft-card mt-4 animate-pop p-5 sm:p-6">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {subgroup ? `${subgroup.emoji} ${subgroup.name}` : book.title}
          </h1>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm font-bold text-ink-soft">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-paper">
              <div
                className="progress-fill h-full rounded-full bg-sage"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-ink-soft">
            <span>
              {days == null
                ? "No due date"
                : days < 0
                  ? `Overdue by ${Math.abs(days)}d`
                  : `Due in ${days} day${days === 1 ? "" : "s"}`}
            </span>
            <span>·</span>
            <span>Team: {book.members.length} members</span>
          </div>
          <p className="mt-3 text-sm font-bold text-blush">{encouragement}</p>
          {!subgroup && (
            <label className="mt-3 block text-xs font-bold text-ink-faint">
              Due date
              <input
                type="date"
                value={book.dueDate ?? ""}
                onChange={(e) => updateBook(book.id, { dueDate: e.target.value || undefined })}
                className="mt-1 rounded-xl border border-line bg-paper px-2 py-1"
              />
            </label>
          )}
        </header>

        {tab === "home" && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="hub-btn flex aspect-square flex-col items-center justify-center gap-2 p-4"
                style={{ backgroundColor: t.tint }}
              >
                <span className="font-display text-xl font-bold text-ink">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {tab !== "home" && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setTab("home")}
              className="mb-4 text-sm font-bold text-ink-soft"
            >
              ← Book home
            </button>

            {tab === "notes" && (
              <NotesScrap
                items={subgroup ? subgroup.notes : book.notes}
                stickers={book.unlockedStickers}
                onChange={(notes) => {
                  if (subgroup) updateSubgroup(book.id, subgroup.id, { notes });
                  else updateBook(book.id, { notes });
                }}
              />
            )}
            {tab === "tasks" && (
              <TasksSticky
                tasks={subgroup ? subgroup.tasks : book.tasks}
                members={subgroup ? subgroup.members : book.members}
                onChange={(tasks) => {
                  if (subgroup) updateSubgroup(book.id, subgroup.id, { tasks });
                  else updateBook(book.id, { tasks });
                }}
              />
            )}
            {tab === "files" && (
              <FilesDesk
                files={subgroup ? subgroup.files : book.files}
                onChange={(files) => {
                  if (subgroup) updateSubgroup(book.id, subgroup.id, { files });
                  else updateBook(book.id, { files });
                }}
              />
            )}
            {tab === "team" && !subgroup && (
              <TeamPage
                book={book}
                showSubgroups
                onInvite={() => {
                  navigator.clipboard.writeText(
                    `${typeof window !== "undefined" ? window.location.origin : ""}/join/${book.inviteCode}`,
                  );
                }}
                onOpenSubgroup={(id) => {
                  setSubgroupId(id);
                  setTab("home");
                }}
                onCreateSubgroup={() => {
                  const name = prompt("Subgroup name");
                  if (!name) return;
                  addSubgroup(book.id, name, "✦");
                }}
                onChat={(text) =>
                  updateBook(book.id, {
                    chat: [
                      ...book.chat,
                      {
                        id: makeId("msg"),
                        author: "You",
                        text,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    ],
                  })
                }
                onAddMeeting={() => {
                  const title = prompt("Meeting title", "Team sync") || "Team sync";
                  const when = prompt("When", "Tomorrow 3pm") || "";
                  const link = prompt("Join link", "https://") || "";
                  updateBook(book.id, {
                    meetings: [
                      ...book.meetings,
                      { id: makeId("meet"), title, when, link },
                    ],
                  });
                }}
              />
            )}
            {tab === "team" && subgroup && (
              <TeamPage
                book={{
                  ...book,
                  members: subgroup.members,
                  inviteCode: subgroup.inviteCode,
                  chat: subgroup.chat,
                  meetings: subgroup.meetings,
                  subgroups: [],
                }}
                showSubgroups={false}
                onInvite={() =>
                  navigator.clipboard.writeText(subgroup.inviteCode)
                }
                onOpenSubgroup={() => {}}
                onCreateSubgroup={() => {}}
                onChat={(text) =>
                  updateSubgroup(book.id, subgroup.id, {
                    chat: [
                      ...subgroup.chat,
                      {
                        id: makeId("msg"),
                        author: "You",
                        text,
                        time: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    ],
                  })
                }
                onAddMeeting={() => {
                  const title = prompt("Meeting title") || "Meetup";
                  const when = prompt("When") || "";
                  const link = prompt("Link") || "";
                  updateSubgroup(book.id, subgroup.id, {
                    meetings: [
                      ...subgroup.meetings,
                      { id: makeId("meet"), title, when, link },
                    ],
                  });
                }}
              />
            )}
            {tab === "progress" && (
              <ProgressPage book={book} progress={progress} />
            )}
          </div>
        )}

        {/* Mini meetings strip when on home */}
        {tab === "home" && book.meetings.length > 0 && !subgroup && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold">Upcoming</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {book.meetings.map((m) => (
                <MeetingChip key={m.id} meeting={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MeetingChip({ meeting }: { meeting: MeetingCard }) {
  return (
    <div className="soft-card min-w-[10rem] shrink-0 p-4">
      <p className="font-display font-bold">{meeting.title}</p>
      <p className="mt-1 text-xs font-semibold text-ink-faint">{meeting.when}</p>
      {meeting.link && (
        <a
          href={meeting.link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-full bg-sage px-3 py-1.5 text-xs font-bold text-white"
        >
          Join
        </a>
      )}
    </div>
  );
}

function NotesScrap({
  items,
  stickers,
  onChange,
}: {
  items: ScrapItem[];
  stickers: string[];
  onChange: (items: ScrapItem[]) => void;
}) {
  function add(kind: ScrapItem["kind"]) {
    const item: ScrapItem = {
      id: makeId("scrap"),
      kind,
      x: 24 + Math.random() * 40,
      y: 24 + Math.random() * 40,
      width: kind === "sticker" ? 56 : 180,
      height: kind === "sticker" ? 56 : 120,
      content: kind === "sticker" ? stickers[0] ?? "✦" : "",
      color: kind === "sticky" ? "#FFF3C4" : "#fffdf9",
      pinned: kind === "pin",
      zIndex: items.length + 1,
    };
    onChange([...items, item]);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["text", "Type"],
            ["sticky", "Sticky"],
            ["sticker", "Sticker"],
            ["pin", "Pin"],
            ["image", "Photo"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              if (k === "image") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = () => {
                  const file = input.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    onChange([
                      ...items,
                      {
                        id: makeId("scrap"),
                        kind: "image",
                        x: 40,
                        y: 40,
                        width: 200,
                        height: 150,
                        content: file.name,
                        imageSrc: String(reader.result),
                        zIndex: items.length + 1,
                      },
                    ]);
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
                return;
              }
              add(k);
            }}
            className="rounded-full bg-surface px-3 py-2 text-xs font-bold shadow-sm"
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative mt-4 min-h-[28rem] overflow-hidden rounded-[2rem] border border-dashed border-line bg-[linear-gradient(180deg,#fffdf9,#f7f3ea)] shadow-inner">
        {items.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center font-display text-ink-faint">
            Blank page — make a mess
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className={`absolute cursor-grab rounded-2xl p-2 shadow-md active:cursor-grabbing ${
              item.kind === "sticker" ? "bg-transparent shadow-none" : ""
            }`}
            style={{
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              backgroundColor: item.kind === "image" ? "transparent" : item.color,
              zIndex: item.zIndex,
            }}
            onMouseDown={(e) => {
              const sx = e.clientX;
              const sy = e.clientY;
              const ox = item.x;
              const oy = item.y;
              function move(ev: MouseEvent) {
                onChange(
                  items.map((i) =>
                    i.id === item.id
                      ? {
                          ...i,
                          x: Math.max(0, ox + ev.clientX - sx),
                          y: Math.max(0, oy + ev.clientY - sy),
                        }
                      : i,
                  ),
                );
              }
              function up() {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              }
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          >
            {item.kind === "image" && item.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageSrc} alt="" className="h-full w-full rounded-xl object-cover" />
            ) : item.kind === "sticker" ? (
              <button
                type="button"
                className="text-3xl"
                onClick={(e) => {
                  e.stopPropagation();
                  const next =
                    stickers[(stickers.indexOf(item.content) + 1) % stickers.length];
                  onChange(
                    items.map((i) =>
                      i.id === item.id ? { ...i, content: next } : i,
                    ),
                  );
                }}
              >
                {item.content}
              </button>
            ) : (
              <textarea
                value={item.content}
                onChange={(e) =>
                  onChange(
                    items.map((i) =>
                      i.id === item.id ? { ...i, content: e.target.value } : i,
                    ),
                  )
                }
                className="h-full w-full resize-none bg-transparent text-sm outline-none"
                placeholder={item.kind === "pin" ? "Pinned note…" : "Write…"}
                onMouseDown={(e) => e.stopPropagation()}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TasksSticky({
  tasks,
  members,
  onChange,
}: {
  tasks: StickyTask[];
  members: string[];
  onChange: (tasks: StickyTask[]) => void;
}) {
  return (
    <div>
      <button
        type="button"
        className="rounded-full bg-blush px-4 py-2 text-sm font-bold text-white"
        onClick={() =>
          onChange([
            ...tasks,
            {
              id: makeId("task"),
              title: "New task",
              assignee: members[0] ?? "You",
              due: "",
              priority: "medium",
              done: false,
              x: 20 + Math.random() * 80,
              y: 20 + Math.random() * 60,
              color: TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)],
            },
          ])
        }
      >
        Add sticky task
      </button>
      <div className="relative mt-4 min-h-[28rem] overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_1px_1px,rgba(61,74,68,0.08)_1px,transparent_0)] [background-size:20px_20px]">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="absolute w-44 cursor-grab rounded-2xl p-3 shadow-md active:cursor-grabbing"
            style={{ left: task.x, top: task.y, backgroundColor: task.color }}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "SELECT")
                return;
              const sx = e.clientX;
              const sy = e.clientY;
              const ox = task.x;
              const oy = task.y;
              function move(ev: MouseEvent) {
                onChange(
                  tasks.map((t) =>
                    t.id === task.id
                      ? {
                          ...t,
                          x: Math.max(0, ox + ev.clientX - sx),
                          y: Math.max(0, oy + ev.clientY - sy),
                        }
                      : t,
                  ),
                );
              }
              function up() {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              }
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          >
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() =>
                  onChange(
                    tasks.map((t) =>
                      t.id === task.id ? { ...t, done: !t.done } : t,
                    ),
                  )
                }
                className="mt-1"
              />
              <input
                value={task.title}
                onChange={(e) =>
                  onChange(
                    tasks.map((t) =>
                      t.id === task.id ? { ...t, title: e.target.value } : t,
                    ),
                  )
                }
                className={`w-full bg-transparent text-sm font-bold outline-none ${
                  task.done ? "line-through opacity-60" : ""
                }`}
              />
            </label>
            <select
              value={task.assignee}
              onChange={(e) =>
                onChange(
                  tasks.map((t) =>
                    t.id === task.id ? { ...t, assignee: e.target.value } : t,
                  ),
                )
              }
              className="mt-2 w-full bg-transparent text-xs font-semibold outline-none"
            >
              {members.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={task.due}
              onChange={(e) =>
                onChange(
                  tasks.map((t) =>
                    t.id === task.id ? { ...t, due: e.target.value } : t,
                  ),
                )
              }
              className="mt-1 w-full bg-transparent text-xs outline-none"
            />
            <select
              value={task.priority}
              onChange={(e) =>
                onChange(
                  tasks.map((t) =>
                    t.id === task.id
                      ? { ...t, priority: e.target.value as StickyTask["priority"] }
                      : t,
                  ),
                )
              }
              className="mt-1 w-full bg-transparent text-xs font-semibold outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilesDesk({
  files,
  onChange,
}: {
  files: DeskFile[];
  onChange: (files: DeskFile[]) => void;
}) {
  const folders: DeskFile["folder"][] = ["Images", "PDFs", "Videos", "Links"];
  return (
    <div className="grid grid-cols-2 gap-4">
      {folders.map((folder) => (
        <div key={folder} className="soft-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold">{folder}</h3>
            <button
              type="button"
              className="text-xs font-bold text-sage"
              onClick={() => {
                const name = prompt(`Add to ${folder}`) || "Untitled";
                const url =
                  folder === "Links" ? prompt("URL", "https://") || "" : undefined;
                onChange([
                  ...files,
                  { id: makeId("file"), name, folder, url: url || undefined },
                ]);
              }}
            >
              + Add
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {files
              .filter((f) => f.folder === folder)
              .map((f) => (
                <li key={f.id} className="rounded-xl bg-paper px-3 py-2 text-sm font-semibold">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer" className="text-sky">
                      {f.name}
                    </a>
                  ) : (
                    f.name
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function TeamPage({
  book,
  showSubgroups,
  onInvite,
  onOpenSubgroup,
  onCreateSubgroup,
  onChat,
  onAddMeeting,
}: {
  book: {
    members: string[];
    inviteCode: string;
    chat: { id: string; author: string; text: string; time: string }[];
    meetings: MeetingCard[];
    subgroups: { id: string; name: string; emoji: string }[];
  };
  showSubgroups: boolean;
  onInvite: () => void;
  onOpenSubgroup: (id: string) => void;
  onCreateSubgroup: () => void;
  onChat: (text: string) => void;
  onAddMeeting: () => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <div className="space-y-5 animate-pop">
      <section className="soft-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Members</h2>
          <button
            type="button"
            onClick={onInvite}
            className="rounded-full bg-sage px-3 py-1.5 text-xs font-bold text-white"
          >
            + Invite
          </button>
        </div>
        <p className="mt-1 text-xs font-semibold text-ink-faint">
          Code {book.inviteCode}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {book.members.map((m) => (
            <li
              key={m}
              className="rounded-full bg-paper px-3 py-1 text-sm font-bold"
            >
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="soft-card p-5">
        <h2 className="font-display text-xl font-bold">Main group chat</h2>
        <div className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm">
          {book.chat.length === 0 && (
            <p className="text-ink-faint">Say hi to the team</p>
          )}
          {book.chat.map((m) => (
            <p key={m.id}>
              <span className="font-bold">{m.author}</span>{" "}
              <span className="text-ink-faint">{m.time}</span>
              <br />
              {m.text}
            </p>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            onChat(draft.trim());
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 rounded-full border border-line bg-paper px-4 py-2 text-sm outline-none"
            placeholder="Message…"
          />
          <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">
            Send
          </button>
        </form>
        <button
          type="button"
          onClick={onAddMeeting}
          className="mt-4 rounded-full bg-sky px-4 py-2 text-sm font-bold text-ink"
        >
          Join meeting / add meeting
        </button>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {book.meetings.map((m) => (
            <MeetingChip key={m.id} meeting={m} />
          ))}
        </div>
      </section>

      {showSubgroups && (
        <section className="soft-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Subgroups</h2>
            <button
              type="button"
              onClick={onCreateSubgroup}
              className="text-xs font-bold text-sage"
            >
              + Create subgroup
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {book.subgroups.map((sg) => (
              <button
                key={sg.id}
                type="button"
                onClick={() => onOpenSubgroup(sg.id)}
                className="hub-btn bg-peach/40 p-5 text-left"
              >
                <span className="text-2xl">{sg.emoji}</span>
                <span className="mt-2 block font-display font-bold">{sg.name}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProgressPage({
  book,
  progress,
}: {
  book: {
    tasks: StickyTask[];
    achievements: { id: string; label: string }[];
    unlockedStickers: string[];
  };
  progress: number;
}) {
  const done = book.tasks.filter((t) => t.done).length;
  return (
    <div className="space-y-4 animate-pop">
      <div className="soft-card p-6 text-center">
        <p className="font-display text-5xl font-bold text-sage">{progress}%</p>
        <p className="mt-2 font-semibold text-ink-soft">
          {done} / {book.tasks.length} tasks complete
        </p>
        <div className="mx-auto mt-4 h-4 max-w-xs overflow-hidden rounded-full bg-paper">
          <div className="h-full rounded-full bg-blush" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="soft-card p-5">
        <h3 className="font-display text-lg font-bold">Achievements</h3>
        <ul className="mt-3 space-y-2">
          {book.achievements.length === 0 && (
            <li className="text-sm text-ink-faint">Finish tasks to earn badges</li>
          )}
          {book.achievements.map((a) => (
            <li key={a.id} className="rounded-2xl bg-paper px-3 py-2 text-sm font-bold">
              {a.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="soft-card p-5">
        <h3 className="font-display text-lg font-bold">Sticker jar</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-2xl">
          {book.unlockedStickers.map((s) => (
            <span key={s} className="rounded-2xl bg-paper px-3 py-2">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
