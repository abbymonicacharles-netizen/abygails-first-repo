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
import { creaturesForProgress } from "@/data/sea";
import type {
  AppSettings,
  BookQuestions,
  ProjectBook,
  ProjectKind,
  Subgroup,
  ThemeMode,
} from "@/data/types";

const GLOBAL_INVITES_KEY = "brainstorm.invites.global.v1";

type Ctx = {
  ready: boolean;
  books: ProjectBook[];
  settings: AppSettings;
  setSettings: (p: Partial<AppSettings>) => void;
  createProject: (title?: string, shelfRow?: number) => string;
  updateBook: (id: string, patch: Partial<ProjectBook>) => void;
  getBook: (id: string) => ProjectBook | undefined;
  deleteBook: (id: string) => void;
  archiveBook: (id: string, archived?: boolean) => void;
  placeBook: (id: string, shelfX: number, shelfRow: number) => void;
  joinWithCode: (code: string) => { ok: true; id: string } | { ok: false; error: string };
  addSubgroup: (bookId: string, name: string, emoji?: string) => string;
  updateSubgroup: (bookId: string, sgId: string, patch: Partial<Subgroup>) => void;
  displayNameFor: (member: string) => string;
  celebrate: string | null;
  clearCelebrate: () => void;
};

const BookshelfContext = createContext<Ctx | null>(null);

const defaultSettings: AppSettings = {
  musicOn: false,
  theme: "light",
  notificationsEnabled: false,
  displayName: "",
  profileImage: "",
  friendNicknames: {},
  seaCollection: ["egg"],
};

function migrateTheme(raw: Partial<AppSettings> & { darkMode?: boolean }): ThemeMode {
  if (raw.theme) return raw.theme;
  if (raw.darkMode) return "dark";
  return "light";
}

function normalizeQuestions(
  raw:
    | (BookQuestions & { teamNote?: string; milestone?: string })
    | undefined,
): BookQuestions {
  const legacy = raw as { teamNote?: string; projectKind?: ProjectKind } | undefined;
  let projectKind: ProjectKind = legacy?.projectKind ?? "";
  if (!projectKind && legacy?.teamNote) {
    const note = legacy.teamNote.trim().toLowerCase();
    if (note === "solo" || note === "group") projectKind = note;
  }
  return {
    about: raw?.about ?? "",
    goal: raw?.goal ?? "",
    projectKind,
    dueNote: raw?.dueNote ?? "",
    remindersOk: raw?.remindersOk ?? false,
    answered: raw?.answered ?? false,
  };
}

