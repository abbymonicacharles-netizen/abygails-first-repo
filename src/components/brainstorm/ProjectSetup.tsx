"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { genres } from "@/data/genres";
import type { GenreId } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";
import { BrandMark } from "./BrandMark";

export function ProjectSetup({ projectId }: { projectId: string }) {
  const { getProject, completeSetup, ready } = useBrainstorm();
  const project = getProject(projectId);
  const router = useRouter();

  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [goals, setGoals] = useState(project?.goals ?? "");
  const [genre, setGenre] = useState<GenreId>(project?.genre ?? "custom");
  const [customGenre, setCustomGenre] = useState(project?.customGenre ?? "");
  const [dueDate, setDueDate] = useState(project?.dueDate ?? "");
  const [collaborative, setCollaborative] = useState(project?.collaborative ?? false);
  const [savedInvite, setSavedInvite] = useState<string | null>(null);

  const genreLabel = useMemo(
    () => genres.find((g) => g.id === genre)?.label ?? "Custom",
    [genre],
  );

  if (!ready) {
    return <div className="min-h-[100svh] bs-room" />;
  }

  if (!project) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center">
        <p>Project not found.</p>
      </div>
    );
  }

  if (project.setupComplete && !savedInvite) {
    router.replace(`/book/${project.id}`);
    return null;
  }

  return (
    <div className="min-h-[100svh] bs-room px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-xl">
        <BrandMark size="sm" />
        <h1 className="mt-10 font-display text-3xl font-bold tracking-tight">
          Set up your project
        </h1>
        <p className="mt-2 text-ink-soft">
          A short setup before the notebook opens—so planning starts with clear intent.
        </p>

        <form
          className="mt-8 space-y-4 rounded-2xl bg-surface p-6 shadow-[0_12px_40px_rgba(28,29,28,0.08)] sm:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            completeSetup(project.id, {
              title,
              description,
              goals,
              genre,
              customGenre: genre === "custom" ? customGenre : undefined,
              dueDate: dueDate || undefined,
              collaborative,
            });
            if (collaborative) {
              // invite is generated in completeSetup; read after tick via redirect
              setSavedInvite("pending");
              // Navigate after state flush
              setTimeout(() => {
                router.push(`/book/${project.id}?invited=1`);
              }, 50);
            } else {
              router.push(`/book/${project.id}`);
            }
          }}
        >
          <label className="block text-sm font-medium">
            Project name
            <input
              required
              value={title === "Untitled project" ? "" : title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your project"
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <label className="block text-sm font-medium">
            Description <span className="font-normal text-ink-faint">(optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <label className="block text-sm font-medium">
            Genre
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as GenreId)}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
            >
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label} — {g.description}
                </option>
              ))}
            </select>
          </label>

          {genre === "custom" && (
            <label className="block text-sm font-medium">
              Custom genre
              <input
                value={customGenre}
                onChange={(e) => setCustomGenre(e.target.value)}
                placeholder={`e.g. ${genreLabel} remix`}
                className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
              />
            </label>
          )}

          <label className="block text-sm font-medium">
            Due date <span className="font-normal text-ink-faint">(optional)</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <fieldset className="rounded-xl border border-line p-4">
            <legend className="px-1 text-sm font-medium">Project type</legend>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="collab"
                  checked={!collaborative}
                  onChange={() => setCollaborative(false)}
                />
                Solo project
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="collab"
                  checked={collaborative}
                  onChange={() => setCollaborative(true)}
                />
                Collaborative project
              </label>
            </div>
            {collaborative && (
              <p className="mt-3 text-xs leading-relaxed text-ink-soft">
                Brainstorm will generate a unique one-time invitation code and shareable link.
                You can copy or regenerate them anytime under Project Settings → Invite Members.
              </p>
            )}
          </fieldset>

          <label className="block text-sm font-medium">
            Project goals
            <textarea
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
              placeholder="What does success look like?"
              className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-ink py-3 text-sm font-semibold text-surface"
          >
            Open notebook
          </button>
        </form>
      </div>
    </div>
  );
}
