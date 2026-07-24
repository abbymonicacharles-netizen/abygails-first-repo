import Image from "next/image";
import Link from "next/link";

export function BrandMark({
  href = "/",
  size = "md",
  showWordmark = true,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const img =
    size === "lg" ? 56 : size === "sm" ? 28 : 36;
  const text =
    size === "lg"
      ? "text-4xl sm:text-5xl tracking-[-0.03em]"
      : size === "sm"
        ? "text-lg tracking-[-0.02em]"
        : "text-xl tracking-[-0.02em]";

  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-ink">
      <Image
        src="/brainstorm-logo.png"
        alt="Brainstorm"
        width={img}
        height={img}
        className="rounded-md"
        priority
      />
      {showWordmark && (
        <span className={`font-display font-bold ${text}`}>Brainstorm</span>
      )}
    </Link>
  );
}
