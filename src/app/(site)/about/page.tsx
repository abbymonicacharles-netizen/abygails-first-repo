import { PageHeader } from "@/components/PageHeader";
import { extracurriculars } from "@/data/content";

export default function AboutPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="About"
          title="About me"
          description="A recent high school graduate from the east side of Trinidad & Tobago. I tutor recently graduated students, and my life beyond the classroom has shaped who I am today."
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 text-ink-muted leading-relaxed">
            <p>
              Life hasn&apos;t always been easy, but I&apos;ve learned to stay hardworking and look
              for the best in every situation. That mindset shapes how I show up for my students,
              my community, and myself.
            </p>
            <p>
              I&apos;m a graduating member of the{" "}
              <strong className="font-medium text-ink">Heroes Foundation</strong> and have competed
              in the{" "}
              <strong className="font-medium text-ink">
                National Secondary School Entrepreneurship Competition (NSEC)
              </strong>
              . Across academics, sports, arts, and service, I&apos;ve thrown myself into over 20
              extracurricular activities that taught me discipline, teamwork, and leadership.
            </p>
            <p>
              Today I tutor students who have recently graduated, helping them build confidence and
              navigate their next chapter with clarity and support.
            </p>
          </div>

          <div className="border border-cream-dark bg-cream-dark p-px">
            <div className="bg-cream p-8">
              <h2 className="mb-6 font-display text-2xl font-semibold text-ink">
                Extracurriculars
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {extracurriculars.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-ink-muted before:mt-2 before:block before:h-px before:w-4 before:shrink-0 before:bg-blush before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
