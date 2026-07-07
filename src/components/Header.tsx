import { Logo } from "./Logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#tutoring", label: "Tutoring" },
  { href: "#clubs", label: "Clubs" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-blush-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <Logo className="h-9 w-9" />
          <span className="font-display text-lg font-semibold tracking-tight text-[#3d2c35]">
            Abygail Charles
          </span>
        </a>
        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#5c4a52] transition-colors hover:text-blush-500"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="rounded-full bg-gradient-to-r from-blush-300 to-teal-300 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
