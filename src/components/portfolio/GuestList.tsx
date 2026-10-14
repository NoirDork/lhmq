import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fetchGuests as fetchGuestsApi, type PublicGuest } from "@/lib/rsvps";
import { GuestLetter } from "./GuestLetter";

export function GuestList() {
  const [guests, setGuests] = useState<PublicGuest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<PublicGuest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const loadGuests = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      setGuests(await fetchGuestsApi());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGuests();
    const onGuestSubmitted = () => loadGuests();
    window.addEventListener("guest-submitted", onGuestSubmitted);
    return () => window.removeEventListener("guest-submitted", onGuestSubmitted);
  }, [loadGuests]);

  useGSAP(() => {
    if (!listRef.current || guests.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: reduceMotion ? 0 : 16 },
      {
        opacity: 1,
        y: 0,
        duration: reduceMotion ? 0 : 0.55,
        stagger: reduceMotion ? 0 : 0.06,
        ease: "power2.out",
      },
    );
  }, [guests]);

  function GuestCardSkeleton() {
    return (
      <div className="w-full rounded-2xl border border-border bg-card px-5 py-4 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="h-3 w-24 bg-accent rounded" />
            <div className="mt-2 h-4 w-32 bg-accent rounded" />
          </div>
          <div className="h-4 w-20 bg-accent rounded shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">LỜI CHÚC</p>
      </div>

      {loading && (
        <div
          ref={listRef}
          className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Đang tải lời chúc"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <GuestCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="py-8 text-center">
          <p role="alert" className="text-sm text-red-700">
            Không thể tải danh sách khách mời.
          </p>
          <button
            type="button"
            onClick={loadGuests}
            className="mt-3 min-h-[44px] rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signature"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && guests.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Chưa có lời chúc nào. Hãy là người đầu tiên!
        </p>
      )}

      {!loading && !error && guests.length > 0 && (
        <div
          ref={listRef}
          className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {guests.map((guest) => (
            <button
              key={guest.id}
              type="button"
              aria-label={`Mở thư của ${guest.guest_name}`}
              onClick={() => setSelectedGuest(guest)}
              className="group relative min-h-44 w-full overflow-hidden rounded-2xl border border-border bg-card px-6 pb-5 pt-16 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-16 border-b border-border bg-accent [clip-path:polygon(0_0,100%_0,50%_100%)]"
              />
              <p className="mt-2 break-words font-medium">
                Từ: <span>{guest.guest_name}</span>
              </p>
            </button>
          ))}
        </div>
      )}
      {selectedGuest && (
        <GuestLetter guest={selectedGuest} onClose={() => setSelectedGuest(null)} />
      )}
    </section>
  );
}
