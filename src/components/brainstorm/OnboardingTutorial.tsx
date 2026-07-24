"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { useBrainstorm } from "@/context/BrainstormContext";

const STEPS = [
  {
    title: "Your bookshelf starts empty",
    body: "Every project is a book. Spines line your shelf so you can scan projects at a glance.",
  },
  {
    title: "Create your first book",
    body: "Use New Project to begin. You’ll name it, pick a genre, set goals, and choose solo or collaborative.",
  },
  {
    title: "Customize the book",
    body: "Tap the paintbrush under any spine to change colors, title, stickers, bookmarks, and labels—without opening the project.",
  },
  {
    title: "Invite your team",
    body: "Collaborative projects get a one-time invitation code and shareable link. Manage invites anytime in Project Settings.",
  },
  {
    title: "Pages & tasks stay connected",
    body: "Work in a clean notebook with sections you can rename. Add notes and stickies; keep tasks in the side panel linked to pages.",
  },
  {
    title: "Build together—or join one",
    body: "Start a collaborative project, or use Join Project on the homepage with an invitation code to add a book to your shelf.",
  },
] as const;

export function OnboardingTutorial() {
  const { settings, skipOnboarding, completeOnboarding, createProject, ready } =
    useBrainstorm();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const visible = ready && settings.showOnboarding;

  const progress = useMemo(
    () => ((step + 1) / STEPS.length) * 100,
    [step],
  );

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-lg rounded-2xl bg-surface p-6 shadow-[0_20px_50px_rgba(28,29,28,0.25)] sm:p-8 animate-rise">
        <div className="flex items-start justify-between gap-3">
          <BrandMark size="sm" href="/" />
          <button
            type="button"
            onClick={skipOnboarding}
            className="text-sm font-medium text-ink-faint hover:text-ink"
          >
            Skip
          </button>
        </div>

        <div className="mt-6 h-1 overflow-hidden rounded-full bg-paper-deep">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">
          {current.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{current.body}</p>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-sm font-semibold text-ink-soft disabled:opacity-30"
          >
            Back
          </button>
          <div className="flex gap-2">
            {!isLast ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-surface"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  completeOnboarding();
                  const id = createProject();
                  router.push(`/book/${id}/setup`);
                }}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white"
              >
                Create first project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
