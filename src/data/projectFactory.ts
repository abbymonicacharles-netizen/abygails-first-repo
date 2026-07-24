import { DEFAULT_SECTIONS } from "./genres";
import type {
  Chapter,
  ChapterPage,
  GenreId,
  MemberRole,
  Project,
} from "./types";

export function makeId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function makeInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function blankPage(title: string): ChapterPage {
  return {
    id: makeId("page"),
    title,
    type: "canvas",
    visibility: "team",
    background: "#f7f7f5",
    paperStyle: "plain",
    items: [],
    content: "",
  };
}

export function defaultChapters(): Chapter[] {
  return DEFAULT_SECTIONS.map((title) => ({
    id: makeId("ch"),
    title,
    pages: [blankPage(`${title} page`)],
  }));
}

export function createBlankProject(partial?: {
  title?: string;
  genre?: GenreId;
  coverColor?: string;
  spineColor?: string;
}): Project {
  const cover = partial?.coverColor ?? "#2c4a6e";
  const spine = partial?.spineColor ?? cover;
  return {
    id: makeId("project"),
    title: partial?.title?.trim() || "Untitled project",
    subtitle: "",
    description: "",
    goals: "",
    genre: partial?.genre ?? "custom",
    collaborative: false,
    setupComplete: false,
    favorite: false,
    archived: false,
    updatedAt: new Date().toISOString(),
    members: [{ id: "you", name: "You", role: "owner" }],
    style: {
      coverColor: cover,
      spineColor: spine,
      textColor: "#f8fafc",
      decoration: { bookmarkColor: "#9ca3af" },
    },
    theme: "minimal",
    chapters: defaultChapters(),
    tasks: [],
    progress: 0,
  };
}

export function withInvite(project: Project, role: MemberRole = "editor"): Project {
  const code = makeInviteCode();
  return {
    ...project,
    collaborative: true,
    invite: {
      code,
      link: `/join/${code}`,
      role,
    },
  };
}

/** Shared invite registry for join flow in this client prototype */
export type SharedInvite = {
  code: string;
  projectSnapshot: Project;
};

export const STORAGE_KEYS = {
  projects: "brainstorm.projects.v2",
  settings: "brainstorm.settings.v2",
  invites: "brainstorm.invites.v2",
} as const;
