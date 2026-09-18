import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { fetchGuests as fetchGuestsApi, type PublicGuest } from "@/lib/rsvps";

const statusColor: Record<string, string> = {
  Attending: "text-green-400",
  "Not Attending": "text-red-400",
  Maybe: "text-yellow-400",
};

export function GuestList() {
  const [guests, setGuests] = useState<PublicGuest[]>([]);
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
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">PHẢN HỒI KHÁCH</p>
      </div>

      {loading && (
        <div
          ref={listRef}
          className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Đang tải phản hồi khách"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <GuestCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="py-8 text-center text-sm text-red-500">Không thể tải danh sách khách mời.</p>
      )}

      {!loading && !error && guests.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Chưa có phản hồi nào. Hãy là người đầu tiên!
        </p>
      )}

      {!loading && !error && guests.length > 0 && (
        <div
          ref={listRef}
          className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {guests.map((guest, i) => (
            <div
              key={`${guest.created_at}-${i}`}
              className="w-full rounded-2xl border border-border bg-card px-5 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                    Gửi: <span className="font-medium text-foreground">Minh Quân</span>
                  </p>
                  <p className="mt-1 truncate text-sm">
                    Từ: <span className="font-medium">{guest.guest_name}</span>
                  </p>
                </div>
                <span
                  className={`shrink-0 text-right text-xs font-medium uppercase tracking-[0.1em] ${statusColor[guest.attending_status] ?? "text-muted-foreground"}`}
                >
                  {guest.attending_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
