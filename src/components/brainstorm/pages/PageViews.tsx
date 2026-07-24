"use client";

import type { ChapterPage, KanbanCard } from "@/data/types";

const columns: KanbanCard["column"][] = ["backlog", "doing", "review", "done"];
const columnLabels: Record<KanbanCard["column"], string> = {
  backlog: "Backlog",
  doing: "Doing",
  review: "Review",
  done: "Done",
};

export function PageViews({
  page,
  onChange,
}: {
  page: ChapterPage;
  onChange: (next: ChapterPage) => void;
}) {
  if (page.type === "kanban") {
    const cards = page.kanban ?? [];
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => (
          <div key={col} className="min-h-40 bg-paper/60 p-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-ink-faint">
              {columnLabels[col]}
            </h4>
            <ul className="mt-3 space-y-2">
              {cards
                .filter((c) => c.column === col)
                .map((card) => (
                  <li key={card.id} className="border border-line bg-surface px-3 py-2 text-sm">
                    <p className="font-medium text-ink">{card.title}</p>
                    {card.tags && (
                      <p className="mt-1 text-xs text-ink-faint">{card.tags.join(" · ")}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {columns
                        .filter((c) => c !== col)
                        .map((target) => (
                          <button
                            key={target}
                            type="button"
                            className="text-[0.65rem] font-semibold uppercase tracking-wide text-teal hover:underline"
                            onClick={() =>
                              onChange({
                                ...page,
                                kanban: cards.map((c) =>
                                  c.id === card.id ? { ...c, column: target } : c,
                                ),
                              })
                            }
                          >
                            → {columnLabels[target]}
                          </button>
                        ))}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (page.type === "whiteboard" || page.type === "moodboard" || page.type === "freeform") {
    const stickies = page.stickies ?? [];
    return (
      <div className="relative min-h-[420px] overflow-hidden border border-dashed border-line bg-[radial-gradient(circle_at_1px_1px,rgba(20,32,28,0.08)_1px,transparent_0)] [background-size:22px_22px]">
        {stickies.map((note) => (
          <button
            key={note.id}
            type="button"
            className="absolute w-36 p-3 text-left text-sm text-ink shadow-sm transition hover:-translate-y-0.5"
            style={{
              left: `${note.x}%`,
              top: `${note.y}%`,
              backgroundColor: note.color,
            }}
            onClick={() => {
              const next = prompt("Edit sticky note", note.text);
              if (next == null) return;
              onChange({
                ...page,
                stickies: stickies.map((s) =>
                  s.id === note.id ? { ...s, text: next } : s,
                ),
              });
            }}
          >
            {note.text}
          </button>
        ))}
        <button
          type="button"
          className="absolute bottom-4 right-4 bg-ink px-3 py-2 text-xs font-semibold text-surface"
          onClick={() => {
            const text = prompt("Sticky note text");
            if (!text) return;
            onChange({
              ...page,
              stickies: [
                ...stickies,
                {
                  id: `s-${Date.now()}`,
                  text,
                  x: 15 + Math.random() * 50,
                  y: 15 + Math.random() * 45,
                  color: ["#fde68a", "#bbf7d0", "#fecaca", "#bae6fd"][
                    Math.floor(Math.random() * 4)
                  ],
                },
              ],
            });
          }}
        >
          Add sticky
        </button>
      </div>
    );
  }

  if (page.type === "checklist") {
    const items = page.checklist ?? [];
    return (
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 border-b border-line/70 py-3"
          >
            <input
              type="checkbox"
              checked={item.done}
              onChange={() =>
                onChange({
                  ...page,
                  checklist: items.map((i) =>
                    i.id === item.id ? { ...i, done: !i.done } : i,
                  ),
                })
              }
              className="mt-1"
            />
            <div className="flex-1">
              <p
                className={`font-medium ${item.done ? "text-ink-faint line-through" : "text-ink"}`}
              >
                {item.title}
              </p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {item.priority}
                {item.due ? ` · due ${item.due}` : ""}
                {item.assignee ? ` · ${item.assignee}` : ""}
              </p>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-teal hover:underline"
            onClick={() => {
              const title = prompt("New checklist item");
              if (!title) return;
              onChange({
                ...page,
                checklist: [
                  ...items,
                  {
                    id: `c-${Date.now()}`,
                    title,
                    done: false,
                    priority: "medium",
                  },
                ],
              });
            }}
          >
            + Add item
          </button>
        </li>
      </ul>
    );
  }

  if (page.type === "timeline") {
    const events = page.timeline ?? [];
    return (
      <ol className="relative space-y-0 border-l-2 border-teal/40 pl-6">
        {events.map((ev) => (
          <li key={ev.id} className="relative pb-8 last:pb-0">
            <span
              className={`absolute -left-[1.55rem] top-1 h-3 w-3 rounded-sm ${
                ev.status === "done"
                  ? "bg-teal"
                  : ev.status === "active"
                    ? "bg-ember"
                    : "bg-ink-faint"
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
              {ev.date} · {ev.status}
            </p>
            <p className="mt-1 font-display text-lg font-bold text-ink">{ev.label}</p>
          </li>
        ))}
      </ol>
    );
  }

  if (page.type === "dashboard") {
    const lines = (page.content ?? "").split("\n").filter(Boolean);
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {lines.map((line) => {
          const [label, value] = line.split(":").map((s) => s.trim());
          return (
            <div key={line} className="bg-paper/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-ink">{value}</p>
            </div>
          );
        })}
      </div>
    );
  }

  // document | notebook | calendar | default
  return (
    <textarea
      value={page.content ?? ""}
      onChange={(e) => onChange({ ...page, content: e.target.value })}
      className="min-h-[420px] w-full resize-y bg-transparent text-base leading-7 text-ink outline-none"
      placeholder="Write freely… attach ideas, links, and notes."
    />
  );
}
