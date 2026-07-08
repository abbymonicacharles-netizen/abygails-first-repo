import { PageHeader } from "@/components/PageHeader";
import { vision } from "@/data/content";

export default function VisionPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader label="Vision" title="Where I'm headed" />

        <div className="border-l-2 border-blush pl-8 sm:pl-12">
          <p className="font-display text-2xl leading-relaxed text-ink sm:text-3xl sm:leading-relaxed">
            {vision}
          </p>
        </div>

        <div className="mt-16 grid gap-px border border-cream-dark bg-cream-dark sm:grid-cols-3">
          {[
            { title: "Learn", text: "Stay curious and grow from every experience." },
            { title: "Lead", text: "Create spaces where others feel capable and seen." },
            { title: "Lift", text: "Leave a positive mark on the lives around me." },
          ].map((pillar) => (
            <div key={pillar.title} className="bg-cream px-8 py-8">
              <h2 className="font-display text-2xl font-semibold text-ink">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{pillar.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
