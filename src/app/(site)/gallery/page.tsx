import { PageHeader } from "@/components/PageHeader";
import { GalleryGrid } from "@/components/GalleryGrid";
import { CommentsSection } from "@/components/CommentsSection";

export default function GalleryPage() {
  return (
    <section className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          label="Gallery"
          title="Pictures & comments"
          description="A dedicated space for photos, memories, and messages. Add pictures and comments below — they'll be saved on your device for now."
        />

        <div className="mb-16">
          <h2 className="mb-6 border-b border-cream-dark pb-3 font-display text-2xl font-semibold text-ink">
            Pictures
          </h2>
          <GalleryGrid />
        </div>

        <div>
          <h2 className="mb-6 border-b border-cream-dark pb-3 font-display text-2xl font-semibold text-ink">
            Comments
          </h2>
          <CommentsSection />
        </div>
      </div>
    </section>
  );
}
