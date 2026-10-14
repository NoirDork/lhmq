import {
  useReducer,
  useRef,
  useCallback,
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { ArrowUpRight, ImagePlus, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { submitRsvp } from "@/lib/rsvps";
import { RsvpConfirmation } from "./RsvpConfirmation";
import { prepareWishPhoto } from "@/lib/wish-photo";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormState {
  status: FormStatus;
  errorMessage: string;
  sent: boolean;
}

const initialState: FormState = {
  status: "idle",
  errorMessage: "",
  sent: false,
};

function formReducer(state: FormState, action: { type: string; payload?: unknown }): FormState {
  switch (action.type) {
    case "SUBMIT_START":
      return { ...state, status: "submitting", errorMessage: "", sent: false };
    case "SUBMIT_SUCCESS":
      return { ...state, status: "success", sent: true };
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
  const submittingRef = useRef(false);
  const requestRef = useRef<{ fingerprint: string; id: string } | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<Blob>();
  const [preview, setPreview] = useState("");
  const [preparing, setPreparing] = useState(false);
  const photoVersion = useRef(0);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { status, errorMessage, sent } = formState;
  const loading = status === "submitting";
  const error = status === "error";

  useEffect(() => {
    if (!photo) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  async function choosePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const version = ++photoVersion.current;
    setPhoto(undefined);
    requestRef.current = null;
    if (!file) return;
    setPreparing(true);
    try {
      const prepared = await prepareWishPhoto(file);
      if (version === photoVersion.current) {
        setPhoto(prepared);
        dispatch({ type: "RESET_SUCCESS" });
      }
    } catch (cause) {
      if (version === photoVersion.current) {
        event.target.value = "";
        dispatch({
          type: "SUBMIT_ERROR",
          payload:
            cause instanceof Error ? cause.message : "Không đọc được ảnh. Vui lòng chọn ảnh khác.",
        });
      }
    } finally {
      if (version === photoVersion.current) setPreparing(false);
    }
  }

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

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      if (submittingRef.current || preparing || !form.reportValidity()) return;

      const formData = new FormData(form);
      const guestName = (formData.get("name") as string)?.trim();
      const message = (formData.get("message") as string).trim();
      const relationship = (formData.get("relationship") as string).trim();

      if (!guestName || !message || !relationship) {
        dispatch({
          type: "SUBMIT_ERROR",
          payload: "Vui lòng điền đầy đủ tên, mối quan hệ và lời chúc.",
        });
        return;
      }

      submittingRef.current = true;
      dispatch({ type: "SUBMIT_START" });
      const fingerprint = JSON.stringify([guestName, message, relationship, photoVersion.current]);
      if (requestRef.current?.fingerprint !== fingerprint) {
        requestRef.current = { fingerprint, id: crypto.randomUUID() };
      }

      try {
        await submitRsvp({
          guestName,
          message,
          relationship,
          photo,
          requestId: requestRef.current.id,
        });
      } catch {
        dispatch({
          type: "SUBMIT_ERROR",
          payload: "Không thể lưu lời chúc. Vui lòng thử lại.",
        });
        return;
      } finally {
        submittingRef.current = false;
      }

      dispatch({ type: "SUBMIT_SUCCESS" });
      form.reset();
      setPhoto(undefined);
      requestRef.current = null;
      window.dispatchEvent(new CustomEvent("guest-submitted"));
    },
    [photo, preparing],
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} aria-busy={loading} className="grid gap-4">
      <fieldset disabled={loading || preparing} className="grid min-w-0 gap-4">
        <div className="grid gap-4">
          <Field label="Minh Quân gọi đằng ấy là gì tar" name="name" />
          <Field label="Mối quan hệ" name="relationship" placeholder="Bạn bè, gia đình, thầy cô…" />
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
        <div>
          <label
            htmlFor="wish-photo"
            className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            Ảnh kỷ niệm (không bắt buộc)
          </label>
          <p id="photo-help" className="mb-3 text-sm leading-relaxed text-muted-foreground">
            Nếu chúng ta có chụp chung tấm hình nào đó, hãy chia sẻ cho tớ với nhaa.
          </p>
          <div className="rounded-2xl border border-dashed border-border bg-background p-4">
            <ImagePlus size={24} aria-hidden="true" className="mb-3 text-signature" />
            <input
              ref={photoInputRef}
              id="wish-photo"
              name="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={choosePhoto}
              aria-describedby="photo-help photo-public"
              className="block w-full min-w-0 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
            />
            <p className="mt-3 text-xs text-muted-foreground">
              1 ảnh JPG, PNG hoặc WebP · tối đa 5 MB
            </p>
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Ảnh kỷ niệm đã chọn"
                  className="max-h-56 w-full rounded-xl object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    photoVersion.current++;
                    setPhoto(undefined);
                    requestRef.current = null;
                    if (photoInputRef.current) photoInputRef.current.value = "";
                  }}
                  className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground"
                >
                  <X size={16} />
                  Bỏ ảnh
                </button>
              </div>
            )}
          </div>
        </div>
      </fieldset>
      {preparing && (
        <p role="status" className="text-sm text-muted-foreground">
          Đang chuẩn bị ảnh…
        </p>
      )}
      <div aria-live="polite">
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {errorMessage}
          </p>
        )}
      </div>
      <p id="photo-public" className="text-xs leading-relaxed text-muted-foreground">
        Tên, lời chúc và ảnh đính kèm sẽ hiển thị công khai khi mở bao thư. Chỉ gửi ảnh bạn đồng ý
        chia sẻ.
      </p>
      <button
        type="submit"
        disabled={loading || preparing}
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
      {sent && <RsvpConfirmation onClose={() => dispatch({ type: "RESET_SUCCESS" })} />}
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
