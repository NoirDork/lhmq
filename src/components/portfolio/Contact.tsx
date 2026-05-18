import { Mail, MapPin, ArrowUpRight } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { ContactForm } from "./ContactForm";

const socials = ["Instagram", "Twitter", "LinkedIn", "Dribbble"];

export function Contact() {
  return (
    <section id="contact" className="px-4 py-32 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <SectionTitle eyebrow="Contact" title="Let's work together." />

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <p className="text-lg text-muted-foreground">
              Have a project in mind? Tell me about it. I usually reply within 48 hours.
            </p>
            <div className="space-y-4">
              <InfoRow icon={Mail} label="Email" value="hello@studio.folio" />
              <InfoRow icon={MapPin} label="Location" value="Lisbon, Portugal" />
            </div>
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Social</p>
              <ul className="grid gap-2">
                {socials.map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      className="group flex items-center justify-between border-b border-border py-3 text-sm transition-colors hover:text-foreground"
                    >
                      {s}
                      <ArrowUpRight
                        size={16}
                        className="text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-foreground"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
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
