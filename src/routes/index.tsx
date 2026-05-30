import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Invitation } from "@/components/portfolio/Invitation";
import { About } from "@/components/portfolio/About";
import { EventDetails } from "@/components/portfolio/EventDetails";
import { Gallery } from "@/components/portfolio/Gallery";
import { Timeline } from "@/components/portfolio/Timeline";
import { RSVP } from "@/components/portfolio/RSVP";
import { GuestList } from "@/components/portfolio/GuestList";
import { SectionTitle } from "@/components/portfolio/SectionTitle";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thiệp Mời Tốt Nghiệp | Lâm Hồng Minh Quân" },
      {
        name: "description",
        content:
          "Trân trọng mời bạn đến tham dự lễ tốt nghiệp của Lâm Hồng Minh Quân tại Đại học Kinh tế - Luật, ĐHQG-HCM.",
      },
      { property: "og:title", content: "Thiệp Mời Tốt Nghiệp | Lâm Hồng Minh Quân" },
      {
        property: "og:description",
        content: "Cùng chung vui trong ngày tốt nghiệp — một cột mốc đáng nhớ 2026.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://lhmq.vercel.app" },
      { property: "og:image", content: "https://lhmq.vercel.app/og-image.jpg" },
      { property: "og:locale", content: "vi_VN" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Thiệp Mời Tốt Nghiệp | Lâm Hồng Minh Quân" },
      {
        name: "twitter:description",
        content:
          "Trân trọng mời bạn đến tham dự lễ tốt nghiệp của Lâm Hồng Minh Quân tại Đại học Kinh tế - Luật, ĐHQG-HCM.",
      },
    ],
    links: [{ rel: "canonical", href: "https://lhmq.vercel.app" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Lễ Tốt Nghiệp của Lâm Hồng Minh Quân",
          description:
            "Chào mừng đến với lễ tốt nghiệp của Lâm Hồng Minh Quân tại Đại học Kinh tế - Luật, ĐHQG-HCM.",
          startDate: "2026",
          location: {
            "@type": "Place",
            name: "Trường Đại học Kinh tế - Luật, ĐHQG-HCM",
            address: "Đại học Kinh tế - Luật, ĐHQG-HCM",
          },
          organizer: {
            "@type": "Person",
            name: "Lâm Hồng Minh Quân",
          },
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
        }),
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
      <section id="guests" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Khách Mời" title="Phản hồi từ khách." />
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Lời nhắn và xác nhận tham dự từ những người đã đồng hành trong hành trình này.
          </p>
          <div className="mt-10 w-full">
            <GuestList />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
