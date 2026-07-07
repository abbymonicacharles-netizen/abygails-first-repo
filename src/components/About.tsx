export function About() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blush-400">
              About me
            </p>
            <h2 className="font-display text-3xl font-bold text-[#3d2c35] sm:text-4xl">
              A little about who I am
            </h2>
          </div>

          <div className="space-y-4 text-[#5c4a52] leading-relaxed">
            <p>
              I&apos;m a recent high school graduate based on the{" "}
              <strong className="font-semibold text-[#3d2c35]">east side of Trinidad &amp; Tobago</strong>.
              I tutor students who have recently graduated, helping them stay on track and feel
              confident in their next steps.
            </p>
            <p>
              Life hasn&apos;t always been easy, but I&apos;ve learned to stay hardworking and look
              for the best in every situation. That mindset shapes how I show up for my students —
              patient, encouraging, and genuinely invested in their growth.
            </p>
            <p>
              With experience in <strong className="font-semibold text-[#3d2c35]">20+ extracurricular activities</strong>,
              I bring discipline, teamwork, and leadership to everything I do — both in and out of
              the classroom.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Location", value: "East Trinidad & Tobago" },
            { label: "Focus", value: "Tutoring & student support" },
            { label: "Activities", value: "20+ extracurriculars" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-blush-100 bg-white/60 p-6 text-center backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                {item.label}
              </p>
              <p className="mt-2 font-display text-lg font-semibold text-[#3d2c35]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
