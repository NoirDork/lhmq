import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { supabase } from "@/lib/supabase";

interface Guest {
  guest_name: string;
  attending_status: string;
  created_at: string;
}

const statusColor: Record<string, string> = {
  Attending: "text-green-400",
  "Not Attending": "text-red-400",
  Maybe: "text-yellow-400",
};

export function GuestList() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchGuests();
    const onGuestSubmitted = () => fetchGuests();
    window.addEventListener("guest-submitted", onGuestSubmitted);
    return () => window.removeEventListener("guest-submitted", onGuestSubmitted);
  }, []);

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

  async function fetchGuests() {
    setLoading(true);
    setError(false);

    const { data, error: fetchError } = await supabase
      .from("rsvps")
      .select("guest_name, attending_status, created_at")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(true);
    } else {
      setGuests(data ?? []);
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          PHẢN HỒI KHÁCH
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
      )}

      {!loading && error && (
        <p className="py-8 text-center text-sm text-red-500">
          Không thể tải danh sách khách mời.
        </p>
      )}

      {!loading && !error && guests.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Chưa có phản hồi nào. Hãy là người đầu tiên!
        </p>
      )}

      {!loading && !error && guests.length > 0 && (
        <div ref={listRef} className="mx-auto grid w-full max-w-5xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
