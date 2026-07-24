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

export type PageType = "canvas" | "meetings";
export type MemberRole = "owner" | "editor" | "viewer";
export type TaskPriority = "low" | "medium" | "high";
export type SectionVisibility = "team" | "personal" | "subgroup";
export type TextAlign = "left" | "center" | "right";
export type TextStyleKind = "title" | "heading" | "subheading" | "body" | "mono";

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

export interface TableData {
  rows: number;
  cols: number;
  cells: string[][];
}

export interface CanvasItem {
  id: string;
  kind: "note" | "sticky" | "checklist" | "text" | "table" | "image" | "drawing";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  locked?: boolean;
  zIndex: number;
  content: string;
  color?: string;
  stickyType?: "square" | "wide" | "tall" | "round";
  textStyle?: TextStyleKind;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: TextAlign;
  listType?: "none" | "bullet" | "dash" | "number" | "checklist";
  doneItems?: { id: string; text: string; done: boolean }[];
  table?: TableData;
  imageSrc?: string;
  penStyle?: string;
}

export interface ChapterPage {
  id: string;
  title: string;
  type: PageType;
  background: string;
  paperStyle: "plain" | "lined" | "dot" | "grid";
  items: CanvasItem[];
  /** Free-typing body for the page (text cursor) */
  body: string;
  meetingLink?: string;
}

export interface Chapter {
  id: string;
  title: string;
  visibility: SectionVisibility;
  subgroupId?: string;
  isMeetings?: boolean;
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
  subgroupId?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  role: MemberRole;
  subgroupIds?: string[];
}

export interface InviteInfo {
  code: string;
  link: string;
  role: MemberRole;
}

export interface Subgroup {
  id: string;
  name: string;
  inviteCode: string;
  memberIds: string[];
  chapters: Chapter[];
  tasks: TaskItem[];
  meetingLink?: string;
  chat: { id: string; author: string; text: string; time: string }[];
  noteColor: string;
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
  noteColor: string;
  chapters: Chapter[];
  tasks: TaskItem[];
  subgroups: Subgroup[];
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
