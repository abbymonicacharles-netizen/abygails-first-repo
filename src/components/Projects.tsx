const projects = [
  {
    title: "Tutoring programme",
    description:
      "Building a personalised tutoring approach for recently graduated students in East Trinidad.",
    tag: "Education",
    color: "from-blush-100 to-blush-200",
  },
  {
    title: "Community involvement",
    description:
      "Active participation in school and community initiatives through leadership and service clubs.",
    tag: "Leadership",
    color: "from-butter-100 to-butter-200",
  },
  {
    title: "Personal growth journey",
    description:
      "Turning life experiences into strength — staying positive, hardworking, and focused on what matters.",
    tag: "Personal",
    color: "from-teal-100 to-teal-200",
  },
];

export function Projects() {
  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blush-400">
            Projects
          </p>
          <h2 className="font-display text-3xl font-bold text-[#3d2c35] sm:text-4xl">
            What I&apos;ve been working on
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#5c4a52]">
            A snapshot of the work and experiences that shape who I am today.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col rounded-2xl border border-blush-100 bg-white/70 overflow-hidden transition-all hover:border-blush-200 hover:shadow-lg hover:shadow-blush-100/50"
            >
              <div className={`h-2 bg-gradient-to-r ${project.color}`} />
              <div className="flex flex-1 flex-col p-7">
                <span className="mb-3 inline-block w-fit rounded-full bg-blush-50 px-3 py-1 text-xs font-semibold text-blush-500">
                  {project.tag}
                </span>
                <h3 className="font-display text-lg font-semibold text-[#3d2c35]">
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5c4a52]">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#7a6670] italic">
          * More projects coming soon — this is just the beginning!
        </p>
      </div>
    </section>
  );
}
