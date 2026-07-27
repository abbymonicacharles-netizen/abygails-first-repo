"use client";

import { useState } from "react";
import type { CalEvent } from "@/data/mock";
import { Modal } from "./ui";

export function CalendarPanel({
  events,
  onClose,
}: {
  events: CalEvent[];
  onClose: () => void;
}) {
  const [items, setItems] = useState(events);

  function setRsvp(id: string, rsvp: CalEvent["rsvp"]) {
    setItems((prev) => prev.map((e) => (e.id === id ? { ...e, rsvp } : e)));
  }

  return (
    <Modal title="Calendar" onClose={onClose} wide>
      <p className="text-sm text-ink-soft">
        Meetings, study sessions, movie nights, birthdays, and deadlines — with invites, RSVPs, and reminders.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Invitations", "RSVPs", "Reminders", "Recurring"].map((f) => (
          <span key={f} className="chip">
            {f}
          </span>
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((event) => (
          <li key={event.id} className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{event.title}</p>
                <p className="mt-1 text-xs text-ink-faint">
                  {event.when} · {event.type}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {(["yes", "maybe", "no"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRsvp(event.id, r)}
                    className={`rounded-full px-2.5 py-1 text-[0.7rem] font-semibold capitalize ${
                      event.rsvp === r ? "bg-ink text-surface" : "border border-line bg-surface"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="mt-4 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-semibold">
        + Schedule event
      </button>
    </Modal>
  );
}
