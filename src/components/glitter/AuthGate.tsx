"use client";

import { useState } from "react";
import { createUser, signIn, usernameTaken } from "@/data/auth";
import type { GlitterUser } from "@/data/types";

type Step = "welcome" | "signup" | "signin";

export function AuthGate({ onAuthed }: { onAuthed: (user: GlitterUser) => void }) {
  const [step, setStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  function submitSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = createUser({ email, password, username, displayName });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onAuthed(res.user);
  }

  function submitSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = signIn(email, password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    onAuthed(res.user);
  }

  return (
    <div className="app-shell flex min-h-[100svh] items-center justify-center px-4 py-10">
      <div className="panel w-full max-w-md p-7 sm:p-8">
        <p className="font-display text-3xl font-extrabold tracking-tight">
          <span className="iri-text">Glitter</span>
        </p>

        {step === "welcome" && (
          <div className="mt-8 space-y-3">
            <button type="button" className="btn btn-primary w-full" onClick={() => setStep("signup")}>
              Create account
            </button>
            <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("signin")}>
              Sign in
            </button>
          </div>
        )}

        {step === "signup" && (
          <form className="mt-6 space-y-3" onSubmit={submitSignup}>
            <Field label="Email" type="email" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />
            <Field
              label="Username"
              value={username}
              onChange={(v) => {
                setUsername(v.replace(/\s/g, "").toLowerCase());
                setChecking(true);
                window.setTimeout(() => setChecking(false), 120);
              }}
              required
              hint={
                username.length >= 3
                  ? usernameTaken(username)
                    ? "Taken"
                    : checking
                      ? "…"
                      : "Available"
                  : "Unique · 3–20 characters"
              }
              hintBad={username.length >= 3 && usernameTaken(username)}
            />
            <Field label="Display name" value={displayName} onChange={setDisplayName} />
            {error && <p className="text-sm font-semibold text-coral">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Continue
            </button>
            <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("welcome")}>
              Back
            </button>
          </form>
        )}

        {step === "signin" && (
          <form className="mt-6 space-y-3" onSubmit={submitSignIn}>
            <Field label="Email or username" value={email} onChange={setEmail} required />
            <Field label="Password" type="password" value={password} onChange={setPassword} required />
            {error && <p className="text-sm font-semibold text-coral">{error}</p>}
            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
            <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("welcome")}>
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
  hintBad,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
  hintBad?: boolean;
}) {
  return (
    <label className="block text-xs font-bold text-ink-faint">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-sm font-semibold text-ink outline-none focus:border-violet"
      />
      {hint && (
        <span className={`mt-1 block text-[0.7rem] font-semibold ${hintBad ? "text-coral" : "text-ink-faint"}`}>
          {hint}
        </span>
      )}
    </label>
  );
}
