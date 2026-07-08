import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-cream-dark bg-cream px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <p className="text-sm text-ink-faint">
            © {new Date().getFullYear()} Abygail Charles · East Trinidad &amp; Tobago
          </p>
        </div>
        <div className="flex gap-6 text-xs font-medium uppercase tracking-[0.12em] text-ink-faint">
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
          <a
            href="https://instagram.com/abby.charless"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Instagram
          </a>
          <a
            href="mailto:abygailmonicacharles@gmail.com"
            className="transition-colors hover:text-ink"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
