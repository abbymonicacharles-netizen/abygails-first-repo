import { BookHub } from "@/components/scrapbook/BookHub";

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookHub bookId={id} />;
}
