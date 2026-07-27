"use client";

import { useState } from "react";
import { CHATS, MESSAGES } from "@/data/mock";
import { Initials } from "./ui";

export function MessagesPanel() {
  const [active, setActive] = useState(CHATS[0].id);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const chat = CHATS.find((c) => c.id === active) ?? CHATS[0];

  return (
    <div className="panel grid min-h-[70svh] overflow-hidden lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 border-b border-line p-4">
          <div>
            <h2 className="font-display text-xl font-bold">Messages</h2>
            <p className="text-xs text-ink-faint">Private & group conversations</p>
          </div>
          <button type="button" className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-surface">
            + New
          </button>
        </div>
        <div className="border-b border-line p-3">
          <input
            placeholder="Search chats, files, GIFs…"
            className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        <ul className="scroll-y max-h-[40svh] lg:max-h-none">
          {CHATS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActive(c.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                  active === c.id ? "bg-accent-soft" : "hover:bg-paper"
                }`}
              >
                <Initials name={c.name} color={c.color} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold">{c.name}</span>
                    {c.pinned && <span className="text-[0.65rem] text-gold">📌</span>}
                  </span>
                  <span className="block truncate text-xs text-ink-faint">{c.last}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[0.65rem] text-ink-faint">{c.time}</span>
                  {c.unread > 0 && (
                    <span className="mt-1 inline-flex rounded-full bg-coral px-1.5 text-[0.65rem] font-bold text-white">
                      {c.unread}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex min-h-[50svh] flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            <h3 className="font-semibold">{chat.name}</h3>
            <p className="text-xs text-ink-faint">
              {chat.kind === "group" ? "Group chat" : "One-on-one"} · reply, edit, react, pin
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["📞 Voice", "🎥 Video", "🖥️ Share"].map((a) => (
              <button
                key={a}
                type="button"
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-semibold"
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        <div className="scroll-y flex-1 space-y-3 p-4">
          <div className="rounded-xl border border-dashed border-line bg-paper px-3 py-2 text-center text-xs text-ink-faint">
            Pinned · whiteboard notes for tonight’s room
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`msg-bubble ${m.mine ? "mine" : "theirs"}`}>
              {m.replyTo && (
                <p className={`mb-1 text-[0.7rem] ${m.mine ? "text-white/60" : "text-ink-faint"}`}>
                 ↩ {m.replyTo}
                </p>
              )}
              <p>{m.text}</p>
              <div className={`mt-1 flex items-center gap-2 text-[0.65rem] ${m.mine ? "text-white/55" : "text-ink-faint"}`}>
                <span>{m.time}</span>
                {m.reaction && <span className="rounded-full bg-surface/20 px-1.5">{m.reaction}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-3">
          <div className="mb-2 flex flex-wrap gap-2 text-xs font-semibold text-ink-soft">
            {["🎙 Voice", "📷 Photo", "📎 File", "GIF", "😊 Sticker", "📊 Poll"].map((t) => (
              <button key={t} type="button" className="rounded-full border border-line bg-paper px-2.5 py-1">
                {t}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setMessages((prev) => [
                ...prev,
                {
                  id: `local-${Date.now()}`,
                  author: "You",
                  mine: true,
                  text: draft.trim(),
                  time: "Now",
                },
              ]);
              setDraft("");
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write a message… (reply · edit · delete for everyone)"
              className="flex-1 rounded-xl border border-line bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            <button type="submit" className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-surface">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
