"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBrainstorm } from "@/context/BrainstormContext";

export function JoinProjectModal({
  open,
  onClose,
  initialCode = "",
}: {
  open: boolean;
  onClose: () => void;
  initialCode?: string;
}) {
  const { joinWithCode } = useBrainstorm();
  const router = useRouter();
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close"
        onClick={onClose}
      />
      <form
        className="relative z-10 w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          const result = joinWithCode(code);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          onClose();
          router.push(`/book/${result.projectId}`);
        }}
      >
        <h2 className="font-display text-xl font-bold">Join project</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Enter a one-time invitation code to add a project to your bookshelf.
        </p>
        <input
          autoFocus
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="Invitation code"
          className="mt-5 w-full rounded-xl border border-line bg-paper px-4 py-3 font-mono tracking-widest outline-none focus:border-accent"
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-ink-soft">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-surface"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
}
