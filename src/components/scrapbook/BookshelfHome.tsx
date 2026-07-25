"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { DecorateBook } from "./DecorateBook";
import { CelebrateOverlay } from "./CelebrateOverlay";
import { useAuth } from "@/context/AuthContext";
import { useBookshelf } from "@/context/BookshelfContext";
import { bookProgress } from "@/data/factory";
import type { ProjectBook } from "@/data/types";

export function BookshelfHome() {
  const { session, isGuest, canUseGroups, signOut } = useAuth();
  const {
    books,
    createProject,
    ready,
    settings,
    setSettings,
    joinWithCode,
    deleteBook,
    archiveBook,
  } = useBookshelf();
  const router = useRouter();
  const [decorate, setDecorate] = useState<ProjectBook | null>(null);
  const [joinOpen, setJoinOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [menuId, setMenuId] = useState<string | null>(null);
  const [passPrompt, setPassPrompt] = useState<ProjectBook | null>(null);
  const [passInput, setPassInput] = useState("");
  const [passErr, setPassErr] = useState("");

  const visible = useMemo(
    () => books.filter((b) => (settings.showArchived ? b.archived : !b.archived)),
    [books, settings.showArchived],
  );

  function tryOpen(book: ProjectBook) {
    if (book.locked) {
      setPassPrompt(book);
      setPassInput("");
      setPassErr("");
      return;
    }
    router.push(`/book/${book.id}`);
  }

  return (
    <div className="room relative min-h-[100svh]">
      <CelebrateOverlay />
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <BrandMark size="sm" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-faint">
              {session?.name}
              {isGuest ? " · Guest" : ""}
            </span>
            <button
              type="button"
              onClick={() => setSettings({ showArchived: !settings.showArchived })}
              className="border border-line bg-surface px-3 py-2 text-sm font-semibold"
            >
              {settings.showArchived ? "Active shelf" : "Archive"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canUseGroups) {
                  setErr("Sign in to join group projects.");
                  setJoinOpen(true);
                  return;
                }
                setErr("");
                setJoinOpen(true);
              }}
              className="border border-line bg-surface px-4 py-2 text-sm font-semibold"
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => {
                const id = createProject("New project");
                router.push(`/book/${id}`);
              }}
              className="bg-forest px-4 py-2 text-sm font-semibold text-surface"
            >
              New book
            </button>
            <button
              type="button"
              onClick={signOut}
              className="text-sm font-semibold text-ink-faint underline-offset-4 hover:underline"
            >
              {isGuest ? "Sign in" : "Sign out"}
            </button>
          </div>
        </header>

        <h1 className="mt-14 font-display text-4xl tracking-tight text-ink">
          {session?.name ? `${session.name.split(" ")[0]}’s bookshelf` : "The bookshelf"}
        </h1>
        {isGuest && (
          <p className="mt-2 text-sm text-ink-soft">
            Guest shelf — sign in to save across sessions on this device and unlock group projects.
          </p>
        )}

        <div className="mt-14 flex min-h-[14rem] items-end justify-center gap-3 px-2 sm:gap-4">
          {ready && visible.length === 0 && (
            <p className="mb-12 font-display text-lg text-ink-faint">
              {settings.showArchived ? "No archived books" : "Your shelf awaits a first volume"}
            </p>
          )}
          {visible.map((book) => {
            const fill = bookProgress(book);
            return (
              <div key={book.id} className="relative flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => tryOpen(book)}
                  className="book-spine relative h-48 w-11 overflow-hidden rounded-sm sm:h-56 sm:w-12"
                  style={{ backgroundColor: book.style.spineColor }}
                  aria-label={book.title}
                >
                  <span className="absolute inset-y-0 right-0 w-[3px] bg-white/15" />
                  {book.locked && (
                    <span className="absolute left-1/2 top-2 -translate-x-1/2 text-[0.65rem] text-gold">
                      ⌘
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
                      {book.title}
                    </span>
                  </span>
                  <span
                    className="absolute bottom-0 left-0 right-0 bg-gold/30"
                    style={{ height: `${Math.max(6, fill)}%` }}
                  />
                  {book.style.sticker && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm">
                      {book.style.sticker}
                    </span>
                  )}
                </button>
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => setDecorate(book)}
                    className="border border-line bg-surface px-2 py-1 text-[0.65rem] font-semibold"
                  >
                    Decorate
                  </button>
                  <button
                    type="button"
                    onClick={() => setMenuId(menuId === book.id ? null : book.id)}
                    className="border border-line bg-surface px-2 py-1 text-[0.65rem] font-semibold"
                  >
                    ···
                  </button>
                </div>
                {menuId === book.id && (
                  <div className="absolute top-full z-20 mt-1 w-32 border border-line bg-surface p-1 shadow-md">
                    <button
                      type="button"
                      className="block w-full px-2 py-1.5 text-left text-xs font-semibold hover:bg-paper"
                      onClick={() => {
                        archiveBook(book.id, !book.archived);
                        setMenuId(null);
                      }}
                    >
                      {book.archived ? "Unarchive" : "Archive"}
                    </button>
                    <button
                      type="button"
                      className="block w-full px-2 py-1.5 text-left text-xs font-semibold text-burgundy hover:bg-paper"
                      onClick={() => {
                        if (confirm(`Delete “${book.title}”?`)) deleteBook(book.id);
                        setMenuId(null);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="shelf-board mx-auto mt-1 h-3.5 rounded-sm" />
        <div className="mx-auto h-2 w-[92%] bg-[#1a1510]/80" />
      </div>

      <DecorateBook
        book={decorate ? books.find((b) => b.id === decorate.id) ?? null : null}
        onClose={() => setDecorate(null)}
      />

      {passPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close"
            onClick={() => setPassPrompt(null)}
          />
          <form
            className="relative z-10 w-full max-w-sm animate-pop soft-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (passInput !== passPrompt.passcode) {
                setPassErr("Incorrect passcode");
                return;
              }
              const id = passPrompt.id;
              setPassPrompt(null);
              router.push(`/book/${id}`);
            }}
          >
            <h2 className="font-display text-xl">Private volume</h2>
            <p className="mt-1 text-sm text-ink-soft">Enter the passcode for {passPrompt.title}</p>
            <input
              type="password"
              autoFocus
              value={passInput}
              onChange={(e) => {
                setPassInput(e.target.value);
                setPassErr("");
              }}
              className="mt-4 w-full border border-line bg-paper px-3 py-2.5 outline-none focus:border-forest"
            />
            {passErr && <p className="mt-2 text-sm text-burgundy">{passErr}</p>}
            <button type="submit" className="mt-4 w-full bg-forest py-2.5 text-sm font-semibold text-surface">
              Open
            </button>
          </form>
        </div>
      )}

      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close"
            onClick={() => setJoinOpen(false)}
          />
          <form
            className="relative z-10 w-full max-w-sm animate-pop soft-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (!canUseGroups) {
                setErr("Sign in to join group projects.");
                return;
              }
              const res = joinWithCode(code);
              if (!res.ok) {
                setErr(res.error);
                return;
              }
              setJoinOpen(false);
              router.push(`/book/${res.id}`);
            }}
          >
            <h2 className="font-display text-xl">Join a book</h2>
            {!canUseGroups ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink-soft">
                  Group projects require an account so invites stay tied to you.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setJoinOpen(false);
                    signOut();
                  }}
                  className="w-full bg-forest py-2.5 text-sm font-semibold text-surface"
                >
                  Sign in to continue
                </button>
              </div>
            ) : (
              <>
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    setErr("");
                  }}
                  placeholder="Invite code"
                  className="mt-4 w-full border border-line bg-paper px-3 py-2.5 font-mono tracking-widest outline-none"
                />
                {err && <p className="mt-2 text-sm text-burgundy">{err}</p>}
                <button
                  type="submit"
                  className="mt-4 w-full bg-forest py-2.5 text-sm font-semibold text-surface"
                >
                  Join
                </button>
              </>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
