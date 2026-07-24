import { Suspense } from "react";
import { WorkspaceShell } from "@/components/brainstorm/WorkspaceShell";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-[100svh] bg-paper" />}>
      <WorkspaceShell projectId={id} />
    </Suspense>
  );
}
