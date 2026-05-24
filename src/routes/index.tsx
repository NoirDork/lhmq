import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Invitation } from "@/components/portfolio/Invitation";
import { About } from "@/components/portfolio/About";
import { EventDetails } from "@/components/portfolio/EventDetails";
import { Gallery } from "@/components/portfolio/Gallery";
import { Timeline } from "@/components/portfolio/Timeline";
import { RSVP } from "@/components/portfolio/RSVP";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Graduation Invitation | Jordan Riley" },
      {
        name: "description",
        content:
          "You are warmly invited to celebrate my university graduation ceremony at Crestwood University.",
      },
      { property: "og:title", content: "Graduation Invitation | Jordan Riley" },
      {
        property: "og:description",
        content: "Join us in celebrating a milestone — university graduation ceremony 2026.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Invitation />
      <About />
      <EventDetails />
      <Gallery />
      <Timeline />
      <RSVP />
      <Footer />
    </main>
  );
}
