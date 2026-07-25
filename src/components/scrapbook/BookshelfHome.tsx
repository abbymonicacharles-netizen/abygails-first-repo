"use client";

import { useMemo, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { CelebrateOverlay } from "./CelebrateOverlay";
import { SettingsPanel } from "./SettingsPanel";
import { OnScreenKeyboard } from "./OnScreenKeyboard";
import { ShelfAquarium } from "./FishBowl";
import { useAuth } from "@/context/AuthContext";
import { useBookshelf } from "@/context/BookshelfContext";
import { bookProgress, COVER_SWATCHES } from "@/data/factory";
import { stickerSrc } from "@/data/stickers";
import type { PasscodeLength, ProjectBook } from "@/data/types";

type DragItem = { kind: "book"; id: string } | { kind: "bowl" };

export function BookshelfHome() {
  const { session, isGuest, canUseGroups, signOut } = useAuth();
  const {
    books,
    createProject,
    ready,
    settings,
    joinWithCode,
    deleteBook,
    archiveBook,
    placeBook,
    placeBowl,
    updateBook,
  } = useBookshelf();
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [viewArchive, setViewArchive] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [penBook, setPenBook] = useState<ProjectBook | null>(null);
  const [passPrompt, setPassPrompt] = useState<ProjectBook | null>(null);
  const [passInput, setPassInput] = useState("");
  const [passErr, setPassErr] = useState("");
  const [lockSetup, setLockSetup] = useState<{
    book: ProjectBook;
    step: "choose" | "set" | "remove";
    length: PasscodeLength;
  } | null>(null);
  const [lockInput, setLockInput] = useState("");
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  const shownName = settings.displayName.trim() || session?.name || "";

  const activeBooks = useMemo(
    () => books.filter((b) => !b.archived).sort((a, b) => a.sortOrder - b.sortOrder),
    [books],
  );
  const archivedBooks = useMemo(
    () => books.filter((b) => b.archived).sort((a, b) => a.sortOrder - b.sortOrder),
    [books],
  );

  const shelfRows = useMemo(() => {
    const list = viewArchive ? archivedBooks : activeBooks;
    const maxBookRow = list.reduce((m, b) => Math.max(m, b.shelfRow), 0);
    const maxRow = viewArchive
      ? maxBookRow
      : Math.max(maxBookRow, settings.bowlShelfRow, 0);
    const rows = Math.max(1, maxRow + 1);
    return Array.from({ length: rows }, (_, row) => {
      const rowBooks = list
        .filter((b) => b.shelfRow === row)
        .sort((a, b) => a.sortOrder - b.sortOrder);
      return { row, books: rowBooks };
    });
  }, [activeBooks, archivedBooks, viewArchive, settings.bowlShelfRow]);

  function tryOpen(book: ProjectBook) {
    if (book.locked) {
      setPassPrompt(book);
      setPassInput("");
      setPassErr("");
      return;
    }
    router.push(`/book/${book.id}`);
  }

  function dropOnShelf(row: number, slot: number) {
    if (!dragItem) return;
    if (dragItem.kind === "book") {
      placeBook(dragItem.id, slot, row);
    } else {
      placeBowl(slot, row);
    }
    setDragItem(null);
  }

  function submitPass() {
    if (!passPrompt) return;
    const len = passPrompt.passcodeLength ?? passPrompt.passcode?.length ?? 4;
    if (passInput.length !== len) {
      setPassErr(`Enter all ${len} digits`);
      return;
    }
    if (passInput !== passPrompt.passcode) {
      setPassErr("Incorrect passcode");
      return;
    }
    const id = passPrompt.id;
    setPassPrompt(null);
    router.push(`/book/${id}`);
  }

  return (
    <div className="room relative min-h-[100svh]">
      <CelebrateOverlay />
      <div className="mx-auto max-w-4xl px-5 pb-24 pt-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <BrandMark size="sm" onOpenSettings={() => setSettingsOpen(true)} />
          <div className="flex flex-wrap items-center gap-2">
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
              className="bg-butter px-4 py-2 text-sm font-semibold text-ink"
            >
              New book
            </button>
          </div>
        </header>

        <h1 className="mt-14 font-display text-4xl tracking-tight text-ink">
          {shownName ? `${shownName.split(" ")[0]}’s bookshelf` : "The bookshelf"}
        </h1>
        {isGuest && (
          <p className="mt-2 text-sm text-ink-soft">
            Guest shelf: sign in to save across sessions on this device and unlock group projects.
          </p>
        )}
        {viewArchive && (
          <button
            type="button"
            onClick={() => setViewArchive(false)}
            className="mt-3 text-sm font-semibold text-plum"
          >
            ← Back to active shelf
          </button>
        )}
        <p className="mt-2 text-xs text-ink-faint">
          Drag books along a shelf to reorder. Drop on a lower shelf to move them down. Books stay in a line and cannot stack.
        </p>

        <div className="mt-10 space-y-8">
          {ready && viewArchive && archivedBooks.length === 0 && (
            <p className="font-display text-lg text-ink-faint">No archived books yet</p>
          )}

          {shelfRows.map(({ row, books: rowBooks }) => {
            const showBowl = !viewArchive && settings.bowlShelfRow === row;
            const items: { key: string; slot: number; node: ReactElement }[] = [];

            rowBooks.forEach((book, i) => {
              items.push({
                key: book.id,
                slot: i,
                node: (
                  <ShelfBook
                    book={book}
                    onOpen={() => tryOpen(book)}
                    onPen={() => setPenBook(book)}
                    onDragStart={() => setDragItem({ kind: "book", id: book.id })}
                    onDropBefore={() => dropOnShelf(row, i)}
                  />
                ),
              });
            });

            if (showBowl) {
              const bowlSlot = Math.max(0, Math.min(items.length, settings.bowlSlot));
              items.splice(bowlSlot, 0, {
                key: "bowl",
                slot: bowlSlot,
                node: (
                  <div
                    className="relative mb-0 flex flex-col items-center self-end"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      dropOnShelf(row, bowlSlot);
                    }}
                  >
                    <ShelfAquarium onDragStart={() => setDragItem({ kind: "bowl" })} />
                  </div>
                ),
              });
            }

            return (
              <div key={row} className="shelf-unit">
                <div
                  className="shelf-row"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    dropOnShelf(row, rowBooks.length);
                  }}
                >
                  {!viewArchive && row === 0 && activeBooks.length === 0 && !showBowl && (
                    <p className="mb-2 w-full text-center font-display text-lg text-ink-faint">
                      Your shelf awaits a first volume
                    </p>
                  )}

                  {items.map((item) => (
                    <div key={item.key} className="shelf-item">
                      {item.node}
                    </div>
                  ))}

                  {!viewArchive && row === 0 && (
                    <div
                      className="shelf-item"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        dropOnShelf(row, rowBooks.length);
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setViewArchive(true)}
                        className="book-spine archive-spine relative h-44 w-10 overflow-hidden rounded-sm sm:h-52 sm:w-11"
                        aria-label="Archive"
                      >
                        <span className="absolute inset-x-0 bottom-3 top-10 flex items-end justify-center text-butter">
                          <span
                            className="max-h-full overflow-hidden font-display text-[0.65rem] font-bold tracking-wide"
                            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                          >
                            Archive
                          </span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <div className="shelf-board mx-auto h-3.5" />
                <div className="shelf-trim mx-auto w-[96%]" />
                {!viewArchive && row === shelfRows.length - 1 && (
                  <button
                    type="button"
                    className="mt-3 text-xs font-semibold text-plum"
                    onClick={() => {
                      const id = createProject("New project", row + 1);
                      router.push(`/book/${id}`);
                    }}
                  >
                    + Add a shelf below
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {penBook && (
        <div className="fixed inset-x-0 bottom-0 z-50 animate-pop border-t border-line bg-surface p-4 shadow-2xl sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-t-xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg">{penBook.title}</p>
            <button type="button" className="text-sm font-semibold text-ink-faint" onClick={() => setPenBook(null)}>
              Close
            </button>
          </div>
          <p className="mb-2 text-xs font-semibold text-ink-faint">Cover colour</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {COVER_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                className="h-7 w-7 border border-line"
                style={{ backgroundColor: c }}
                onClick={() => {
                  const text =
                    c.toLowerCase() === "#fafafa" || c.toLowerCase() === "#fdd835"
                      ? "#1c2421"
                      : "#f5f1ea";
                  updateBook(penBook.id, {
                    style: { ...penBook.style, coverColor: c, spineColor: c, textColor: text },
                  });
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="border border-line bg-paper py-3 text-sm font-semibold"
              onClick={() => {
                archiveBook(penBook.id, !penBook.archived);
                setPenBook(null);
              }}
            >
              {penBook.archived ? "Unarchive" : "Archive"}
            </button>
            <button
              type="button"
              className="border border-burgundy/40 bg-paper py-3 text-sm font-semibold text-burgundy"
              onClick={() => {
                if (confirm(`Delete “${penBook.title}”?`)) deleteBook(penBook.id);
                setPenBook(null);
              }}
            >
              Delete
            </button>
          </div>
          <button
            type="button"
            className="mt-2 w-full border border-line bg-butter py-2.5 text-sm font-semibold text-ink"
            onClick={() => {
              if (penBook.locked) {
                setLockSetup({ book: penBook, step: "remove", length: penBook.passcodeLength ?? 4 });
              } else {
                setLockSetup({ book: penBook, step: "choose", length: 4 });
              }
              setLockInput("");
              setPenBook(null);
            }}
          >
            {penBook.locked ? "Remove passcode" : "Lock with passcode"}
          </button>
        </div>
      )}

      {lockSetup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={() => setLockSetup(null)} />
          <div className="relative z-10 w-full max-w-sm animate-pop soft-card p-6">
            {lockSetup.step === "choose" && (
              <>
                <h2 className="font-display text-xl">Lock this book</h2>
                <p className="mt-1 text-sm text-ink-soft">Choose a 4-digit or 6-digit passcode.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="border border-line bg-paper py-3 text-sm font-semibold"
                    onClick={() => setLockSetup({ ...lockSetup, step: "set", length: 4 })}
                  >
                    4 digits
                  </button>
                  <button
                    type="button"
                    className="border border-line bg-butter py-3 text-sm font-semibold"
                    onClick={() => setLockSetup({ ...lockSetup, step: "set", length: 6 })}
                  >
                    6 digits
                  </button>
                </div>
              </>
            )}
            {(lockSetup.step === "set" || lockSetup.step === "remove") && (
              <>
                <h2 className="font-display text-xl">
                  {lockSetup.step === "set" ? `Set ${lockSetup.length}-digit passcode` : "Enter passcode to unlock"}
                </h2>
                <input
                  readOnly
                  value={lockInput}
                  className="mt-4 w-full border border-line bg-paper px-3 py-2.5 font-mono tracking-[0.35em] outline-none"
                />
                <OnScreenKeyboard
                  value={lockInput}
                  maxLength={lockSetup.length}
                  onChange={setLockInput}
                  onSubmit={() => {
                    if (lockInput.length !== lockSetup.length) return;
                    if (lockSetup.step === "set") {
                      updateBook(lockSetup.book.id, {
                        locked: true,
                        passcode: lockInput,
                        passcodeLength: lockSetup.length,
                      });
                      setLockSetup(null);
                      return;
                    }
                    if (lockInput !== lockSetup.book.passcode) {
                      setPassErr("Incorrect passcode");
                      return;
                    }
                    updateBook(lockSetup.book.id, {
                      locked: false,
                      passcode: undefined,
                      passcodeLength: undefined,
                    });
                    setLockSetup(null);
                  }}
                />
                {passErr && <p className="mt-2 text-sm text-burgundy">{passErr}</p>}
              </>
            )}
          </div>
        </div>
      )}

      {passPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={() => setPassPrompt(null)} />
          <form
            className="relative z-10 w-full max-w-sm animate-pop soft-card p-6"
            onSubmit={(e) => {
              e.preventDefault();
              submitPass();
            }}
          >
            <h2 className="font-display text-xl">Private volume</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Enter the {passPrompt.passcodeLength ?? passPrompt.passcode?.length ?? 4}-digit passcode for{" "}
              {passPrompt.title}
            </p>
            <input
              type="password"
              readOnly
              value={passInput}
              className="mt-4 w-full border border-line bg-paper px-3 py-2.5 outline-none"
            />
            <OnScreenKeyboard
              value={passInput}
              maxLength={passPrompt.passcodeLength ?? passPrompt.passcode?.length ?? 4}
              onChange={(v) => {
                setPassInput(v);
                setPassErr("");
              }}
              onSubmit={submitPass}
            />
            {passErr && <p className="mt-2 text-sm text-burgundy">{passErr}</p>}
            <button type="submit" className="mt-4 w-full bg-plum py-2.5 text-sm font-semibold text-surface">
              Open
            </button>
          </form>
        </div>
      )}

      {joinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-ink/40" aria-label="Close" onClick={() => setJoinOpen(false)} />
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
                <p className="text-sm text-ink-soft">Group projects require an account.</p>
                <button
                  type="button"
                  onClick={() => {
                    setJoinOpen(false);
                    signOut();
                  }}
                  className="w-full bg-plum py-2.5 text-sm font-semibold text-surface"
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
                <button type="submit" className="mt-4 w-full bg-plum py-2.5 text-sm font-semibold text-surface">
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

function ShelfBook({
  book,
  onOpen,
  onPen,
  onDragStart,
  onDropBefore,
}: {
  book: ProjectBook;
  onOpen: () => void;
  onPen: () => void;
  onDragStart: () => void;
  onDropBefore: () => void;
}) {
  const fill = bookProgress(book);
  const done = book.tasks.length > 0 && book.tasks.every((t) => t.done);

  return (
    <div
      className="relative flex flex-col items-center self-end"
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDropBefore();
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="book-spine relative h-44 w-10 overflow-hidden rounded-sm sm:h-52 sm:w-11"
        style={{ backgroundColor: book.style.spineColor }}
        aria-label={book.title}
      >
        <span className="absolute inset-y-0 right-0 w-[3px] bg-white/15" />
        {book.locked && (
          <span className="absolute left-1/2 top-1.5 -translate-x-1/2 text-[0.55rem] text-butter">⌘</span>
        )}
        <span
          className="absolute inset-x-0 bottom-2 top-8 flex items-end justify-center"
          style={{ color: book.style.textColor }}
        >
          <span
            className="max-h-full overflow-hidden font-display text-[0.65rem] font-bold tracking-wide"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {book.title}
          </span>
        </span>
        <span
          className="absolute bottom-0 left-0 right-0 bg-butter/40"
          style={{ height: `${Math.max(6, fill)}%` }}
        />
        {book.style.sticker && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stickerSrc(book.style.sticker)}
            alt=""
            className="sticker-cutout absolute bottom-1 left-1/2 h-4 w-4 -translate-x-1/2"
          />
        )}
        {done && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[0.5rem] font-bold text-butter">
            ✓
          </span>
        )}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onPen();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              onPen();
            }
          }}
          className="pen-chip"
          aria-label={`Edit ${book.title}`}
        >
          ✎
        </span>
      </button>
    </div>
  );
}
