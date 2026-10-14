import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import track from "../../../music/THÁNG NĂM ĐẸP NHẤT CUỘC ĐỜI - Vũ Thịnh _ Official Music Video.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio || pending) return;
    if (playing) {
      audio.pause();
      return;
    }
    setError(false);
    setPending(true);
    audio.volume = 0.35;
    try {
      await audio.play();
    } catch {
      setPlaying(false);
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <aside
      aria-label="Nhạc nền"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2"
    >
      <audio
        ref={audioRef}
        src={track}
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
      />
      {error && (
        <p
          role="alert"
          className="max-w-64 rounded-xl border border-border bg-background p-3 text-sm text-foreground shadow-sm"
        >
          Không phát được nhạc. Bạn thử bật lại nhé.
        </p>
      )}
      <button
        type="button"
        onClick={toggleMusic}
        disabled={pending}
        aria-pressed={playing}
        aria-label={`${playing ? "Tắt" : "Bật"} nhạc nền: Tháng Năm Đẹp Nhất Cuộc Đời – Vũ Thịnh`}
        title="Tháng Năm Đẹp Nhất Cuộc Đời – Vũ Thịnh"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-signature shadow-sm hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature disabled:opacity-60"
      >
        {playing ? (
          <Volume2 size={18} aria-hidden="true" />
        ) : (
          <VolumeX size={18} aria-hidden="true" />
        )}
        {pending ? "Đang tải nhạc…" : playing ? "Tắt nhạc" : "Bật nhạc"}
      </button>
    </aside>
  );
}
