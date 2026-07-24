import { ProjectSetup } from "@/components/brainstorm/ProjectSetup";

export default async function SetupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectSetup projectId={id} />;
}
