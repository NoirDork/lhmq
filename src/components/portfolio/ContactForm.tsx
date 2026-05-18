import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" placeholder="Your full name" />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" />
      </div>
      <Field label="Subject" name="subject" placeholder="Project inquiry" />
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Message
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Tell me about the project…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>
      <button
        type="submit"
        className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {sent ? "Message sent" : "Send message"}
        <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
      </button>
    </form>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}
