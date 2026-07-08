import Link from "next/link";
import { MechanicalFlower } from "@/components/MechanicalFlower";

export default function HomePage() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="animate-fade-up mb-10">
          <MechanicalFlower className="h-56 w-44 sm:h-64 sm:w-48" />
        </div>

        <p className="animate-fade-up mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-blush">
          East Trinidad &amp; Tobago
        </p>

        <h1
          className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-ink sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          Abygail Charles
        </h1>

        <p
          className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl"
          style={{ animationDelay: "0.2s" }}
        >
          Recent graduate, tutor, and community leader — hardworking, resilient, and always
          looking for the best in everything.
        </p>

        <p
          className="animate-fade-up mt-4 max-w-lg text-sm leading-relaxed text-ink-faint"
          style={{ animationDelay: "0.3s" }}
        >
          From debate and drama to entrepreneurship and international volunteering — I bring
          discipline, creativity, and heart to everything I do.
        </p>

        <div
          className="animate-fade-up mt-12 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.4s" }}
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

      <div className="mx-auto mt-20 grid max-w-5xl gap-px border border-cream-dark bg-cream-dark sm:grid-cols-3">
        {[
          { label: "Focus", value: "Tutoring & mentorship" },
          { label: "Background", value: "20+ extracurriculars" },
          { label: "Approach", value: "Leadership with heart" },
        ].map((item) => (
          <div key={item.label} className="bg-cream px-8 py-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush">
              {item.label}
            </p>
            <p className="mt-2 font-display text-xl text-ink">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
