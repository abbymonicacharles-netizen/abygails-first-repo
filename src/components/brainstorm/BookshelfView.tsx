"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { CustomizeBookModal } from "./CustomizeBookModal";
import { JoinProjectModal } from "./JoinProjectModal";
import { SettingsPanel } from "./SettingsPanel";
import { useBrainstorm } from "@/context/BrainstormContext";
import type { Project } from "@/data/types";

function PaintbrushIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20c2.5 0 4-1 4-3.2C8 14 6.5 13 5 13S2 14.2 2 16.5 3 20 4 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.5 4.5 19 9l-8.2 8.2c-.4.4-1 .6-1.5.6H7v-2.3c0-.5.2-1.1.6-1.5L14.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookshelfView() {
  const { projects, createProject, ready, settings } = useBrainstorm();
  const router = useRouter();
  const [joinOpen, setJoinOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customize, setCustomize] = useState<Project | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);

  const shelfProjects = useMemo(
    () => projects.filter((p) => !p.archived),
    [projects],
  );

  const revealed = shelfProjects.find((p) => p.id === revealedId) ?? null;

  function handleSpineClick(project: Project) {
    if (!project.setupComplete) {
      router.push(`/book/${project.id}/setup`);
      return;
    }
    setRevealedId((id) => (id === project.id ? null : project.id));
  }

  function openCover(project: Project) {
    router.push(`/book/${project.id}`);
  }

  return (
    <div className="relative min-h-[100svh] bs-room">
      <div className="mx-auto max-w-5xl px-5 pb-24 pt-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <BrandMark size="sm" />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-ink-soft hover:bg-surface"
            >
              Settings
            </button>
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="rounded-xl border border-line bg-surface px-4 py-2 text-sm font-semibold"
            >
              Join Project
            </button>
            <button
              type="button"
              onClick={() => {
                const id = createProject();
                router.push(`/book/${id}/setup`);
              }}
              className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-surface"
            >
              New Project
            </button>
          </div>
        </header>

        <h1 className="mt-12 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Your bookshelf
        </h1>

        {/* Revealed cover */}
        {revealed && (
          <div className="mt-10 flex flex-col items-center animate-page-turn">
            <button
              type="button"
              onClick={() => openCover(revealed)}
              className="relative h-72 w-52 overflow-hidden rounded-r-md rounded-l-sm shadow-[8px_16px_40px_rgba(28,29,28,0.28)] transition hover:-translate-y-1 sm:h-80 sm:w-60"
              style={{ backgroundColor: revealed.style.coverColor, color: revealed.style.textColor }}
              aria-label={`Open ${revealed.title}`}
            >
              <span
                className="absolute inset-y-0 left-0 w-4"
                style={{ backgroundColor: revealed.style.spineColor }}
              />
              {revealed.style.decoration.bookmarkColor && (
                <span
                  className="absolute right-5 top-0 h-12 w-3"
                  style={{
                    backgroundColor: revealed.style.decoration.bookmarkColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                  }}
                />
              )}
              <div className="flex h-full flex-col justify-between p-6 pl-8">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] opacity-70">
                    {revealed.customGenre || revealed.genre}
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold leading-tight">
                    {revealed.title}
                  </h2>
                  {revealed.subtitle && (
                    <p className="mt-2 text-sm opacity-80">{revealed.subtitle}</p>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl opacity-90">
                    {revealed.style.decoration.sticker || revealed.style.decoration.icon}
                  </span>
                  <span className="text-xs opacity-60">Open</span>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCustomize(revealed)}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 text-sm text-ink-soft shadow-sm hover:text-ink"
              aria-label="Decorate cover"
            >
              <PaintbrushIcon />
              Decorate
            </button>
            <button
              type="button"
              onClick={() => setRevealedId(null)}
              className="mt-2 text-xs font-semibold text-ink-faint hover:text-ink"
            >
              Put back
            </button>
          </div>
        )}

        <div className={`mt-14 ${revealed ? "opacity-80" : ""}`}>
          <div
            className="relative mx-auto flex min-h-[13rem] items-end justify-center gap-2 px-4 sm:gap-3 sm:px-8"
            style={{ ["--bs-shelf" as string]: settings.shelfTone }}
          >
            {!ready ? null : shelfProjects.length === 0 ? (
              <p className="mb-10 text-center text-sm text-ink-faint">No books yet</p>
            ) : (
              shelfProjects.map((project) => {
                const title = project.title || "Untitled";
                const active = revealedId === project.id;
                return (
                  <div key={project.id} className="group flex w-11 flex-col items-center sm:w-12">
                    <button
                      type="button"
                      onClick={() => handleSpineClick(project)}
                      className={`spine-book relative h-44 w-9 overflow-hidden rounded-sm sm:h-52 sm:w-10 ${
                        active ? "ring-2 ring-accent ring-offset-2" : ""
                      }`}
                      style={{ backgroundColor: project.style.spineColor }}
                      aria-label={`Show cover for ${title}`}
                    >
                      {project.style.decoration.bookmarkColor && (
                        <span
                          className="absolute right-1 top-0 h-7 w-1.5"
                          style={{
                            backgroundColor: project.style.decoration.bookmarkColor,
                            clipPath:
                              "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
                          }}
                        />
                      )}
                      <span
                        className="absolute inset-x-0 top-0 h-full w-full opacity-30"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(0,0,0,0.25), transparent 35%, rgba(255,255,255,0.12) 70%, rgba(0,0,0,0.2))",
                        }}
                      />
                      <span
                        className="absolute inset-y-3 left-1/2 flex w-[1.05rem] -translate-x-1/2 items-end justify-center overflow-hidden pb-2"
                        style={{ color: project.style.textColor }}
                      >
                        <span
                          className="origin-center whitespace-nowrap font-display text-[0.68rem] font-semibold tracking-wide"
                          style={{
                            writingMode: "vertical-rl",
                            transform: "rotate(180deg)",
                          }}
                        >
                          {title}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRevealedId(project.id);
                        setCustomize(project);
                      }}
                      className="mt-2 rounded-full p-1.5 text-ink-faint opacity-70 transition hover:bg-surface hover:text-ink group-hover:opacity-100"
                      aria-label={`Decorate ${title}`}
                    >
                      <PaintbrushIcon />
                    </button>
                  </div>
                );
              })
            )}
          </div>
          <div
            className="shelf-plank mx-auto h-3 rounded-sm"
            style={{ backgroundColor: settings.shelfTone }}
          />
          <div className="mx-auto h-2 rounded-b-sm bg-shelf-edge/80" />
        </div>
      </div>

      <JoinProjectModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CustomizeBookModal
        project={
          customize ? projects.find((p) => p.id === customize.id) ?? null : null
        }
        onClose={() => setCustomize(null)}
      />
    </div>
  );
}
