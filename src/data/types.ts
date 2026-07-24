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
  | "document"
  | "whiteboard"
  | "notebook"
  | "moodboard"
  | "timeline"
  | "kanban"
  | "calendar"
  | "dashboard"
  | "checklist"
  | "freeform";

export type TextureId = "linen" | "leather" | "canvas" | "matte" | "speckle";

export interface BookDecoration {
  sticker?: string;
  bookmarkColor?: string;
  icon?: string;
}

export interface BookStyle {
  coverColor: string;
  spineColor: string;
  textColor: string;
  texture: TextureId;
  decoration: BookDecoration;
}

export interface TaskItem {
  id: string;
  title: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  due?: string;
  assignee?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  column: "backlog" | "doing" | "review" | "done";
  tags?: string[];
}

export interface StickyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

export interface ChapterPage {
  id: string;
  title: string;
  type: PageType;
  content?: string;
  checklist?: TaskItem[];
  kanban?: KanbanCard[];
  stickies?: StickyNote[];
  timeline?: { id: string; label: string; date: string; status: "done" | "active" | "upcoming" }[];
}

export interface Chapter {
  id: string;
  title: string;
  pages: ChapterPage[];
}

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
  channel: "project" | "private";
}

export interface ProjectHistoryEvent {
  id: string;
  at: string;
  label: string;
  kind: "edit" | "upload" | "milestone" | "discussion" | "task";
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  genre: GenreId;
  collection: string;
  favorite: boolean;
  archived: boolean;
  updatedAt: string;
  members: string[];
  style: BookStyle;
  theme: "minimal" | "futuristic" | "fantasy" | "vintage" | "professional" | "custom";
  chapters: Chapter[];
  tasks: TaskItem[];
  messages: ChatMessage[];
  history: ProjectHistoryEvent[];
  progress: number;
}

export interface GenreMeta {
  id: GenreId;
  label: string;
  description: string;
  defaultChapters: string[];
  accent: string;
}
