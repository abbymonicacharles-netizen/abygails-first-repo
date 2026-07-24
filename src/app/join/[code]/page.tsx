"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/scrapbook/BrandMark";
import { useBookshelf } from "@/context/BookshelfContext";

export default function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const { joinWithCode, ready } = useBookshelf();
  const router = useRouter();
  const [err, setErr] = useState("");

  if (!ready) return <div className="room min-h-[100svh]" />;

  return (
    <div className="room flex min-h-[100svh] flex-col items-center justify-center gap-4 px-5">
      <BrandMark />
      <form
        className="soft-card w-full max-w-sm p-6"
        onSubmit={(e) => {
          e.preventDefault();
          const res = joinWithCode(code);
          if (!res.ok) {
            setErr(res.error);
            return;
          }
          router.replace(`/book/${res.id}`);
        }}
      >
        <h1 className="font-display text-xl font-bold">Join book</h1>
        <p className="mt-2 font-mono tracking-widest">{code.toUpperCase()}</p>
        {err && <p className="mt-2 text-sm text-blush">{err}</p>}
        <button
          type="submit"
          className="mt-4 w-full rounded-2xl bg-sage py-3 text-sm font-bold text-white"
        >
          Add to my shelf
        </button>
      </form>
    </div>
  );
}
