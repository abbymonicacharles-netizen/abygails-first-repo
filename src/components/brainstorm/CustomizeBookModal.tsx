"use client";

import type { Project } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";

const BASIC_COLORS = [
  "#1c1d1c",
  "#ffffff",
  "#2c4a6e",
  "#2f6f66",
  "#6b3a2a",
  "#b45309",
  "#9f1239",
  "#4c1d95",
  "#ca8a04",
  "#3f6212",
  "#0e7490",
  "#9a3412",
];

export function CustomizeBookModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { updateProject } = useBrainstorm();
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Decorate cover</h2>
          <button type="button" onClick={onClose} className="text-sm text-ink-faint">
            Done
          </button>
        </div>

        <label className="mt-5 block text-sm font-medium">
          Title
          <input
            value={project.title}
            onChange={(e) => updateProject(project.id, { title: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-accent"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Subtitle
          <input
            value={project.subtitle}
            onChange={(e) => updateProject(project.id, { subtitle: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-accent"
          />
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Basic colors</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {BASIC_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  updateProject(project.id, {
                    style: {
                      ...project.style,
                      coverColor: c,
                      spineColor: c,
                      textColor: c === "#ffffff" ? "#1c1d1c" : "#f8fafc",
                    },
                  })
                }
                className="h-8 w-8 rounded-full border border-line"
                style={{ backgroundColor: c }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium">
            Cover shade
            <input
              type="color"
              value={project.style.coverColor}
              onChange={(e) =>
                updateProject(project.id, {
                  style: { ...project.style, coverColor: e.target.value },
                })
              }
              className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-transparent"
            />
          </label>
          <label className="block text-sm font-medium">
            Spine shade
            <input
              type="color"
              value={project.style.spineColor}
              onChange={(e) =>
                updateProject(project.id, {
                  style: { ...project.style, spineColor: e.target.value },
                })
              }
              className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-transparent"
            />
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Bookmark
          <input
            type="color"
            value={project.style.decoration.bookmarkColor ?? "#9ca3af"}
            onChange={(e) =>
              updateProject(project.id, {
                style: {
                  ...project.style,
                  decoration: {
                    ...project.style.decoration,
                    bookmarkColor: e.target.value,
                  },
                },
              })
            }
            className="mt-2 h-12 w-full cursor-pointer rounded-lg bg-transparent"
          />
        </label>

        <div className="mt-5 flex flex-wrap gap-2">
          {["◆", "●", "▲", "✦", "■", ""].map((sticker) => (
            <button
              key={sticker || "none"}
              type="button"
              onClick={() =>
                updateProject(project.id, {
                  style: {
                    ...project.style,
                    decoration: { ...project.style.decoration, sticker },
                  },
                })
              }
              className="h-9 w-9 rounded-lg border border-line text-sm"
            >
              {sticker || "—"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
