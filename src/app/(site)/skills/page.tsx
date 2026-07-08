import { PageHeader } from "@/components/PageHeader";
import { skills } from "@/data/content";

export default function SkillsPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="Skills"
          title="What I bring to the table"
          description="Skills developed through leadership roles, competitions, creative work, and years of collaboration across diverse teams."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <div
              key={skill}
              className="group border border-cream-dark bg-cream p-6 transition-colors hover:border-blush hover:bg-cream-dark/30"
            >
              <span className="mb-3 block h-px w-8 bg-blush transition-all group-hover:w-12" />
              <h2 className="font-display text-xl font-medium text-ink">{skill}</h2>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-2xl text-sm leading-relaxed text-ink-faint">
          These strengths come from real experience — leading as a school prefect, performing on
          stage, competing in entrepreneurship, volunteering internationally, and working alongside
          others in every club and team I&apos;ve joined.
        </p>
      </div>
    </section>
  );
}
