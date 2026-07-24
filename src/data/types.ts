export type GenreId =
  | "software"
  | "robotics"
  | "engineering"
  | "business"
  | "school"
  | "film"
  | "research"
  | "marketing"
  | "architecture"
  | "writing"
  | "custom";

export type PageType =
  | "canvas"
  | "document"
  | "checklist"
  | "kanban"
  | "notes";

export type MemberRole = "owner" | "editor" | "viewer";
export type TaskPriority = "low" | "medium" | "high";
export type PageVisibility = "private" | "selected" | "team";

export interface BookDecoration {
  sticker?: string;
  bookmarkColor?: string;
  icon?: string;
  label?: string;
}

export interface BookStyle {
  coverColor: string;
  spineColor: string;
  textColor: string;
  decoration: BookDecoration;
}

export interface CanvasItem {
  id: string;
  kind: "note" | "sticky" | "checklist" | "text" | "link" | "file";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  zIndex: number;
  content: string;
  color?: string;
  doneItems?: { id: string; text: string; done: boolean }[];
}

export interface ChapterPage {
  id: string;
  title: string;
  type: PageType;
  visibility: PageVisibility;
  background: string;
  paperStyle: "plain" | "lined" | "dot" | "grid";
  items: CanvasItem[];
  content?: string;
}

export interface Chapter {
  id: string;
  title: string;
  pages: ChapterPage[];
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  priority: TaskPriority;
  due?: string;
  assignee?: string;
  labels?: string[];
  subtasks?: { id: string; title: string; done: boolean }[];
  linkedPageId?: string;
  progress?: number;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: MemberRole;
}

export interface InviteInfo {
  code: string;
  link: string;
  role: MemberRole;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  goals: string;
  genre: GenreId;
  customGenre?: string;
  dueDate?: string;
  collaborative: boolean;
  setupComplete: boolean;
  favorite: boolean;
  archived: boolean;
  updatedAt: string;
  members: ProjectMember[];
  invite?: InviteInfo;
  style: BookStyle;
  theme: "minimal" | "soft" | "ink" | "custom";
  chapters: Chapter[];
  tasks: TaskItem[];
  progress: number;
}

export interface AppSettings {
  onboardingComplete: boolean;
  showOnboarding: boolean;
  accent: string;
  shelfTone: string;
  fontScale: "sm" | "md" | "lg";
}

export interface GenreMeta {
  id: GenreId;
  label: string;
  description: string;
}
