"use client";

import { useState } from "react";
import { makeAvatar, type AvatarConfig } from "@/data/types";
import { AvatarBubble } from "./HumanAvatar";
import { IconBookmark, IconHeart, IconShare, IconMessages } from "./Icons";

type Post = {
  id: string;
  author: string;
  handle: string;
  caption: string;
  likes: number;
  comments: number;
  liked?: boolean;
  saved?: boolean;
  avatar: AvatarConfig;
};

const SEED: Post[] = [
  {
    id: "1",
    author: "Glitter",
    handle: "@glitter",
    caption: "Welcome.",
    likes: 0,
    comments: 0,
    avatar: makeAvatar({ clothingColor: "#5b4db8", hairStyle: "buns" }),
  },
];

export function ForYouPanel() {
  const [posts, setPosts] = useState(SEED);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="feed-card">
          <div className="h-40 bg-gradient-to-br from-[#d7e8f4] via-[#ddd6fe] to-[#fce7f3]" />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <AvatarBubble config={post.avatar} size={40} />
              <div>
                <p className="text-sm font-bold">{post.author}</p>
                <p className="text-xs text-ink-faint">{post.handle}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-soft">{post.caption}</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="chip"
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === post.id
                        ? {
                            ...p,
                            liked: !p.liked,
                            likes: p.likes + (p.liked ? -1 : 1),
                          }
                        : p,
                    ),
                  )
                }
              >
                <IconHeart size={16} filled={post.liked} /> {post.likes}
              </button>
              <button type="button" className="chip">
                <IconMessages size={16} /> {post.comments}
              </button>
              <button type="button" className="chip">
                <IconShare size={16} />
              </button>
              <button
                type="button"
                className="chip"
                onClick={() =>
                  setPosts((prev) =>
                    prev.map((p) => (p.id === post.id ? { ...p, saved: !p.saved } : p)),
                  )
                }
              >
                <IconBookmark size={16} filled={post.saved} />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
