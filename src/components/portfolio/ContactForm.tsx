import { useReducer, useRef, useCallback, type FormEvent } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitRsvp } from "@/lib/rsvps";
import { RsvpConfirmation } from "./RsvpConfirmation";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormState {
  status: FormStatus;
  errorMessage: string;
  sent: boolean;
  attending: boolean;
}

const initialState: FormState = {
  status: "idle",
  errorMessage: "",
  sent: false,
  attending: false,
};

function formReducer(state: FormState, action: { type: string; payload?: unknown }): FormState {
  switch (action.type) {
    case "SUBMIT_START":
      return { ...state, status: "submitting", errorMessage: "", sent: false };
    case "SUBMIT_SUCCESS":
      return { ...state, status: "success", sent: true, attending: action.payload === "Attending" };
    case "SUBMIT_ERROR":
      return {
        ...state,
        status: "error",
        errorMessage: String(action.payload ?? "Error"),
        sent: false,
      };
    case "RESET_SUCCESS":
      return { ...state, status: "idle", sent: false };
    default:
      return state;
  }
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { status, errorMessage, sent, attending } = formState;
  const loading = status === "submitting";
  const error = status === "error";

  useGSAP(
    (_, contextSafe) => {
      if (!formRef.current || !contextSafe) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
      const selector = "input, textarea";
      const inputs = formRef.current.querySelectorAll<HTMLElement>(selector);

      const onFocus = contextSafe((e: FocusEvent) => {
        const el = e.currentTarget as HTMLElement;
        if (reduceMotion) return;
        gsap.to(el, {
          scale: 1.01,
          borderColor: "var(--color-foreground)",
          duration: 0.25,
          ease: "power2.out",
        });
      });

      const onBlur = contextSafe((e: FocusEvent) => {
        const el = e.currentTarget as HTMLElement;
        if (reduceMotion) return;
        gsap.to(el, {
          scale: 1,
          borderColor: "var(--color-border)",
          duration: 0.3,
          ease: "power2.out",
        });
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

  const onSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const guestName = (formData.get("name") as string)?.trim();
    const attendingStatus = formData.get("attendance") as string;
    const email = (formData.get("email") as string).trim();
    const message = (formData.get("message") as string).trim();
    const relationship = (formData.get("relationship") as string).trim();

    if (!guestName || !message || !relationship) {
      dispatch({
        type: "SUBMIT_ERROR",
        payload: "Vui lòng điền đầy đủ tên, mối quan hệ và lời chúc.",
      });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      await submitRsvp({ guestName, attendingStatus, email, message, relationship });
    } catch (cause) {
      dispatch({
        type: "SUBMIT_ERROR",
        payload:
          cause && typeof cause === "object" && "code" in cause && cause.code === "23505"
            ? "Email này đã được dùng để RSVP trước đó."
            : "Không thể lưu lời chúc. Vui lòng thử lại.",
      });
      return;
    }

    if (SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY) {
      void emailjs
        .send(SERVICE_ID, TEMPLATE_ID, Object.fromEntries(formData.entries()), PUBLIC_KEY)
        .catch(() => console.warn("Không gửi được email thông báo lời chúc."));
    }

    dispatch({ type: "SUBMIT_SUCCESS", payload: attendingStatus });
    form.reset();
    window.dispatchEvent(new CustomEvent("guest-submitted"));
  }, []);

  return (
    <form ref={formRef} onSubmit={onSubmit} aria-busy={loading} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tên của bạn" name="name" placeholder="Họ và tên" />
        <Field label="Mối quan hệ" name="relationship" placeholder="Bạn bè, gia đình, thầy cô…" />
      </div>
      <Field label="Email" name="email" type="email" placeholder="email@example.com" />
      <div>
        <label
          htmlFor="attendance"
          className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground"
        >
          Tham dự
        </label>
        <div className="relative">
          <select
            id="attendance"
            name="attendance"
            required
            defaultValue=""
            className="attendance-select min-h-[48px] w-full appearance-none rounded-2xl border border-border bg-card px-5 py-4 pr-12 text-base transition-colors sm:text-sm"
          >
            <option value="" disabled>
              Chọn phản hồi
            </option>
            <option value="Attending">Có tham dự</option>
            <option value="Not Attending">Không tham dự</option>
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
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
          maxLength={4000}
          required
          aria-required="true"
          placeholder="Viết lời chúc, kỷ niệm hay lời nhắn…"
          className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base outline-none transition-colors focus:border-foreground sm:text-sm"
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
        <RsvpConfirmation
          attending={attending}
          onClose={() => dispatch({ type: "RESET_SUCCESS" })}
        />
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
        maxLength={type === "email" ? 254 : 120}
        autoComplete={name === "email" ? "email" : name === "name" ? "name" : "off"}
        required
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-base outline-none transition-colors focus:border-foreground sm:text-sm"
      />
    </div>
  );
}
