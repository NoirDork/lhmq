import { useMotionValue, useSpring, useTransform, type MotionStyle } from "framer-motion";
import { useCallback } from "react";

type TiltResult = {
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
  style: MotionStyle;
};

export function useMouseTilt(degrees = 8): TiltResult {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 200, damping: 20 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [0, 1], [degrees, -degrees]);
  const rotateY = useTransform(springX, [0, 1], [-degrees, degrees]);

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
      transformStyle: "preserve-3d",
      perspective: 1000,
    } as MotionStyle,
  };
}
