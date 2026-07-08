"use client";

import { useEffect, useState } from "react";
import { comments as seedComments, type Comment } from "@/data/content";

const COMMENTS_STORAGE_KEY = "ac-gallery-comments";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-TT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function CommentsSection() {
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
      if (stored) setLocalComments(JSON.parse(stored));
    } catch {
      /* ignore */
    }
  }, []);

  const allComments = [...seedComments, ...localComments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newComment: Comment = {
      id: `local-${Date.now()}`,
      author: author.trim(),
      message: message.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [...localComments, newComment];
    setLocalComments(updated);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updated));
    setAuthor("");
    setMessage("");
  };

  return (
    <div>
      <ul className="space-y-4">
        {allComments.map((comment) => (
          <li key={comment.id} className="border border-cream-dark bg-surface p-6">
            <div className="mb-3 flex items-baseline justify-between gap-4">
              <p className="font-display text-lg font-semibold text-ink">{comment.author}</p>
              <time className="text-xs uppercase tracking-[0.1em] text-ink-faint">
                {formatDate(comment.date)}
              </time>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">{comment.message}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="mt-10 border border-cream-dark bg-surface p-6">
        <h3 className="font-display text-xl font-semibold text-ink">Leave a comment</h3>
        <p className="mt-1 text-sm text-ink-faint">
          Share a note or message. Comments are saved on this device for now.
        </p>

        <div className="mt-5 space-y-4">
          <label className="block text-sm text-ink-muted">
            Your name
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full border border-cream-dark bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-blush"
              required
            />
          </label>
          <label className="block text-sm text-ink-muted">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
              className="mt-1 w-full resize-y border border-cream-dark bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-blush"
              required
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-5 border border-ink bg-ink px-6 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-transparent hover:text-ink"
        >
          Post comment
        </button>
      </form>
    </div>
  );
}
