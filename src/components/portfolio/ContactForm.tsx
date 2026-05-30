import { useEffect, useState, useRef, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn("EmailJS environment variables not configured");
    }
  }, []);

  useGSAP(() => {
    if (!successRef.current) return;
    gsap.fromTo(
      successRef.current,
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
    );
  }, { dependencies: [sent] });

  useGSAP(
    (_, contextSafe) => {
      if (!formRef.current) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const selector = "input, select, textarea";
      const inputs = formRef.current.querySelectorAll<HTMLElement>(selector);

      const onFocus = contextSafe((e: FocusEvent) => {
        const el = e.currentTarget as HTMLElement;
        if (reduceMotion) return;
        gsap.to(el, { scale: 1.01, borderColor: "var(--color-foreground)", duration: 0.25, ease: "power2.out" });
      });

      const onBlur = contextSafe((e: FocusEvent) => {
        const el = e.currentTarget as HTMLElement;
        if (reduceMotion) return;
        gsap.to(el, { scale: 1, borderColor: "var(--color-border)", duration: 0.3, ease: "power2.out" });
      });

      inputs.forEach((el) => {
        el.addEventListener("focus", onFocus);
        el.addEventListener("blur", onBlur);
      });

      return () => {
        inputs.forEach((el) => {
          el.removeEventListener("focus", onFocus);
          el.removeEventListener("blur", onBlur);
        });
      };
    },
    { scope: formRef },
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const guestName = (formData.get("name") as string)?.trim();

    if (!guestName) return;

    setLoading(true);
    setError(false);
    setErrorMessage("");

    let emailOk = false;
    let supabaseOk = false;

    const attendingStatus = formData.get("attendance") as string;
    const email = formData.get("email") as string;

    try {
      const { data: existing } = await supabase
        .from("rsvps")
        .select("email")
        .eq("email", email);

      if (existing && existing.length > 0) {
        throw new Error("Email này đã được dùng để RSVP trước đó.");
      }

      const { error: supabaseError } = await supabase
        .from("rsvps")
        .insert({ guest_name: guestName, attending_status: attendingStatus, email });
      if (supabaseError) throw supabaseError;
      supabaseOk = true;
    } catch (e) {
      setError(true);
      setErrorMessage(e instanceof Error ? e.message : "Không thể gửi RSVP. Vui lòng thử lại.");
      setLoading(false);
      return;
    }

    try {
      const formDataObj = Object.fromEntries(formData.entries());
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, formDataObj, PUBLIC_KEY);
      emailOk = true;
    } catch (e) {
      console.error("EmailJS error:", e);
    }

    if (emailOk && supabaseOk) {
      setSent(true);
      form.reset();
      setSelectKey((k) => k + 1);
      window.dispatchEvent(new CustomEvent("guest-submitted"));
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        confetti({
          particleCount: window.innerWidth < 768 ? 40 : 80,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#D4A853", "#1E293B", "#FFFFFF"],
        });
      }
      setTimeout(() => setSent(false), 4000);
    } else {
      setError(true);
      setErrorMessage("RSVP của bạn đã được lưu công khai, nhưng email thông báo không gửi được.");
      setTimeout(() => setError(false), 5000);
    }

    setLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên của bạn" name="name" placeholder="Họ và tên" />
        <Field label="Mối quan hệ" name="relationship" placeholder="Bạn bè, gia đình, thầy cô…" />
      </div>
      <Field label="Email" name="email" type="email" placeholder="email@example.com" />
      <AnimatedSelect key={selectKey} />
      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Lời nhắn hay lời chúc
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          aria-required="true"
          placeholder="Viết lời chúc, kỷ niệm hay lời nhắn…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
        />
      </div>
      <div aria-live="polite">
        {error && (
          <p role="alert" className="text-sm text-red-500">
            {errorMessage}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Đang gửi…
          </>
        ) : sent ? (
          "Đã gửi!"
        ) : (
          "Gửi lời chúc"
        )}
        {!loading && (
          <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
        )}
      </button>
      {sent && (
        <div
          ref={successRef}
          className="mt-4 rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signature/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-5 w-5 text-signature"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Đã gửi!</p>
              <p className="text-sm text-muted-foreground">Cảm ơn bạn đã gửi lời chúc.</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground"
      />
    </div>
  );
}

const options = [
  { value: "", label: "Chọn phản hồi" },
  { value: "Attending", label: "Có tham dự" },
  { value: "Not Attending", label: "Không tham dự" },
  { value: "Maybe", label: "Có thể" },
];

function AnimatedSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const label = options.find((o) => o.value === value)?.label ?? "Chọn phản hồi";

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div ref={ref}>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Tham dự
      </label>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-required="true"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-sm outline-none transition-colors focus:border-foreground touch-manipulation"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {label}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-muted-foreground" />
        </motion.span>
      </button>
      <input type="hidden" name="attendance" value={value} required aria-required="true" />
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ originY: 0 }}
            className="mt-1 overflow-hidden rounded-2xl border border-border bg-card p-1 shadow-xl"
          >
            {options.map((opt) => (
              <li key={opt.value} role="option" aria-selected={value === opt.value}>
                <button
                  type="button"
                  disabled={!opt.value}
                  onClick={() => {
                    setValue(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    value === opt.value
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50"
                  } ${!opt.value ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
