import Link from "next/link";

export function BrandMark({
  href = "/",
  size = "md",
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const text =
    size === "lg"
      ? "text-5xl sm:text-7xl md:text-8xl tracking-[-0.04em]"
      : size === "sm"
        ? "text-xl tracking-[-0.03em]"
        : "text-2xl tracking-[-0.03em]";

  return (
    <Link
      href={href}
      className={`font-display font-bold text-ink inline-flex items-baseline gap-2 ${text}`}
    >
      <span className="relative">
        Brainstorm
        <span
          aria-hidden
          className="absolute -right-3 top-1 h-2 w-2 rounded-[2px] bg-ember"
        />
      </span>
    </Link>
  );
}
