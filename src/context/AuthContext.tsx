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
  AUTH_MAILBOX_KEY,
  AUTH_RESET_KEY,
  AUTH_SESSION_KEY,
  AUTH_USERS_KEY,
  type AuthSession,
  type AuthUser,
  type MailMessage,
  type ResetChallenge,
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

function readMailbox(): MailMessage[] {
  try {
    const raw = localStorage.getItem(AUTH_MAILBOX_KEY);
    return raw ? (JSON.parse(raw) as MailMessage[]) : [];
  } catch {
    return [];
  }
}

function writeMailbox(mail: MailMessage[]) {
  localStorage.setItem(AUTH_MAILBOX_KEY, JSON.stringify(mail));
}

function writeReset(challenge: ResetChallenge | null) {
  if (!challenge) localStorage.removeItem(AUTH_RESET_KEY);
  else localStorage.setItem(AUTH_RESET_KEY, JSON.stringify(challenge));
}

function readReset(): ResetChallenge | null {
  try {
    const raw = localStorage.getItem(AUTH_RESET_KEY);
    return raw ? (JSON.parse(raw) as ResetChallenge) : null;
  } catch {
    return null;
  }
}

type AuthCtx = {
  ready: boolean;
  session: AuthSession | null;
  isGuest: boolean;
  isSignedIn: boolean;
  canUseGroups: boolean;
  mailbox: MailMessage[];
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  requestPasswordReset: (
    email: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  resetPasswordWithCode: (input: {
    email: string;
    code: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  refreshMailbox: () => void;
  continueAsGuest: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mailbox, setMailbox] = useState<MailMessage[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) setSession(JSON.parse(raw) as AuthSession);
      setMailbox(readMailbox());
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

  const refreshMailbox = useCallback(() => {
    setMailbox(readMailbox());
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const name = input.name.trim();
      if (!name || !email || input.password.length < 4) {
        return {
          ok: false as const,
          error: "Name, email, and a password (4+ characters) are required.",
        };
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
        provider: "email",
      });
      return { ok: true as const };
    },
    [],
  );

  const signIn = useCallback(async (input: { email: string; password: string }) => {
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
      provider: "email",
    });
    return { ok: true as const };
  }, []);

  const requestPasswordReset = useCallback(async (emailRaw: string) => {
    const email = emailRaw.trim().toLowerCase();
    if (!email) return { ok: false as const, error: "Enter your email." };
    const users = readUsers();
    const user = users.find((u) => u.email === email);
    // Always look successful to avoid account enumeration, but only mail if user exists.
    const code = String(Math.floor(100000 + Math.random() * 900000));
    if (user) {
      writeReset({ email, code, expiresAt: Date.now() + 1000 * 60 * 15 });
      const mail: MailMessage = {
        id: makeId("mail"),
        to: email,
        subject: "Brainstorm password reset code",
        body: `Your reset code is ${code}. It expires in 15 minutes.`,
        code,
        createdAt: new Date().toISOString(),
        read: false,
      };
      const box = [mail, ...readMailbox()].slice(0, 20);
      writeMailbox(box);
      setMailbox(box);
    }
    return { ok: true as const };
  }, []);

  const resetPasswordWithCode = useCallback(
    async (input: { email: string; code: string; password: string }) => {
      const email = input.email.trim().toLowerCase();
      const challenge = readReset();
      if (!challenge || challenge.email !== email) {
        return { ok: false as const, error: "No reset request found for that email." };
      }
      if (Date.now() > challenge.expiresAt) {
        writeReset(null);
        return { ok: false as const, error: "That code has expired. Request a new one." };
      }
      if (challenge.code !== input.code.trim()) {
        return { ok: false as const, error: "Incorrect code." };
      }
      if (input.password.length < 4) {
        return { ok: false as const, error: "Password must be at least 4 characters." };
      }
      const users = readUsers();
      const idx = users.findIndex((u) => u.email === email);
      if (idx < 0) return { ok: false as const, error: "Account not found." };
      const salt = makeId("salt");
      const passwordHash = await sha256Hex(`${salt}:${input.password}`);
      const next = [...users];
      next[idx] = { ...next[idx], salt, passwordHash };
      writeUsers(next);
      writeReset(null);
      setSession({
        userId: next[idx].id,
        name: next[idx].name,
        email: next[idx].email,
        mode: "signed-in",
        provider: "email",
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
      mailbox,
      signUp,
      signIn,
      requestPasswordReset,
      resetPasswordWithCode,
      refreshMailbox,
      continueAsGuest,
      signOut,
    }),
    [
      ready,
      session,
      isGuest,
      isSignedIn,
      canUseGroups,
      mailbox,
      signUp,
      signIn,
      requestPasswordReset,
      resetPasswordWithCode,
      refreshMailbox,
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
