"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { OAuthButtons } from "./OAuthButtons";
import { useAuth } from "@/context/AuthContext";

function authErrorMessage(code: string | null) {
  if (!code) return "";
  if (code === "Configuration") {
    return "Sign-in isn’t configured yet. Add Google/GitHub keys in Vercel environment variables.";
  }
  if (code === "OAuthAccountNotLinked") {
    return "That email is already linked to another sign-in method.";
  }
  if (code === "AccessDenied") return "Access was denied. Try again.";
  return "Sign-in failed. Please try again.";
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, session, signIn, signUp, continueAsGuest } = useAuth();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"welcome" | "signin" | "signup">("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setError(authErrorMessage(err));
  }, [searchParams]);

  if (!ready) return <div className="room min-h-[100svh]" />;
  if (session) return <>{children}</>;

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signIn({ email, password });
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await signUp({ name, email, password });
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="room flex min-h-[100svh] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md animate-pop soft-card p-7 sm:p-9">
        <BrandMark size="sm" />
        <h1 className="mt-8 font-display text-3xl tracking-tight">
          {mode === "welcome" && "Your private bookshelf"}
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {mode === "welcome" &&
            "Sign in with Google or GitHub so your books stay personal. Guests can explore solo books, but group projects stay locked."}
          {mode === "signin" && "Sign in to open your saved shelf."}
          {mode === "signup" && "A fresh shelf starts with your account — only you see your books."}
        </p>

        {mode === "welcome" && (
          <div className="mt-8 space-y-4">
            <OAuthButtons onError={setError} />
            {error && <p className="text-sm text-burgundy">{error}</p>}
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              or
              <span className="h-px flex-1 bg-line" />
            </div>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className="w-full bg-forest py-3 text-sm font-semibold text-surface"
            >
              Sign up with email
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className="w-full border border-line bg-surface py-3 text-sm font-semibold"
            >
              Sign in with email
            </button>
            <button
              type="button"
              onClick={continueAsGuest}
              className="w-full py-2 text-sm font-semibold text-ink-faint underline-offset-4 hover:underline"
            >
              Continue as guest
            </button>
            <p className="text-center text-xs text-ink-faint">
              Guest mode: no join codes, invites, or subgroups.
            </p>
          </div>
        )}

        {mode === "signin" && (
          <div className="mt-6 space-y-4">
            <OAuthButtons onError={setError} />
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              or email
              <span className="h-px flex-1 bg-line" />
            </div>
            <form className="space-y-3" onSubmit={handleSignIn}>
              <label className="block text-sm font-semibold">
                Email
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
                />
              </label>
              <label className="block text-sm font-semibold">
                Password
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
                />
              </label>
              {error && <p className="text-sm text-burgundy">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-forest py-3 text-sm font-semibold text-surface disabled:opacity-60"
              >
                {busy ? "Signing in…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("welcome");
                  setError("");
                }}
                className="w-full text-sm font-semibold text-ink-faint"
              >
                Back
              </button>
            </form>
          </div>
        )}

        {mode === "signup" && (
          <div className="mt-6 space-y-4">
            <OAuthButtons onError={setError} />
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              <span className="h-px flex-1 bg-line" />
              or email
              <span className="h-px flex-1 bg-line" />
            </div>
            <form className="space-y-3" onSubmit={handleSignUp}>
              <label className="block text-sm font-semibold">
                Name
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
                />
              </label>
              <label className="block text-sm font-semibold">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
                />
              </label>
              <label className="block text-sm font-semibold">
                Password
                <input
                  type="password"
                  required
                  minLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
                />
              </label>
              {error && <p className="text-sm text-burgundy">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="w-full bg-forest py-3 text-sm font-semibold text-surface disabled:opacity-60"
              >
                {busy ? "Creating…" : "Create account"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("welcome");
                  setError("");
                }}
                className="w-full text-sm font-semibold text-ink-faint"
              >
                Back
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
