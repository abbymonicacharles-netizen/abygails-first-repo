"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { CustomizeBookModal } from "./CustomizeBookModal";
import { JoinProjectModal } from "./JoinProjectModal";
import { OnboardingTutorial } from "./OnboardingTutorial";
import { SettingsPanel } from "./SettingsPanel";
import { useBrainstorm } from "@/context/BrainstormContext";
import type { Project } from "@/data/types";

function PaintbrushIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function SpineBook({
  project,
  onOpen,
  onCustomize,
}: {
  project: Project;
  onOpen: () => void;
  onCustomize: () => void;
}) {
  const title = project.title || "Untitled";
  return (
    <div className="group flex w-11 flex-col items-center sm:w-12">
      <button
        type="button"
        onClick={onOpen}
        className="spine-book relative h-44 w-9 overflow-hidden rounded-sm sm:h-52 sm:w-10"
        style={{ backgroundColor: project.style.spineColor }}
        aria-label={`Open ${title}`}
      >
        {project.style.decoration.bookmarkColor && (
          <span
            className="absolute right-1 top-0 h-7 w-1.5"
            style={{
              backgroundColor: project.style.decoration.bookmarkColor,
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
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
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {project.style.decoration.icon ? `${project.style.decoration.icon} ` : ""}
            {title}
          </span>
        </span>
        {project.style.decoration.sticker && (
          <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[0.65rem] text-white/80">
            {project.style.decoration.sticker}
          </span>
        )}
      </button>
      <button
        type="button"
        onClick={onCustomize}
        className="mt-2 rounded-full p-1.5 text-ink-faint opacity-70 transition hover:bg-surface hover:text-ink group-hover:opacity-100"
        aria-label={`Customize ${title}`}
        title="Customize"
      >
        <PaintbrushIcon />
      </button>
      {project.style.decoration.label && (
        <p className="mt-1 max-w-[3rem] truncate text-center text-[0.6rem] text-ink-faint">
          {project.style.decoration.label}
        </p>
      )}
    </div>
  );
}

export function BookshelfView() {
  const { projects, createProject, ready, settings } = useBrainstorm();
  const router = useRouter();
  const [joinOpen, setJoinOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [customize, setCustomize] = useState<Project | null>(null);

  const shelfProjects = useMemo(
    () => projects.filter((p) => !p.archived),
    [projects],
  );

  function openProject(project: Project) {
    if (!project.setupComplete) {
      router.push(`/book/${project.id}/setup`);
      return;
    }
    router.push(`/book/${project.id}`);
  }

  return (
    <div className="relative min-h-[100svh] bs-room">
      <OnboardingTutorial />
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

        <div className="mt-14 animate-rise">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your bookshelf
          </h1>
          <p className="mt-2 max-w-xl text-ink-soft">
            {ready && shelfProjects.length === 0
              ? "A blank slate. Create a project book or join one with an invitation code."
              : "Only spines show here—open a book to work, or paintbrush to customize."}
          </p>
        </div>

        <div className="mt-16">
          <div
            className="relative mx-auto flex min-h-[13rem] items-end justify-center gap-2 px-4 sm:gap-3 sm:px-8"
            style={{ ["--bs-shelf" as string]: settings.shelfTone }}
          >
            {shelfProjects.length === 0 ? (
              <p className="mb-10 text-center text-sm text-ink-faint">
                No books yet
              </p>
            ) : (
              shelfProjects.map((project) => (
                <SpineBook
                  key={project.id}
                  project={customize?.id === project.id ? customize : project}
                  onOpen={() => openProject(project)}
                  onCustomize={() => setCustomize(project)}
                />
              ))
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
        project={customize ? projects.find((p) => p.id === customize.id) ?? null : null}
        onClose={() => setCustomize(null)}
      />
    </div>
  );
}
