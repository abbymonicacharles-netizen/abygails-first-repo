"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTH_SESSION_KEY,
  AUTH_USERS_KEY,
  type AuthSession,
  type AuthUser,
} from "@/data/auth";
import { makeId } from "@/data/factory";

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function readUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? (JSON.parse(raw) as AuthUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: AuthUser[]) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

type AuthCtx = {
  ready: boolean;
  session: AuthSession | null;
  isGuest: boolean;
  isSignedIn: boolean;
  canUseGroups: boolean;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  continueAsGuest: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as AuthSession);
    } catch {
      /* none */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (session) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(AUTH_SESSION_KEY);
  }, [session, ready]);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const name = input.name.trim();
      if (!name || !email || input.password.length < 4) {
        return { ok: false as const, error: "Name, email, and a password (4+ characters) are required." };
      }
      const users = readUsers();
      if (users.some((u) => u.email === email)) {
        return { ok: false as const, error: "An account with that email already exists." };
      }
      const salt = makeId("salt");
      const passwordHash = await sha256Hex(`${salt}:${input.password}`);
      const user: AuthUser = {
        id: makeId("user"),
        name,
        email,
        passwordHash,
        salt,
        createdAt: new Date().toISOString(),
      };
      writeUsers([...users, user]);
      setSession({
        userId: user.id,
        name: user.name,
        email: user.email,
        mode: "signed-in",
      });
      return { ok: true as const };
    },
    [],
  );

  const signIn = useCallback(
    async (input: { email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const users = readUsers();
      const user = users.find((u) => u.email === email);
      if (!user) return { ok: false as const, error: "No account found for that email." };
      const passwordHash = await sha256Hex(`${user.salt}:${input.password}`);
      if (passwordHash !== user.passwordHash) {
        return { ok: false as const, error: "Incorrect password." };
      }
      setSession({
        userId: user.id,
        name: user.name,
        email: user.email,
        mode: "signed-in",
      });
      return { ok: true as const };
    },
    [],
  );

  const continueAsGuest = useCallback(() => {
    setSession({
      userId: "guest",
      name: "Guest",
      mode: "guest",
    });
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
  }, []);

  const isGuest = session?.mode === "guest";
  const isSignedIn = session?.mode === "signed-in";
  const canUseGroups = isSignedIn;

  const value = useMemo(
    () => ({
      ready,
      session,
      isGuest,
      isSignedIn,
      canUseGroups,
      signUp,
      signIn,
      continueAsGuest,
      signOut,
    }),
    [
      ready,
      session,
      isGuest,
      isSignedIn,
      canUseGroups,
      signUp,
      signIn,
      continueAsGuest,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth required");
  return ctx;
}
