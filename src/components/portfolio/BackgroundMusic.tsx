import { useEffect, useRef } from "react";
import track from "../../../music/HOÀNG DŨNG GIỮ ANH CHO NGÀY HÔM QUA feat.RHYMASTIC OFFICIAL MUSIC VIDEO.mp3";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    let pending = false;
    const removeListeners = () => {
      document.removeEventListener("pointerup", start);
      document.removeEventListener("keydown", start);
    };
    function start() {
      if (pending) return;
      pending = true;
      void audio!
        .play()
        .then(removeListeners, () => {
          // Autoplay can be blocked; retry within the next real user gesture.
        })
        .finally(() => {
          pending = false;
        });
    }
    audio.volume = 0.35;
    document.addEventListener("pointerup", start);
    document.addEventListener("keydown", start);
    start();
    return () => {
      removeListeners();
      audio.pause();
    };
  }, []);

  return <audio ref={audioRef} src={track} autoPlay loop preload="auto" aria-hidden="true" />;
}
