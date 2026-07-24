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
  bookProgress,
  createBook,
  createSubgroup,
  makeCode,
  makeId,
  STORAGE_KEY,
} from "@/data/factory";
import type { AppSettings, ProjectBook, Subgroup } from "@/data/types";

type Ctx = {
  ready: boolean;
  books: ProjectBook[];
  settings: AppSettings;
  setSettings: (p: Partial<AppSettings>) => void;
  createProject: (title?: string) => string;
  updateBook: (id: string, patch: Partial<ProjectBook>) => void;
  getBook: (id: string) => ProjectBook | undefined;
  deleteBook: (id: string) => void;
  joinWithCode: (code: string) => { ok: true; id: string } | { ok: false; error: string };
  addSubgroup: (bookId: string, name: string, emoji?: string) => string;
  updateSubgroup: (bookId: string, sgId: string, patch: Partial<Subgroup>) => void;
  celebrate: string | null;
  triggerCelebrate: (msg: string) => void;
  clearCelebrate: () => void;
};

const BookshelfContext = createContext<Ctx | null>(null);

const defaultSettings: AppSettings = {
  seasonalTheme: "cozy",
  musicOn: false,
};

export function BookshelfProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [books, setBooks] = useState<ProjectBook[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [inviteMap, setInviteMap] = useState<Record<string, ProjectBook>>({});
  const [celebrate, setCelebrate] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          books?: ProjectBook[];
          settings?: AppSettings;
          invites?: Record<string, ProjectBook>;
        };
        setBooks(parsed.books ?? []);
        setSettingsState({ ...defaultSettings, ...parsed.settings });
        setInviteMap(parsed.invites ?? {});
      }
    } catch {
      /* empty shelf */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ books, settings, invites: inviteMap }),
    );
  }, [books, settings, inviteMap, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.season = settings.seasonalTheme;
  }, [settings.seasonalTheme, ready]);

  const setSettings = useCallback((p: Partial<AppSettings>) => {
    setSettingsState((s) => ({ ...s, ...p }));
  }, []);

  const triggerCelebrate = useCallback((msg: string) => {
    setCelebrate(msg);
  }, []);

  const clearCelebrate = useCallback(() => setCelebrate(null), []);

  const createProject = useCallback((title?: string) => {
    const book = createBook(title);
    setBooks((b) => [book, ...b]);
    setInviteMap((m) => ({ ...m, [book.inviteCode]: book }));
    return book.id;
  }, []);

  const updateBook = useCallback((id: string, patch: Partial<ProjectBook>) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const next = { ...b, ...patch, updatedAt: new Date().toISOString() };
        // unlock stickers / achievements when progress jumps
        const before = bookProgress(b);
        const after = bookProgress(next);
        if (after >= 50 && before < 50 && !next.achievements.some((a) => a.id === "halfway")) {
          next.achievements = [
            ...next.achievements,
            { id: "halfway", label: "Halfway there!", unlockedAt: new Date().toISOString() },
          ];
          next.unlockedStickers = Array.from(new Set([...next.unlockedStickers, "☘", "♪"]));
          setCelebrate("Halfway! New stickers unlocked");
        }
        if (after === 100 && before < 100) {
          next.achievements = [
            ...next.achievements,
            { id: "done", label: "Project complete!", unlockedAt: new Date().toISOString() },
          ];
          next.unlockedStickers = Array.from(new Set([...next.unlockedStickers, "☁", "☎"]));
          setCelebrate("All tasks done — confetti time!");
        }
        setInviteMap((m) => ({ ...m, [next.inviteCode]: next }));
        return next;
      }),
    );
  }, []);

  const getBook = useCallback((id: string) => books.find((b) => b.id === id), [books]);

  const deleteBook = useCallback((id: string) => {
    setBooks((b) => b.filter((x) => x.id !== id));
  }, []);

  const joinWithCode = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      const source = inviteMap[key] ?? books.find((b) => b.inviteCode === key);
      if (!source) return { ok: false as const, error: "Code not found" };
      if (books.some((b) => b.id === source.id)) return { ok: true as const, id: source.id };
      const copy = {
        ...source,
        members: source.members.includes("You")
          ? source.members
          : [...source.members, "You"],
      };
      setBooks((b) => [copy, ...b]);
      return { ok: true as const, id: copy.id };
    },
    [inviteMap, books],
  );

  const addSubgroup = useCallback((bookId: string, name: string, emoji?: string) => {
    const sg = createSubgroup(name, emoji);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, subgroups: [...b.subgroups, sg] } : b,
      ),
    );
    return sg.id;
  }, []);

  const updateSubgroup = useCallback(
    (bookId: string, sgId: string, patch: Partial<Subgroup>) => {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? {
                ...b,
                subgroups: b.subgroups.map((s) =>
                  s.id === sgId ? { ...s, ...patch } : s,
                ),
              }
            : b,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      ready,
      books,
      settings,
      setSettings,
      createProject,
      updateBook,
      getBook,
      deleteBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      celebrate,
      triggerCelebrate,
      clearCelebrate,
    }),
    [
      ready,
      books,
      settings,
      setSettings,
      createProject,
      updateBook,
      getBook,
      deleteBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      celebrate,
      triggerCelebrate,
      clearCelebrate,
    ],
  );

  return (
    <BookshelfContext.Provider value={value}>{children}</BookshelfContext.Provider>
  );
}

export function useBookshelf() {
  const ctx = useContext(BookshelfContext);
  if (!ctx) throw new Error("useBookshelf required");
  return ctx;
}

// re-export helper for id generation in UI
export { makeId, makeCode };
