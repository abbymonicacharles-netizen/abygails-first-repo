export type BookTab = "home" | "notes" | "tasks" | "files" | "team" | "progress";

export interface BookStyle {
  coverColor: string;
  spineColor: string;
  textColor: string;
  sticker?: string;
  icon?: string;
  spineMark?: string;
}

export interface StickyTask {
  id: string;
  title: string;
  assignee: string;
  due: string;
  priority: "low" | "medium" | "high";
  done: boolean;
  x: number;
  y: number;
  color: string;
}

export interface ScrapItem {
  id: string;
  kind: "text" | "sticky" | "image" | "sticker" | "pin";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color?: string;
  imageSrc?: string;
  pinned?: boolean;
  zIndex: number;
}

export interface DeskFile {
  id: string;
  name: string;
  folder: "Images" | "PDFs" | "Videos" | "Links";
  url?: string;
}

export interface MeetingCard {
  id: string;
  title: string;
  when: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface Subgroup {
  id: string;
  name: string;
  emoji: string;
  members: string[];
  inviteCode: string;
  tasks: StickyTask[];
  notes: ScrapItem[];
  files: DeskFile[];
  meetings: MeetingCard[];
  chat: ChatMessage[];
}

export interface Achievement {
  id: string;
  label: string;
  unlockedAt: string;
}

export interface ProjectBook {
  id: string;
  title: string;
  locked: boolean;
  dueDate?: string;
  style: BookStyle;
  members: string[];
  inviteCode: string;
  notes: ScrapItem[];
  tasks: StickyTask[];
  files: DeskFile[];
  meetings: MeetingCard[];
  chat: ChatMessage[];
  subgroups: Subgroup[];
  unlockedStickers: string[];
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  seasonalTheme: "spring" | "summer" | "autumn" | "winter" | "cozy";
  musicOn: boolean;
}
