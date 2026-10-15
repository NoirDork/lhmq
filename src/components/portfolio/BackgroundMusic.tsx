import { useEffect } from "react";

export function BackgroundMusic() {
  useEffect(() => {
    // Reuse the HTML audio element so downloading starts before React loads.
    const audio = document.querySelector<HTMLAudioElement>("#background-music");
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

  return null;
}
