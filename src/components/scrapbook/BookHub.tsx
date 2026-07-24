"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBookshelf } from "@/context/BookshelfContext";
import {
  bookProgress,
  daysUntil,
  makeId,
  STICKER_PACK,
  STICKY_SHAPES,
  subgroupProgress,
  TYPE_FONTS,
} from "@/data/factory";
import type {
  BookQuestions,
  BookTab,
  ChecklistTask,
  DeskFile,
  MeetingCard,
  ScrapItem,
} from "@/data/types";
import { CelebrateOverlay } from "./CelebrateOverlay";

const TABS: { id: BookTab; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "tasks", label: "Tasks" },
  { id: "files", label: "Files" },
  { id: "team", label: "Team" },
  { id: "progress", label: "Progress" },
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
        <Link href="/" className="font-semibold text-forest">
          Back to shelf
        </Link>
      </div>
    );
  }

  if (!book.questions.answered) {
    return (
      <QuestionsPage
        title={book.title}
        questions={book.questions}
        onDone={(q, dueDate) => {
          updateBook(book.id, {
            questions: { ...q, answered: true },
            dueDate: dueDate || book.dueDate,
            title: book.title,
          });
        }}
        onTitle={(title) => updateBook(book.id, { title })}
      />
    );
  }

  const tasks = subgroup ? subgroup.tasks : book.tasks;
  const progress = subgroup ? subgroupProgress(tasks) : bookProgress(book);
  const days = daysUntil(book.dueDate);
  const left = tasks.filter((t) => !t.done).length;

  return (
    <div className="room min-h-[100svh]">
      <CelebrateOverlay />
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-5 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="text-sm font-semibold text-ink-soft">
            ← Shelf
          </Link>
          {subgroup && (
            <button
              type="button"
              onClick={() => {
                setSubgroupId(null);
                setTab("team");
              }}
              className="text-sm font-semibold text-forest"
            >
              ← Main book
            </button>
          )}
        </div>

        <header className="soft-card mt-4 animate-pop p-5 sm:p-6">
          <h1 className="font-display text-3xl tracking-tight">
            {subgroup ? `${subgroup.emoji} ${subgroup.name}` : book.title}
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
            {subgroup ? "Subgroup progress" : "Project progress"}
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-sm font-semibold text-ink-soft">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden bg-paper">
              <div className="h-full bg-forest" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-ink-soft">
            <span>
              {days == null
                ? "No due date"
                : days < 0
                  ? `Overdue by ${Math.abs(days)}d`
                  : `Due in ${days} day${days === 1 ? "" : "s"}`}
            </span>
            <span>·</span>
            <span>
              {subgroup
                ? `${subgroup.members.length} in subgroup`
                : `Team: ${book.members.length}`}
            </span>
            {left > 0 && left <= 3 && (
              <>
                <span>·</span>
                <span className="text-burgundy">Only {left} left</span>
              </>
            )}
          </div>
        </header>

        {tab === "home" && (
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="hub-btn flex aspect-[4/3] flex-col items-center justify-center bg-surface p-4"
              >
                <span className="font-display text-xl text-ink">{t.label}</span>
              </button>
            ))}
          </div>
        )}

        {tab !== "home" && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setTab("home")}
              className="mb-4 text-sm font-semibold text-ink-soft"
            >
              ← Book home
            </button>

            {tab === "notes" && (
              <NotesPage
                items={subgroup ? subgroup.notes : book.notes}
                stickers={book.unlockedStickers}
                onChange={(notes) => {
                  if (subgroup) updateSubgroup(book.id, subgroup.id, { notes });
                  else updateBook(book.id, { notes });
                }}
              />
            )}
            {tab === "tasks" && (
              <TasksChecklist
                tasks={tasks}
                members={subgroup ? subgroup.members : book.members}
                onChange={(next) => {
                  if (subgroup) updateSubgroup(book.id, subgroup.id, { tasks: next });
                  else updateBook(book.id, { tasks: next });
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
                onInvite={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/join/${book.inviteCode}`,
                  )
                }
                onOpenSubgroup={(id) => {
                  setSubgroupId(id);
                  setTab("home");
                }}
                onCreateSubgroup={() => {
                  const name = prompt("Subgroup name");
                  if (!name) return;
                  addSubgroup(book.id, name, "◆");
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
                  const title = prompt("Meeting title", "Salon") || "Salon";
                  const when = prompt("When") || "";
                  const link = prompt("Join link", "https://") || "";
                  updateBook(book.id, {
                    meetings: [...book.meetings, { id: makeId("meet"), title, when, link }],
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
                onInvite={() => navigator.clipboard.writeText(subgroup.inviteCode)}
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
              <ProgressPage
                progress={progress}
                tasks={tasks}
                achievements={book.achievements}
                stickers={book.unlockedStickers}
                label={subgroup ? "Subgroup" : "Project"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionsPage({
  title,
  questions,
  onDone,
  onTitle,
}: {
  title: string;
  questions: BookQuestions;
  onDone: (q: BookQuestions, dueDate?: string) => void;
  onTitle: (t: string) => void;
}) {
  const [about, setAbout] = useState(questions.about);
  const [goal, setGoal] = useState(questions.goal);
  const [teamNote, setTeamNote] = useState(questions.teamNote);
  const [dueNote, setDueNote] = useState(questions.dueNote);
  const [milestone, setMilestone] = useState(questions.milestone);
  const [dueDate, setDueDate] = useState("");
  const [name, setName] = useState(title === "New project" || title === "Untitled book" ? "" : title);

  return (
    <div className="room min-h-[100svh] px-4 py-10">
      <div className="mx-auto max-w-lg animate-pop soft-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Opening pages</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight">A few questions</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Answer once — then your scrapbook opens.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) onTitle(name.trim());
            onDone(
              { about, goal, teamNote, dueNote, milestone, answered: true },
              dueDate || undefined,
            );
          }}
        >
          <Field label="Project name" value={name} onChange={setName} required />
          <Field label="What is this project about?" value={about} onChange={setAbout} area />
          <Field label="What is the main goal?" value={goal} onChange={setGoal} area />
          <Field label="Who’s on the team?" value={teamNote} onChange={setTeamNote} />
          <label className="block text-sm font-semibold">
            When is it due?
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setDueNote(e.target.value);
              }}
              className="mt-1.5 w-full border border-line bg-paper px-3 py-2 outline-none focus:border-forest"
            />
          </label>
          <Field label="First milestone?" value={milestone} onChange={setMilestone} />
          <button type="submit" className="w-full bg-forest py-3 text-sm font-semibold text-surface">
            Open the book
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  area,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      {area ? (
        <textarea
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className="mt-1.5 w-full border border-line bg-paper px-3 py-2 outline-none focus:border-forest"
        />
      ) : (
        <input
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full border border-line bg-paper px-3 py-2 outline-none focus:border-forest"
        />
      )}
    </label>
  );
}

function NotesPage({
  items,
  stickers,
  onChange,
}: {
  items: ScrapItem[];
  stickers: string[];
  onChange: (items: ScrapItem[]) => void;
}) {
  const [menu, setMenu] = useState<"type" | "sticky" | "sticker" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageText, setPageText] = useState("");
  const selected = items.find((i) => i.id === selectedId) ?? null;

  function addItem(partial: Partial<ScrapItem> & { kind: ScrapItem["kind"] }) {
    const item: ScrapItem = {
      id: makeId("scrap"),
      x: 32 + Math.random() * 40,
      y: 32 + Math.random() * 40,
      width: 180,
      height: 120,
      content: "",
      zIndex: items.length + 1,
      ...partial,
      kind: partial.kind,
    };
    onChange([...items, item]);
    setSelectedId(item.id);
    setMenu(null);
  }

  function patchSelected(patch: Partial<ScrapItem>) {
    if (!selected) return;
    onChange(items.map((i) => (i.id === selected.id ? { ...i, ...patch } : i)));
    setMenu(null);
  }

  return (
    <div>
      <div className="relative flex flex-wrap gap-2">
        <button
          type="button"
          className={`border px-3 py-2 text-xs font-semibold ${menu === "type" ? "border-forest bg-forest text-surface" : "border-line bg-surface"}`}
          onClick={() => setMenu(menu === "type" ? null : "type")}
        >
          Type
        </button>
        <button
          type="button"
          className="border border-line bg-surface px-3 py-2 text-xs font-semibold"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
              const file = input.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                addItem({
                  kind: "image",
                  width: 200,
                  height: 150,
                  content: file.name,
                  imageSrc: String(reader.result),
                });
              };
              reader.readAsDataURL(file);
            };
            input.click();
          }}
        >
          Photo
        </button>
        <button
          type="button"
          className={`border px-3 py-2 text-xs font-semibold ${menu === "sticker" ? "border-forest bg-forest text-surface" : "border-line bg-surface"}`}
          onClick={() => setMenu(menu === "sticker" ? null : "sticker")}
        >
          Sticker
        </button>
        <button
          type="button"
          className={`border px-3 py-2 text-xs font-semibold ${menu === "sticky" ? "border-forest bg-forest text-surface" : "border-line bg-surface"}`}
          onClick={() => setMenu(menu === "sticky" ? null : "sticky")}
        >
          Sticky
        </button>

        {menu === "type" && (
          <div className="absolute left-0 top-11 z-30 w-64 border border-line bg-surface p-3 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Type</p>
            {!selected && (
              <button
                type="button"
                className="mt-2 w-full border border-line px-2 py-1.5 text-left text-xs font-semibold hover:bg-paper"
                onClick={() =>
                  addItem({
                    kind: "text",
                    content: "Write here",
                    fontFamily: "Libre Baskerville",
                    fontSize: 16,
                    textColor: "#1c2421",
                    width: 220,
                    height: 90,
                  })
                }
              >
                Add text box
              </button>
            )}
            <label className="mt-2 block text-[0.65rem] font-semibold">
              Font
              <select
                className="mt-1 w-full border border-line bg-paper px-2 py-1 text-xs"
                value={selected?.fontFamily ?? "Libre Baskerville"}
                onChange={(e) => {
                  if (selected) patchSelected({ fontFamily: e.target.value });
                  else {
                    addItem({
                      kind: "text",
                      content: "Write here",
                      fontFamily: e.target.value,
                      fontSize: 16,
                    });
                  }
                }}
              >
                {TYPE_FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-2 block text-[0.65rem] font-semibold">
              Size
              <input
                type="range"
                min={12}
                max={36}
                value={selected?.fontSize ?? 16}
                onChange={(e) => patchSelected({ fontSize: Number(e.target.value) })}
                className="mt-1 w-full"
              />
            </label>
            <label className="mt-2 block text-[0.65rem] font-semibold">
              Colour
              <input
                type="color"
                value={selected?.textColor ?? "#1c2421"}
                onChange={(e) => patchSelected({ textColor: e.target.value })}
                className="mt-1 h-8 w-full"
              />
            </label>
            <label className="mt-2 block text-[0.65rem] font-semibold">
              Highlight
              <input
                type="color"
                value={selected?.highlight ?? "#f3e7c5"}
                onChange={(e) => patchSelected({ highlight: e.target.value, color: e.target.value })}
                className="mt-1 h-8 w-full"
              />
            </label>
            <div className="mt-2 flex gap-1">
              <button
                type="button"
                className="border border-line px-2 py-1 text-xs font-bold"
                onClick={() => patchSelected({ bold: !selected?.bold })}
              >
                B
              </button>
              <button
                type="button"
                className="border border-line px-2 py-1 text-xs italic"
                onClick={() => patchSelected({ italic: !selected?.italic })}
              >
                I
              </button>
              <button
                type="button"
                className="border border-line px-2 py-1 text-xs underline"
                onClick={() => patchSelected({ underline: !selected?.underline })}
              >
                U
              </button>
            </div>
          </div>
        )}

        {menu === "sticky" && (
          <div className="absolute left-0 top-11 z-30 w-56 border border-line bg-surface p-3 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Sticky</p>
            <div className="mt-2 space-y-1">
              {STICKY_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs font-semibold hover:bg-paper"
                  onClick={() =>
                    addItem({
                      kind: "sticky",
                      stickyShape: s.id,
                      width: s.w,
                      height: s.h,
                      color: s.color,
                      content: "",
                    })
                  }
                >
                  <span
                    className={`inline-block h-5 w-5 bg-[#edd59a] ${
                      s.id === "triangle"
                        ? "sticky-triangle"
                        : s.id === "star"
                          ? "sticky-star"
                          : ""
                    }`}
                  />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {menu === "sticker" && (
          <div className="absolute left-0 top-11 z-30 w-52 border border-line bg-surface p-3 shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Sticker</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(stickers.length ? stickers : STICKER_PACK).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="flex h-9 w-9 items-center justify-center border border-line text-lg hover:bg-paper"
                  onClick={() =>
                    addItem({
                      kind: "sticker",
                      content: s,
                      width: 56,
                      height: 56,
                      color: "transparent",
                    })
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="relative mt-4 min-h-[28rem] overflow-hidden border border-line bg-[linear-gradient(180deg,#faf7f1,#f3efe6)]"
        onClick={() => {
          setSelectedId(null);
          setMenu(null);
        }}
      >
        <textarea
          value={pageText}
          onChange={(e) => setPageText(e.target.value)}
          placeholder="Begin writing…"
          className="absolute inset-0 z-0 h-full w-full resize-none bg-transparent p-8 font-display text-base leading-7 text-ink outline-none"
          style={{ caretColor: "#1c2421" }}
          onClick={(e) => e.stopPropagation()}
        />
        {items.map((item) => (
          <ScrapObject
            key={item.id}
            item={item}
            selected={selectedId === item.id}
            onSelect={() => setSelectedId(item.id)}
            onChange={(patch) =>
              onChange(items.map((i) => (i.id === item.id ? { ...i, ...patch } : i)))
            }
            onDelete={() => {
              onChange(items.filter((i) => i.id !== item.id));
              setSelectedId(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ScrapObject({
  item,
  selected,
  onSelect,
  onChange,
  onDelete,
}: {
  item: ScrapItem;
  selected: boolean;
  onSelect: () => void;
  onChange: (p: Partial<ScrapItem>) => void;
  onDelete: () => void;
}) {
  const shapeClass =
    item.stickyShape === "triangle"
      ? "sticky-triangle"
      : item.stickyShape === "star"
        ? "sticky-star"
        : "";

  return (
    <div
      className={`absolute z-10 ${
        item.kind === "sticky" ? `sticky-note p-3 ${shapeClass}` : ""
      } ${item.kind === "sticker" ? "" : item.kind === "sticky" ? "" : "border border-line/40 bg-surface/90 p-2"} ${
        selected ? "ring-1 ring-forest" : ""
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex + 5,
        backgroundColor:
          item.kind === "sticky"
            ? item.color
            : item.kind === "sticker"
              ? "transparent"
              : item.highlight || item.color || "rgba(250,247,241,0.92)",
        fontFamily: item.fontFamily,
        fontSize: item.fontSize,
        color: item.textColor,
        fontWeight: item.bold ? 700 : 400,
        fontStyle: item.italic ? "italic" : "normal",
        textDecoration: item.underline ? "underline" : "none",
        boxShadow: item.kind === "sticky" ? undefined : undefined,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
        e.stopPropagation();
        onSelect();
        const sx = e.clientX;
        const sy = e.clientY;
        const ox = item.x;
        const oy = item.y;
        function move(ev: MouseEvent) {
          onChange({
            x: Math.max(0, ox + ev.clientX - sx),
            y: Math.max(0, oy + ev.clientY - sy),
          });
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
        <img src={item.imageSrc} alt="" className="h-full w-full object-cover" draggable={false} />
      ) : item.kind === "sticker" ? (
        <span className="flex h-full items-center justify-center text-3xl">{item.content}</span>
      ) : (
        <textarea
          value={item.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className={`h-full w-full resize-none bg-transparent outline-none ${
            item.stickyShape === "triangle" || item.stickyShape === "star"
              ? "px-4 pt-6 text-center text-xs"
              : "text-sm"
          }`}
          style={{ caretColor: item.textColor || "#1c2421" }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      )}
      {selected && item.kind !== "image" && (
        <button
          type="button"
          className="absolute bottom-1 right-1 bg-ink/80 px-1.5 text-[0.6rem] text-surface"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Del
        </button>
      )}
    </div>
  );
}

function TasksChecklist({
  tasks,
  members,
  onChange,
}: {
  tasks: ChecklistTask[];
  members: string[];
  onChange: (tasks: ChecklistTask[]) => void;
}) {
  const done = tasks.filter((t) => t.done).length;
  return (
    <div className="animate-pop soft-card p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl">Checklist</h2>
          <p className="text-sm text-ink-soft">
            {done} of {tasks.length} complete
          </p>
        </div>
        <button
          type="button"
          className="bg-burgundy px-3 py-2 text-xs font-semibold text-surface"
          onClick={() =>
            onChange([
              ...tasks,
              {
                id: makeId("task"),
                title: "New task",
                done: false,
                assignee: members[0] ?? "You",
                priority: "medium",
              },
            ])
          }
        >
          Add task
        </button>
      </div>
      <ul className="mt-5 space-y-2">
        {tasks.length === 0 && (
          <li className="py-8 text-center font-display text-ink-faint">No tasks yet</li>
        )}
        {tasks.map((task, index) => (
          <li
            key={task.id}
            className={`checklist-row flex items-start gap-3 border border-line bg-paper/70 px-3 py-3 ${
              task.done ? "opacity-60" : ""
            }`}
          >
            <button
              type="button"
              aria-label="Toggle"
              onClick={() =>
                onChange(
                  tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)),
                )
              }
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border ${
                task.done ? "border-forest bg-forest text-surface" : "border-ink/30 bg-surface"
              }`}
            >
              {task.done ? "✓" : ""}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-gold">{index + 1}.</span>
                <input
                  value={task.title}
                  onChange={(e) =>
                    onChange(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, title: e.target.value } : t,
                      ),
                    )
                  }
                  className={`w-full bg-transparent font-semibold outline-none ${
                    task.done ? "line-through" : ""
                  }`}
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <select
                  value={task.assignee ?? ""}
                  onChange={(e) =>
                    onChange(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, assignee: e.target.value } : t,
                      ),
                    )
                  }
                  className="border border-line bg-surface px-2 py-1"
                >
                  {members.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={task.due ?? ""}
                  onChange={(e) =>
                    onChange(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, due: e.target.value } : t,
                      ),
                    )
                  }
                  className="border border-line bg-surface px-2 py-1"
                />
                <select
                  value={task.priority}
                  onChange={(e) =>
                    onChange(
                      tasks.map((t) =>
                        t.id === task.id
                          ? { ...t, priority: e.target.value as ChecklistTask["priority"] }
                          : t,
                      ),
                    )
                  }
                  className="border border-line bg-surface px-2 py-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </li>
        ))}
      </ul>
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
    <div className="grid grid-cols-2 gap-3">
      {folders.map((folder) => (
        <div key={folder} className="soft-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg">{folder}</h3>
            <button
              type="button"
              className="text-xs font-semibold text-forest"
              onClick={() => {
                const name = prompt(`Add to ${folder}`) || "Untitled";
                const url =
                  folder === "Links" ? prompt("URL", "https://") || "" : undefined;
                onChange([...files, { id: makeId("file"), name, folder, url: url || undefined }]);
              }}
            >
              + Add
            </button>
          </div>
          <ul className="mt-3 space-y-2">
            {files
              .filter((f) => f.folder === folder)
              .map((f) => (
                <li key={f.id} className="border border-line bg-paper px-3 py-2 text-sm font-semibold">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noreferrer" className="text-navy">
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
    subgroups: { id: string; name: string; emoji: string; tasks?: ChecklistTask[] }[];
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
    <div className="space-y-4 animate-pop">
      <section className="soft-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Members</h2>
          <button type="button" onClick={onInvite} className="bg-forest px-3 py-1.5 text-xs font-semibold text-surface">
            + Invite
          </button>
        </div>
        <p className="mt-1 text-xs font-semibold tracking-wider text-ink-faint">
          {book.inviteCode}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {book.members.map((m) => (
            <li key={m} className="border border-line bg-paper px-3 py-1 text-sm font-semibold">
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="soft-card p-5">
        <h2 className="font-display text-xl">Main group chat</h2>
        <div className="mt-3 max-h-40 space-y-2 overflow-y-auto text-sm">
          {book.chat.length === 0 && <p className="text-ink-faint">No messages yet</p>}
          {book.chat.map((m) => (
            <p key={m.id}>
              <span className="font-semibold">{m.author}</span>{" "}
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
            className="flex-1 border border-line bg-paper px-3 py-2 text-sm outline-none"
            placeholder="Message…"
          />
          <button type="submit" className="bg-ink px-3 py-2 text-sm font-semibold text-surface">
            Send
          </button>
        </form>
        <button
          type="button"
          onClick={onAddMeeting}
          className="mt-4 border border-line px-3 py-2 text-sm font-semibold"
        >
          Add meeting
        </button>
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {book.meetings.map((m) => (
            <div key={m.id} className="min-w-[9rem] border border-line bg-paper p-3">
              <p className="font-display font-semibold">{m.title}</p>
              <p className="text-xs text-ink-faint">{m.when}</p>
              {m.link && (
                <a href={m.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-forest">
                  Join
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {showSubgroups && (
        <section className="soft-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Subgroups</h2>
            <button type="button" onClick={onCreateSubgroup} className="text-xs font-semibold text-forest">
              + Create
            </button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {book.subgroups.map((sg) => {
              const pct = subgroupProgress(sg.tasks ?? []);
              return (
                <button
                  key={sg.id}
                  type="button"
                  onClick={() => onOpenSubgroup(sg.id)}
                  className="hub-btn bg-paper p-4 text-left"
                >
                  <span className="font-display text-lg">
                    {sg.emoji} {sg.name}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-ink-faint">
                    Progress {pct}%
                  </span>
                  <span className="mt-1 block h-1.5 overflow-hidden bg-line">
                    <span className="block h-full bg-burgundy" style={{ width: `${pct}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function ProgressPage({
  progress,
  tasks,
  achievements,
  stickers,
  label,
}: {
  progress: number;
  tasks: ChecklistTask[];
  achievements: { id: string; label: string }[];
  stickers: string[];
  label: string;
}) {
  const done = tasks.filter((t) => t.done).length;
  return (
    <div className="space-y-4 animate-pop">
      <div className="soft-card p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{label}</p>
        <p className="mt-2 font-display text-5xl text-forest">{progress}%</p>
        <p className="mt-2 text-sm text-ink-soft">
          {done} / {tasks.length} tasks
        </p>
        <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden bg-paper">
          <div className="h-full bg-burgundy" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="soft-card p-5">
        <h3 className="font-display text-lg">Achievements</h3>
        <ul className="mt-3 space-y-2">
          {achievements.length === 0 && (
            <li className="text-sm text-ink-faint">Complete tasks to earn marks</li>
          )}
          {achievements.map((a) => (
            <li key={a.id} className="border border-line bg-paper px-3 py-2 text-sm font-semibold">
              {a.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="soft-card p-5">
        <h3 className="font-display text-lg">Sticker case</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-2xl">
          {stickers.map((s) => (
            <span key={s} className="border border-line bg-paper px-3 py-2">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
