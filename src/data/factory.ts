import type { ProjectBook, StickyTask, ScrapItem } from "./types";

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function makeCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => a[Math.floor(Math.random() * a.length)]).join("");
}

const COVERS = ["#7BA38A", "#E8A0A8", "#A8C5D4", "#F0C987", "#C4A8D4", "#8FB8A8", "#D4A59A"];

export function createBook(title = "Untitled book"): ProjectBook {
  const cover = COVERS[Math.floor(Math.random() * COVERS.length)];
  return {
    id: makeId("book"),
    title,
    locked: false,
    style: {
      coverColor: cover,
      spineColor: cover,
      textColor: "#fffdf8",
      sticker: undefined,
      icon: "✦",
      spineMark: "",
    },
    members: ["You"],
    inviteCode: makeCode(),
    notes: [],
    tasks: [],
    files: [],
    meetings: [],
    chat: [],
    subgroups: [],
    unlockedStickers: ["✦", "✿", "♡", "★"],
    achievements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createSubgroup(name: string, emoji = "✦") {
  return {
    id: makeId("sg"),
    name,
    emoji,
    members: ["You"],
    inviteCode: makeCode(),
    tasks: [] as StickyTask[],
    notes: [] as ScrapItem[],
    files: [],
    meetings: [],
    chat: [],
  };
}

export function bookProgress(book: ProjectBook) {
  if (book.tasks.length === 0) return 0;
  const done = book.tasks.filter((t) => t.done).length;
  return Math.round((done / book.tasks.length) * 100);
}

export function daysUntil(due?: string) {
  if (!due) return null;
  const diff = Math.ceil(
    (new Date(due).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24),
  );
  return diff;
}

export const COVER_SWATCHES = COVERS;
export const STICKER_PACK = ["✦", "✿", "♡", "★", "☾", "☁", "☘", "♪", "☎", "✿"];
export const STORAGE_KEY = "brainstorm.scrapbook.v1";

export const TASK_COLORS = ["#FFF3C4", "#FFD6E0", "#D4F1F4", "#E2F0CB", "#F5E6FF", "#FFE5D9"];
