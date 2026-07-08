import { PageHeader } from "@/components/PageHeader";
import { achievements } from "@/data/content";

export default function AchievementsPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="Achievements"
          title="Recognition & certificates"
          description="A record of the awards, certificates, and milestones earned through dedication across academics, arts, sports, and service."
        />

        <div className="space-y-4">
          {achievements.map((item, index) => (
            <article
              key={item.title}
              className="flex flex-col gap-2 border border-cream-dark p-6 transition-colors hover:border-blush sm:flex-row sm:items-center sm:justify-between sm:gap-8"
            >
              <div className="flex items-start gap-5">
                <span className="font-display text-3xl font-light text-blush-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl font-medium text-ink sm:text-2xl">
                  {item.title}
                </h2>
              </div>
              <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.15em] text-blush">
                {item.category}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