function normalizeBook(raw: ProjectBook, index = 0): ProjectBook {
  const base = createBook(raw.title);
  return {
    ...base,
    ...raw,
    archived: raw.archived ?? false,
    shelfX: typeof raw.shelfX === "number" ? raw.shelfX : 12 + (index % 5) * 14,
    shelfRow: typeof raw.shelfRow === "number" ? raw.shelfRow : Math.floor(index / 5),
    sortOrder: typeof raw.sortOrder === "number" ? raw.sortOrder : index,
    passcodeLength: raw.passcodeLength === 6 ? 6 : raw.passcode ? 4 : undefined,
    remindersEnabled: raw.remindersEnabled ?? raw.questions?.remindersOk ?? false,
    questions: normalizeQuestions(raw.questions),
    unlockedStickers: (raw.unlockedStickers ?? base.unlockedStickers).map((s) =>
      s.length <= 2
        ? ({ "◆": "heart", "❖": "star", "✦": "flower", "✿": "cloud", "★": "car", "☾": "moon", "☘": "leaf", "♪": "note" } as Record<string, string>)[s] ?? s
        : s,
    ),
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

function fireReminder(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/brainstorm-logo.png" });
  } catch {
    /* ignore */
  }
}

export function BookshelfProvider({ children }: { children: ReactNode }) {
  const { ready: authReady, session, canUseGroups, isSignedIn } = useAuth();
  const userKey = session ? String(session.userId) : null;

  const [ready, setReady] = useState(false);
  const [books, setBooks] = useState<ProjectBook[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [celebrate, setCelebrate] = useState<string | null>(null);

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
          settings?: AppSettings & { darkMode?: boolean; showArchived?: boolean };
        };
        setBooks((parsed.books ?? []).map((b, i) => normalizeBook(b, i)));
        const migrated = (parsed.settings ?? {}) as Partial<AppSettings> & {
          darkMode?: boolean;
        };
        setSettingsState({
          ...defaultSettings,
          ...migrated,
          theme: migrateTheme(migrated),
          friendNicknames: migrated.friendNicknames ?? {},
          displayName: migrated.displayName ?? "",
          profileImage: migrated.profileImage ?? "",
          notificationsEnabled: migrated.notificationsEnabled ?? false,
          seaCollection: migrated.seaCollection?.length
            ? migrated.seaCollection
            : ["egg"],
        });
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

  useEffect(() => {
    if (!ready || !userKey) return;
    localStorage.setItem(
      userStorageKey(userKey),
      JSON.stringify({ books, settings }),
    );
  }, [books, settings, ready, userKey]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    if (!settings.notificationsEnabled) return;
    const tick = () => {
      const active = books.filter((b) => !b.archived && b.remindersEnabled);
      for (const book of active) {
        const open = book.tasks.find((t) => !t.done);
        if (!open) continue;
        fireReminder(
          `Come back to ${book.title}`,
          `You're on “${open.title}”. Your egg is waiting.`,
        );
      }
    };
    const id = window.setInterval(tick, 1000 * 60 * 45);
    return () => window.clearInterval(id);
  }, [books, settings.notificationsEnabled]);

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

  const displayNameFor = useCallback(
    (member: string) => settings.friendNicknames[member] || member,
    [settings.friendNicknames],
  );

  const unlockSeaForProgress = useCallback((progress: number) => {
    const unlocked = creaturesForProgress(progress).map((c) => c.id);
    setSettingsState((s) => {
      const next = Array.from(new Set([...s.seaCollection, ...unlocked]));
      if (next.length === s.seaCollection.length) return s;
      const newest = unlocked.filter((id) => !s.seaCollection.includes(id));
      if (newest.length) {
        const last = newest[newest.length - 1];
        setCelebrate(`New sea friend unlocked`);
        void last;
      }
      return { ...s, seaCollection: next };
    });
  }, []);

  const createProject = useCallback(
    (title?: string, shelfRow?: number) => {
      const maxOrder = books.reduce((m, b) => Math.max(m, b.sortOrder), 0);
      const active = books.filter((b) => !b.archived);
      const row =
        typeof shelfRow === "number"
          ? shelfRow
          : active.length > 0
            ? Math.max(...active.map((b) => b.shelfRow))
            : 0;
      const onRow = active.filter((b) => b.shelfRow === row);
      const shelfX = Math.min(70, 18 + onRow.length * 12);
      const book = createBook(title, maxOrder + 1, shelfX, row);
      const name = settings.displayName.trim() || session?.name;
      if (name) book.members = [name];
      setBooks((b) => [...b, book]);
      if (isSignedIn) publishInvite(book);
      return book.id;
    },
    [books, session?.name, settings.displayName, isSignedIn, publishInvite],
  );

  const updateBook = useCallback(
    (id: string, patch: Partial<ProjectBook>) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          const next = { ...b, ...patch, updatedAt: new Date().toISOString() };
          const before = bookProgress(b);
          const after = bookProgress(next);
          unlockSeaForProgress(after);
          if (after >= 50 && before < 50 && !next.achievements.some((a) => a.id === "halfway")) {
            next.achievements = [
              ...next.achievements,
              { id: "halfway", label: "Halfway mark", unlockedAt: new Date().toISOString() },
            ];
            next.unlockedStickers = Array.from(
              new Set([...next.unlockedStickers, "car", "moon"]),
            );
          }
          if (
            after === 100 &&
            before < 100 &&
            next.tasks.length > 0 &&
            !next.achievements.some((a) => a.id === "completed")
          ) {
            next.achievements = [
              ...next.achievements,
              { id: "completed", label: "Completed", unlockedAt: new Date().toISOString() },
            ];
            setCelebrate("Finished! Completed badge earned");
          }
          if (isSignedIn) publishInvite(next);
          return next;
        }),
      );
    },
    [isSignedIn, publishInvite, unlockSeaForProgress],
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

  const placeBook = useCallback((id: string, shelfX: number, shelfRow: number) => {
    const x = Math.max(4, Math.min(78, shelfX));
    const row = Math.max(0, Math.min(3, Math.round(shelfRow)));
    setBooks((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, shelfX: x, shelfRow: row, updatedAt: new Date().toISOString() } : b,
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
      const memberName = settings.displayName.trim() || session?.name || "You";
      const maxOrder = books.reduce((m, b) => Math.max(m, b.sortOrder), 0);
      const copy = {
        ...normalizeBook(source),
        sortOrder: maxOrder + 1,
        shelfX: 40,
        shelfRow: 0,
        members: source.members.includes(memberName)
          ? source.members
          : [...source.members, memberName],
      };
      setBooks((b) => [...b, copy]);
      return { ok: true as const, id: copy.id };
    },
    [canUseGroups, books, session?.name, settings.displayName],
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
      placeBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      displayNameFor,
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
      placeBook,
      joinWithCode,
      addSubgroup,
      updateSubgroup,
      displayNameFor,
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
