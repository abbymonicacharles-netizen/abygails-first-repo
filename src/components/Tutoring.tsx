const offerings = [
  {
    title: "One-on-one tutoring",
    description:
      "Personalised sessions tailored to each student's pace, strengths, and areas for growth.",
    icon: "✦",
  },
  {
    title: "Recently graduated students",
    description:
      "Specialised support for students navigating life right after graduation — academically and beyond.",
    icon: "♡",
  },
  {
    title: "Confidence building",
    description:
      "A positive, encouraging environment where students feel safe to ask questions and keep trying.",
    icon: "☆",
  },
];

export function Tutoring() {
  return (
    <section id="tutoring" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blush-400">
            Tutoring
          </p>
          <h2 className="font-display text-3xl font-bold text-[#3d2c35] sm:text-4xl">
            How I can help
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#5c4a52]">
            Whether you need academic support or a motivating guide through your next chapter, I&apos;m
            here to help you succeed.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {offerings.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-blush-100 bg-white/70 p-8 transition-all hover:border-blush-200 hover:shadow-lg hover:shadow-blush-100/50"
            >
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blush-100 to-butter-100 text-lg">
                {item.icon}
              </span>
              <h3 className="font-display text-xl font-semibold text-[#3d2c35]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5c4a52]">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-butter-50 p-8 text-center">
          <p className="font-display text-xl font-semibold text-[#3d2c35]">
            Ready to get started?
          </p>
          <p className="mt-2 text-[#5c4a52]">
            Reach out via email or WhatsApp — I&apos;d love to hear from you.
          </p>
          <a
            href="mailto:abygailmonicacharles@gmail.com"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-teal-300 to-teal-400 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
          >
            abygailmonicacharles@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
