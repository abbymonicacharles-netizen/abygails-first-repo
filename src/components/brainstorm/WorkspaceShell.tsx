"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { makeId } from "@/data/projectFactory";
import type { CanvasItem, Chapter, ChapterPage, Project, TaskItem } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";

type SideTool =
  | "note"
  | "sticky"
  | "checklist"
  | "text"
  | "link"
  | "file"
  | "comment"
  | "appearance"
  | "settings";

const stickyColors = ["#fef3c7", "#dcfce7", "#e0e7ff", "#ffe4e6", "#f3e8ff"];

function paperClass(style: ChapterPage["paperStyle"]) {
  if (style === "dot") return "canvas-dot";
  if (style === "lined") return "canvas-lined";
  if (style === "grid") return "canvas-grid";
  return "";
}

export function WorkspaceShell({ projectId }: { projectId: string }) {
  const { getProject, updateProject, regenerateInvite, ready } = useBrainstorm();
  const project = getProject(projectId);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [chapterId, setChapterId] = useState("");
  const [pageId, setPageId] = useState("");
  const [tasksOpen, setTasksOpen] = useState(true);
  const [activeTool, setActiveTool] = useState<SideTool | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inviteFlash, setInviteFlash] = useState(false);
  const [copied, setCopied] = useState(false);
  const [snapStickies, setSnapStickies] = useState(true);

  useEffect(() => {
    if (!project) return;
    if (!project.setupComplete) {
      router.replace(`/book/${project.id}/setup`);
      return;
    }
    const ch = project.chapters[0];
    setChapterId(ch?.id ?? "");
    setPageId(ch?.pages[0]?.id ?? "");
  }, [projectId, project?.setupComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (searchParams.get("invited") === "1") {
      setInviteFlash(true);
      setActiveTool("settings");
    }
  }, [searchParams]);

  const chapter = useMemo(
    () => project?.chapters.find((c) => c.id === chapterId) ?? project?.chapters[0],
    [project, chapterId],
  );
  const page = useMemo(
    () => chapter?.pages.find((p) => p.id === pageId) ?? chapter?.pages[0],
    [chapter, pageId],
  );

  if (!ready) return <div className="min-h-[100svh] bg-paper" />;

  if (!project || !chapter || !page) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <div className="text-center">
          <p className="font-display text-2xl font-bold">Book not found</p>
          <Link href="/" className="mt-3 inline-block text-accent underline">
            Back to shelf
          </Link>
        </div>
      </div>
    );
  }

  const activeProject = project;
  const activeChapter = chapter;
  const activePage = page;

  function saveChapters(chapters: Chapter[]) {
    updateProject(activeProject.id, { chapters });
  }

  function savePage(next: ChapterPage) {
    saveChapters(
      activeProject.chapters.map((c) =>
        c.id === activeChapter.id
          ? { ...c, pages: c.pages.map((p) => (p.id === next.id ? next : p)) }
          : c,
      ),
    );
  }

  function addItem(kind: CanvasItem["kind"]) {
    const base: CanvasItem = {
      id: makeId("item"),
      kind,
      x: 48 + Math.random() * 80,
      y: 48 + Math.random() * 60,
      width: kind === "sticky" ? 160 : kind === "checklist" ? 220 : 200,
      height: kind === "sticky" ? 140 : kind === "checklist" ? 180 : 120,
      zIndex: (activePage.items.at(-1)?.zIndex ?? 0) + 1,
      content:
        kind === "link"
          ? "https://"
          : kind === "file"
            ? "Untitled file"
            : kind === "checklist"
              ? "Checklist"
              : kind === "sticky"
                ? "Sticky note"
                : "New note",
      color: kind === "sticky" ? stickyColors[Math.floor(Math.random() * stickyColors.length)] : "#ffffff",
      doneItems:
        kind === "checklist"
          ? [{ id: makeId("ci"), text: "First item", done: false }]
          : undefined,
    };
    if (snapStickies && kind === "sticky") {
      base.x = Math.round(base.x / 18) * 18;
      base.y = Math.round(base.y / 18) * 18;
    }
    savePage({ ...activePage, items: [...activePage.items, base] });
    setSelectedId(base.id);
  }

  function updateItem(id: string, patch: Partial<CanvasItem>) {
    savePage({
      ...activePage,
      items: activePage.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  }

  function deleteItem(id: string) {
    savePage({ ...activePage, items: activePage.items.filter((i) => i.id !== id) });
    setSelectedId(null);
  }

  function renameChapter(id: string, title: string) {
    saveChapters(activeProject.chapters.map((c) => (c.id === id ? { ...c, title } : c)));
  }

  function deleteChapter(id: string) {
    if (activeProject.chapters.length <= 1) return;
    const next = activeProject.chapters.filter((c) => c.id !== id);
    saveChapters(next);
    setChapterId(next[0].id);
    setPageId(next[0].pages[0]?.id ?? "");
  }

  function moveChapter(id: string, dir: -1 | 1) {
    const idx = activeProject.chapters.findIndex((c) => c.id === id);
    const swap = idx + dir;
    if (idx < 0 || swap < 0 || swap >= activeProject.chapters.length) return;
    const next = [...activeProject.chapters];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    saveChapters(next);
  }

  function addChapter() {
    const ch: Chapter = {
      id: makeId("ch"),
      title: "New section",
      pages: [
        {
          id: makeId("page"),
          title: "New page",
          type: "canvas",
          visibility: "team",
          background: "#f7f7f5",
          paperStyle: "plain",
          items: [],
        },
      ],
    };
    saveChapters([...activeProject.chapters, ch]);
    setChapterId(ch.id);
    setPageId(ch.pages[0].id);
  }

  function addTask() {
    const title = prompt("Task title");
    if (!title) return;
    const task: TaskItem = {
      id: makeId("task"),
      title,
      done: false,
      priority: "medium",
      linkedPageId: activePage.id,
      progress: 0,
      subtasks: [],
      labels: [],
    };
    updateProject(activeProject.id, { tasks: [task, ...activeProject.tasks] });
  }

  const inviteUrl =
    typeof window !== "undefined" && activeProject.invite
      ? `${window.location.origin}/join/${activeProject.invite.code}`
      : activeProject.invite?.link ?? "";

  return (
    <div className="min-h-[100svh] bg-paper">
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-ink">
            ← Shelf
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold">{project.title}</p>
            <p className="truncate text-xs text-ink-faint">
              {project.customGenre || project.genre}
              {project.dueDate ? ` · due ${project.dueDate}` : ""}
              {project.collaborative ? " · collaborative" : " · solo"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTasksOpen((v) => !v)}
            className="rounded-xl bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          >
            {tasksOpen ? "Hide tasks" : "Tasks"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTool(activeTool === "settings" ? null : "settings")}
            className="rounded-xl bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          >
            Project settings
          </button>
        </div>
      </header>

      {inviteFlash && project.invite && (
        <div className="border-b border-line bg-surface px-4 py-3 text-sm sm:px-5">
          <p className="font-medium">Invitation ready</p>
          <p className="mt-1 text-ink-soft">
            Code <span className="font-mono font-semibold tracking-wider">{project.invite.code}</span>
            {" · "}
            <button
              type="button"
              className="font-semibold text-accent underline"
              onClick={async () => {
                await navigator.clipboard.writeText(inviteUrl);
                setCopied(true);
              }}
            >
              {copied ? "Link copied" : "Copy invite link"}
            </button>
          </p>
        </div>
      )}

      <div
        className={`mx-auto grid max-w-[1500px] ${
          tasksOpen
            ? "lg:grid-cols-[200px_52px_minmax(0,1fr)_280px]"
            : "lg:grid-cols-[200px_52px_minmax(0,1fr)]"
        }`}
      >
        {/* Sections */}
        <aside className="border-r border-line bg-surface">
          <div className="flex items-center justify-between px-3 py-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              Sections
            </p>
            <button type="button" onClick={addChapter} className="text-lg leading-none text-ink-soft">
              +
            </button>
          </div>
          <nav className="space-y-1 px-2 pb-4">
            {project.chapters.map((ch, index) => (
              <div
                key={ch.id}
                className={`rounded-xl px-2 py-2 ${
                  ch.id === chapter.id ? "bg-paper" : "hover:bg-paper/70"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left text-sm font-semibold"
                  onClick={() => {
                    setChapterId(ch.id);
                    setPageId(ch.pages[0]?.id ?? "");
                  }}
                >
                  {ch.title}
                </button>
                {ch.id === chapter.id && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-ink-faint"
                      onClick={() => {
                        const next = prompt("Rename section", ch.title);
                        if (next) renameChapter(ch.id, next);
                      }}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-ink-faint"
                      onClick={() => moveChapter(ch.id, -1)}
                      disabled={index === 0}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-ink-faint"
                      onClick={() => moveChapter(ch.id, 1)}
                      disabled={index === project.chapters.length - 1}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-ink-faint"
                      onClick={() => deleteChapter(ch.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Slim toolbar */}
        <aside className="border-r border-line bg-surface/80 py-3">
          <div className="flex flex-col items-center gap-2">
            {(
              [
                ["note", "Note"],
                ["sticky", "Sticky"],
                ["checklist", "List"],
                ["text", "Text"],
                ["link", "Link"],
                ["file", "File"],
                ["comment", "Comment"],
                ["appearance", "Look"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                title={label}
                onClick={() => {
                  setActiveTool(id);
                  if (id === "note" || id === "sticky" || id === "checklist" || id === "text" || id === "link" || id === "file") {
                    addItem(id === "note" ? "note" : id);
                  }
                }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-[0.65rem] font-bold ${
                  activeTool === id ? "bg-ink text-surface" : "text-ink-soft hover:bg-paper"
                }`}
              >
                {label.slice(0, 1)}
              </button>
            ))}
          </div>
        </aside>

        {/* Page canvas */}
        <main className="min-h-[calc(100svh-57px)] p-4 sm:p-6">
          <div className="animate-page-turn mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  {chapter.title}
                </p>
                <input
                  value={page.title}
                  onChange={(e) => savePage({ ...page, title: e.target.value })}
                  className="mt-1 bg-transparent font-display text-3xl font-bold outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={snapStickies}
                  onChange={(e) => setSnapStickies(e.target.checked)}
                />
                Snap stickies
              </label>
            </div>

            <div
              className={`relative min-h-[70vh] overflow-hidden rounded-2xl border border-line shadow-[0_12px_36px_rgba(28,29,28,0.06)] ${paperClass(page.paperStyle)}`}
              style={{ backgroundColor: page.background }}
              onClick={() => setSelectedId(null)}
            >
              {page.items.length === 0 && (
                <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-ink-faint">
                  Empty page — use the side tools to add notes, stickies, and more.
                </p>
              )}
              {page.items.map((item) => (
                <CanvasObject
                  key={item.id}
                  item={item}
                  selected={selectedId === item.id}
                  onSelect={() => setSelectedId(item.id)}
                  onChange={(patch) => updateItem(item.id, patch)}
                  onDelete={() => deleteItem(item.id)}
                  snap={snapStickies}
                />
              ))}
            </div>

            {activeTool === "appearance" && (
              <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
                <h3 className="font-display text-lg font-bold">Page appearance</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-medium">
                    Background
                    <input
                      type="color"
                      value={page.background}
                      onChange={(e) => savePage({ ...page, background: e.target.value })}
                      className="mt-1 h-10 w-full"
                    />
                  </label>
                  <label className="text-sm font-medium">
                    Paper style
                    <select
                      value={page.paperStyle}
                      onChange={(e) =>
                        savePage({
                          ...page,
                          paperStyle: e.target.value as ChapterPage["paperStyle"],
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
                    >
                      <option value="plain">Plain</option>
                      <option value="lined">Lined</option>
                      <option value="dot">Dot</option>
                      <option value="grid">Grid</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium sm:col-span-2">
                    Visibility
                    <select
                      value={page.visibility}
                      onChange={(e) =>
                        savePage({
                          ...page,
                          visibility: e.target.value as ChapterPage["visibility"],
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
                    >
                      <option value="private">Private</option>
                      <option value="selected">Selected members</option>
                      <option value="team">Entire team</option>
                    </select>
                  </label>
                </div>
              </div>
            )}

            {activeTool === "settings" && (
              <ProjectInviteSettings
                project={project}
                inviteUrl={inviteUrl}
                onRegenerate={() => regenerateInvite(project.id)}
                onUpdateRole={(role) =>
                  updateProject(project.id, {
                    invite: project.invite
                      ? { ...project.invite, role }
                      : undefined,
                  })
                }
              />
            )}

            {activeTool === "comment" && (
              <p className="mt-4 text-sm text-ink-soft">
                Select an object on the page, then leave planning notes in its content field. Comments stay with the work.
              </p>
            )}
          </div>
        </main>

        {/* Tasks */}
        {tasksOpen && (
          <aside className="border-l border-line bg-surface">
            <div className="border-b border-line px-4 py-3">
              <h3 className="font-display text-lg font-bold">Tasks</h3>
              <p className="text-xs text-ink-faint">Linked to planning pages</p>
            </div>
            <ul className="max-h-[calc(100svh-140px)] space-y-2 overflow-y-auto px-3 py-3">
              {project.tasks.length === 0 && (
                <li className="px-1 py-6 text-center text-sm text-ink-faint">No tasks yet</li>
              )}
              {project.tasks.map((task) => (
                <li key={task.id} className="rounded-xl border border-line/80 p-3">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() =>
                        updateProject(project.id, {
                          tasks: project.tasks.map((t) =>
                            t.id === task.id ? { ...t, done: !t.done } : t,
                          ),
                        })
                      }
                      className="mt-1"
                    />
                    <span className="min-w-0 flex-1">
                      <button
                        type="button"
                        className={`block w-full text-left text-sm font-medium ${
                          task.done ? "text-ink-faint line-through" : ""
                        }`}
                        onClick={() => {
                          if (task.linkedPageId) {
                            for (const ch of project.chapters) {
                              const pg = ch.pages.find((p) => p.id === task.linkedPageId);
                              if (pg) {
                                setChapterId(ch.id);
                                setPageId(pg.id);
                                break;
                              }
                            }
                          }
                        }}
                      >
                        {task.title}
                      </button>
                      <span className="mt-1 block text-[0.65rem] text-ink-faint">
                        {task.priority}
                        {task.due ? ` · ${task.due}` : ""}
                        {task.assignee ? ` · ${task.assignee}` : ""}
                        {task.linkedPageId ? " · linked page" : ""}
                      </span>
                    </span>
                  </label>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-accent"
                      onClick={() => {
                        const due = prompt("Due date (YYYY-MM-DD)", task.due ?? "");
                        if (due == null) return;
                        updateProject(project.id, {
                          tasks: project.tasks.map((t) =>
                            t.id === task.id ? { ...t, due } : t,
                          ),
                        });
                      }}
                    >
                      Due
                    </button>
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-accent"
                      onClick={() => {
                        const assignee = prompt("Assignee", task.assignee ?? "");
                        if (assignee == null) return;
                        updateProject(project.id, {
                          tasks: project.tasks.map((t) =>
                            t.id === task.id ? { ...t, assignee } : t,
                          ),
                        });
                      }}
                    >
                      Assign
                    </button>
                    <button
                      type="button"
                      className="text-[0.65rem] font-semibold text-accent"
                      onClick={() => {
                        const priority = prompt("Priority: low, medium, high", task.priority);
                        if (!priority) return;
                        if (!["low", "medium", "high"].includes(priority)) return;
                        updateProject(project.id, {
                          tasks: project.tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, priority: priority as TaskItem["priority"] }
                              : t,
                          ),
                        });
                      }}
                    >
                      Priority
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-3">
              <button
                type="button"
                onClick={addTask}
                className="w-full rounded-xl bg-ink py-2 text-sm font-semibold text-surface"
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

function ProjectInviteSettings({
  project,
  inviteUrl,
  onRegenerate,
  onUpdateRole,
}: {
  project: Project;
  inviteUrl: string;
  onRegenerate: () => void;
  onUpdateRole: (role: "editor" | "viewer") => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface p-4">
      <h3 className="font-display text-lg font-bold">Invite members</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Share a one-time code or link. Members join from the homepage Join Project button.
      </p>
      {!project.collaborative || !project.invite ? (
        <p className="mt-4 text-sm text-ink-faint">
          This is a solo project. Recreate as collaborative from setup, or regenerate an invite to enable sharing.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-paper px-3 py-3 font-mono text-lg tracking-[0.2em]">
            {project.invite.code}
          </div>
          <p className="break-all text-xs text-ink-faint">{inviteUrl}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-surface"
              onClick={async () => {
                await navigator.clipboard.writeText(inviteUrl);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
              onClick={onRegenerate}
            >
              Regenerate code
            </button>
          </div>
          <label className="block text-sm font-medium">
            Default join role
            <select
              value={project.invite.role === "owner" ? "editor" : project.invite.role}
              onChange={(e) => onUpdateRole(e.target.value as "editor" | "viewer")}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </label>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Members</p>
            <ul className="mt-2 space-y-1 text-sm">
              {project.members.map((m) => (
                <li key={m.id}>
                  {m.name} · {m.role}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {!project.invite && (
        <button
          type="button"
          onClick={onRegenerate}
          className="mt-4 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Generate invitation
        </button>
      )}
    </div>
  );
}

function CanvasObject({
  item,
  selected,
  onSelect,
  onChange,
  onDelete,
  snap,
}: {
  item: CanvasItem;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<CanvasItem>) => void;
  onDelete: () => void;
  snap: boolean;
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-xl border shadow-sm ${
        selected ? "border-ink ring-2 ring-ink/10" : "border-black/5"
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
        backgroundColor: item.color ?? "#fff",
        transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
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
          let x = origX + (ev.clientX - startX);
          let y = origY + (ev.clientY - startY);
          if (snap && item.kind === "sticky") {
            x = Math.round(x / 18) * 18;
            y = Math.round(y / 18) * 18;
          }
          onChange({ x: Math.max(0, x), y: Math.max(0, y) });
        }
        function up() {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
        }
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      }}
    >
      <textarea
        value={item.content}
        onChange={(e) => onChange({ content: e.target.value })}
        className="h-[calc(100%-28px)] w-full resize-none bg-transparent p-3 text-sm outline-none"
      />
      {selected && (
        <div className="absolute bottom-1 right-1 flex gap-1">
          <button
            type="button"
            className="rounded bg-ink/80 px-1.5 text-[0.6rem] text-white"
            onClick={(e) => {
              e.stopPropagation();
              onChange({
                width: item.width + 20,
                height: item.height + 16,
              });
            }}
          >
            +
          </button>
          <button
            type="button"
            className="rounded bg-ink/80 px-1.5 text-[0.6rem] text-white"
            onClick={(e) => {
              e.stopPropagation();
              onChange({ locked: !item.locked });
            }}
          >
            {item.locked ? "Unlock" : "Lock"}
          </button>
          <button
            type="button"
            className="rounded bg-ink/80 px-1.5 text-[0.6rem] text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Del
          </button>
        </div>
      )}
    </div>
  );
}
