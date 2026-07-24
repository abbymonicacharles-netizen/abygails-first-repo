"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { genres } from "@/data/genres";
import { initialProjects } from "@/data/projects";
import type { GenreId, Project, ProjectHistoryEvent } from "@/data/types";

export type SortKey = "updated" | "title" | "progress" | "genre";

type BrainstormContextValue = {
  projects: Project[];
  query: string;
  setQuery: (q: string) => void;
  collection: string;
  setCollection: (c: string) => void;
  genreFilter: GenreId | "all";
  setGenreFilter: (g: GenreId | "all") => void;
  sortKey: SortKey;
  setSortKey: (s: SortKey) => void;
  showArchived: boolean;
  setShowArchived: (v: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (v: boolean) => void;
  filteredProjects: Project[];
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  createProject: (input: {
    title: string;
    genre: GenreId;
    collection: string;
    coverColor: string;
  }) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  getProject: (id: string) => Project | undefined;
  addHistory: (projectId: string, event: Omit<ProjectHistoryEvent, "id">) => void;
};

const BrainstormContext = createContext<BrainstormContextValue | null>(null);

function coverForGenre(genre: GenreId): { cover: string; spine: string } {
  const g = genres.find((x) => x.id === genre);
  const cover = g?.accent ?? "#334155";
  return { cover, spine: cover };
}

export function BrainstormProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState("All");
  const [genreFilter, setGenreFilter] = useState<GenreId | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [showArchived, setShowArchived] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (!showArchived && p.archived) return false;
      if (showArchived && !p.archived) return false;
      if (favoritesOnly && !p.favorite) return false;
      if (collection !== "All" && p.collection !== collection) return false;
      if (genreFilter !== "all" && p.genre !== genreFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.genre.includes(q) ||
        p.collection.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortKey === "title") return a.title.localeCompare(b.title);
      if (sortKey === "progress") return b.progress - a.progress;
      if (sortKey === "genre") return a.genre.localeCompare(b.genre);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [projects, query, collection, genreFilter, sortKey, showArchived, favoritesOnly]);

  const toggleFavorite = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
    );
  }, []);

  const toggleArchive = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)),
    );
  }, []);

  const createProject = useCallback(
    (input: {
      title: string;
      genre: GenreId;
      collection: string;
      coverColor: string;
    }) => {
      const id = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "project"}-${Date.now().toString(36)}`;
      const meta = genres.find((g) => g.id === input.genre);
      const { spine } = coverForGenre(input.genre);
      const chapters = (meta?.defaultChapters ?? ["Brainstorming", "Planning"]).map(
        (title, i) => ({
          id: `ch-${i}`,
          title,
          pages: [
            {
              id: `p-${i}-doc`,
              title: `${title} notes`,
              type: "document" as const,
              content: `Start writing in ${title}. This page is yours to shape.`,
            },
          ],
        }),
      );

      const project: Project = {
        id,
        title: input.title,
        subtitle: `${meta?.label ?? "Custom"} project book`,
        genre: input.genre,
        collection: input.collection,
        favorite: false,
        archived: false,
        updatedAt: new Date().toISOString().slice(0, 10),
        members: ["Abygail"],
        theme: "custom",
        progress: 0,
        style: {
          coverColor: input.coverColor || spine,
          spineColor: input.coverColor || spine,
          textColor: "#f8fafc",
          texture: "linen",
          decoration: { bookmarkColor: "#d85a1f" },
        },
        chapters,
        tasks: [],
        messages: [],
        history: [
          {
            id: `h-${Date.now()}`,
            at: "Just now",
            label: "Project book created",
            kind: "milestone",
          },
        ],
      };

      setProjects((prev) => [project, ...prev]);
      return id;
    },
    [],
  );

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  );

  const addHistory = useCallback(
    (projectId: string, event: Omit<ProjectHistoryEvent, "id">) => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                history: [
                  { ...event, id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
                  ...p.history,
                ],
              }
            : p,
        ),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      projects,
      query,
      setQuery,
      collection,
      setCollection,
      genreFilter,
      setGenreFilter,
      sortKey,
      setSortKey,
      showArchived,
      setShowArchived,
      favoritesOnly,
      setFavoritesOnly,
      filteredProjects,
      toggleFavorite,
      toggleArchive,
      createProject,
      updateProject,
      getProject,
      addHistory,
    }),
    [
      projects,
      query,
      collection,
      genreFilter,
      sortKey,
      showArchived,
      favoritesOnly,
      filteredProjects,
      toggleFavorite,
      toggleArchive,
      createProject,
      updateProject,
      getProject,
      addHistory,
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
