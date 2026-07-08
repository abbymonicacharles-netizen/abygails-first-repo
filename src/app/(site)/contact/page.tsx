import { PageHeader } from "@/components/PageHeader";
import { socials } from "@/data/content";

export default function ContactPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="Contact"
          title="Let's connect"
          description="Interested in tutoring, collaboration, or just want to say hello? Email is my preferred way to reach me."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target={social.name === "Email" ? undefined : "_blank"}
              rel={social.name === "Email" ? undefined : "noopener noreferrer"}
              className={`group border p-8 text-center transition-colors ${
                social.preferred
                  ? "border-ink bg-ink text-cream hover:bg-blush-deep hover:border-blush-deep"
                  : "border-cream-dark hover:border-blush"
              }`}
            >
              <p
                className={`text-xs font-semibold uppercase tracking-[0.15em] ${
                  social.preferred ? "text-blush-muted" : "text-blush"
                }`}
              >
                {social.name}
                {social.preferred && " · preferred"}
              </p>
              <p
                className={`mt-3 text-sm font-medium ${
                  social.preferred
                    ? "text-cream group-hover:text-cream"
                    : "text-ink group-hover:text-blush-deep"
                }`}
              >
                {social.handle}
              </p>
            </a>
          ))}
        </div>

        <div className="mt-12 border border-cream-dark p-10 text-center">
          <p className="font-display text-2xl text-ink">Ready to get in touch?</p>
          <a
            href="mailto:abygailmonicacharles@gmail.com"
            className="mt-6 inline-block border border-ink bg-ink px-10 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-cream transition-colors hover:bg-transparent hover:text-ink"
          >
            Send an email
          </a>
        </div>
      </div>
    </section>
  );
}
