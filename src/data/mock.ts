export type TabId =
  | "messages"
  | "foryou"
  | "status"
  | "rooms"
  | "notifications"
  | "profile";

export type Presence = "available" | "busy" | "dnd" | "in-room" | "offline";

export type ThemeMode = "light" | "dark" | "hc";

export type HairStyle = "sleek" | "waves" | "curls" | "buzz" | "bun" | "braids" | "pixie" | "long";
export type EyeShape = "almond" | "round" | "hooded" | "upturned" | "wide";
export type FaceShape = "soft" | "sharp" | "round" | "long";
export type ClothingStyle = "blazer" | "hoodie" | "tee" | "knit" | "jacket" | "dress";
export type Accessory = "none" | "watch" | "necklace" | "earrings" | "scarf";
export type HatStyle = "none" | "cap" | "beanie" | "beret";
export type GlassesStyle = "none" | "round" | "rect" | "sun";

export interface AvatarConfig {
  hairStyle: HairStyle;
  hairColor: string;
  face: FaceShape;
  skin: string;
  eyeShape: EyeShape;
  eyeColor: string;
  clothing: ClothingStyle;
  clothingColor: string;
  accessory: Accessory;
  hat: HatStyle;
  glasses: GlassesStyle;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  mood: string;
  presence: Presence;
  color: string;
  joined: string;
  friends: string[];
  favoriteThemes: string[];
  avatar: AvatarConfig;
}

export interface ChatPreview {
  id: string;
  name: string;
  kind: "dm" | "group";
  last: string;
  time: string;
  unread: number;
  color: string;
  pinned?: boolean;
  avatar: AvatarConfig;
}

export interface ChatMessage {
  id: string;
  author: string;
  mine?: boolean;
  text: string;
  time: string;
  reaction?: string;
  replyTo?: string;
}

export interface FeedPost {
  id: string;
  author: string;
  handle: string;
  color: string;
  kind: "video" | "progress" | "art" | "clip" | "tutorial";
  caption: string;
  likes: number;
  comments: number;
  saved?: boolean;
  liked?: boolean;
  avatar: AvatarConfig;
}

export interface StatusItem {
  id: string;
  user: string;
  emoji: string;
  text: string;
  presence: Presence;
  expires: "24h" | "forever";
  color: string;
  avatar: AvatarConfig;
}

export interface RoomSeat {
  id: string;
  user?: string;
  speaking?: boolean;
  micOn?: boolean;
  camOn?: boolean;
  avatar?: AvatarConfig;
}

export type RoomKind = "personal" | "meeting";

export interface Room {
  id: string;
  name: string;
  theme: string;
  emoji: string;
  kind: RoomKind;
  inviteOnly: boolean;
  seats: RoomSeat[];
}

export interface Notif {
  id: string;
  kind: string;
  text: string;
  time: string;
  unread?: boolean;
}

export interface CalEvent {
  id: string;
  title: string;
  when: string;
  type: string;
  rsvp: "yes" | "maybe" | "no" | "none";
}

export const PRESENCE_META: Record<
  Presence,
  { label: string; color: string; emoji: string }
> = {
  available: { label: "Available", color: "#22c55e", emoji: "🟢" },
  busy: { label: "Busy", color: "#eab308", emoji: "🟡" },
  dnd: { label: "Do Not Disturb", color: "#ef4444", emoji: "🔴" },
  "in-room": { label: "In a Room", color: "#a855f7", emoji: "🟣" },
  offline: { label: "Offline", color: "#64748b", emoji: "⚫" },
};

export const ROOM_THEMES = [
  { id: "gaming", emoji: "🎮", label: "Gaming Room" },
  { id: "movie", emoji: "🍿", label: "Movie Theater" },
  { id: "meeting", emoji: "🏢", label: "Meeting Room" },
  { id: "classroom", emoji: "📚", label: "Classroom" },
  { id: "cafe", emoji: "☕", label: "Café" },
  { id: "library", emoji: "📖", label: "Library" },
  { id: "art", emoji: "🎨", label: "Art Studio" },
  { id: "podcast", emoji: "🎙", label: "Podcast Studio" },
  { id: "space", emoji: "🌌", label: "Space Room" },
];

export const MOODS = [
  { emoji: "😊", text: "Feeling happy" },
  { emoji: "💻", text: "Working" },
  { emoji: "📚", text: "Studying" },
  { emoji: "☕", text: "Coffee break" },
  { emoji: "🎮", text: "Gaming" },
];

