export type BookTab = "home" | "notes" | "tasks" | "files" | "team" | "progress";

export type StickyShape = "small" | "large" | "square" | "triangle" | "star";

export interface BookStyle {
  coverColor: string;
  spineColor: string;
  textColor: string;
  sticker?: string;
  icon?: string;
}

export interface ChecklistTask {
  id: string;
  title: string;
  done: boolean;
  assignee?: string;
  due?: string;
  priority: "low" | "medium" | "high";
}

export interface ScrapItem {
  id: string;
  kind: "text" | "sticky" | "image" | "sticker";
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  color?: string;
  highlight?: string;
  imageSrc?: string;
  zIndex: number;
  stickyShape?: StickyShape;
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
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

export interface BookQuestions {
  about: string;
  goal: string;
  teamNote: string;
  dueNote: string;
  milestone: string;
  answered: boolean;
}

export interface Subgroup {
  id: string;
  name: string;
  emoji: string;
  members: string[];
  inviteCode: string;
  tasks: ChecklistTask[];
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
  passcode?: string;
  archived: boolean;
  dueDate?: string;
  style: BookStyle;
  members: string[];
  inviteCode: string;
  questions: BookQuestions;
  notes: ScrapItem[];
  tasks: ChecklistTask[];
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
  musicOn: boolean;
  showArchived: boolean;
}
