"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { OAuthProvider } from "@/data/auth";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c6.9 0 8.5-4.8 8.5-7.3 0-.5 0-.9-.1-1.3H12z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.7.7 1.1 1.6 1.1 2.7 0 4-2.3 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z" />
    </svg>
  );
}

export function OAuthButtons({
  onError,
}: {
  onError?: (message: string) => void;
}) {
  const { signInWithOAuth, oauthConfigured } = useAuth();
  const [busy, setBusy] = useState<OAuthProvider | null>(null);

  async function handle(provider: "google" | "github") {
    if (!oauthConfigured[provider]) {
      onError?.(
        provider === "google"
          ? "Google sign-in isn’t set up yet. Add AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET in Vercel env, then redeploy."
          : "GitHub sign-in isn’t set up yet. Add AUTH_GITHUB_ID and AUTH_GITHUB_SECRET in Vercel env, then redeploy.",
      );
      return;
    }
    setBusy(provider);
    onError?.("");
    const res = await signInWithOAuth(provider);
    if (!res.ok) {
      onError?.(res.error);
      setBusy(null);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => handle("google")}
        className="flex w-full items-center justify-center gap-2.5 border border-line bg-surface py-3 text-sm font-semibold disabled:opacity-60"
      >
        <GoogleIcon />
        {busy === "google" ? "Opening Google…" : "Continue with Google"}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => handle("github")}
        className="flex w-full items-center justify-center gap-2.5 border border-line bg-surface py-3 text-sm font-semibold disabled:opacity-60"
      >
        <GitHubIcon />
        {busy === "github" ? "Opening GitHub…" : "Continue with GitHub"}
      </button>
    </div>
  );
}
