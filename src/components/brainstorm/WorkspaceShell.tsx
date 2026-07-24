"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ChapterPage, Project } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";
import { PageViews } from "./pages/PageViews";

type Panel = "none" | "tasks" | "history" | "theme";

const themes: Project["theme"][] = [
  "minimal",
  "futuristic",
  "fantasy",
  "vintage",
  "professional",
  "custom",
];

export function WorkspaceShell({ projectId }: { projectId: string }) {
  const { getProject, updateProject, toggleFavorite, toggleArchive, addHistory } =
    useBrainstorm();
  const project = getProject(projectId);

  const [chapterId, setChapterId] = useState(project?.chapters[0]?.id ?? "");
  const [pageId, setPageId] = useState(project?.chapters[0]?.pages[0]?.id ?? "");
  const [panel, setPanel] = useState<Panel>("tasks");
  const [openBook, setOpenBook] = useState(true);

  useEffect(() => {
    const firstChapter = project?.chapters[0];
    setChapterId(firstChapter?.id ?? "");
    setPageId(firstChapter?.pages[0]?.id ?? "");
    setPanel("tasks");
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps -- reset navigation when book changes

  const chapter = useMemo(
    () => project?.chapters.find((c) => c.id === chapterId) ?? project?.chapters[0],
    [project, chapterId],
  );
  const page = useMemo(
    () => chapter?.pages.find((p) => p.id === pageId) ?? chapter?.pages[0],
    [chapter, pageId],
  );

  if (!project || !chapter || !page) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bs-atmosphere px-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Book not found</h1>
          <Link href="/shelf" className="mt-4 inline-block text-teal underline">
            Back to shelf
          </Link>
        </div>
      </div>
    );
  }

  function replacePage(next: ChapterPage) {
    if (!project || !chapter) return;
    updateProject(project.id, {
      chapters: project.chapters.map((c) =>
        c.id === chapter.id
          ? { ...c, pages: c.pages.map((p) => (p.id === next.id ? next : p)) }
          : c,
      ),
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  }

  function togglePanel(next: Panel) {
    setPanel((prev) => (prev === next ? "none" : next));
  }

  const themeSurface =
    project.theme === "futuristic"
      ? "from-[#d9e7e4] to-[#b9cdc7]"
      : project.theme === "fantasy"
        ? "from-[#e7e0ef] to-[#d5dce8]"
        : project.theme === "vintage"
          ? "from-[#e8e0d4] to-[#d5cbb8]"
          : project.theme === "professional"
            ? "from-[#e4e9f0] to-[#d2dae6]"
            : "from-[#eef4f1] to-[#dce8e2]";

  return (
    <div className={`min-h-[100svh] bg-gradient-to-br ${themeSurface}`}>
      <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line/80 bg-surface/85 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/shelf"
            className="text-sm font-semibold text-ink-soft hover:text-ink"
          >
            ← Shelf
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold text-ink">
              {project.title}
            </p>
            <p className="truncate text-xs text-ink-faint">
              {project.genre} · {project.theme} theme · {project.members.join(", ")}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {(
            [
              ["tasks", "Tasks"],
              ["history", "History"],
              ["theme", "Theme"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => togglePanel(id)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                panel === id ? "bg-ink text-surface" : "bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => toggleFavorite(project.id)}
            className="px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ember"
            aria-label="Favorite"
          >
            {project.favorite ? "★" : "☆"}
          </button>
          <button
            type="button"
            onClick={() => toggleArchive(project.id)}
            className="px-3 py-1.5 text-xs font-semibold text-ink-soft hover:text-ink"
          >
            {project.archived ? "Unarchive" : "Archive"}
          </button>
        </div>
      </header>

      <div
        className={`mx-auto grid max-w-[1400px] gap-0 ${
          panel === "none"
            ? "lg:grid-cols-[220px_minmax(0,1fr)]"
            : "lg:grid-cols-[220px_minmax(0,1fr)_minmax(280px,340px)]"
        }`}
      >
        <aside className="border-r border-line/70 bg-shelf text-paper">
          <button
            type="button"
            onClick={() => setOpenBook((v) => !v)}
            className="flex w-full items-center justify-between px-4 py-4 text-left"
          >
            <span className="font-display text-sm font-bold tracking-wide">Chapters</span>
            <span className="text-xs opacity-70">{openBook ? "Hide" : "Show"}</span>
          </button>
          {openBook && (
            <nav className="px-2 pb-6">
              {project.chapters.map((ch) => (
                <div key={ch.id} className="mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      setChapterId(ch.id);
                      setPageId(ch.pages[0]?.id ?? "");
                    }}
                    className={`w-full px-3 py-2 text-left text-sm font-semibold ${
                      ch.id === chapter.id
                        ? "bg-paper/15 text-white"
                        : "text-paper/75 hover:bg-paper/10 hover:text-paper"
                    }`}
                  >
                    {ch.title}
                  </button>
                  {ch.id === chapter.id && (
                    <ul className="mt-1 space-y-0.5 pl-3">
                      {ch.pages.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            onClick={() => setPageId(p.id)}
                            className={`w-full px-2 py-1.5 text-left text-xs ${
                              p.id === page.id
                                ? "text-ember-soft"
                                : "text-paper/60 hover:text-paper"
                            }`}
                          >
                            {p.title}
                            <span className="ml-1 opacity-50">· {p.type}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </nav>
          )}
          <div className="border-t border-white/10 px-4 py-4">
            <p className="text-[0.65rem] uppercase tracking-wider text-paper/50">Progress</p>
            <div className="mt-2 h-1.5 overflow-hidden bg-black/30">
              <div
                className="h-full bg-ember"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-paper/70">{project.progress}% complete</p>
          </div>
        </aside>

        <main className="min-h-[calc(100svh-57px)] p-4 sm:p-6">
          <div className="animate-bs-page-turn workspace-paper mx-auto min-h-[70vh] max-w-4xl border border-line/60 px-5 py-6 shadow-[0_18px_40px_rgba(20,32,28,0.12)] sm:px-10 sm:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line/80 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                  {chapter.title}
                </p>
                <h1 className="mt-1 font-display text-3xl font-bold text-ink">
                  {page.title}
                </h1>
              </div>
              <p className="text-xs text-ink-faint">Page type · {page.type}</p>
            </div>
            <div className="mt-6">
              <PageViews page={page} onChange={replacePage} />
            </div>
            <div className="mt-8 border-t border-line/70 pt-4">
              <button
                type="button"
                className="text-sm font-semibold text-teal hover:underline"
                onClick={() =>
                  addHistory(project.id, {
                    at: "Just now",
                    label: `Edited “${page.title}”`,
                    kind: "edit",
                  })
                }
              >
                Save checkpoint
              </button>
            </div>
          </div>
        </main>

        {panel !== "none" && (
          <aside className="border-l border-line/70 bg-surface/90">
            {panel === "tasks" && (
              <div className="flex h-full flex-col">
                <div className="border-b border-line px-4 py-3">
                  <h3 className="font-display text-lg font-bold">Tasks</h3>
                  <p className="text-xs text-ink-faint">
                    Priorities, owners, and deadlines
                  </p>
                </div>
                <ul className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
                  {project.tasks.map((t) => (
                    <li key={t.id} className="border-b border-line/60 py-2">
                      <label className="flex cursor-pointer items-start gap-2">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() =>
                            updateProject(project.id, {
                              tasks: project.tasks.map((x) =>
                                x.id === t.id ? { ...x, done: !x.done } : x,
                              ),
                            })
                          }
                          className="mt-1"
                        />
                        <span>
                          <span
                            className={`block text-sm font-medium ${
                              t.done ? "text-ink-faint line-through" : "text-ink"
                            }`}
                          >
                            {t.title}
                          </span>
                          <span className="text-xs text-ink-faint">
                            {t.priority}
                            {t.due ? ` · ${t.due}` : ""}
                            {t.assignee ? ` · ${t.assignee}` : ""}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line p-3">
                  <button
                    type="button"
                    className="w-full bg-ink px-3 py-2 text-sm font-semibold text-surface"
                    onClick={() => {
                      const title = prompt("New task");
                      if (!title) return;
                      updateProject(project.id, {
                        tasks: [
                          {
                            id: `task-${Date.now()}`,
                            title,
                            done: false,
                            priority: "medium",
                          },
                          ...project.tasks,
                        ],
                      });
                    }}
                  >
                    Add task
                  </button>
                </div>
              </div>
            )}
            {panel === "history" && (
              <div className="px-4 py-3">
                <h3 className="font-display text-lg font-bold">Project history</h3>
                <p className="text-xs text-ink-faint">
                  How this book developed over time
                </p>
                <ol className="mt-4 space-y-3">
                  {project.history.map((h) => (
                    <li key={h.id} className="border-l-2 border-teal/40 pl-3">
                      <p className="text-[0.65rem] uppercase tracking-wide text-ink-faint">
                        {h.at} · {h.kind}
                      </p>
                      <p className="text-sm text-ink">{h.label}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {panel === "theme" && (
              <div className="px-4 py-3">
                <h3 className="font-display text-lg font-bold">Visual theme</h3>
                <p className="text-xs text-ink-faint">
                  Colors, atmosphere, and book feel
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateProject(project.id, { theme: t })}
                      className={`px-3 py-3 text-left text-sm font-semibold capitalize ${
                        project.theme === t
                          ? "bg-ink text-surface"
                          : "bg-paper text-ink-soft hover:text-ink"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <label className="mt-5 block text-sm font-medium text-ink">
                  Cover color
                  <input
                    type="color"
                    value={project.style.coverColor}
                    onChange={(e) =>
                      updateProject(project.id, {
                        style: {
                          ...project.style,
                          coverColor: e.target.value,
                          spineColor: e.target.value,
                        },
                      })
                    }
                    className="mt-2 h-10 w-full cursor-pointer bg-transparent"
                  />
                </label>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
