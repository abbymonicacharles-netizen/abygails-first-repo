import { DEFAULT_SECTIONS } from "./genres";
import type {
  Chapter,
  ChapterPage,
  GenreId,
  MemberRole,
  Project,
  Subgroup,
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

function blankPage(title: string, isMeetings = false): ChapterPage {
  return {
    id: makeId("page"),
    title,
    type: isMeetings ? "meetings" : "canvas",
    background: "#f7f7f5",
    paperStyle: "plain",
    items: [],
    body: "",
    meetingLink: isMeetings ? "" : undefined,
  };
}

export function defaultChapters(): Chapter[] {
  return DEFAULT_SECTIONS.map((title) => {
    const isMeetings = title === "Meetings";
    return {
      id: makeId("ch"),
      title,
      visibility: "team" as const,
      isMeetings,
      pages: [blankPage(isMeetings ? "Meeting link" : title, isMeetings)],
    };
  });
}

export function defaultSubgroupChapters(): Chapter[] {
  return ["Brainstorming", "Planning", "Tasks", "Resources", "Meetings", "Progress"].map(
    (title) => {
      const isMeetings = title === "Meetings";
      return {
        id: makeId("ch"),
        title,
        visibility: "subgroup" as const,
        isMeetings,
        pages: [blankPage(isMeetings ? "Meeting link" : title, isMeetings)],
      };
    },
  );
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
    members: [{ id: "you", name: "You", role: "owner", subgroupIds: [] }],
    style: {
      coverColor: cover,
      spineColor: spine,
      textColor: "#f8fafc",
      decoration: { bookmarkColor: "#9ca3af" },
    },
    theme: "minimal",
    noteColor: "#f7f7f5",
    chapters: defaultChapters(),
    tasks: [],
    subgroups: [],
    progress: 0,
  };
}

export function createSubgroup(name: string): Subgroup {
  return {
    id: makeId("sg"),
    name: name.trim() || "Subgroup",
    inviteCode: makeInviteCode(),
    memberIds: ["you"],
    chapters: defaultSubgroupChapters(),
    tasks: [],
    meetingLink: "",
    chat: [],
    noteColor: "#f7f7f5",
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

export const STORAGE_KEYS = {
  projects: "brainstorm.projects.v3",
  settings: "brainstorm.settings.v3",
  invites: "brainstorm.invites.v3",
} as const;
