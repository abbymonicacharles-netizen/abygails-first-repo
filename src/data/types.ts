export type TabId =
  | "messages"
  | "foryou"
  | "update"
  | "rooms"
  | "notifications"
  | "profile";

export type Presence = "available" | "busy" | "dnd" | "in-room" | "offline";
export type ThemeMode = "light" | "dark" | "hc";
export type BodyShape = "skinny" | "slim" | "athletic" | "muscular" | "curvy" | "thick" | "plus";
export type GenderPresentation = "feminine" | "masculine" | "fluid";
export type HairTexture = "straight" | "wavy" | "curly" | "coily" | "kinky";
export type HairStyle =
  | "buzz"
  | "short"
  | "pixie"
  | "bob"
  | "shoulder"
  | "long"
  | "buns"
  | "braids"
  | "loc"
  | "ponytail"
  | "afro"
  | "fade";
export type EyeShape = "almond" | "round" | "hooded" | "upturned" | "wide" | "monolid";
export type ClothingStyle =
  | "blazer"
  | "hoodie"
  | "tee"
  | "crop"
  | "jacket"
  | "dress"
  | "puffer"
  | "coat";

export interface AvatarConfig {
  gender: GenderPresentation;
  body: BodyShape;
  hairTexture: HairTexture;
  hairStyle: HairStyle;
  hairColor: string;
  skin: string;
  eyeShape: EyeShape;
  eyeColor: string;
  lipColor: string;
  clothing: ClothingStyle;
  clothingColor: string;
  accessory: "none" | "hoops" | "studs" | "necklace" | "watch" | "scarf";
  hat: "none" | "cap" | "beanie" | "beret" | "earmuffs" | "headband" | "bows";
  glasses: "none" | "round" | "rect" | "sun" | "thin";
}

export interface GlitterUser {
  id: string;
  email: string;
  password: string;
  username: string;
  displayName: string;
  bio: string;
  mood: string;
  presence: Presence;
  avatar: AvatarConfig;
  friends: string[];
  friendRequestsIn: string[];
  friendRequestsOut: string[];
  nicknames: Record<string, string>;
  groupAddPolicy: "friends" | "public";
  contactsLinked: boolean;
  joined: string;
}

export interface ChatPreview {
  id: string;
  name: string;
  kind: "dm" | "group";
  peerUsername?: string;
  last: string;
  time: string;
  unread: number;
  avatar: AvatarConfig;
}

export interface ChatMessage {
  id: string;
  author: string;
  mine?: boolean;
  text: string;
  time: string;
  reaction?: string;
}

export interface FeedPost {
  id: string;
  author: string;
  handle: string;
  caption: string;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
  avatar: AvatarConfig;
}

export interface RoomSeat {
  id: string;
  username?: string;
  displayName?: string;
  speaking?: boolean;
  micOn?: boolean;
  camOn?: boolean;
  avatar?: AvatarConfig;
}

export type RoomKind = "personal" | "meeting";

export interface Room {
  id: string;
  name: string;
  kind: RoomKind;
  inviteOnly: boolean;
  browserUrl: string;
  seats: RoomSeat[];
}

export interface Notif {
  id: string;
  kind: "friend" | "message" | "room" | "social" | "calendar";
  text: string;
  time: string;
  unread?: boolean;
}

export const SKIN_TONES = [
  "#ffe7d1",
  "#f6d0b1",
  "#e8b98a",
  "#d1a074",
  "#c68642",
  "#a15c2f",
  "#8d5524",
  "#6b3b1f",
  "#4a2814",
  "#2d160c",
];

export const HAIR_COLORS = [
  "#0b0b0b",
  "#1c1917",
  "#44403c",
  "#78350f",
  "#b45309",
  "#ca8a04",
  "#dc2626",
  "#db2777",
  "#7c3aed",
  "#2563eb",
  "#f8fafc",
  "#a3a3a3",
];

export const EYE_COLORS = ["#111827", "#1e3a8a", "#0f766e", "#713f12", "#4c1d95", "#334155", "#57534e"];

export const CLOTHING_COLORS = [
  "#0f172a",
  "#1e3a5f",
  "#7c3aed",
  "#0d9488",
  "#be123c",
  "#f8fafc",
  "#fbbf24",
  "#93c5fd",
  "#fecdd3",
  "#d6d3d1",
];

export const LIP_COLORS = ["#9f1239", "#be123c", "#e11d48", "#fb7185", "#7f1d1d", "#44403c"];

export function makeAvatar(partial: Partial<AvatarConfig> = {}): AvatarConfig {
  return {
    gender: "fluid",
    body: "slim",
    hairTexture: "wavy",
    hairStyle: "shoulder",
    hairColor: "#1c1917",
    skin: "#e8b98a",
    eyeShape: "almond",
    eyeColor: "#111827",
    lipColor: "#be123c",
    clothing: "hoodie",
    clothingColor: "#7c3aed",
    accessory: "none",
    hat: "none",
    glasses: "none",
    ...partial,
  };
}

export const STORAGE_USERS = "glitter.users.v1";
export const STORAGE_SESSION = "glitter.session.v1";

export const MOODS = [
  "Focused",
  "Social",
  "Busy",
  "Relaxed",
  "Creative",
  "Away",
];

export const TABS: { id: TabId; label: string }[] = [
  { id: "messages", label: "Messages" },
  { id: "foryou", label: "For You" },
  { id: "update", label: "Update" },
  { id: "rooms", label: "Rooms" },
  { id: "notifications", label: "Alerts" },
  { id: "profile", label: "Profile" },
];
