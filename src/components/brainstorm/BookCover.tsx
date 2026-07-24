"use client";

import Link from "next/link";
import type { Project } from "@/data/types";

const textureClass: Record<Project["style"]["texture"], string> = {
  linen:
    "bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.04)_3px)]",
  leather:
    "bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(ellipse_at_70%_80%,rgba(0,0,0,0.2),transparent_50%)]",
  canvas:
    "bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03),rgba(255,255,255,0.03)_1px,transparent_2px),repeating-linear-gradient(90deg,rgba(0,0,0,0.04),rgba(0,0,0,0.04)_1px,transparent_2px)]",
  matte: "",
  speckle:
    "bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15)_0_1px,transparent_1.5px),radial-gradient(circle_at_70%_60%,rgba(0,0,0,0.12)_0_1px,transparent_1.5px)]",
};

export function BookCover({
  project,
  index = 0,
  href,
  onFavorite,
}: {
  project: Project;
  index?: number;
  href?: string;
  onFavorite?: () => void;
}) {
  const { style } = project;
  const destination = href ?? `/book/${project.id}`;

  return (
    <div
      className="group relative flex w-[7.5rem] sm:w-[8.5rem] flex-col items-center animate-bs-rise"
      style={{ animationDelay: `${Math.min(index, 10) * 0.05}s` }}
    >
      <Link
        href={destination}
        className="book-cover relative block h-44 w-full sm:h-52 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal"
        style={{ perspective: "800px" }}
        aria-label={`Open project ${project.title}`}
      >
        {/* pages edge */}
        <span
          aria-hidden
          className="absolute right-0 top-1 bottom-1 w-1.5 translate-x-full rounded-r-sm"
          style={{
            background:
              "linear-gradient(90deg, #e8efe9, #f7faf8 40%, #d7e0da)",
          }}
        />
        <div
          className={`relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[4px_8px_20px_rgba(20,32,28,0.28)] ${textureClass[style.texture]}`}
          style={{ backgroundColor: style.coverColor, color: style.textColor }}
        >
          <div
            className="book-spine absolute inset-y-0 left-0 w-3"
            style={{ backgroundColor: style.spineColor }}
          />
          {style.decoration.bookmarkColor && (
            <span
              aria-hidden
              className="absolute right-3 top-0 h-10 w-2.5 origin-top"
              style={{
                backgroundColor: style.decoration.bookmarkColor,
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
              }}
            />
          )}
          <div className="flex h-full flex-col justify-between p-3 pl-5">
            <div>
              <p className="font-display text-[0.65rem] font-semibold uppercase tracking-[0.18em] opacity-70">
                {project.genre}
              </p>
              <h3 className="mt-2 font-display text-lg font-bold leading-tight sm:text-xl">
                {project.title}
              </h3>
            </div>
            <div className="space-y-1">
              {style.decoration.sticker && (
                <span className="text-lg opacity-90" aria-hidden>
                  {style.decoration.sticker}
                </span>
              )}
              <div className="h-1 w-full overflow-hidden rounded-sm bg-black/25">
                <div
                  className="h-full bg-current opacity-80"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-[0.65rem] opacity-70">{project.progress}%</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-3 w-full text-center">
        <div className="flex items-center justify-center gap-1">
          <p className="truncate font-medium text-ink text-sm">{project.title}</p>
          {onFavorite && (
            <button
              type="button"
              onClick={onFavorite}
              className="text-ink-faint hover:text-ember transition-colors"
              aria-label={project.favorite ? "Unfavorite" : "Favorite"}
            >
              {project.favorite ? "★" : "☆"}
            </button>
          )}
        </div>
        <p className="truncate text-xs text-ink-faint">{project.collection}</p>
      </div>
    </div>
  );
}
