import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Introduction } from "@/components/portfolio/Introduction";
import { About } from "@/components/portfolio/About";
import { Work } from "@/components/portfolio/Work";
import { Gallery } from "@/components/portfolio/Gallery";
import { Services } from "@/components/portfolio/Services";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Graduation Invitation | Jordan Riley" },
      { name: "description", content: "You are warmly invited to celebrate my university graduation ceremony at Crestwood University." },
      { property: "og:title", content: "Graduation Invitation | Jordan Riley" },
      { property: "og:description", content: "Join us in celebrating a milestone — university graduation ceremony 2026." },
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
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
