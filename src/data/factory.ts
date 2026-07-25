import type { ChecklistTask, ProjectBook, ScrapItem } from "./types";

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

export const COVER_SWATCHES = [
  "#1c2b26",
  "#2c3a4a",
  "#4a1f2b",
  "#3d3428",
  "#1f2f3a",
  "#2e241c",
  "#243028",
];

export function createBook(title = "Untitled book"): ProjectBook {
  const cover = COVER_SWATCHES[Math.floor(Math.random() * COVER_SWATCHES.length)];
  return {
    id: makeId("book"),
    title,
    locked: false,
    archived: false,
    style: {
      coverColor: cover,
      spineColor: cover,
      textColor: "#f5f1ea",
      icon: "◆",
    },
    members: ["You"],
    inviteCode: makeCode(),
    questions: {
      about: "",
      goal: "",
      teamNote: "",
      dueNote: "",
      milestone: "",
      answered: false,
    },
    notes: [],
    tasks: [],
    files: [],
    meetings: [],
    chat: [],
    subgroups: [],
    unlockedStickers: ["◆", "❖", "✦", "✿"],
    achievements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createSubgroup(name: string, emoji = "◆") {
  return {
    id: makeId("sg"),
    name,
    emoji,
    members: ["You"],
    inviteCode: makeCode(),
    tasks: [] as ChecklistTask[],
    notes: [] as ScrapItem[],
    files: [],
    meetings: [],
    chat: [],
  };
}

export function tasksProgress(tasks: { done: boolean }[]) {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

export function bookProgress(book: ProjectBook) {
  return tasksProgress(book.tasks);
}

export function subgroupProgress(tasks: ChecklistTask[]) {
  return tasksProgress(tasks);
}

export function daysUntil(due?: string) {
  if (!due) return null;
  const diff = Math.ceil(
    (new Date(due).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24),
  );
  return diff;
}

export const STICKER_PACK = ["◆", "❖", "✦", "✿", "★", "☾", "☘", "♪"];
/** @deprecated use per-user keys from auth.ts */
export const STORAGE_KEY = "brainstorm.scrapbook.v2";

export const STICKY_SHAPES: {
  id: ScrapItem["stickyShape"];
  label: string;
  w: number;
  h: number;
  color: string;
}[] = [
  { id: "small", label: "Small", w: 120, h: 100, color: "#f3e7c5" },
  { id: "large", label: "Large", w: 200, h: 160, color: "#f0d9a8" },
  { id: "square", label: "Square", w: 150, h: 150, color: "#e8d5b5" },
  { id: "triangle", label: "Triangle", w: 140, h: 130, color: "#f2e2b8" },
  { id: "star", label: "Star", w: 150, h: 150, color: "#efe0b0" },
];

export const TYPE_FONTS = [
  "Libre Baskerville",
  "Cormorant Garamond",
  "Georgia",
  "Palatino Linotype",
  "Courier New",
];
