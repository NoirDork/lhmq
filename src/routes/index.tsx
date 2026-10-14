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
import { BackgroundMusic } from "@/components/portfolio/BackgroundMusic";
import { GRADUATION_START, GRADUATION_END, SCHOOL } from "@/lib/event";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thiệp Mời Tốt Nghiệp | Lâm Hồng Minh Quân" },
      {
        name: "description",
        content: `Trân trọng mời bạn đến tham dự lễ tốt nghiệp của Lâm Hồng Minh Quân tại ${SCHOOL}.`,
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
        content: `Trân trọng mời bạn đến tham dự lễ tốt nghiệp của Lâm Hồng Minh Quân tại ${SCHOOL}.`,
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
          description: `Chào mừng đến với lễ tốt nghiệp của Lâm Hồng Minh Quân tại ${SCHOOL}.`,
          startDate: GRADUATION_START,
          endDate: GRADUATION_END,
          location: {
            "@type": "Place",
            name: SCHOOL,
            address: "669 Đỗ Mười, phường Linh Xuân, Thành phố Hồ Chí Minh",
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
      <Invitation />
      <Hero />
      <About />
      <Timeline />
      <Gallery />
      <EventDetails />
      <RSVP />
      <section id="guests" className="scroll-mt-24 px-4 py-20 sm:py-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionTitle eyebrow="Với lòng biết ơn" title="LỜI YÊU THƯƠNG CỦA MỌI NGƯỜI" />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Minh Quân xin chân thành cảm ơn những lời chúc tốt đẹp và tình cảm quý báu mà mọi người
            đã dành cho Quân ạ
          </p>
          <div className="mt-10 w-full">
            <GuestList />
          </div>
        </div>
      </section>
      <Footer />
      <BackgroundMusic />
    </main>
  );
}
