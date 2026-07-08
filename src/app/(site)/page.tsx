import Link from "next/link";
import { MetalAssemblyAnimation } from "@/components/MetalAssemblyAnimation";

const roles = ["Tutor", "Builder", "Aspiring engineer", "Community leader"];

const highlights = [
  {
    title: "What I build toward",
    body: "Technology that improves lives, solves meaningful problems, and leaves a lasting impact.",
    className: "sm:col-span-2 lg:row-span-2",
    accent: true,
  },
  {
    title: "Focus",
    body: "Tutoring & mentorship for recently graduated students.",
    className: "",
    accent: false,
  },
  {
    title: "Background",
    body: "10+ extracurriculars across arts, sports, service, and leadership.",
    className: "",
    accent: false,
  },
  {
    title: "Based in",
    body: "East Trinidad & Tobago",
    className: "",
    accent: false,
  },
];

const quickLinks = [
  { href: "/about", label: "About", num: "01" },
  { href: "/achievements", label: "Achievements", num: "02" },
  { href: "/vision", label: "Vision", num: "03" },
  { href: "/gallery", label: "Gallery", num: "04" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero-shell relative overflow-hidden px-6 pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="hero-glow pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blush/15 blur-3xl" />
        <div className="hero-glow pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blush-muted/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <p className="animate-fade-up mb-5 inline-flex items-center gap-2 border border-cream-dark bg-surface/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-blush">
              <span className="h-1.5 w-1.5 rounded-full bg-blush" />
              East Trinidad &amp; Tobago
            </p>

            <h1 className="animate-fade-up font-display text-5xl font-semibold leading-[0.95] text-ink sm:text-6xl lg:text-7xl">
              <span className="block" style={{ animationDelay: "0.05s" }}>
                Abygail
              </span>
              <span
                className="mt-1 block text-blush"
                style={{ animationDelay: "0.1s" }}
              >
                Charles
              </span>
            </h1>

            <p
              className="animate-fade-up mt-6 max-w-md text-lg leading-relaxed text-ink-muted"
              style={{ animationDelay: "0.15s" }}
            >
              I gather ideas, parts, and purpose the same way I always have: by building
              something new from what is already there.
            </p>

            <div
              className="animate-fade-up mt-6 flex flex-wrap gap-2"
              style={{ animationDelay: "0.2s" }}
            >
              {roles.map((role) => (
                <span
                  key={role}
                  className="border border-cream-dark bg-cream px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-muted"
                >
                  {role}
                </span>
              ))}
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-wrap gap-4"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                href="/about"
                className="btn-solid px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em]"
              >
                About me
              </Link>
              <Link
                href="/contact"
                className="border border-blush px-8 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-blush-deep transition-colors hover:border-ink hover:text-ink"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div
            className="animate-fade-up order-1 flex justify-center lg:order-2 lg:justify-end"
            style={{ animationDelay: "0.12s" }}
          >
            <div className="hero-frame relative">
              <div className="hero-frame-accent" aria-hidden />
              <div className="hero-frame-inner border border-cream-dark bg-surface/60 p-6 backdrop-blur-sm sm:p-8">
                <MetalAssemblyAnimation className="h-64 w-52 sm:h-72 sm:w-56" />
                <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  Parts in motion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-cream-dark pb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">
              At a glance
            </p>
            <p className="hidden text-xs uppercase tracking-[0.14em] text-ink-faint sm:block">
              Scroll to explore
            </p>
          </div>

          <div className="grid gap-px border border-cream-dark bg-cream-dark sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <article
                key={item.title}
                className={`home-card bg-cream p-7 sm:p-8 ${item.className} ${
                  item.accent ? "home-card-accent" : ""
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blush">
                  {item.title}
                </p>
                <p
                  className={`mt-3 leading-relaxed ${
                    item.accent
                      ? "font-display text-2xl text-ink sm:text-3xl"
                      : "text-sm text-ink-muted sm:text-base"
                  }`}
                >
                  {item.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-px border border-cream-dark bg-cream-dark sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="home-link group bg-cream px-6 py-5"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blush">
                  {link.num}
                </span>
                <span className="mt-2 block font-display text-xl text-ink transition-colors group-hover:text-blush-deep">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
