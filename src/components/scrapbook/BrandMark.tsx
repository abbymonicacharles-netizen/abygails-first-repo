import Image from "next/image";
import Link from "next/link";

export function BrandMark({ size = "md" }: { size?: "sm" | "md" }) {
  const wh = size === "sm" ? 32 : 40;
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 text-ink">
      <Image
        src="/brainstorm-logo.png"
        alt="Brainstorm"
        width={wh}
        height={wh}
        className="rounded-xl"
        priority
      />
      <span className="font-display text-xl font-bold tracking-tight">Brainstorm</span>
    </Link>
  );
}