export const AVATAR_OPTIONS = {
  hairStyle: ["sleek", "waves", "curls", "buzz", "bun", "braids", "pixie", "long"] as HairStyle[],
  hairColor: ["#1c1917", "#44403c", "#92400e", "#b45309", "#ca8a04", "#dc2626", "#7c3aed", "#f8fafc"],
  face: ["soft", "sharp", "round", "long"] as FaceShape[],
  skin: ["#f6e0d0", "#f3c7a6", "#e0ac79", "#c68642", "#8d5524", "#5c3a21"],
  eyeShape: ["almond", "round", "hooded", "upturned", "wide"] as EyeShape[],
  eyeColor: ["#1e293b", "#0f766e", "#1d4ed8", "#713f12", "#4c1d95", "#334155"],
  clothing: ["blazer", "hoodie", "tee", "knit", "jacket", "dress"] as ClothingStyle[],
  clothingColor: ["#0f172a", "#1e3a5f", "#7c3aed", "#0d9488", "#be123c", "#f8fafc", "#fbbf24"],
  accessory: ["none", "watch", "necklace", "earrings", "scarf"] as Accessory[],
  hat: ["none", "cap", "beanie", "beret"] as HatStyle[],
  glasses: ["none", "round", "rect", "sun"] as GlassesStyle[],
};

export function makeAvatar(partial: Partial<AvatarConfig> = {}): AvatarConfig {
  return {
    hairStyle: "waves",
    hairColor: "#1c1917",
    face: "soft",
    skin: "#e0ac79",
    eyeShape: "almond",
    eyeColor: "#1e293b",
    clothing: "blazer",
    clothingColor: "#1e3a5f",
    accessory: "none",
    hat: "none",
    glasses: "none",
    ...partial,
  };
}

export const ME: User = {
  id: "me",
  username: "you",
  displayName: "You",
  bio: "Building rooms where work and play can share a seat.",
  mood: "💻 Working",
  presence: "available",
  color: "#7c3aed",
  joined: "Jul 2026",
  friends: ["Maya Chen", "Jordan Lee", "Sam Okonkwo", "Riley Park"],
  favoriteThemes: ["Café", "Library", "Art Studio"],
  avatar: makeAvatar({
    hairStyle: "waves",
    clothing: "blazer",
    clothingColor: "#7c3aed",
    accessory: "watch",
    eyeColor: "#0f766e",
  }),
};

const maya = makeAvatar({
  hairStyle: "braids",
  hairColor: "#1c1917",
  skin: "#8d5524",
  eyeShape: "round",
  eyeColor: "#713f12",
  clothing: "knit",
  clothingColor: "#be123c",
  accessory: "earrings",
  glasses: "round",
});

const jordan = makeAvatar({
  hairStyle: "buzz",
  hairColor: "#44403c",
  skin: "#f3c7a6",
  eyeShape: "hooded",
  clothing: "hoodie",
  clothingColor: "#0d9488",
  hat: "cap",
});

const sam = makeAvatar({
  hairStyle: "sleek",
  hairColor: "#1c1917",
  skin: "#5c3a21",
  eyeShape: "almond",
  eyeColor: "#1d4ed8",
  clothing: "jacket",
  clothingColor: "#0f172a",
  glasses: "rect",
});

const riley = makeAvatar({
  hairStyle: "pixie",
  hairColor: "#7c3aed",
  skin: "#f6e0d0",
  eyeShape: "upturned",
  eyeColor: "#4c1d95",
  clothing: "tee",
  clothingColor: "#fbbf24",
  accessory: "necklace",
});

export const CHATS: ChatPreview[] = [
  {
    id: "c1",
    name: "Maya Chen",
    kind: "dm",
    last: "Voice note · 0:12",
    time: "2m",
    unread: 2,
    color: "#fb7185",
    pinned: true,
    avatar: maya,
  },
  {
    id: "c2",
    name: "Design Crit Crew",
    kind: "group",
    last: "Poll: ship Friday?",
    time: "18m",
    unread: 5,
    color: "#22d3ee",
    avatar: makeAvatar({ hairStyle: "curls", clothingColor: "#22d3ee" }),
  },
  {
    id: "c3",
    name: "Jordan Lee",
    kind: "dm",
    last: "Sending the loom link",
    time: "1h",
    unread: 0,
    color: "#fbbf24",
    avatar: jordan,
  },
  {
    id: "c4",
    name: "Study Squad",
    kind: "group",
    last: "Room opens at 7",
    time: "3h",
    unread: 0,
    color: "#a78bfa",
    avatar: riley,
  },
];

export const MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    author: "Maya",
    text: "Can we jam on the Glitter rooms flow?",
    time: "4:02 PM",
  },
  {
    id: "m2",
    author: "You",
    mine: true,
    text: "Yes — I pinned the whiteboard notes.",
    time: "4:03 PM",
    replyTo: "Can we jam on the Glitter rooms flow?",
  },
  {
    id: "m3",
    author: "Maya",
    text: "Perfect. Sending a quick voice note 🎙",
    time: "4:04 PM",
    reaction: "✨",
  },
  {
    id: "m4",
    author: "You",
    mine: true,
    text: "Got it. Want a café room or library?",
    time: "4:05 PM",
  },
];

