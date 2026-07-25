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
import { signIn as oauthSignIn, signOut as oauthSignOut, useSession } from "next-auth/react";
import {
  AUTH_SESSION_KEY,
  AUTH_USERS_KEY,
  type AuthSession,
  type AuthUser,
  type OAuthProvider,
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
  oauthConfigured: { google: boolean; github: boolean };
  signUp: (input: {
    name: string;
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (input: {
    email: string;
    password: string;
  }) => Promise<{ ok: true } | { ok: false; error: string }>;
  signInWithOAuth: (
    provider: OAuthProvider,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: oauthSession, status: oauthStatus } = useSession();
  const [localReady, setLocalReady] = useState(false);
  const [localSession, setLocalSession] = useState<AuthSession | null>(null);
  const [oauthConfigured, setOauthConfigured] = useState({
    google: false,
    github: false,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_SESSION_KEY);
      if (raw) setLocalSession(JSON.parse(raw) as AuthSession);
    } catch {
      /* none */
    }
    setLocalReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((providers: Record<string, unknown>) => {
        if (cancelled) return;
        setOauthConfigured({
          google: Boolean(providers.google),
          github: Boolean(providers.github),
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const oauthUser = oauthSession?.user;
  const session: AuthSession | null = useMemo(() => {
    if (oauthStatus === "authenticated" && oauthUser?.id) {
      return {
        userId: oauthUser.id,
        name: oauthUser.name?.trim() || "Signed-in user",
        email: oauthUser.email ?? undefined,
        mode: "signed-in",
        provider: (oauthUser.provider as OAuthProvider | undefined) ?? "oauth",
      };
    }
    return localSession;
  }, [oauthStatus, oauthUser, localSession]);

  useEffect(() => {
    if (!localReady || oauthStatus === "loading") return;
    // Persist only local/guest sessions; OAuth is cookie-backed.
    if (oauthStatus === "authenticated") {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return;
    }
    if (localSession) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(localSession));
    else localStorage.removeItem(AUTH_SESSION_KEY);
  }, [localSession, localReady, oauthStatus]);

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
      setLocalSession({
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
    setLocalSession({
      userId: user.id,
      name: user.name,
      email: user.email,
      mode: "signed-in",
      provider: "email",
    });
    return { ok: true as const };
  }, []);

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    if (provider !== "google" && provider !== "github") {
      return { ok: false as const, error: "Unsupported sign-in provider." };
    }
    try {
      await oauthSignIn(provider, { callbackUrl: "/" });
      return { ok: true as const };
    } catch {
      return {
        ok: false as const,
        error: "Could not start sign-in. Check that Google/GitHub login is configured.",
      };
    }
  }, []);

  const continueAsGuest = useCallback(() => {
    setLocalSession({
      userId: "guest",
      name: "Guest",
      mode: "guest",
    });
  }, []);

  const signOut = useCallback(async () => {
    setLocalSession(null);
    localStorage.removeItem(AUTH_SESSION_KEY);
    if (oauthStatus === "authenticated") {
      await oauthSignOut({ callbackUrl: "/", redirect: true });
    }
  }, [oauthStatus]);

  const ready = localReady && oauthStatus !== "loading";
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
      oauthConfigured,
      signUp,
      signIn,
      signInWithOAuth,
      continueAsGuest,
      signOut,
    }),
    [
      ready,
      session,
      isGuest,
      isSignedIn,
      canUseGroups,
      oauthConfigured,
      signUp,
      signIn,
      signInWithOAuth,
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
