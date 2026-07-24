"use client";

import type { Project } from "@/data/types";
import { useBrainstorm } from "@/context/BrainstormContext";
import { SPINE_COLORS } from "@/data/genres";

const stickers = ["◆", "●", "▲", "✦", "■", ""];
const icons = ["", "✦", "◎", "△", "◇", "▣"];

export function CustomizeBookModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { updateProject } = useBrainstorm();
  if (!project) return null;

  function patchStyle(partial: Partial<Project["style"]> & { decoration?: Partial<Project["style"]["decoration"]> }) {
    updateProject(project!.id, {
      style: {
        ...project!.style,
        ...partial,
        decoration: {
          ...project!.style.decoration,
          ...(partial.decoration ?? {}),
        },
      },
      title: project!.title,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Customize book</h2>
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

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Spine color</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {SPINE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() =>
                  updateProject(project.id, {
                    style: { ...project.style, spineColor: c, coverColor: c },
                  })
                }
                className="h-8 w-8 rounded-lg border-2"
                style={{
                  backgroundColor: c,
                  borderColor: project.style.spineColor === c ? "#1c1d1c" : "transparent",
                }}
                aria-label={`Spine ${c}`}
              />
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-medium">
          Cover color
          <input
            type="color"
            value={project.style.coverColor}
            onChange={(e) =>
              updateProject(project.id, {
                style: { ...project.style, coverColor: e.target.value },
              })
            }
            className="mt-2 h-10 w-full cursor-pointer bg-transparent"
          />
        </label>

        <label className="mt-4 block text-sm font-medium">
          Bookmark color
          <input
            type="color"
            value={project.style.decoration.bookmarkColor ?? "#9ca3af"}
            onChange={(e) =>
              patchStyle({ decoration: { bookmarkColor: e.target.value } })
            }
            className="mt-2 h-10 w-full cursor-pointer bg-transparent"
          />
        </label>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Icon</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {icons.map((icon) => (
              <button
                key={icon || "none"}
                type="button"
                onClick={() => patchStyle({ decoration: { icon } })}
                className={`h-9 w-9 rounded-lg border text-sm ${
                  (project.style.decoration.icon ?? "") === icon
                    ? "border-ink bg-paper"
                    : "border-line"
                }`}
              >
                {icon || "—"}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="text-sm font-medium">Sticker</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {stickers.map((sticker) => (
              <button
                key={sticker || "none"}
                type="button"
                onClick={() => patchStyle({ decoration: { sticker } })}
                className={`h-9 w-9 rounded-lg border text-sm ${
                  (project.style.decoration.sticker ?? "") === sticker
                    ? "border-ink bg-paper"
                    : "border-line"
                }`}
              >
                {sticker || "—"}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 block text-sm font-medium">
          Label
          <input
            value={project.style.decoration.label ?? ""}
            onChange={(e) => patchStyle({ decoration: { label: e.target.value } })}
            placeholder="e.g. Priority"
            className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 outline-none focus:border-accent"
          />
        </label>
      </div>
    </div>
  );
}
