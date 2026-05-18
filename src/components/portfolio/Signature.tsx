export function Signature({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M30 140 C 80 40, 140 40, 170 120 S 240 200, 280 100 C 310 30, 360 30, 380 130 C 395 200, 460 180, 500 110 C 520 70, 540 60, 570 80" />
      <path d="M180 160 C 260 150, 360 150, 520 155" strokeWidth="3" opacity="0.7" />
    </svg>
  );
}
