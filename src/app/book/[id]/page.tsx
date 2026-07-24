import { WorkspaceShell } from "@/components/brainstorm/WorkspaceShell";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkspaceShell projectId={id} />;
}
