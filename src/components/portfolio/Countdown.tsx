import { useEffect, useState } from "react";
import { GRADUATION_START } from "@/lib/event";

const target = Date.parse(GRADUATION_START);

export function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, Math.ceil((target - now) / 1000));
  const values = [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];
  return (
    <div>
      <div
        role="timer"
        aria-label="Đếm ngược đến lễ tốt nghiệp"
        className="grid grid-cols-4 gap-2 sm:gap-4"
      >
        {["ngày", "giờ", "phút", "giây"].map((label, i) => (
          <div key={label} className="rounded-2xl border border-current/15 px-2 py-4 text-center">
            <span className="block text-3xl font-semibold tabular-nums sm:text-4xl">
              {String(values[i]).padStart(2, "0")}
            </span>{" "}
            <span className="mt-1 block text-xs uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>
      {remaining === 0 && <p className="mt-3 text-sm">Đã đến ngày tốt nghiệp!</p>}
    </div>
  );
}
