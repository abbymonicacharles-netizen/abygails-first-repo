const clubCategories = [
  {
    category: "Leadership & Service",
    emoji: "🌸",
    items: [
      "Student Council",
      "Peer mentoring programme",
      "Community outreach club",
      "Volunteer service group",
    ],
  },
  {
    category: "Arts & Culture",
    emoji: "🎀",
    items: [
      "Drama & performing arts",
      "Choir / music ensemble",
      "Cultural heritage club",
      "Creative writing society",
    ],
  },
  {
    category: "Sports & Wellness",
    emoji: "✨",
    items: [
      "Netball / athletics",
      "School sports team",
      "Fitness & wellness club",
      "Intramural competitions",
    ],
  },
  {
    category: "Academic & Skills",
    emoji: "📚",
    items: [
      "Debate society",
      "Science & STEM club",
      "Literary club",
      "Public speaking group",
    ],
  },
];

export function Clubs() {
  return (
    <section id="clubs" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blush-400">
            Clubs &amp; Activities
          </p>
          <h2 className="font-display text-3xl font-bold text-[#3d2c35] sm:text-4xl">
            20+ extracurriculars
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#5c4a52]">
            Staying active beyond the classroom taught me discipline, teamwork, and how to balance
            it all — skills I bring to every tutoring session.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {clubCategories.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-blush-100 bg-white/70 p-7 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <h3 className="font-display text-lg font-semibold text-[#3d2c35]">
                  {cat.category}
                </h3>
              </div>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-[#5c4a52] before:h-1.5 before:w-1.5 before:rounded-full before:bg-blush-300 before:content-['']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[#7a6670] italic">
          * Placeholder activities — send me your full list and I&apos;ll update these with your real
          clubs!
        </p>
      </div>
    </section>
  );
}
