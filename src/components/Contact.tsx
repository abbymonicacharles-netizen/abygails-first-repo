const socials = [
  {
    name: "Email",
    handle: "abygailmonicacharles@gmail.com",
    href: "mailto:abygailmonicacharles@gmail.com",
    preferred: true,
  },
  {
    name: "Instagram",
    handle: "@abby.charless",
    href: "https://instagram.com/abby.charless",
    preferred: false,
  },
  {
    name: "TikTok",
    handle: "@____abbyyy",
    href: "https://tiktok.com/@____abbyyy",
    preferred: false,
  },
];

export function Contact() {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-blush-100 bg-white/80 p-10 backdrop-blur-sm sm:p-14">
          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blush-400">
              Contact
            </p>
            <h2 className="font-display text-3xl font-bold text-[#3d2c35] sm:text-4xl">
              Let&apos;s connect
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[#5c4a52]">
              Interested in tutoring or just want to say hi? Email and WhatsApp are my preferred
              ways to reach me.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target={social.name === "Email" ? undefined : "_blank"}
                rel={social.name === "Email" ? undefined : "noopener noreferrer"}
                className={`group rounded-2xl border p-6 text-center transition-all hover:shadow-md ${
                  social.preferred
                    ? "border-blush-200 bg-gradient-to-br from-blush-50 to-butter-50 hover:border-blush-300"
                    : "border-blush-100 bg-white hover:border-blush-200"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-400">
                  {social.name}
                  {social.preferred && (
                    <span className="ml-1 text-blush-400">★ preferred</span>
                  )}
                </p>
                <p className="mt-2 text-sm font-medium text-[#3d2c35] transition-colors group-hover:text-blush-500">
                  {social.handle}
                </p>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="mailto:abygailmonicacharles@gmail.com"
              className="inline-block rounded-full bg-gradient-to-r from-blush-400 via-butter-300 to-teal-300 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              Send me an email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
