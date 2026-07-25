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
import { useAuth } from "@/context/AuthContext";
import { userStorageKey } from "@/data/auth";
import {
  bookProgress,
  createBook,
  createSubgroup,
} from "@/data/factory";
import type { AppSettings, ProjectBook, Subgroup } from "@/data/types";

const GLOBAL_INVITES_KEY = "brainstorm.invites.global.v1";

type Ctx = {
  ready: boolean;
  books: ProjectBook[];
  settings: AppSettings;
  setSettings: (p: Partial<AppSettings>) => void;
  createProject: (title?: string) => string;
  updateBook: (id: string, patch: Partial<ProjectBook>) => void;
  getBook: (id: string) => ProjectBook | undefined;
  deleteBook: (id: string) => void;
  archiveBook: (id: string, archived?: boolean) => void;
  joinWithCode: (code: string) => { ok: true; id: string } | { ok: false; error: string };
  addSubgroup: (bookId: string, name: string, emoji?: string) => string;
  updateSubgroup: (bookId: string, sgId: string, patch: Partial<Subgroup>) => void;
  celebrate: string | null;
  clearCelebrate: () => void;
};

const BookshelfContext = createContext<Ctx | null>(null);

const defaultSettings: AppSettings = {
  musicOn: false,
  showArchived: false,
};

function normalizeBook(raw: ProjectBook): ProjectBook {
  return {
    ...createBook(raw.title),
    ...raw,
    archived: raw.archived ?? false,
    questions: raw.questions ?? {
      about: "",
      goal: "",
      teamNote: "",
      dueNote: "",
      milestone: "",
      answered: false,
    },
    tasks: (raw.tasks ?? []).map((t) => ({
      id: t.id,
      title: t.title,
      done: t.done,
      assignee: "assignee" in t ? (t as { assignee?: string }).assignee : undefined,
      due: "due" in t ? (t as { due?: string }).due : undefined,
      priority: t.priority ?? "medium",
    })),
    subgroups: (raw.subgroups ?? []).map((s) => ({
      ...s,
      tasks: (s.tasks ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        done: t.done,
        assignee: "assignee" in t ? (t as { assignee?: string }).assignee : undefined,
        due: "due" in t ? (t as { due?: string }).due : undefined,
        priority: t.priority ?? "medium",
      })),
    })),
  };
}

function readGlobalInvites(): Record<string, ProjectBook> {
  try {
    const raw = localStorage.getItem(GLOBAL_INVITES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ProjectBook>) : {};
  } catch {
    return {};
  }
}

function writeGlobalInvites(map: Record<string, ProjectBook>) {
  localStorage.setItem(GLOBAL_INVITES_KEY, JSON.stringify(map));
}

