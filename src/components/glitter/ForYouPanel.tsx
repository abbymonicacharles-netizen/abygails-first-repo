"use client";

import { useState } from "react";
import { FEED, type FeedPost } from "@/data/mock";
import { Initials } from "./ui";

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
    <div className="space-y-4">
      <div className="panel p-5">
        <h2 className="font-display text-2xl font-bold">For You</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Short videos, progress, tutorials, gaming clips, art, and wins — personalized for your circle.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Following", "Progress", "Tutorials", "Art", "Funny"].map((f) => (
            <button key={f} type="button" className="chip">
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="feed-card fade-up">
            <div
              className="relative flex h-44 items-end p-4"
              style={{
                background: `linear-gradient(145deg, ${post.color}33, ${post.color}88), linear-gradient(180deg, #1a2230, #0f141c)`,
              }}
            >
              <span className="rounded-full bg-black/35 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                {KIND_LABEL[post.kind]}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Initials name={post.author} color={post.color} />
                <div>
                  <p className="text-sm font-semibold">{post.author}</p>
                  <p className="text-xs text-ink-faint">{post.handle}</p>
                </div>
                <button type="button" className="ml-auto rounded-full border border-line px-3 py-1 text-xs font-semibold">
                  Follow
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{post.caption}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
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
                  className={`chip ${post.saved ? "border-accent bg-accent-soft" : ""}`}
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
