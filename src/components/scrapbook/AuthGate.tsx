"use client";

import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { useAuth } from "@/context/AuthContext";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const {
    ready,
    session,
    signIn,
    signUp,
    continueAsGuest,
    requestPasswordReset,
    resetPasswordWithCode,
    mailbox,
    refreshMailbox,
  } = useAuth();
  const [mode, setMode] = useState<
    "welcome" | "signin" | "signup" | "forgot" | "reset" | "inbox"
  >("welcome");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

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

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    const res = await requestPasswordReset(email);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setInfo("If that email has an account, a reset code was sent to your inbox.");
    setMode("reset");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await resetPasswordWithCode({ email, code, password });
    setBusy(false);
    if (!res.ok) setError(res.error);
  }

  return (
    <div className="room flex min-h-[100svh] items-center justify-center px-5 py-10">
      <div className="w-full max-w-md animate-pop soft-card p-7 sm:p-9">
        <BrandMark size="sm" interactive={false} />
        <h1 className="mt-8 font-display text-3xl tracking-tight">
          {mode === "welcome" && "Your private bookshelf"}
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "forgot" && "Forgot password"}
          {mode === "reset" && "Enter reset code"}
          {mode === "inbox" && "Your inbox"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {mode === "welcome" &&
            "Your projects live as books on a private shelf. Sign in with email to keep them, or browse as a guest."}
          {mode === "signin" && "Sign in to open your saved shelf."}
          {mode === "signup" && "A fresh shelf starts with your account. Only you see your books."}
          {mode === "forgot" && "We will send a reset code to your email inbox."}
          {mode === "reset" && "Enter the code from your email, then choose a new password."}
          {mode === "inbox" && "Messages delivered to this device (including reset codes)."}
        </p>

        {mode === "welcome" && (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface"
            >
              Sign up with email
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className="w-full border border-line bg-butter py-3 text-sm font-semibold text-ink"
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
          <form className="mt-6 space-y-3" onSubmit={handleSignIn}>
            <label className="block text-sm font-semibold">
              Email
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            {error && <p className="text-sm text-burgundy">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("forgot");
                setError("");
                setInfo("");
              }}
              className="w-full text-sm font-semibold text-plum"
            >
              Forgot password?
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
        )}

        {mode === "signup" && (
          <form className="mt-6 space-y-3" onSubmit={handleSignUp}>
            <label className="block text-sm font-semibold">
              Name
              <input
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
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
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            {error && <p className="text-sm text-burgundy">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface disabled:opacity-60"
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
        )}

        {mode === "forgot" && (
          <form className="mt-6 space-y-3" onSubmit={handleForgot}>
            <label className="block text-sm font-semibold">
              Email
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            {error && <p className="text-sm text-burgundy">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send reset code"}
            </button>
            <button
              type="button"
              onClick={() => {
                refreshMailbox();
                setMode("inbox");
              }}
              className="w-full text-sm font-semibold text-plum"
            >
              Open inbox
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className="w-full text-sm font-semibold text-ink-faint"
            >
              Back
            </button>
          </form>
        )}

        {mode === "reset" && (
          <form className="mt-6 space-y-3" onSubmit={handleReset}>
            {info && <p className="text-sm text-plum">{info}</p>}
            <label className="block text-sm font-semibold">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            <label className="block text-sm font-semibold">
              Code from email
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 font-mono tracking-[0.3em] outline-none focus:border-plum"
              />
            </label>
            <label className="block text-sm font-semibold">
              New password
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-plum"
              />
            </label>
            {error && <p className="text-sm text-burgundy">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface disabled:opacity-60"
            >
              {busy ? "Saving…" : "Reset password"}
            </button>
            <button
              type="button"
              onClick={() => {
                refreshMailbox();
                setMode("inbox");
              }}
              className="w-full text-sm font-semibold text-plum"
            >
              Open inbox
            </button>
          </form>
        )}

        {mode === "inbox" && (
          <div className="mt-6 space-y-3">
            {mailbox.length === 0 && (
              <p className="text-sm text-ink-faint">No messages yet.</p>
            )}
            {mailbox.map((m) => (
              <div key={m.id} className="border border-line bg-paper p-3">
                <p className="text-xs font-semibold text-ink-faint">To {m.to}</p>
                <p className="mt-1 text-sm font-semibold">{m.subject}</p>
                <p className="mt-1 text-sm text-ink-soft">{m.body}</p>
                {m.code && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold text-plum"
                    onClick={() => {
                      setCode(m.code || "");
                      setEmail(m.to);
                      setMode("reset");
                    }}
                  >
                    Use this code
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMode("reset")}
              className="w-full bg-plum py-3 text-sm font-semibold text-surface"
            >
              Enter code
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className="w-full text-sm font-semibold text-ink-faint"
            >
              Back to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
