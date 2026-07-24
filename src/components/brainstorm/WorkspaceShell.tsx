"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { makeId } from "@/data/projectFactory";
import type {
  CanvasItem,
  Chapter,
  ChapterPage,
  SectionVisibility,
  TaskItem,
  TextAlign,
  TextStyleKind,
} from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";

type Tool =
  | "table"
  | "format"
  | "checklist"
  | "camera"
  | "sticky"
  | "draw"
  | null;

const BASIC = ["#1c1d1c", "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ffffff"];
const STICKY_TYPES = [
  { id: "square" as const, label: "Square", w: 160, h: 160, color: "#fef3c7" },
  { id: "wide" as const, label: "Wide", w: 220, h: 120, color: "#dcfce7" },
  { id: "tall" as const, label: "Tall", w: 120, h: 200, color: "#e0e7ff" },
  { id: "round" as const, label: "Round", w: 150, h: 150, color: "#ffe4e6" },
];
const PENS = ["Pencil", "Marker", "Fine tip", "Marker bold", "Crayon", "Ruler"];

function paperClass(style: ChapterPage["paperStyle"]) {
  if (style === "dot") return "canvas-dot";
  if (style === "lined") return "canvas-lined";
  if (style === "grid") return "canvas-grid";
  return "";
}

export function WorkspaceShell({ projectId }: { projectId: string }) {
  const {
    getProject,
    updateProject,
    regenerateInvite,
    addSubgroup,
    joinSubgroup,
    updateSubgroup,
    ready,
  } = useBrainstorm();
  const project = getProject(projectId);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeSubgroupId, setActiveSubgroupId] = useState<string | null>(null);
  const [chapterId, setChapterId] = useState("");
  const [pageId, setPageId] = useState("");
  const [tasksOpen, setTasksOpen] = useState(true);
  const [tool, setTool] = useState<Tool>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawColor, setDrawColor] = useState("#1c1d1c");
  const [pen, setPen] = useState("Pencil");
  const [chatDraft, setChatDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const subgroup = useMemo(
    () => project?.subgroups?.find((s) => s.id === activeSubgroupId) ?? null,
    [project, activeSubgroupId],
  );

  const chapters = useMemo(
    () => (subgroup ? subgroup.chapters : project?.chapters ?? []),
    [subgroup, project?.chapters],
  );
  const tasks = useMemo(
    () => (subgroup ? subgroup.tasks : project?.tasks ?? []),
    [subgroup, project?.tasks],
  );
  const noteColor = subgroup ? subgroup.noteColor : project?.noteColor ?? "#f7f7f5";

  useEffect(() => {
    if (!project) return;
    if (!project.setupComplete) {
      router.replace(`/book/${project.id}/setup`);
      return;
    }
    const list = activeSubgroupId
      ? project.subgroups.find((s) => s.id === activeSubgroupId)?.chapters
      : project.chapters;
    const ch = list?.[0];
    setChapterId(ch?.id ?? "");
    setPageId(ch?.pages[0]?.id ?? "");
  }, [projectId, project?.setupComplete, activeSubgroupId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchParams.get("invited") === "1") {
      // keep invite panel visible at top
    }
  }, [searchParams]);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === chapterId) ?? chapters[0],
    [chapters, chapterId],
  );
  const page = useMemo(
    () => chapter?.pages.find((p) => p.id === pageId) ?? chapter?.pages[0],
    [chapter, pageId],
  );

  if (!ready) return <div className="min-h-[100svh] bg-paper" />;
  if (!project || !chapter || !page) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <Link href="/" className="text-accent underline">
          Back to shelf
        </Link>
      </div>
    );
  }

  const activeProject = project;
  const activeChapter = chapter;
  const activePage = page;

  function persistChapters(nextChapters: Chapter[]) {
    if (subgroup) {
      updateSubgroup(activeProject.id, subgroup.id, { chapters: nextChapters });
    } else {
      updateProject(activeProject.id, { chapters: nextChapters });
    }
  }

  function persistTasks(nextTasks: TaskItem[]) {
    if (subgroup) {
      updateSubgroup(activeProject.id, subgroup.id, { tasks: nextTasks });
    } else {
      updateProject(activeProject.id, { tasks: nextTasks });
    }
  }

  function savePage(next: ChapterPage) {
    persistChapters(
      chapters.map((c) =>
        c.id === activeChapter.id
          ? { ...c, pages: c.pages.map((p) => (p.id === next.id ? next : p)) }
          : c,
      ),
    );
  }

  function addItem(partial: Partial<CanvasItem> & { kind: CanvasItem["kind"] }) {
    const item: CanvasItem = {
      id: makeId("item"),
      x: 40 + Math.random() * 60,
      y: 40 + Math.random() * 40,
      width: 200,
      height: 140,
      zIndex: (activePage.items.at(-1)?.zIndex ?? 0) + 1,
      content: "",
      ...partial,
      kind: partial.kind,
    };
    savePage({ ...activePage, items: [...activePage.items, item] });
    setSelectedId(item.id);
    return item;
  }

  function updateItem(id: string, patch: Partial<CanvasItem>) {
    savePage({
      ...activePage,
      items: activePage.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  }

  function deleteItem(id: string) {
    savePage({ ...activePage, items: activePage.items.filter((i) => i.id !== id) });
    setSelectedId(null);
  }

  const selected = activePage.items.find((i) => i.id === selectedId) ?? null;

  const inviteUrl =
    typeof window !== "undefined" && activeProject.invite
      ? `${window.location.origin}/join/${activeProject.invite.code}`
      : activeProject.invite?.link ?? "";

  return (
    <div className="min-h-[100svh] bg-paper" style={{ ["--page-note" as string]: noteColor }}>
      <header className="sticky top-0 z-20 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-ink">
              ← Shelf
            </Link>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold">
                {activeProject.title}
                {subgroup ? ` / ${subgroup.name}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTasksOpen((v) => !v)}
            className="rounded-xl bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          >
            {tasksOpen ? "Hide tasks" : "Tasks"}
          </button>
        </div>

        {/* Invite Members — top of project page */}
        {!subgroup && (
          <div className="mt-4 rounded-2xl border border-line bg-paper/80 p-4">
            <h2 className="font-display text-base font-bold">Invite Members</h2>
            {activeProject.invite ? (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                <span className="font-mono tracking-[0.18em]">{activeProject.invite.code}</span>
                <button
                  type="button"
                  className="font-semibold text-accent"
                  onClick={() => navigator.clipboard.writeText(inviteUrl)}
                >
                  Copy link
                </button>
                <button
                  type="button"
                  className="font-semibold text-ink-soft"
                  onClick={() => regenerateInvite(activeProject.id)}
                >
                  Regenerate
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mt-2 rounded-xl bg-accent px-3 py-2 text-sm font-semibold text-white"
                onClick={() => regenerateInvite(activeProject.id)}
              >
                Generate invitation
              </button>
            )}
          </div>
        )}

        {/* Subgroups */}
        {!subgroup && (
          <div className="mt-3 rounded-2xl border border-line bg-paper/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold">Subgroups</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold"
                  onClick={() => {
                    const name = prompt("Subgroup name");
                    if (!name) return;
                    const id = addSubgroup(activeProject.id, name);
                    setActiveSubgroupId(id);
                  }}
                >
                  Create
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-line px-3 py-1.5 text-xs font-semibold"
                  onClick={() => {
                    const code = prompt("Subgroup invite code");
                    if (!code) return;
                    const res = joinSubgroup(activeProject.id, code);
                    if (!res.ok) {
                      alert(res.error);
                      return;
                    }
                    setActiveSubgroupId(res.subgroupId);
                  }}
                >
                  Join
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(activeProject.subgroups ?? []).map((sg) => (
                <button
                  key={sg.id}
                  type="button"
                  onClick={() => setActiveSubgroupId(sg.id)}
                  className="rounded-full bg-surface px-3 py-1 text-xs font-semibold shadow-sm"
                >
                  {sg.name}
                </button>
              ))}
              {(activeProject.subgroups ?? []).length === 0 && (
                <p className="text-xs text-ink-faint">No subgroups yet</p>
              )}
            </div>
          </div>
        )}

        {subgroup && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              className="font-semibold text-accent"
              onClick={() => setActiveSubgroupId(null)}
            >
              ← Main project
            </button>
            <span className="font-mono text-xs tracking-wider text-ink-faint">
              Code {subgroup.inviteCode}
            </span>
          </div>
        )}
      </header>

      <div
        className={`mx-auto grid max-w-[1500px] ${
          tasksOpen
            ? "lg:grid-cols-[200px_56px_minmax(0,1fr)_280px]"
            : "lg:grid-cols-[200px_56px_minmax(0,1fr)]"
        }`}
      >
        {/* Sidebar */}
        <aside className="border-r border-line bg-surface">
          <div className="flex items-center justify-between px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Sections
            </p>
            <button
              type="button"
              className="text-lg leading-none"
              onClick={() => {
                const title = prompt("Section name", "New section");
                if (!title) return;
                const visibility = (prompt(
                  "Visibility: team, personal, or subgroup",
                  subgroup ? "subgroup" : "team",
                ) || "team") as SectionVisibility;
                const ch: Chapter = {
                  id: makeId("ch"),
                  title,
                  visibility:
                    visibility === "personal" || visibility === "subgroup"
                      ? visibility
                      : "team",
                  subgroupId: subgroup?.id,
                  pages: [
                    {
                      id: makeId("page"),
                      title,
                      type: "canvas",
                      background: noteColor,
                      paperStyle: "plain",
                      items: [],
                      body: "",
                    },
                  ],
                };
                persistChapters([...chapters, ch]);
                setChapterId(ch.id);
                setPageId(ch.pages[0].id);
              }}
            >
              +
            </button>
          </div>
          <nav className="space-y-1 px-2 pb-3">
            {chapters.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setChapterId(ch.id);
                  setPageId(ch.pages[0]?.id ?? "");
                }}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm font-semibold ${
                  ch.id === activeChapter.id ? "bg-paper" : "hover:bg-paper/70"
                }`}
              >
                {ch.title}
                <span className="ml-1 text-[0.6rem] font-normal text-ink-faint">
                  {ch.visibility !== "team" ? `· ${ch.visibility}` : ""}
                </span>
              </button>
            ))}
          </nav>

          {!subgroup && (
            <div className="border-t border-line px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                Subgroups
              </p>
              <ul className="mt-2 space-y-1">
                {(activeProject.subgroups ?? []).map((sg) => (
                  <li key={sg.id}>
                    <button
                      type="button"
                      onClick={() => setActiveSubgroupId(sg.id)}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-paper"
                    >
                      {sg.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-line px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Project settings
            </p>
            <label className="mt-2 block text-xs font-medium">
              Note color
              <input
                type="color"
                value={noteColor}
                onChange={(e) => {
                  if (subgroup) {
                    updateSubgroup(activeProject.id, subgroup.id, {
                      noteColor: e.target.value,
                    });
                  } else {
                    updateProject(activeProject.id, { noteColor: e.target.value });
                  }
                  savePage({ ...activePage, background: e.target.value });
                }}
                className="mt-1 h-9 w-full cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* Toolbar */}
        <aside className="relative border-r border-line bg-surface/90 py-3">
          <div className="flex flex-col items-center gap-2">
            {(
              [
                ["table", "Tbl"],
                ["format", "Aa"],
                ["checklist", "☑"],
                ["camera", "Cam"],
                ["sticky", "Stk"],
                ["draw", "Pen"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                title={id}
                onClick={() => {
                  if (id === "table") {
                    const rows = 3;
                    const cols = 3;
                    addItem({
                      kind: "table",
                      width: 280,
                      height: 160,
                      content: "Table",
                      table: {
                        rows,
                        cols,
                        cells: Array.from({ length: rows }, () =>
                          Array.from({ length: cols }, () => ""),
                        ),
                      },
                    });
                    setTool("table");
                    return;
                  }
                  if (id === "checklist") {
                    addItem({
                      kind: "checklist",
                      content: "Checklist",
                      listType: "checklist",
                      doneItems: [{ id: makeId("ci"), text: "Item", done: false }],
                    });
                    setTool("checklist");
                    return;
                  }
                  if (id === "camera") {
                    fileRef.current?.click();
                    setTool("camera");
                    return;
                  }
                  setTool((t) => (t === id ? null : id));
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-[0.65rem] font-bold ${
                  tool === id ? "bg-ink text-surface" : "text-ink-soft hover:bg-paper"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                addItem({
                  kind: "image",
                  width: 220,
                  height: 160,
                  content: file.name,
                  imageSrc: String(reader.result),
                });
              };
              reader.readAsDataURL(file);
              e.target.value = "";
            }}
          />

          {tool === "format" && (
            <FormatPanel
              selected={selected}
              onApply={(patch) => {
                if (selected) updateItem(selected.id, patch);
                else {
                  addItem({
                    kind: "text",
                    content: "Text",
                    textStyle: "body",
                    width: 240,
                    height: 80,
                    ...patch,
                  });
                }
              }}
              onBodyFormat={(cmd) => {
                document.execCommand(cmd);
              }}
            />
          )}
          {tool === "sticky" && (
            <div className="absolute left-14 top-24 z-30 w-44 rounded-2xl border border-line bg-surface p-3 shadow-lg">
              <p className="text-xs font-semibold">Sticky types</p>
              <div className="mt-2 space-y-1">
                {STICKY_TYPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-paper"
                    onClick={() =>
                      addItem({
                        kind: "sticky",
                        stickyType: s.id,
                        width: s.w,
                        height: s.h,
                        color: s.color,
                        content: "",
                      })
                    }
                  >
                    <span
                      className="inline-block h-5 w-5 rounded-sm"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {tool === "draw" && (
            <div className="absolute left-14 top-40 z-30 w-52 rounded-2xl border border-line bg-surface p-3 shadow-lg">
              <p className="text-xs font-semibold">Pens</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {PENS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPen(p)}
                    className={`rounded-lg px-2 py-1 text-[0.65rem] font-semibold ${
                      pen === p ? "bg-ink text-surface" : "bg-paper"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold">Color</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {BASIC.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="h-6 w-6 rounded-full border border-line"
                    style={{ backgroundColor: c }}
                    onClick={() => setDrawColor(c)}
                  />
                ))}
              </div>
              <input
                type="color"
                value={drawColor}
                onChange={(e) => setDrawColor(e.target.value)}
                className="mt-2 h-10 w-full cursor-pointer"
              />
              <button
                type="button"
                className="mt-2 w-full rounded-xl bg-ink py-2 text-xs font-semibold text-surface"
                onClick={() =>
                  addItem({
                    kind: "drawing",
                    content: `${pen} stroke`,
                    color: drawColor,
                    penStyle: pen,
                    width: 200,
                    height: 120,
                  })
                }
              >
                Add stroke pad
              </button>
            </div>
          )}
          {tool === "table" && selected?.kind === "table" && (
            <div className="absolute left-14 top-16 z-30 w-48 rounded-2xl border border-line bg-surface p-3 shadow-lg">
              <p className="text-xs font-semibold">Table settings</p>
              <button
                type="button"
                className="mt-2 block w-full rounded-lg px-2 py-1.5 text-left text-xs hover:bg-paper"
                onClick={() => {
                  const text = (selected.table?.cells ?? [])
                    .map((r) => r.join("\t"))
                    .join("\n");
                  updateItem(selected.id, { kind: "text", content: text, table: undefined });
                }}
              >
                Convert to text
              </button>
              <button
                type="button"
                className="block w-full rounded-lg px-2 py-1.5 text-left text-xs hover:bg-paper"
                onClick={() => {
                  const text = (selected.table?.cells ?? [])
                    .map((r) => r.join("\t"))
                    .join("\n");
                  navigator.clipboard.writeText(text);
                }}
              >
                Copy table
              </button>
              <button
                type="button"
                className="block w-full rounded-lg px-2 py-1.5 text-left text-xs hover:bg-paper"
                onClick={() => {
                  alert("Table shared with project members (local demo).");
                }}
              >
                Share table
              </button>
            </div>
          )}
        </aside>

        {/* Page */}
        <main className="min-h-[calc(100svh-200px)] p-4 sm:p-6">
          <div className="animate-page-turn mx-auto max-w-4xl">
            <input
              value={activePage.title}
              onChange={(e) => savePage({ ...activePage, title: e.target.value })}
              className="mb-3 w-full bg-transparent font-display text-3xl font-bold outline-none"
            />

            {activeChapter.isMeetings || activePage.type === "meetings" ? (
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
                <h3 className="font-display text-lg font-bold">Meeting link</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Paste a meeting URL for the team to join.
                </p>
                <input
                  value={activePage.meetingLink ?? ""}
                  onChange={(e) =>
                    savePage({ ...activePage, meetingLink: e.target.value })
                  }
                  placeholder="https://meet.example.com/..."
                  className="mt-4 w-full rounded-xl border border-line bg-paper px-4 py-3 outline-none focus:border-accent"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-surface"
                    onClick={() => {
                      if (activePage.meetingLink)
                        navigator.clipboard.writeText(activePage.meetingLink);
                    }}
                  >
                    Copy link
                  </button>
                  {activePage.meetingLink && (
                    <a
                      href={activePage.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
                    >
                      Open
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`relative min-h-[70vh] overflow-hidden rounded-2xl border border-line shadow-[0_12px_36px_rgba(28,29,28,0.06)] ${paperClass(activePage.paperStyle)}`}
                style={{ backgroundColor: activePage.background || noteColor }}
                onClick={() => setSelectedId(null)}
              >
                <textarea
                  value={activePage.body}
                  onChange={(e) => savePage({ ...activePage, body: e.target.value })}
                  placeholder="Start typing…"
                  className="absolute inset-0 z-0 h-full w-full resize-none bg-transparent p-8 text-base leading-7 text-ink outline-none caret-ink"
                  style={{ caretColor: "#1c1d1c" }}
                />
                {activePage.items.map((item) => (
                  <CanvasObject
                    key={item.id}
                    item={item}
                    selected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={(patch) => updateItem(item.id, patch)}
                    onDelete={() => deleteItem(item.id)}
                  />
                ))}
              </div>
            )}

            {/* Subgroup chat */}
            {subgroup && (
              <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
                <h3 className="font-display text-base font-bold">Subgroup chat</h3>
                <div className="mt-2 max-h-40 space-y-2 overflow-y-auto text-sm">
                  {subgroup.chat.length === 0 && (
                    <p className="text-ink-faint">No messages yet</p>
                  )}
                  {subgroup.chat.map((m) => (
                    <p key={m.id}>
                      <span className="font-semibold">{m.author}</span>{" "}
                      <span className="text-ink-faint">{m.time}</span>
                      <br />
                      {m.text}
                    </p>
                  ))}
                </div>
                <form
                  className="mt-2 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!chatDraft.trim()) return;
                    updateSubgroup(activeProject.id, subgroup.id, {
                      chat: [
                        ...subgroup.chat,
                        {
                          id: makeId("msg"),
                          author: "You",
                          text: chatDraft.trim(),
                          time: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                        },
                      ],
                    });
                    setChatDraft("");
                  }}
                >
                  <input
                    value={chatDraft}
                    onChange={(e) => setChatDraft(e.target.value)}
                    className="flex-1 rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none"
                    placeholder="Message subgroup…"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-ink px-3 py-2 text-sm font-semibold text-surface"
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </div>
        </main>

        {tasksOpen && (
          <aside className="border-l border-line bg-surface">
            <div className="border-b border-line px-4 py-3">
              <h3 className="font-display text-lg font-bold">Tasks</h3>
            </div>
            <ul className="max-h-[calc(100svh-220px)] space-y-2 overflow-y-auto px-3 py-3">
              {tasks.length === 0 && (
                <li className="py-8 text-center text-sm text-ink-faint">No tasks</li>
              )}
              {tasks.map((task) => (
                <li key={task.id} className="rounded-xl border border-line/80 p-3">
                  <label className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() =>
                        persistTasks(
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, done: !t.done } : t,
                          ),
                        )
                      }
                    />
                    <span className={task.done ? "line-through text-ink-faint" : ""}>
                      {task.title}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-3">
              <button
                type="button"
                className="w-full rounded-xl bg-ink py-2 text-sm font-semibold text-surface"
                onClick={() => {
                  const title = prompt("Task");
                  if (!title) return;
                  persistTasks([
                    {
                      id: makeId("task"),
                      title,
                      done: false,
                      priority: "medium",
                      linkedPageId: activePage.id,
                      subgroupId: subgroup?.id,
                    },
                    ...tasks,
                  ]);
                }}
              >
                Add task
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function FormatPanel({
  selected,
  onApply,
}: {
  selected: CanvasItem | null;
  onApply: (patch: Partial<CanvasItem>) => void;
  onBodyFormat: (cmd: string) => void;
}) {
  const styles: TextStyleKind[] = ["title", "heading", "subheading", "body", "mono"];
  const aligns: TextAlign[] = ["left", "center", "right"];
  return (
    <div className="absolute left-14 top-20 z-30 w-56 rounded-2xl border border-line bg-surface p-3 shadow-lg">
      <p className="text-xs font-semibold">Format</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {styles.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-lg bg-paper px-2 py-1 text-[0.65rem] font-semibold capitalize"
            onClick={() => onApply({ textStyle: s, kind: selected?.kind ?? "text" })}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-1">
        <button type="button" className="rounded bg-paper px-2 py-1 text-xs font-bold" onClick={() => onApply({ bold: !selected?.bold })}>
          B
        </button>
        <button type="button" className="rounded bg-paper px-2 py-1 text-xs italic" onClick={() => onApply({ italic: !selected?.italic })}>
          I
        </button>
        <button type="button" className="rounded bg-paper px-2 py-1 text-xs underline" onClick={() => onApply({ underline: !selected?.underline })}>
          U
        </button>
      </div>
      <label className="mt-2 block text-[0.65rem] font-semibold">
        Font
        <select
          className="mt-1 w-full rounded-lg border border-line bg-paper px-2 py-1 text-xs"
          value={selected?.fontFamily ?? "Figtree"}
          onChange={(e) => onApply({ fontFamily: e.target.value })}
        >
          <option>Figtree</option>
          <option>Syne</option>
          <option>Georgia</option>
          <option>Courier New</option>
        </select>
      </label>
      <div className="mt-2 flex flex-wrap gap-1">
        <button type="button" className="rounded bg-paper px-2 py-1 text-[0.65rem]" onClick={() => onApply({ listType: "dash" })}>
          — list
        </button>
        <button type="button" className="rounded bg-paper px-2 py-1 text-[0.65rem]" onClick={() => onApply({ listType: "bullet" })}>
          • list
        </button>
        <button type="button" className="rounded bg-paper px-2 py-1 text-[0.65rem]" onClick={() => onApply({ listType: "number" })}>
          1. list
        </button>
      </div>
      <div className="mt-2 flex gap-1">
        {aligns.map((a) => (
          <button
            key={a}
            type="button"
            className="rounded bg-paper px-2 py-1 text-[0.65rem] capitalize"
            onClick={() => onApply({ align: a })}
          >
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}

function CanvasObject({
  item,
  selected,
  onSelect,
  onChange,
  onDelete,
}: {
  item: CanvasItem;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasItem>) => void;
  onDelete: () => void;
}) {
  const fontSize =
    item.textStyle === "title"
      ? "1.75rem"
      : item.textStyle === "heading"
        ? "1.35rem"
        : item.textStyle === "subheading"
          ? "1.1rem"
          : item.textStyle === "mono"
            ? "0.85rem"
            : "0.95rem";

  return (
    <div
      className={`absolute z-10 overflow-hidden border shadow-sm ${
        item.stickyType === "round" ? "rounded-full" : "rounded-xl"
      } ${selected ? "border-ink ring-2 ring-ink/10" : "border-black/5"}`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex + 10,
        backgroundColor: item.color ?? (item.kind === "image" ? "transparent" : "#fff"),
        fontFamily: item.fontFamily,
        fontWeight: item.bold ? 700 : 400,
        fontStyle: item.italic ? "italic" : "normal",
        textDecoration: item.underline ? "underline" : "none",
        textAlign: item.align ?? "left",
        fontSize,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={(e) => {
        if (item.locked) return;
        e.stopPropagation();
        onSelect();
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = item.x;
        const origY = item.y;
        function move(ev: MouseEvent) {
          onChange({
            x: Math.max(0, origX + (ev.clientX - startX)),
            y: Math.max(0, origY + (ev.clientY - startY)),
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
      ) : item.kind === "table" && item.table ? (
        <table className="h-full w-full border-collapse text-xs">
          <tbody>
            {item.table.cells.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-line p-0">
                    <input
                      value={cell}
                      onChange={(e) => {
                        const cells = item.table!.cells.map((r) => [...r]);
                        cells[ri][ci] = e.target.value;
                        onChange({ table: { ...item.table!, cells } });
                      }}
                      className="w-full bg-transparent px-1 py-1 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : item.kind === "checklist" ? (
        <div className="space-y-1 p-3 text-sm" onClick={(e) => e.stopPropagation()}>
          {(item.doneItems ?? []).map((ci) => (
            <label key={ci.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ci.done}
                onChange={() =>
                  onChange({
                    doneItems: (item.doneItems ?? []).map((d) =>
                      d.id === ci.id ? { ...d, done: !d.done } : d,
                    ),
                  })
                }
              />
              <input
                value={ci.text}
                onChange={(e) =>
                  onChange({
                    doneItems: (item.doneItems ?? []).map((d) =>
                      d.id === ci.id ? { ...d, text: e.target.value } : d,
                    ),
                  })
                }
                className="flex-1 bg-transparent outline-none"
              />
            </label>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-accent"
            onClick={() =>
              onChange({
                doneItems: [
                  ...(item.doneItems ?? []),
                  { id: makeId("ci"), text: "Item", done: false },
                ],
              })
            }
          >
            + item
          </button>
        </div>
      ) : (
        <textarea
          value={item.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="h-[calc(100%-24px)] w-full resize-none bg-transparent p-3 outline-none"
          style={{
            fontFamily: item.textStyle === "mono" ? "Courier New, monospace" : item.fontFamily,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {selected && (
        <button
          type="button"
          className="absolute bottom-1 right-1 rounded bg-ink/80 px-1.5 text-[0.6rem] text-white"
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
