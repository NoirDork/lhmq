import { useRef } from "react";
import { GraduationCap, Heart, Droplet } from "lucide-react";
import confetti from "canvas-confetti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function RsvpConfirmation({
  attending,
  onClose,
}: {
  attending: boolean;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const Icon = attending ? GraduationCap : Heart;

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      let burst: ReturnType<typeof confetti.create> | undefined;

      if (!reduceMotion) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 16, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" },
        );
        if (attending && canvasRef.current) {
          // Keep the canvas inside the dialog's top layer so confetti stays visible.
          burst = confetti.create(canvasRef.current, { resize: true });
          void burst({
            particleCount: window.innerWidth < 768 ? 40 : 80,
            spread: 80,
            origin: { y: 0.65 },
            colors: ["#BFDDF5", "#345F87", "#FFFFFF"],
            disableForReducedMotion: true,
          });
        } else {
          gsap.fromTo(
            dialog.querySelectorAll("[data-rain-icon]"),
            { y: -32, opacity: 0.65 },
            { y: window.innerHeight + 32, rotation: 30, duration: 3, stagger: 0.12, ease: "none" },
          );
        }
      }

      return () => {
        burst?.reset();
        dialog.close();
        document.body.style.overflow = previousOverflow;
      };
    },
    { scope: dialogRef, dependencies: [attending, reduceMotion], revertOnUpdate: true },
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="rsvp-confirmation-title"
      aria-describedby="rsvp-confirmation-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md overflow-visible border-0 bg-transparent p-0 text-foreground backdrop:bg-black/35 backdrop:backdrop-blur-sm"
    >
      {!reduceMotion &&
        (attending ? (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 h-dvh w-screen"
          />
        ) : (
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {Array.from({ length: 24 }, (_, index) => {
              const RainIcon = index % 2 === 0 ? Droplet : Heart;
              return (
                <span
                  key={index}
                  data-rain-icon
                  className="absolute -top-8 text-primary opacity-0"
                  style={{ left: `${3 + index * 4}%` }}
                >
                  <RainIcon size={index % 3 === 0 ? 24 : 16} />
                </span>
              );
            })}
          </div>
        ))}
      <div
        ref={panelRef}
        className="relative z-10 max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl border border-border bg-card p-6 text-center shadow-xl sm:p-8"
      >
        <span
          aria-hidden="true"
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary bg-accent text-signature"
        >
          <Icon size={28} strokeWidth={1.5} />
        </span>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          RSVP · Đã ghi nhận
        </p>
        <h2
          id="rsvp-confirmation-title"
          className="text-balance font-serif text-2xl leading-snug sm:text-3xl"
        >
          {attending
            ? "Cảm ơn sự hiện diện của bạn vào ngày trọng đại của mình."
            : "Thật tiếc khi không có bạn bên cạnh."}
        </h2>
        <p
          id="rsvp-confirmation-description"
          className="mt-4 text-base leading-relaxed text-foreground/75"
        >
          Cảm ơn bạn đã gửi lời chúc.
        </p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-8 min-h-[48px] w-full cursor-pointer rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
        >
          Đóng
        </button>
      </div>
    </dialog>
  );
}
