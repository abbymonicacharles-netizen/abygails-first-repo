export type TabId =
  | "messages"
  | "foryou"
  | "status"
  | "rooms"
  | "notifications"
  | "profile";

export type Presence = "available" | "busy" | "dnd" | "in-room" | "offline";

export type ThemeMode = "light" | "dark" | "hc";

export interface AvatarConfig {
  hair: string;
  face: string;
  skin: string;
  eyes: string;
  clothing: string;
  accessory: string;
  hat: string;
  glasses: string;
  pose: string;
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
}

export interface StatusItem {
  id: string;
  user: string;
  emoji: string;
  text: string;
  presence: Presence;
  expires: "24h" | "forever";
  color: string;
}

export interface RoomSeat {
  id: string;
  user?: string;
  color?: string;
  speaking?: boolean;
  micOn?: boolean;
  camOn?: boolean;
}

export interface Room {
  id: string;
  name: string;
  theme: string;
  emoji: string;
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
  hair: ["Sleek", "Waves", "Curls", "Buzz", "Bun", "Braids"],
  face: ["Soft", "Sharp", "Round", "Long"],
  skin: ["#f6d7c3", "#e0ac79", "#c68642", "#8d5524", "#5c3a21"],
  eyes: ["Warm", "Cool", "Bright", "Soft"],
  clothing: ["Blazer", "Hoodie", "Tee", "Knit", "Jacket"],
  accessory: ["None", "Watch", "Necklace", "Earrings"],
  hat: ["None", "Cap", "Beanie", "Beret"],
  glasses: ["None", "Round", "Rect", "Sun"],
  pose: ["Relaxed", "Lean", "Crossed", "Wave"],
};

export const ME: User = {
  id: "me",
  username: "you",
  displayName: "You",
  bio: "Building rooms where work and play can share a seat.",
  mood: "💻 Working",
  presence: "available",
  color: "#0d9488",
  joined: "Jul 2026",
  friends: ["Maya Chen", "Jordan Lee", "Sam Okonkwo", "Riley Park"],
  favoriteThemes: ["Café", "Library", "Art Studio"],
  avatar: {
    hair: "Waves",
    face: "Soft",
    skin: "#e0ac79",
    eyes: "Warm",
    clothing: "Blazer",
    accessory: "Watch",
    hat: "None",
    glasses: "None",
    pose: "Relaxed",
  },
};

export const CHATS: ChatPreview[] = [
  {
    id: "c1",
    name: "Maya Chen",
    kind: "dm",
    last: "Voice note · 0:12",
    time: "2m",
    unread: 2,
    color: "#f9736a",
    pinned: true,
  },
  {
    id: "c2",
    name: "Design Crit Crew",
    kind: "group",
    last: "Poll: ship Friday?",
    time: "18m",
    unread: 5,
    color: "#0d9488",
  },
  {
    id: "c3",
    name: "Jordan Lee",
    kind: "dm",
    last: "Sending the loom link",
    time: "1h",
    unread: 0,
    color: "#e8b84a",
  },
  {
    id: "c4",
    name: "Study Squad",
    kind: "group",
    last: "Room opens at 7",
    time: "3h",
    unread: 0,
    color: "#6366f1",
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
    color: "#6366f1",
    kind: "progress",
    caption: "Shipped the invite-only room lobby. Seats feel so intentional.",
    likes: 128,
    comments: 14,
    liked: true,
  },
  {
    id: "f2",
    author: "Sam Okonkwo",
    handle: "@samok",
    color: "#f9736a",
    kind: "tutorial",
    caption: "60-second tip: pin messages before a meeting so nobody digs.",
    likes: 86,
    comments: 9,
  },
  {
    id: "f3",
    author: "Jordan Lee",
    handle: "@jlee",
    color: "#e8b84a",
    kind: "art",
    caption: "Tonight’s space-room moodboard ✨",
    likes: 210,
    comments: 31,
    saved: true,
  },
  {
    id: "f4",
    author: "Maya Chen",
    handle: "@maya",
    color: "#0d9488",
    kind: "clip",
    caption: "Funny moment from our movie night room — no spoilers.",
    likes: 64,
    comments: 7,
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
    color: "#f9736a",
  },
  {
    id: "s2",
    user: "Jordan Lee",
    emoji: "🎮",
    text: "Gaming",
    presence: "available",
    expires: "24h",
    color: "#e8b84a",
  },
  {
    id: "s3",
    user: "Sam Okonkwo",
    emoji: "💻",
    text: "Working",
    presence: "dnd",
    expires: "forever",
    color: "#0d9488",
  },
  {
    id: "s4",
    user: "Riley Park",
    emoji: "☕",
    text: "Coffee break",
    presence: "in-room",
    expires: "24h",
    color: "#6366f1",
  },
];

export const ROOMS: Room[] = [
  {
    id: "r1",
    name: "Friday Design Jam",
    theme: "art",
    emoji: "🎨",
    inviteOnly: true,
    seats: [
      { id: "1", user: "You", color: "#0d9488", speaking: true, micOn: true, camOn: true },
      { id: "2", user: "Maya", color: "#f9736a", micOn: true, camOn: false },
      { id: "3", user: "Jordan", color: "#e8b84a", micOn: false, camOn: true },
      { id: "4" },
      { id: "5" },
      { id: "6", user: "Riley", color: "#6366f1", micOn: true, camOn: true, speaking: false },
      { id: "7" },
      { id: "8" },
    ],
  },
  {
    id: "r2",
    name: "Quiet Library Sprint",
    theme: "library",
    emoji: "📖",
    inviteOnly: true,
    seats: [
      { id: "1", user: "Sam", color: "#0d9488", micOn: false, camOn: false },
      { id: "2", user: "Ava", color: "#f9736a", micOn: false, camOn: true },
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
