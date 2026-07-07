import { Logo } from "./Logo";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-16">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-1/3 h-32 w-32 rounded-full bg-butter-200/50 blur-2xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="animate-fade-up flex flex-col items-center text-center">
          <div className="animate-float mb-8">
            <Logo className="h-24 w-24 shadow-lg shadow-blush-200/50" />
          </div>

          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-blush-200 bg-white/60 px-4 py-1.5 text-sm font-medium text-teal-400">
            <span className="h-2 w-2 rounded-full bg-teal-300" />
            East Trinidad &amp; Tobago
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight text-[#3d2c35] sm:text-5xl md:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-blush-400 via-butter-300 to-teal-400 bg-clip-text text-transparent">
              Abygail Charles
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-lg text-[#5c4a52] sm:text-xl">
            Recent graduate &amp; tutor helping students build confidence and reach their goals.
          </p>

          <p className="mt-3 max-w-lg text-base text-[#7a6670]">
            Hardworking, positive, and always looking for the best in everything — dedicated to
            helping young learners succeed.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-gradient-to-r from-blush-400 to-blush-500 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blush-200 transition-transform hover:scale-105"
            >
              Book a session
            </a>
            <a
              href="#about"
              className="rounded-full border border-blush-200 bg-white/70 px-7 py-3 text-sm font-semibold text-[#5c4a52] transition-colors hover:border-blush-300 hover:bg-white"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
