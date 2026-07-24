"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { DecorateBook } from "./DecorateBook";
import { CelebrateOverlay } from "./CelebrateOverlay";
import { useBookshelf } from "@/context/BookshelfContext";
import { bookProgress } from "@/data/factory";
import type { ProjectBook } from "@/data/types";

export function BookshelfHome() {
  const { books, createProject, ready, settings, setSettings, joinWithCode } = useBookshelf();
  const router = useRouter();
  const [decorate, setDecorate] = useState<ProjectBook | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="room relative min-h-[100svh]">
      <CelebrateOverlay />
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <BrandMark size="sm" />
          <div className="flex flex-wrap gap-2">
            <select
              value={settings.seasonalTheme}
              onChange={(e) =>
                setSettings({
                  seasonalTheme: e.target.value as typeof settings.seasonalTheme,
                })
              }
              className="rounded-2xl border border-line bg-surface px-3 py-2 text-sm font-bold"
              aria-label="Season theme"
            >
              <option value="cozy">Cozy</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
            <button
              type="button"
              onClick={() => setJoinOpen(true)}
              className="rounded-2xl border border-line bg-surface px-4 py-2 text-sm font-bold"
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => {
                const id = createProject("New project");
                router.push(`/book/${id}`);
              }}
              className="rounded-2xl bg-sage px-4 py-2 text-sm font-bold text-white"
            >
              New book
            </button>
          </div>
        </header>

        <div className="mt-16 flex min-h-[14rem] items-end justify-center gap-3 px-2 sm:gap-4">
          {ready && books.length === 0 && (
            <p className="mb-12 font-display text-lg font-semibold text-ink-faint">
              Your shelf is empty — add a book
            </p>
          )}
          {books.map((book) => {
            const fill = bookProgress(book);
            return (
              <div key={book.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => router.push(`/book/${book.id}`)}
                  className="book-spine relative h-48 w-11 overflow-hidden rounded-md sm:h-56 sm:w-12"
                  style={{ backgroundColor: book.style.spineColor }}
                  aria-label={book.title}
                >
                  <span
                    className="absolute inset-y-0 right-0 w-[3px] bg-white/20"
                    aria-hidden
                  />
                  {book.locked && (
                    <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[0.65rem] text-white/90">
                      🔒
                    </span>
                  )}
                  <span
                    className="absolute inset-x-0 bottom-3 top-10 flex items-end justify-center"
                    style={{ color: book.style.textColor }}
                  >
                    <span
                      className="max-h-full overflow-hidden font-display text-[0.7rem] font-bold tracking-wide"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {book.style.icon} {book.title}
                    </span>
                  </span>
                  {/* fill as book “fills up” */}
                  <span
                    className="absolute bottom-0 left-0 right-0 bg-white/25 transition-all"
                    style={{ height: `${Math.max(8, fill)}%` }}
                  />
                  {book.style.sticker && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm">
                      {book.style.sticker}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDecorate(book)}
                  className="mt-2 rounded-full bg-surface px-2 py-1 text-xs font-bold text-ink-soft shadow-sm"
                >
                  Decorate
                </button>
              </div>
            );
          })}
        </div>
        <div className="shelf-board mx-auto mt-1 h-3.5 rounded-full" />
        <div className="mx-auto h-2 w-[92%] rounded-b-2xl bg-[#a89278]/70" />

        {settings.musicOn && (
          <p className="mt-8 text-center text-sm font-semibold text-ink-faint">
            Study music on — soft room ambience
          </p>
        )}
        <button
          type="button"
          onClick={() => setSettings({ musicOn: !settings.musicOn })}
          className="mx-auto mt-4 block text-sm font-bold text-sky"
        >
          {settings.musicOn ? "Mute music" : "Optional study music"}
        </button>
      </div>

      <DecorateBook
        book={decorate ? books.find((b) => b.id === decorate.id) ?? null : null}
        onClose={() => setDecorate(null)}
      />

      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-ink/25"
            aria-label="Close"
            onClick={() => setJoinOpen(false)}
          />
          <form
            className="relative z-10 w-full max-w-sm animate-pop soft-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const res = joinWithCode(code);
              if (!res.ok) {
                setErr(res.error);
                return;
              }
              setJoinOpen(false);
              router.push(`/book/${res.id}`);
            }}
          >
            <h2 className="font-display text-xl font-bold">Join a book</h2>
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setErr("");
              }}
              placeholder="Invite code"
              className="mt-4 w-full rounded-2xl border border-line bg-paper px-4 py-3 font-mono tracking-widest outline-none"
            />
            {err && <p className="mt-2 text-sm text-blush">{err}</p>}
            <button
              type="submit"
              className="mt-4 w-full rounded-2xl bg-sage py-3 text-sm font-bold text-white"
            >
              Join
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
