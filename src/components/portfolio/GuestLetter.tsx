import { useEffect, useRef } from "react";
import { Mail } from "lucide-react";
import type { PublicGuest } from "@/lib/rsvps";

export function GuestLetter({ guest, onClose }: { guest: PublicGuest; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("button")?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [guest.id]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="guest-letter-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-border bg-card p-0 text-foreground shadow-xl backdrop:bg-black/35 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8">
        <Mail aria-hidden="true" size={24} className="mb-6 text-signature" />
        <h2 id="guest-letter-title" className="break-words font-serif text-2xl leading-snug">
          Lời chúc từ {guest.guest_name}
        </h2>
        <p
          data-letter-message
          className="mt-6 whitespace-pre-wrap [overflow-wrap:anywhere] text-base leading-relaxed"
        >
          {guest.message}
        </p>
        <p className="mt-8 text-sm text-muted-foreground">Gửi Minh Quân, với yêu thương.</p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 min-h-12 w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
        >
          Đóng thư
        </button>
      </div>
    </dialog>
  );
}
