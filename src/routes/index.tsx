import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Introduction } from "@/components/portfolio/Introduction";
import { About } from "@/components/portfolio/About";
import { Work } from "@/components/portfolio/Work";
import { Services } from "@/components/portfolio/Services";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "studio.folio — Editorial portfolio of Alex Mercer" },
      { name: "description", content: "Independent design & development studio crafting editorial digital experiences for ambitious brands." },
      { property: "og:title", content: "studio.folio — Editorial portfolio" },
      { property: "og:description", content: "Editorial portfolio: brand, product, and web design." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Introduction />
      <About />
      <Work />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
