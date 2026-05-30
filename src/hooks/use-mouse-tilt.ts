import { useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useCallback } from "react";

type TiltResult = {
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  style: Record<string, unknown>;
};

export function useMouseTilt(degrees = 12): TiltResult {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [0, 1], [degrees, -degrees]);
  const rotateY = useTransform(springX, [0, 1], [-degrees, degrees]);

  const shadowX = useTransform(springX, [0, 1], [-8, 8]);
  const shadowY = useTransform(springY, [0, 1], [8, -8]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 24px rgba(0,0,0,0.12)`;

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left) / rect.width);
      y.set((e.clientY - rect.top) / rect.height);
    },
    [x, y],
  );

  const onMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
  }, [x, y]);

  return {
    onMouseMove,
    onMouseLeave,
    style: {
      rotateX,
      rotateY,
      boxShadow,
      transformStyle: "preserve-3d" as const,
      perspective: 1000,
    },
  };
}
