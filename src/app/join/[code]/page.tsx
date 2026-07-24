"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JoinProjectModal } from "@/components/brainstorm/JoinProjectModal";
import { BrandMark } from "@/components/brainstorm/BrandMark";
import { useBrainstorm } from "@/context/BrainstormContext";

export default function JoinPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const { joinWithCode, ready } = useBrainstorm();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [autoTried, setAutoTried] = useState(false);

  useEffect(() => {
    if (!ready || autoTried) return;
    setAutoTried(true);
    const result = joinWithCode(code);
    if (result.ok) {
      router.replace(`/book/${result.projectId}`);
    }
  }, [ready, code, autoTried, joinWithCode, router]);

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4 bs-room px-5">
      <BrandMark />
      <p className="text-sm text-ink-soft">Joining project with code {code.toUpperCase()}…</p>
      <JoinProjectModal
        open={open}
        initialCode={code.toUpperCase()}
        onClose={() => {
          setOpen(false);
          router.push("/");
        }}
      />
    </div>
  );
}
