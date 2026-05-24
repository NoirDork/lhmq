import { motion, type Variants } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const mainPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: easeOut },
  },
};

const underlinePath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 0.7,
    transition: { duration: 1.2, delay: 0.8, ease: easeOut },
  },
};

export function Signature({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 600 200"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      initial="hidden"
      animate="visible"
    >
      <motion.path
        variants={mainPath}
        d="M30 140 C 80 40, 140 40, 170 120 S 240 200, 280 100 C 310 30, 360 30, 380 130 C 395 200, 460 180, 500 110 C 520 70, 540 60, 570 80"
      />
      <motion.path
        variants={underlinePath}
        d="M180 160 C 260 150, 360 150, 520 155"
        strokeWidth="3"
      />
    </motion.svg>
  );
}
