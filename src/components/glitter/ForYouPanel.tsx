"use client";

import { useState } from "react";
import { FEED, type FeedPost } from "@/data/mock";
import { AvatarBubble } from "./HumanAvatar";

const KIND_LABEL: Record<FeedPost["kind"], string> = {
  video: "Short video",
  progress: "Project progress",
  art: "Art",
  clip: "Clip",
  tutorial: "Tutorial",
};

export function ForYouPanel() {
  const [posts, setPosts] = useState(FEED);

  function toggle(id: string, key: "liked" | "saved") {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        if (key === "liked") {
          const liked = !p.liked;
          return { ...p, liked, likes: p.likes + (liked ? 1 : -1) };
        }
        return { ...p, saved: !p.saved };
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div className="panel relative overflow-hidden p-6 sm:p-8">
        <span className="float-icon absolute right-10 top-8 text-3xl opacity-60">🎥</span>
        <h2 className="font-display text-3xl font-bold">
          For <span className="iri-text">You</span>
        </h2>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Progress, tutorials, art, and clips — spaced out, not crowded.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Following", "Progress", "Tutorials", "Art", "Funny"].map((f) => (
            <button key={f} type="button" className="chip">
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="feed-card fade-up">
            <div
              className="relative flex h-40 items-end p-4"
              style={{
                background: `linear-gradient(145deg, ${post.color}44, ${post.color}99), linear-gradient(180deg, #1a1830, #0b0c12)`,
              }}
            >
              <span className="rounded-full bg-black/35 px-3 py-1 text-[0.7rem] font-bold text-white backdrop-blur">
                {KIND_LABEL[post.kind]}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3">
                <AvatarBubble config={post.avatar} size={44} />
                <div>
                  <p className="text-sm font-bold">{post.author}</p>
                  <p className="text-xs text-ink-faint">{post.handle}</p>
                </div>
                <button type="button" className="btn btn-ghost ml-auto !py-1.5 !text-xs">
                  Follow
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{post.caption}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => toggle(post.id, "liked")}
                  className={`chip ${post.liked ? "border-coral bg-coral/10" : ""}`}
                >
                  ♥ {post.likes}
                </button>
                <button type="button" className="chip">
                  💬 {post.comments}
                </button>
                <button type="button" className="chip">
                  ↗ Share
                </button>
                <button
                  type="button"
                  onClick={() => toggle(post.id, "saved")}
                  className={`chip ${post.saved ? "border-transparent bg-ink text-paper" : ""}`}
                >
                  {post.saved ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
