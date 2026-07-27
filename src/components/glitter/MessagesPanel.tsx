"use client";

import { useState } from "react";
import { CHATS, MESSAGES } from "@/data/mock";
import { AvatarBubble } from "./HumanAvatar";

export function MessagesPanel() {
  const [active, setActive] = useState(CHATS[0].id);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(MESSAGES);
  const chat = CHATS.find((c) => c.id === active) ?? CHATS[0];

  return (
    <div className="panel grid min-h-[70svh] overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 p-5">
          <div>
            <h2 className="font-display text-2xl font-bold">Messages</h2>
            <p className="mt-1 text-xs text-ink-faint">Clear bubbles · obvious actions</p>
          </div>
          <button type="button" className="btn btn-primary !px-3 !py-2 !text-xs">
            + New
          </button>
        </div>
        <div className="px-4 pb-3">
          <input
            placeholder="Search chats…"
            className="w-full rounded-full border border-line bg-paper/80 px-4 py-2.5 text-sm outline-none focus:border-violet"
          />
        </div>
        <ul className="scroll-y max-h-[42svh] space-y-1 px-2 pb-3 lg:max-h-none">
          {CHATS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setActive(c.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                  active === c.id ? "bg-accent-soft" : "hover:bg-paper/70"
                }`}
              >
                <AvatarBubble config={c.avatar} size={46} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-bold">{c.name}</span>
                    {c.pinned && <span className="text-[0.65rem]">📌</span>}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-ink-faint">{c.last}</span>
                </span>
                <span className="text-right">
                  <span className="block text-[0.65rem] text-ink-faint">{c.time}</span>
                  {c.unread > 0 && (
                    <span className="mt-1 inline-flex min-w-5 justify-center rounded-full bg-coral px-1.5 text-[0.65rem] font-bold text-white">
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <AvatarBubble config={chat.avatar} size={44} />
            <div>
              <h3 className="font-bold">{chat.name}</h3>
              <p className="text-xs text-ink-faint">
                {chat.kind === "group" ? "Group" : "Direct"} · reply · react · pin
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-ghost !py-2 !text-xs">
              📞 Voice
            </button>
            <button type="button" className="btn btn-ghost !py-2 !text-xs">
              🎥 Video
            </button>
            <button type="button" className="btn btn-ink !py-2 !text-xs">
              🖥️ Share
            </button>
          </div>
        </div>

        <div className="scroll-y flex-1 space-y-3 p-5">
          <div className="mx-auto max-w-sm rounded-full border border-dashed border-line bg-paper/60 px-4 py-2 text-center text-xs text-ink-faint">
            Pinned · whiteboard notes for tonight’s room
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`msg-bubble ${m.mine ? "mine" : "theirs"}`}>
              {m.replyTo && (
                <p className={`mb-1 text-[0.7rem] ${m.mine ? "text-ink/55" : "text-ink-faint"}`}>
                  ↩ {m.replyTo}
                </p>
              )}
              <p>{m.text}</p>
              <div className={`mt-1.5 flex items-center gap-2 text-[0.65rem] font-semibold ${m.mine ? "text-ink/55" : "text-ink-faint"}`}>
                <span>{m.time}</span>
                {m.reaction && <span className="rounded-full bg-white/50 px-1.5">{m.reaction}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-line p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {["🎙 Voice", "📷 Photo", "📎 File", "GIF", "✨ Sticker", "📊 Poll"].map((t) => (
              <button key={t} type="button" className="chip float-icon">
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
              placeholder="Write a clear message…"
              className="flex-1 rounded-full border border-line bg-paper/80 px-4 py-3 text-sm outline-none focus:border-violet"
            />
            <button type="submit" className="btn btn-primary !px-5">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
