"use client";

import { useState } from "react";
import { collections } from "@/data/projects";
import { genres } from "@/data/genres";
import type { GenreId } from "@/data/types";
import { useBrainstorm, type SortKey } from "@/context/BrainstormContext";
import { BrandMark } from "./BrandMark";
import { BookCover } from "./BookCover";
import { NewProjectModal } from "./NewProjectModal";

export function BookshelfView() {
  const {
    filteredProjects,
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
    toggleFavorite,
  } = useBrainstorm();
  const [newOpen, setNewOpen] = useState(false);

  return (
    <div className="relative min-h-[100svh] bs-atmosphere">
      <div className="bs-grain absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-20 pt-6 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <BrandMark size="sm" href="/" />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setNewOpen(true)}
              className="bg-ink px-4 py-2 text-sm font-semibold text-surface hover:bg-teal-deep"
            >
              New book
            </button>
          </div>
        </header>

        <div className="mt-10 max-w-2xl animate-bs-rise">
          <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Your bookshelf
          </h1>
          <p className="mt-3 text-ink-soft">
            Search, filter, and open any project as a living book.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 animate-bs-rise-delay-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, genres, collections…"
            className="w-full border border-line bg-surface/80 px-4 py-3 text-ink outline-none backdrop-blur-sm focus:border-teal"
          />

          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCollection(c);
                  setShowArchived(c === "Archive");
                }}
                className={`px-3 py-1.5 text-sm font-medium transition ${
                  collection === c
                    ? "bg-ink text-surface"
                    : "bg-surface/70 text-ink-soft hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-ink-soft">
              Genre
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value as GenreId | "all")}
                className="border border-line bg-surface px-2 py-1.5 text-ink"
              >
                <option value="all">All</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-ink-soft">
              Sort
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="border border-line bg-surface px-2 py-1.5 text-ink"
              >
                <option value="updated">Recently updated</option>
                <option value="title">Title</option>
                <option value="progress">Progress</option>
                <option value="genre">Genre</option>
              </select>
            </label>

            <button
              type="button"
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-3 py-1.5 font-medium ${
                favoritesOnly ? "bg-ember text-white" : "bg-surface/70 text-ink-soft"
              }`}
            >
              Favorites
            </button>

            <button
              type="button"
              onClick={() => {
                setShowArchived(!showArchived);
                setCollection(showArchived ? "All" : "Archive");
              }}
              className={`px-3 py-1.5 font-medium ${
                showArchived ? "bg-shelf text-paper" : "bg-surface/70 text-ink-soft"
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex flex-wrap items-end justify-center gap-x-6 gap-y-10 px-2 sm:justify-start sm:gap-x-8">
            {filteredProjects.map((project, i) => (
              <BookCover
                key={project.id}
                project={project}
                index={i}
                onFavorite={() => toggleFavorite(project.id)}
              />
            ))}
            {filteredProjects.length === 0 && (
              <p className="w-full py-16 text-center text-ink-faint">
                No books on this shelf. Try another filter or create a new book.
              </p>
            )}
          </div>
          <div className="shelf-wood mt-2 h-3 w-full rounded-sm shadow-[0_8px_18px_rgba(20,32,28,0.3)]" />
          <div className="h-2 w-full bg-shelf-edge/70" />
        </div>
      </div>

      <NewProjectModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}
