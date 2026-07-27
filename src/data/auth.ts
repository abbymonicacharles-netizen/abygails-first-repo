import type { GlitterUser } from "./types";
import { STORAGE_SESSION, STORAGE_USERS, makeAvatar } from "./types";

function readUsers(): GlitterUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]") as GlitterUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: GlitterUser[]) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

export function getSessionUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_SESSION);
}

export function setSession(username: string | null) {
  if (!username) localStorage.removeItem(STORAGE_SESSION);
  else localStorage.setItem(STORAGE_SESSION, username);
}

export function getUser(username: string): GlitterUser | undefined {
  return readUsers().find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function getUserByEmail(email: string): GlitterUser | undefined {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function usernameTaken(username: string, except?: string) {
  const hit = getUser(username);
  if (!hit) return false;
  if (except && hit.username.toLowerCase() === except.toLowerCase()) return false;
  return true;
}

export function createUser(input: {
  email: string;
  password: string;
  username: string;
  displayName: string;
}): { ok: true; user: GlitterUser } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim().replace(/^@/, "").toLowerCase();
  if (!email.includes("@")) return { ok: false, error: "Enter a valid email." };
  if (input.password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    return { ok: false, error: "Username: 3–20 chars, letters, numbers, underscore." };
  }
  if (usernameTaken(username)) return { ok: false, error: "That username is taken." };
  if (getUserByEmail(email)) return { ok: false, error: "An account with that email exists." };

  const user: GlitterUser = {
    id: `u-${Date.now().toString(36)}`,
    email,
    password: input.password,
    username,
    displayName: input.displayName.trim() || username,
    bio: "",
    mood: "Focused",
    presence: "available",
    avatar: makeAvatar(),
    friends: [],
    friendRequestsIn: [],
    friendRequestsOut: [],
    nicknames: {},
    groupAddPolicy: "friends",
    contactsLinked: false,
    joined: new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
  };
  const users = readUsers();
  users.push(user);
  writeUsers(users);
  setSession(user.username);
  return { ok: true, user };
}

export function signIn(
  emailOrUser: string,
  password: string,
): { ok: true; user: GlitterUser } | { ok: false; error: string } {
  const key = emailOrUser.trim().toLowerCase();
  const user =
    getUserByEmail(key) || getUser(key.replace(/^@/, ""));
  if (!user || user.password !== password) return { ok: false, error: "Incorrect email/username or password." };
  setSession(user.username);
  return { ok: true, user };
}

export function updateUser(username: string, patch: Partial<GlitterUser>) {
  const users = readUsers();
  const i = users.findIndex((u) => u.username.toLowerCase() === username.toLowerCase());
  if (i < 0) return null;
  users[i] = { ...users[i], ...patch, username: users[i].username, email: users[i].email };
  writeUsers(users);
  return users[i];
}

export function sendFriendRequest(from: string, toUsername: string) {
  const to = toUsername.trim().replace(/^@/, "").toLowerCase();
  if (to === from.toLowerCase()) return { ok: false as const, error: "That’s you." };
  const target = getUser(to);
  if (!target) return { ok: false as const, error: "No user with that username." };
  if (target.friends.some((f) => f.toLowerCase() === from.toLowerCase())) {
    return { ok: false as const, error: "Already friends." };
  }
  const me = getUser(from);
  if (!me) return { ok: false as const, error: "Not signed in." };
  if (me.friendRequestsOut.includes(target.username)) {
    return { ok: false as const, error: "Request already sent." };
  }
  updateUser(me.username, {
    friendRequestsOut: [...me.friendRequestsOut, target.username],
  });
  updateUser(target.username, {
    friendRequestsIn: [...target.friendRequestsIn, me.username],
  });
  return { ok: true as const };
}

export function acceptFriend(meUsername: string, fromUsername: string) {
  const me = getUser(meUsername);
  const other = getUser(fromUsername);
  if (!me || !other) return;
  updateUser(me.username, {
    friends: Array.from(new Set([...me.friends, other.username])),
    friendRequestsIn: me.friendRequestsIn.filter((u) => u !== other.username),
  });
  updateUser(other.username, {
    friends: Array.from(new Set([...other.friends, me.username])),
    friendRequestsOut: other.friendRequestsOut.filter((u) => u !== me.username),
  });
}

export function displayNameFor(viewer: GlitterUser, username: string) {
  if (viewer.nicknames[username]) return viewer.nicknames[username];
  const u = getUser(username);
  return u?.displayName || username;
}
