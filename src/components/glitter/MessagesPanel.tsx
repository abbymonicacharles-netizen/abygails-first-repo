"use client";

import { useMemo, useState } from "react";
import { displayNameFor, getUser, sendFriendRequest } from "@/data/auth";
import type { ChatMessage, GlitterUser } from "@/data/types";
import { makeAvatar } from "@/data/types";
import { AvatarBubble } from "./HumanAvatar";
import {
  IconMore,
  IconPhone,
  IconSearch,
  IconSend,
  IconVideo,
  IconPlus,
} from "./Icons";
import { CallOverlay } from "./CallOverlay";

export function MessagesPanel({
  user,
  onPatchUser,
}: {
  user: GlitterUser;
  onPatchUser: (p: Partial<GlitterUser>) => void;
}) {
  const chats = useMemo(() => {
    return user.friends.map((uname) => {
      const friend = getUser(uname);
      return {
        id: uname,
        name: displayNameFor(user, uname),
        username: uname,
        avatar: friend?.avatar ?? makeAvatar(),
        last: "Say hi",
        time: "",
      };
    });
  }, [user]);

  const [active, setActive] = useState<string | null>(chats[0]?.id ?? null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [addUser, setAddUser] = useState("");
  const [addErr, setAddErr] = useState("");
  const [nickEdit, setNickEdit] = useState(false);
  const [nick, setNick] = useState("");
  const [call, setCall] = useState<"voice" | "video" | null>(null);

  const activeChat = chats.find((c) => c.id === active) ?? null;

  function addFriend(e: React.FormEvent) {
    e.preventDefault();
    setAddErr("");
    const res = sendFriendRequest(user.username, addUser);
    if (!res.ok) {
      setAddErr(res.error);
      return;
    }
    const me = getUser(user.username);
    if (me) onPatchUser({ friendRequestsOut: me.friendRequestsOut });
    setAddUser("");
  }

  function saveNick() {
    if (!activeChat) return;
    onPatchUser({
      nicknames: { ...user.nicknames, [activeChat.username]: nick.trim() },
    });
    setNickEdit(false);
  }

  return (
    <div className="panel grid min-h-[70svh] overflow-hidden lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border-b border-line lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-display text-xl font-bold">Messages</h2>
        </div>
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2">
            <IconSearch size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <form onSubmit={addFriend} className="flex gap-2 px-3 pb-3">
          <input
            value={addUser}
            onChange={(e) => setAddUser(e.target.value)}
            placeholder="@username"
            className="min-w-0 flex-1 rounded-full border border-line bg-paper px-3 py-2 text-xs font-semibold outline-none"
          />
          <button type="submit" className="btn btn-ink !p-2" aria-label="Add friend">
            <IconPlus size={16} />
          </button>
        </form>
        {addErr && <p className="px-4 pb-2 text-xs font-semibold text-coral">{addErr}</p>}

        <ul className="scroll-y max-h-[45svh] px-2 pb-3 lg:max-h-none">
          {chats.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-ink-faint">0 friends</li>
          )}
          {chats
            .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.username.includes(query.toLowerCase()))
            .map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(c.id);
                    setNick(user.nicknames[c.username] || "");
                    setNickEdit(false);
                    setMessages([]);
                  }}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                    active === c.id ? "bg-accent-soft" : "hover:bg-paper"
                  }`}
                >
                  <AvatarBubble config={c.avatar} size={44} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{c.name}</span>
                    <span className="block truncate text-xs text-ink-faint">@{c.username}</span>
                  </span>
                </button>
              </li>
            ))}
        </ul>
      </aside>

      <section className="flex min-h-[50svh] flex-col">
        {!activeChat ? (
          <div className="grid flex-1 place-items-center text-sm text-ink-faint">Select a chat</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
              <div className="flex items-center gap-3">
                <AvatarBubble config={activeChat.avatar} size={42} />
                <div>
                  {nickEdit ? (
                    <div className="flex gap-2">
                      <input
                        value={nick}
                        onChange={(e) => setNick(e.target.value)}
                        className="rounded-xl border border-line px-2 py-1 text-sm font-bold outline-none"
                        placeholder="Nickname (only you see)"
                      />
                      <button type="button" className="btn btn-ink !py-1 !text-xs" onClick={saveNick}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="text-left" onClick={() => setNickEdit(true)}>
                      <p className="font-bold">{displayNameFor(user, activeChat.username)}</p>
                      <p className="text-xs text-ink-faint">@{activeChat.username}</p>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" className="btn btn-ghost !p-2" onClick={() => setCall("voice")} aria-label="Voice call">
                  <IconPhone size={18} />
                </button>
                <button type="button" className="btn btn-ghost !p-2" onClick={() => setCall("video")} aria-label="Video call">
                  <IconVideo size={18} />
                </button>
                <button type="button" className="btn btn-ghost !p-2" aria-label="More">
                  <IconMore size={18} />
                </button>
              </div>
            </div>

            <div className="scroll-y flex-1 space-y-3 p-4">
              {messages.length === 0 && (
                <p className="py-10 text-center text-sm text-ink-faint">No messages yet</p>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`msg-bubble ${m.mine ? "mine" : "theirs"}`}>
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[0.65rem] font-semibold ${m.mine ? "text-ink/50" : "text-ink-faint"}`}>
                    {m.time}
                  </p>
                </div>
              ))}
            </div>

            <form
              className="flex gap-2 border-t border-line p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `m-${Date.now()}`,
                    author: user.username,
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
                className="flex-1 rounded-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-violet"
                placeholder="Message"
              />
              <button type="submit" className="btn btn-primary !px-4" aria-label="Send">
                <IconSend size={18} />
              </button>
            </form>
          </>
        )}
      </section>

      {call && activeChat && (
        <CallOverlay
          kind={call}
          name={displayNameFor(user, activeChat.username)}
          avatar={activeChat.avatar}
          onEnd={() => setCall(null)}
        />
      )}
    </div>
  );
}
