import { PageHeader } from "@/components/PageHeader";
import { aboutBio, aboutIntro, extracurriculars } from "@/data/content";

export default function AboutPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="About"
          title="About me"
          description="Recent graduate, tutor, and aspiring engineer from East Trinidad & Tobago."
        />

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 text-ink-muted leading-relaxed">
            <p className="font-display text-2xl font-semibold text-ink">{aboutIntro}</p>
            {aboutBio.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
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
