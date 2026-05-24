import { Mail, MapPin, Heart, GraduationCap } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { ContactForm } from "./ContactForm";
import { Reveal, RevealItem } from "./Reveal";

const wishes = ["Share a memory", "Send a blessing", "Offer a quote", "RSVP response"];

export function RSVP() {
  return (
    <section id="rsvp" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="RSVP" title="Send Your Wishes." />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="space-y-8 lg:col-span-5">
            <RevealItem>
              <p className="text-lg text-muted-foreground">
                Leave a message, blessing, or RSVP response. Your words mean a lot on this special
                day.
              </p>
            </RevealItem>
            <RevealItem className="space-y-4">
              <InfoRow icon={GraduationCap} label="Graduate" value="Jordan Riley" />
              <InfoRow icon={Mail} label="Contact" value="jordan.r@example.com" />
              <InfoRow icon={MapPin} label="University" value="Crestwood University" />
            </RevealItem>
            <RevealItem>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                You can
              </p>
              <ul className="grid gap-2">
                {wishes.map((w) => (
                  <li key={w}>
                    <div className="group flex items-center justify-between border-b border-border py-3 text-sm text-muted-foreground">
                      {w}
                      <Heart size={16} className="text-signature" />
                    </div>
                  </li>
                ))}
              </ul>
            </RevealItem>
          </Reveal>

          <Reveal className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:col-span-7">
            <RevealItem>
              <ContactForm />
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
