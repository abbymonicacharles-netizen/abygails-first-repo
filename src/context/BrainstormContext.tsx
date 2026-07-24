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
  createBlankProject,
  makeId,
  makeInviteCode,
  STORAGE_KEYS,
  withInvite,
} from "@/data/projectFactory";
import type {
  AppSettings,
  GenreId,
  MemberRole,
  Project,
} from "@/data/types";

const defaultSettings: AppSettings = {
  onboardingComplete: false,
  showOnboarding: true,
  accent: "#2f6f66",
  shelfTone: "#2a2e2c",
  fontScale: "md",
};

type BrainstormContextValue = {
  ready: boolean;
  projects: Project[];
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  openOnboarding: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  createProject: () => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  completeSetup: (
    id: string,
    data: {
      title: string;
      description: string;
      goals: string;
      genre: GenreId;
      customGenre?: string;
      dueDate?: string;
      collaborative: boolean;
    },
  ) => void;
  regenerateInvite: (id: string) => void;
  joinWithCode: (code: string, memberName?: string) => { ok: true; projectId: string } | { ok: false; error: string };
  publishInvite: (project: Project) => void;
};

const BrainstormContext = createContext<BrainstormContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function BrainstormProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [inviteRegistry, setInviteRegistry] = useState<Record<string, Project>>({});

  useEffect(() => {
    const storedProjects = readJson<Project[]>(STORAGE_KEYS.projects, []);
    const storedSettings = readJson<AppSettings>(STORAGE_KEYS.settings, defaultSettings);
    const storedInvites = readJson<Record<string, Project>>(STORAGE_KEYS.invites, {});
    setProjects(storedProjects);
    setSettings({ ...defaultSettings, ...storedSettings });
    setInviteRegistry(storedInvites);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  }, [projects, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings, ready]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEYS.invites, JSON.stringify(inviteRegistry));
  }, [inviteRegistry, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.style.setProperty("--bs-accent", settings.accent);
    document.documentElement.style.setProperty("--bs-shelf", settings.shelfTone);
    document.documentElement.dataset.fontScale = settings.fontScale;
  }, [settings, ready]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const openOnboarding = useCallback(() => {
    setSettings((prev) => ({ ...prev, showOnboarding: true }));
  }, []);

  const skipOnboarding = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showOnboarding: false,
      onboardingComplete: true,
    }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      showOnboarding: false,
      onboardingComplete: true,
    }));
  }, []);

  const createProject = useCallback(() => {
    const project = createBlankProject();
    setProjects((prev) => [project, ...prev]);
    return project.id;
  }, []);

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...patch, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  const publishInvite = useCallback((project: Project) => {
    if (!project.invite) return;
    setInviteRegistry((prev) => ({ ...prev, [project.invite!.code]: project }));
  }, []);

  const completeSetup = useCallback(
    (
      id: string,
      data: {
        title: string;
        description: string;
        goals: string;
        genre: GenreId;
        customGenre?: string;
        dueDate?: string;
        collaborative: boolean;
      },
    ) => {
      setProjects((prev) => {
        const nextProjects = prev.map((p) => {
          if (p.id !== id) return p;
          let next: Project = {
            ...p,
            title: data.title.trim() || "Untitled project",
            description: data.description.trim(),
            goals: data.goals.trim(),
            genre: data.genre,
            customGenre: data.customGenre?.trim(),
            dueDate: data.dueDate || undefined,
            collaborative: data.collaborative,
            setupComplete: true,
            subtitle: data.customGenre?.trim() || data.genre,
            updatedAt: new Date().toISOString(),
          };
          if (data.collaborative) {
            next = withInvite(next);
          } else {
            next = { ...next, invite: undefined };
          }
          return next;
        });
        const updated = nextProjects.find((p) => p.id === id);
        if (updated?.invite) {
          queueMicrotask(() => {
            setInviteRegistry((reg) => ({
              ...reg,
              [updated.invite!.code]: updated,
            }));
          });
        }
        return nextProjects;
      });
    },
    [],
  );

  const regenerateInvite = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const code = makeInviteCode();
        const next: Project = {
          ...p,
          collaborative: true,
          invite: { code, link: `/join/${code}`, role: p.invite?.role ?? "editor" },
          updatedAt: new Date().toISOString(),
        };
        setInviteRegistry((reg) => {
          const copy = { ...reg };
          if (p.invite) delete copy[p.invite.code];
          copy[code] = next;
          return copy;
        });
        return next;
      }),
    );
  }, []);

  const joinWithCode = useCallback(
    (code: string, memberName = "Teammate") => {
      const normalized = code.trim().toUpperCase();
      const source = inviteRegistry[normalized];
      if (!source) {
        return { ok: false as const, error: "That invitation code was not found." };
      }
      if (projects.some((p) => p.id === source.id)) {
        return { ok: true as const, projectId: source.id };
      }
      const role: MemberRole = source.invite?.role ?? "editor";
      const joined: Project = {
        ...source,
        members: [
          ...source.members,
          { id: makeId("member"), name: memberName, role },
        ],
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [joined, ...prev]);
      return { ok: true as const, projectId: joined.id };
    },
    [inviteRegistry, projects],
  );

  const value = useMemo(
    () => ({
      ready,
      projects,
      settings,
      updateSettings,
      openOnboarding,
      skipOnboarding,
      completeOnboarding,
      createProject,
      updateProject,
      deleteProject,
      getProject,
      completeSetup,
      regenerateInvite,
      joinWithCode,
      publishInvite,
    }),
    [
      ready,
      projects,
      settings,
      updateSettings,
      openOnboarding,
      skipOnboarding,
      completeOnboarding,
      createProject,
      updateProject,
      deleteProject,
      getProject,
      completeSetup,
      regenerateInvite,
      joinWithCode,
      publishInvite,
    ],
  );

  return (
    <BrainstormContext.Provider value={value}>{children}</BrainstormContext.Provider>
  );
}

export function useBrainstorm() {
  const ctx = useContext(BrainstormContext);
  if (!ctx) throw new Error("useBrainstorm must be used within BrainstormProvider");
  return ctx;
}
