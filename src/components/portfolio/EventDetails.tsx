import { Calendar, Clock, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { Countdown } from "./Countdown";
import { SCHOOL } from "@/lib/event";
import invitationCard from "../../../images/NGƯỜI-THƯƠNG.png";

const contacts = [
  { name: "Minh Quân", number: "0931 314 605", href: "tel:0931314605" },
  { name: "Thảo Nguyên", number: "0964 582 545", href: "tel:0964582545" },
  { name: "Khánh Nhi", number: "0822 889 972", href: "tel:0822889972" },
];
const mapQuery = encodeURIComponent(
  "Trường Đại học Kinh tế - Luật, 669 Đỗ Mười, Linh Xuân, Hồ Chí Minh",
);

export function EventDetails() {
  return (
    <section
      id="details"
      aria-labelledby="details-title"
      className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.2em] text-signature">Thông tin buổi lễ</p>
        <h2
          id="details-title"
          className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-6xl"
        >
          Thư mời lễ tốt nghiệp
        </h2>
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <img
            src={invitationCard}
            alt="Thiệp mời lễ tốt nghiệp Lâm Hồng Minh Quân, ngày 23.10.2026"
            width={1600}
            height={2000}
            loading="lazy"
            className="mx-auto w-full max-w-md rounded-2xl"
          />
          <div>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Save the date và đến chụp hình kỷ niệm cùng Minh Quân nha!
            </p>
            <div className="text-signature">
              <Countdown />
            </div>
            <div className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
              <div className="flex gap-4">
                <Calendar aria-hidden="true" className="shrink-0 text-signature" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Ngày diễn ra
                  </p>
                  <p className="mt-1 font-medium">23/10/2026 (thứ Sáu)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock aria-hidden="true" className="shrink-0 text-signature" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Thời gian
                  </p>
                  <p className="mt-1 font-medium">10:30 – 13:00</p>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin aria-hidden="true" className="shrink-0 text-signature" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Địa điểm
                  </p>
                  <p className="mt-1 font-medium">{SCHOOL}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    669 Đỗ Mười, phường Linh Xuân, Thành phố Hồ Chí Minh
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone aria-hidden="true" className="shrink-0 text-signature" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Liên hệ</p>
                  <ul className="mt-1">
                    {contacts.map((contact) => (
                      <li key={contact.href}>
                        <a
                          className="inline-flex min-h-11 items-center text-sm underline decoration-border underline-offset-4 hover:text-signature"
                          href={contact.href}
                        >
                          {contact.number} ({contact.name})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <a
              href="#rsvp"
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
            >
              Gửi lời chúc <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-border">
          <iframe
            title="Bản đồ đến Trường Đại học Kinh tế - Luật"
            src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full border-0 sm:h-96"
          />
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-signature underline underline-offset-4"
        >
          Mở bản đồ / Chỉ đường <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