export const FEED: FeedPost[] = [
  {
    id: "f1",
    author: "Riley Park",
    handle: "@riley",
    color: "#a78bfa",
    kind: "progress",
    caption: "Shipped the invite-only room lobby. Seats feel so intentional.",
    likes: 128,
    comments: 14,
    liked: true,
    avatar: riley,
  },
  {
    id: "f2",
    author: "Sam Okonkwo",
    handle: "@samok",
    color: "#22d3ee",
    kind: "tutorial",
    caption: "60-second tip: pin messages before a meeting so nobody digs.",
    likes: 86,
    comments: 9,
    avatar: sam,
  },
  {
    id: "f3",
    author: "Jordan Lee",
    handle: "@jlee",
    color: "#fbbf24",
    kind: "art",
    caption: "Tonight’s space-room moodboard ✨",
    likes: 210,
    comments: 31,
    saved: true,
    avatar: jordan,
  },
  {
    id: "f4",
    author: "Maya Chen",
    handle: "@maya",
    color: "#fb7185",
    kind: "clip",
    caption: "Funny moment from our movie night room — no spoilers.",
    likes: 64,
    comments: 7,
    avatar: maya,
  },
];

export const STATUSES: StatusItem[] = [
  {
    id: "s1",
    user: "Maya Chen",
    emoji: "📚",
    text: "Studying",
    presence: "busy",
    expires: "24h",
    color: "#fb7185",
    avatar: maya,
  },
  {
    id: "s2",
    user: "Jordan Lee",
    emoji: "🎮",
    text: "Gaming",
    presence: "available",
    expires: "24h",
    color: "#fbbf24",
    avatar: jordan,
  },
  {
    id: "s3",
    user: "Sam Okonkwo",
    emoji: "💻",
    text: "Working",
    presence: "dnd",
    expires: "forever",
    color: "#22d3ee",
    avatar: sam,
  },
  {
    id: "s4",
    user: "Riley Park",
    emoji: "☕",
    text: "Coffee break",
    presence: "in-room",
    expires: "24h",
    color: "#a78bfa",
    avatar: riley,
  },
];

export const ROOMS: Room[] = [
  {
    id: "r1",
    name: "My Focus Lounge",
    theme: "cafe",
    emoji: "☕",
    kind: "personal",
    inviteOnly: true,
    seats: [
      { id: "1", user: "You", speaking: false, micOn: true, camOn: false, avatar: ME.avatar },
      { id: "2", user: "Maya", micOn: true, camOn: false, avatar: maya },
      { id: "3" },
      { id: "4" },
    ],
  },
  {
    id: "r2",
    name: "Creative Den",
    theme: "art",
    emoji: "🎨",
    kind: "personal",
    inviteOnly: true,
    seats: [
      { id: "1", user: "You", micOn: false, camOn: false, avatar: ME.avatar },
      { id: "2" },
      { id: "3" },
      { id: "4" },
    ],
  },
  {
    id: "r3",
    name: "Friday Design Jam",
    theme: "meeting",
    emoji: "🏢",
    kind: "meeting",
    inviteOnly: true,
    seats: [
      { id: "1", user: "You", speaking: true, micOn: true, camOn: true, avatar: ME.avatar },
      { id: "2", user: "Maya", micOn: true, camOn: false, avatar: maya },
      { id: "3", user: "Jordan", micOn: false, camOn: true, avatar: jordan },
      { id: "4", user: "Riley", micOn: true, camOn: true, avatar: riley },
      { id: "5" },
      { id: "6" },
    ],
  },
  {
    id: "r4",
    name: "One-time Study Sprint",
    theme: "library",
    emoji: "📖",
    kind: "meeting",
    inviteOnly: true,
    seats: [
      { id: "1", user: "Sam", micOn: false, camOn: false, avatar: sam },
      { id: "2", user: "Ava", micOn: false, camOn: true, avatar: makeAvatar({ hairStyle: "long", clothing: "dress", clothingColor: "#fda4af" }) },
      { id: "3" },
      { id: "4" },
      { id: "5" },
      { id: "6" },
    ],
  },
];

export const NOTIFS: Notif[] = [
  { id: "n1", kind: "room", text: "Maya invited you to Friday Design Jam", time: "2m", unread: true },
  { id: "n2", kind: "message", text: "Jordan sent a photo", time: "16m", unread: true },
  { id: "n3", kind: "social", text: "Riley liked your progress post", time: "1h" },
  { id: "n4", kind: "calendar", text: "Study session starts in 30 minutes", time: "2h", unread: true },
  { id: "n5", kind: "friend", text: "Sam accepted your friend request", time: "Yesterday" },
];

export const EVENTS: CalEvent[] = [
  { id: "e1", title: "Design Jam Room", when: "Today · 7:00 PM", type: "Meeting", rsvp: "yes" },
  { id: "e2", title: "Study session", when: "Tomorrow · 4:30 PM", type: "Study", rsvp: "maybe" },
  { id: "e3", title: "Movie night", when: "Sat · 8:00 PM", type: "Movie", rsvp: "none" },
  { id: "e4", title: "Maya’s birthday", when: "Aug 3", type: "Birthday", rsvp: "yes" },
];

export const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "foryou", label: "For You", icon: "🎥" },
  { id: "status", label: "Status", icon: "😊" },
  { id: "rooms", label: "Rooms", icon: "🏠" },
  { id: "notifications", label: "Alerts", icon: "🔔" },
  { id: "profile", label: "Profile", icon: "👤" },
];
