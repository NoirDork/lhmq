import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "YOUR_SERVICE_ID";
const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      .then(() => {
        setSent(true);
        setError(false);
        form.reset();
        setTimeout(() => setSent(false), 4000);
      })
      .catch(() => {
        setError(true);
        setTimeout(() => setError(false), 4000);
      });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Name" name="name" placeholder="Your full name" />
        <Field label="Relationship" name="relationship" placeholder="Friend, family, teacher…" />
      </div>
      <Field label="Email" name="email" type="email" placeholder="you@email.com" />
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Attendance
        </label>
        <select
          name="attendance"
          required
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
        >
          <option value="">Select your response</option>
          <option value="Attending">Attending</option>
          <option value="Not Attending">Not Attending</option>
          <option value="Maybe">Maybe</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Message or wishes
        </label>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Leave a message, blessing, or memory…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {sent ? "Wish sent! 🎓" : "Send your wishes"}
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
