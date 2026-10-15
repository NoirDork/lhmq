import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Memory } from "@/lib/memories";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export function AlbumCarousel({ memory }: { memory: Memory }) {
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [selection, setSelection] = useState(0);
  const [centered, setCentered] = useState(false);
  const reduceMotion = useReducedMotion();
  const imageCount = memory.images.length;
  const nodes = Array.from({ length: Math.min(5, imageCount) }, (_, position) =>
    centered && imageCount > 5 ? (selected - 2 + position + imageCount) % imageCount : position,
  );

  useEffect(() => {
    if (!api) return;
    const update = () => {
      const index = api.selectedScrollSnap();
      setSelected(index);
      if (index >= 2) setCentered(true);
      setSelection((value) => value + 1);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  useEffect(() => {
    if (!api || memory.images.length < 2) return;
    const timer = window.setTimeout(() => api.scrollNext(), 5000);
    return () => window.clearTimeout(timer);
  }, [api, selection, memory.images.length]);

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      aria-label={memory.title}
      className="mt-8 w-full"
    >
      <div className="relative">
        <CarouselContent>
          {memory.images.map((src, index) => (
            <CarouselItem key={src}>
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-card sm:aspect-[3/2]">
                <img
                  src={src}
                  alt={`${memory.title} — ảnh ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious aria-label="Ảnh trước" className="left-3 h-11 w-11" />
        <CarouselNext aria-label="Ảnh tiếp theo" className="right-3 h-11 w-11" />
      </div>
      <div role="group" aria-label="Chọn ảnh" className="mt-4 flex justify-center gap-1">
        {nodes.map((index) => (
          <motion.button
            key={memory.images[index]}
            layout="position"
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            type="button"
            aria-label={`Xem ảnh ${index + 1}`}
            aria-current={selected === index ? "true" : undefined}
            onClick={() => {
              api?.scrollTo(index);
              setSelection((value) => value + 1);
            }}
            className="flex h-8 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signature"
          >
            <span
              className={`h-2 rounded-full transition-all ${selected === index ? "w-5 bg-signature" : "w-2 bg-border"}`}
            />
          </motion.button>
        ))}
      </div>
    </Carousel>
  );
}
