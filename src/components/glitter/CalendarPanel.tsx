"use client";

import { useState } from "react";
import { Modal } from "./ui";

type Ev = { id: string; title: string; when: string; rsvp: "yes" | "maybe" | "no" | "none" };

export function CalendarPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<Ev[]>([]);
  const [title, setTitle] = useState("");

  return (
    <Modal title="Calendar" onClose={onClose}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          setItems((prev) => [
            ...prev,
            { id: String(Date.now()), title: title.trim(), when: "Soon", rsvp: "none" },
          ]);
          setTitle("");
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New event"
          className="flex-1 rounded-full border border-line bg-paper px-3 py-2 text-sm outline-none"
        />
        <button type="submit" className="btn btn-primary !text-xs">
          Add
        </button>
      </form>
      <ul className="mt-4 space-y-2">
        {items.length === 0 && <li className="py-6 text-center text-sm text-ink-faint">No events</li>}
        {items.map((ev) => (
          <li key={ev.id} className="rounded-2xl border border-line bg-paper p-3">
            <p className="font-bold">{ev.title}</p>
            <p className="text-xs text-ink-faint">{ev.when}</p>
            <div className="mt-2 flex gap-1">
              {(["yes", "maybe", "no"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`chip capitalize ${ev.rsvp === r ? "border-transparent bg-ink text-paper" : ""}`}
                  onClick={() => setItems((prev) => prev.map((x) => (x.id === ev.id ? { ...x, rsvp: r } : x)))}
                >
                  {r}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
