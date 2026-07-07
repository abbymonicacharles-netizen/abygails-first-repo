import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Tutoring } from "@/components/Tutoring";
import { Clubs } from "@/components/Clubs";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Tutoring />
        <Clubs />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
