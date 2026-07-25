"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBookshelf } from "@/context/BookshelfContext";

export function BrandMark({
  size = "md",
  onOpenSettings,
  interactive = true,
}: {
  size?: "sm" | "md";
  onOpenSettings?: () => void;
  /** When false, logo is display-only (auth gate). */
  interactive?: boolean;
}) {
  const wh = size === "sm" ? 32 : 40;
  const { session, isGuest, signOut } = useAuth();
  const { settings, setSettings } = useBookshelf();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shownName = settings.displayName.trim() || session?.name || "You";

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const mark = (
    <>
      {settings.profileImage && interactive ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={settings.profileImage}
          alt=""
          width={wh}
          height={wh}
          className="rounded-xl object-cover"
          style={{ width: wh, height: wh }}
        />
      ) : (
        <Image
          src="/brainstorm-logo.png"
          alt="Brainstorm"
          width={wh}
          height={wh}
          className="rounded-xl"
          priority
        />
      )}
      <span className="font-display text-xl font-bold tracking-tight">Brainstorm</span>
    </>
  );

  if (!interactive) {
    return <div className="inline-flex items-center gap-2.5 text-ink">{mark}</div>;
  }

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2.5 text-ink"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {mark}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-40 mt-2 w-72 animate-pop border border-line bg-surface p-3 shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-line pb-3">
            {settings.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.profileImage}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <Image
                src="/brainstorm-logo.png"
                alt=""
                width={48}
                height={48}
                className="rounded-xl"
              />
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-lg">{shownName}</p>
              <p className="text-xs text-ink-faint">
                {isGuest ? "Guest" : session?.email || "Signed in"}
              </p>
            </div>
          </div>

          <label className="mt-3 block text-xs font-semibold">
            Visible name
            <input
              value={settings.displayName}
              placeholder={session?.name || "Your name"}
              onChange={(e) => setSettings({ displayName: e.target.value })}
              className="mt-1 w-full border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-forest"
            />
          </label>

          <label className="mt-3 block text-xs font-semibold">
            Profile picture
            <input
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  if (typeof reader.result === "string") {
                    setSettings({ profileImage: reader.result });
                  }
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {settings.profileImage && (
            <button
              type="button"
              className="mt-1 text-xs font-semibold text-ink-faint underline"
              onClick={() => setSettings({ profileImage: "" })}
            >
              Remove photo
            </button>
          )}

          <div className="mt-3 space-y-1 border-t border-line pt-2">
            <button
              type="button"
              role="menuitem"
              className="block w-full px-2 py-2 text-left text-sm font-semibold hover:bg-paper"
              onClick={() => {
                setOpen(false);
                onOpenSettings?.();
              }}
            >
              Settings
            </button>
            <button
              type="button"
              role="menuitem"
              className="block w-full px-2 py-2 text-left text-sm font-semibold text-burgundy hover:bg-paper"
              onClick={() => {
                setOpen(false);
                void signOut();
              }}
            >
              {isGuest ? "Sign in" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
