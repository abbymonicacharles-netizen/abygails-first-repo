"use client";

import { useState } from "react";
import type { Project } from "@/data/types";

const prompts = [
  "Summarize this project",
  "Generate task list",
  "Suggest next deadline",
  "Brainstorm ideas",
  "Draft a status report",
];

function replyFor(prompt: string, project: Project): string {
  const openTasks = project.tasks.filter((t) => !t.done).length;
  if (prompt.includes("Summarize")) {
    return `${project.title} is a ${project.genre} book at ${project.progress}% progress with ${project.chapters.length} chapters and ${openTasks} open tasks. Recent focus: ${project.history[0]?.label ?? "getting started"}.`;
  }
  if (prompt.includes("task")) {
    return `Suggested tasks for ${project.title}:\n• Clarify the next milestone in Planning\n• Assign owners on open checklist items\n• Capture meeting decisions on the Meetings page\n• Link related files from Drive or Figma`;
  }
  if (prompt.includes("deadline")) {
    return `Based on progress (${project.progress}%) and open work, aim for a check-in in 5 days and a chapter freeze in 14 days.`;
  }
  if (prompt.includes("Brainstorm")) {
    return `Ideas: add a mood board for visual constraints; turn sticky notes into Kanban cards; create a resources chapter for integrations; invite a teammate to annotate the active page.`;
  }
  return `Draft status: ${project.title} is moving through ${project.chapters.map((c) => c.title).slice(0, 3).join(", ")}. Next narrative beat: close the active milestone and publish a short presentation page for stakeholders.`;
}

export function AiAssistant({ project }: { project: Project }) {
  const [log, setLog] = useState<{ role: "you" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: `I'm the project assistant for ${project.title}. Ask me to summarize, organize, or generate next steps from what's already in this book.`,
    },
  ]);
  const [input, setInput] = useState("");

  function ask(prompt: string) {
    const cleaned = prompt.trim();
    if (!cleaned) return;
    setLog((prev) => [
      ...prev,
      { role: "you", text: cleaned },
      { role: "ai", text: replyFor(cleaned, project) },
    ]);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-3">
        <h3 className="font-display text-lg font-bold text-ink">AI assistant</h3>
        <p className="text-xs text-ink-faint">Grounded in this project book</p>
      </div>
      <div className="flex flex-wrap gap-1.5 px-3 py-3">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => ask(p)}
            className="bg-paper px-2 py-1 text-[0.7rem] font-medium text-ink-soft hover:text-ink"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-3">
        {log.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={`text-sm leading-relaxed ${
              m.role === "ai" ? "text-ink" : "text-teal-deep"
            }`}
          >
            <span className="font-semibold uppercase tracking-wide text-[0.65rem] text-ink-faint">
              {m.role === "ai" ? "Assistant" : "You"}
            </span>
            <p className="mt-1 whitespace-pre-wrap">{m.text}</p>
          </div>
        ))}
      </div>
      <form
        className="border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this project…"
          className="w-full border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-teal"
        />
      </form>
    </div>
  );
}
