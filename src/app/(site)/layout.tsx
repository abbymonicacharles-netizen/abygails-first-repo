import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteProviders } from "@/components/SiteProviders";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProviders>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </SiteProviders>
  );
}
