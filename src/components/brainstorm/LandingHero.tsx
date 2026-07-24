"use client";

import Link from "next/link";
import { BrandMark } from "./BrandMark";

const previewBooks = [
  { title: "Nebula", color: "#0f4c45", spine: "#083832", mark: "#d85a1f" },
  { title: "Atelier", color: "#9a3412", spine: "#7c2d12", mark: "#0f6e62" },
  { title: "Garden", color: "#3d5a40", spine: "#2d4230", mark: "#ca8a04" },
  { title: "Frame", color: "#1f2937", spine: "#111827", mark: "#e11d48" },
  { title: "Ledger", color: "#1e3a5f", spine: "#152a45", mark: "#ca8a04" },
];

export function LandingHero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bs-atmosphere">
      <div className="bs-grain absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 pb-10 pt-6 sm:px-8">
        <header className="flex items-center justify-between animate-bs-rise">
          <BrandMark size="sm" href="/" />
          <Link
            href="/shelf"
            className="text-sm font-semibold text-teal-deep underline-offset-4 hover:underline"
          >
            Open shelf
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-end gap-10 pb-6 pt-16 lg:justify-center lg:pb-0">
          <div className="max-w-3xl">
            <BrandMark size="lg" href="/shelf" />
            <h1 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-5xl animate-bs-rise-delay-1">
              Every project becomes a book you can open, decorate, and work inside.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg animate-bs-rise-delay-2">
              Plans, notes, boards, and checklists live as chapters inside each
              project book — a workspace that feels like a library, not a folder.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-bs-rise-delay-2">
              <Link
                href="/shelf"
                className="inline-flex items-center justify-center bg-ink px-6 py-3 text-sm font-semibold text-surface transition hover:bg-teal-deep"
              >
                Enter your bookshelf
              </Link>
              <a
                href="#how"
                className="text-sm font-semibold text-ink-soft underline-offset-4 hover:text-ink hover:underline"
              >
                How books work
              </a>
            </div>
          </div>

          {/* Full-bleed shelf visual plane */}
          <div className="relative -mx-5 sm:-mx-8 animate-bs-rise-delay-2">
            <div className="relative overflow-hidden px-5 pb-4 pt-8 sm:px-8">
              <div className="flex items-end justify-center gap-3 sm:gap-5">
                {previewBooks.map((book, i) => (
                  <div
                    key={book.title}
                    className="book-cover animate-bs-book-float relative h-36 w-16 sm:h-48 sm:w-24 md:h-56 md:w-28"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <div
                      className="absolute right-0 top-1 bottom-1 w-1 translate-x-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #e8efe9, #f7faf8 40%, #d7e0da)",
                      }}
                    />
                    <div
                      className="relative h-full w-full overflow-hidden rounded-r-md rounded-l-sm shadow-[4px_10px_24px_rgba(20,32,28,0.35)]"
                      style={{ backgroundColor: book.color }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 w-2.5"
                        style={{ backgroundColor: book.spine }}
                      />
                      <span
                        className="absolute right-2 top-0 h-8 w-2"
                        style={{
                          backgroundColor: book.mark,
                          clipPath:
                            "polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)",
                        }}
                      />
                      <p className="absolute bottom-3 left-4 right-2 font-display text-xs font-bold text-white/90 sm:text-sm md:text-base">
                        {book.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="shelf-wood relative z-10 mx-auto mt-0 h-3 max-w-5xl rounded-sm shadow-[0_8px_20px_rgba(20,32,28,0.35)]" />
              <div className="mx-auto h-2 max-w-5xl bg-shelf-edge/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingSections() {
  return (
    <>
      <section id="how" className="bg-surface px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            From shelf to chapter
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            One clear path: browse your library, open a book, work page by page.
          </p>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Collect books",
                body: "Projects live on a virtual shelf with covers, textures, bookmarks, and collections you can search and sort.",
              },
              {
                step: "02",
                title: "Open chapters",
                body: "Inside each book: brainstorming, research, planning, design, development, meetings, and more — your call.",
              },
              {
                step: "03",
                title: "Create on pages",
                body: "Documents, whiteboards, Kanban boards, timelines, and checklists — each page is a place to work.",
              },
            ].map((item) => (
              <li key={item.step}>
                <p className="font-display text-sm font-semibold tracking-[0.2em] text-teal">
                  {item.step}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bs-atmosphere px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Built for creative projects that still need structure
            </h2>
            <p className="mt-4 max-w-xl text-ink-soft">
              Genre templates, tasks, history, and visual themes sit beside your
              pages — everything stays inside the same project book.
            </p>
          </div>
          <ul className="space-y-3 text-sm text-ink-soft">
            {[
              "Genres: robotics, film, research, software, and custom",
              "Themes from minimal to vintage to fully custom",
              "Tasks, checklists, and project history in every book",
              "Works on desktop, tablet, and mobile",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-ember" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-line bg-shelf px-5 py-10 text-paper sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl font-bold">Brainstorm</p>
          <p className="text-sm text-paper/70">
            Project books for teams who think in chapters.
          </p>
          <Link
            href="/shelf"
            className="text-sm font-semibold text-ember-soft underline-offset-4 hover:underline"
          >
            Open the shelf
          </Link>
        </div>
      </footer>
    </>
  );
}