export function BookshelfProvider({ children }: { children: ReactNode }) {
  const { ready: authReady, session, canUseGroups, isSignedIn } = useAuth();
  const userKey = session ? String(session.userId) : null;

  const [ready, setReady] = useState(false);
  const [books, setBooks] = useState<ProjectBook[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [celebrate, setCelebrate] = useState<string | null>(null);

  // Load per-user shelf whenever session changes
  useEffect(() => {
    if (!authReady) return;
    if (!userKey) {
      setBooks([]);
      setSettingsState(defaultSettings);
      setReady(true);
      return;
    }
    setReady(false);
    try {
      const raw = localStorage.getItem(userStorageKey(userKey));
      if (raw) {
        const parsed = JSON.parse(raw) as {
          books?: ProjectBook[];
          settings?: AppSettings;
        };
        setBooks((parsed.books ?? []).map(normalizeBook));
        setSettingsState({ ...defaultSettings, ...parsed.settings });
      } else {
        setBooks([]);
        setSettingsState(defaultSettings);
      }
    } catch {
      setBooks([]);
      setSettingsState(defaultSettings);
    }
    setReady(true);
  }, [authReady, userKey]);

  // Persist per-user shelf
  useEffect(() => {
    if (!ready || !userKey) return;
    localStorage.setItem(
      userStorageKey(userKey),
      JSON.stringify({ books, settings }),
    );
  }, [books, settings, ready, userKey]);

  const publishInvite = useCallback((book: ProjectBook) => {
    if (!book.inviteCode) return;
    const map = readGlobalInvites();
    map[book.inviteCode] = book;
    writeGlobalInvites(map);
  }, []);

  const setSettings = useCallback((p: Partial<AppSettings>) => {
    setSettingsState((s) => ({ ...s, ...p }));
  }, []);

  const clearCelebrate = useCallback(() => setCelebrate(null), []);

  const createProject = useCallback(
    (title?: string) => {
      const book = createBook(title);
      // Stamp owner display name into members
      if (session?.name) {
        book.members = [session.name];
      }
      setBooks((b) => [book, ...b]);
      if (isSignedIn) publishInvite(book);
      return book.id;
    },
    [session?.name, isSignedIn, publishInvite],
  );

  const updateBook = useCallback(
    (id: string, patch: Partial<ProjectBook>) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          const next = { ...b, ...patch, updatedAt: new Date().toISOString() };
          const before = bookProgress(b);
          const after = bookProgress(next);
          if (after >= 50 && before < 50 && !next.achievements.some((a) => a.id === "halfway")) {
            next.achievements = [
              ...next.achievements,
              { id: "halfway", label: "Halfway mark", unlockedAt: new Date().toISOString() },
            ];
            next.unlockedStickers = Array.from(new Set([...next.unlockedStickers, "★", "☾"]));
            setCelebrate("Halfway — new stickers unlocked");
          }
          if (after === 100 && before < 100) {
            next.achievements = [
              ...next.achievements,
              { id: "done", label: "All tasks complete", unlockedAt: new Date().toISOString() },
            ];
            setCelebrate("Project complete");
          }
          if (isSignedIn) publishInvite(next);
          return next;
        }),
      );
    },
    [isSignedIn, publishInvite],
  );

  const getBook = useCallback((id: string) => books.find((b) => b.id === id), [books]);

  const deleteBook = useCallback((id: string) => {
    setBooks((b) => b.filter((x) => x.id !== id));
  }, []);

  const archiveBook = useCallback((id: string, archived = true) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, archived, updatedAt: new Date().toISOString() } : b,
      ),
    );
  }, []);

  const joinWithCode = useCallback(
    (code: string) => {
      if (!canUseGroups) {
        return {
          ok: false as const,
          error: "Sign in to join group projects.",
        };
      }
      const key = code.trim().toUpperCase();
      const global = readGlobalInvites();
      const source = global[key] ?? books.find((b) => b.inviteCode === key);
      if (!source) return { ok: false as const, error: "Code not found" };
      if (books.some((b) => b.id === source.id)) return { ok: true as const, id: source.id };
      const memberName = session?.name ?? "You";
      const copy = {
        ...normalizeBook(source),
        members: source.members.includes(memberName)
          ? source.members
          : [...source.members, memberName],
      };
      setBooks((b) => [copy, ...b]);
      return { ok: true as const, id: copy.id };
    },
    [canUseGroups, books, session?.name],
  );

  const addSubgroup = useCallback(
    (bookId: string, name: string, emoji?: string) => {
      if (!canUseGroups) return "";
      const sg = createSubgroup(name, emoji);
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId ? { ...b, subgroups: [...b.subgroups, sg] } : b,
        ),
      );
      return sg.id;
    },
    [canUseGroups],
  );

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
      ready: authReady && ready,
      books,
      settings,
      setSettings,
      createProject,
      updateBook,
      getBook,
      deleteBook,
      archiveBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      celebrate,
      clearCelebrate,
    }),
    [
      authReady,
      ready,
      books,
      settings,
      setSettings,
      createProject,
      updateBook,
      getBook,
      deleteBook,
      archiveBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      celebrate,
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
