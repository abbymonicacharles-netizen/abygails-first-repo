import Link from "next/link";
import { HologramButterflies } from "@/components/HologramButterflies";

const roles = ["Tutor", "Builder", "Aspiring engineer", "Community leader"];

export default function HomePage() {
  return (
    <section className="hero-shell relative overflow-hidden px-6 pb-16 pt-12 sm:pb-20 sm:pt-16">
      <div className="hero-glow pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-blush/15 blur-3xl" />
      <div className="hero-glow pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-blush-muted/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
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
          className="animate-fade-up order-1 flex justify-center lg:order-2"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="hero-art-frame w-full max-w-[340px]">
            <div className="hero-art-frame-inner aspect-square w-full">
              <HologramButterflies className="h-full w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
