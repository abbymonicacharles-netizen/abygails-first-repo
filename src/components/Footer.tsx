import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-blush-100 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <p className="text-sm text-[#7a6670]">
            © {new Date().getFullYear()} Abygail Charles. Made with ♡ in Trinidad &amp; Tobago.
          </p>
        </div>
        <div className="flex gap-5 text-sm text-[#7a6670]">
          <a
            href="https://instagram.com/abby.charless"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blush-400"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@____abbyyy"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blush-400"
          >
            TikTok
          </a>
          <a
            href="mailto:abygailmonicacharles@gmail.com"
            className="transition-colors hover:text-blush-400"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
