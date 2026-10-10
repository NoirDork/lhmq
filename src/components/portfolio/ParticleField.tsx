import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const dimsRef = useRef({ w: 0, h: 0 });
  const isVisibleRef = useRef(true);

  const drawCap = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#BFDDF5";
      ctx.beginPath();
      const s = size * 0.5;
      ctx.moveTo(x - s * 3, y);
      ctx.lineTo(x + s * 3, y);
      ctx.lineTo(x + s * 3, y - s * 0.5);
      ctx.lineTo(x - s * 3, y - s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x - s * 0.5, y - s * 2, s, s * 2);
      ctx.beginPath();
      ctx.arc(x + s * 1.5, y - s * 2.5, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },
    [],
  );

  const createParticle = useCallback((): Particle => {
    const { w, h } = dimsRef.current;
    return {
      x: Math.random() * w,
      y: h + Math.random() * h * 0.5,
      size: 1.5 + Math.random() * 3,
      speedY: -(0.15 + Math.random() * 0.35),
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: 0.04 + Math.random() * 0.12,
    };
  }, []);

  const animate = useCallback(() => {
    if (!isVisibleRef.current) return;

    const ctx = ctxRef.current;
    const { w, h } = dimsRef.current;
    const particles = particlesRef.current;
    if (!ctx || !w || !h) return;

    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y + p.size < 0) {
        Object.assign(p, createParticle());
        p.y = h + p.size;
      }

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      if (p.size > 3) {
        drawCap(ctx, p.x, p.y, p.size, p.opacity);
      } else {
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#BFDDF5";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animIdRef.current = requestAnimationFrame(animate);
  }, [createParticle, drawCap]);

  useEffect(() => {
    if (prefersReduced() || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctxRef.current = ctx;
    const PARTICLE_COUNT = window.innerWidth < 1024 ? 20 : 40;

    const resize = () => {
      const parent = canvas.parentElement!;
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      dimsRef.current = { w, h };
      canvas.width = w;
      canvas.height = h;
    };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.y = Math.random() * dimsRef.current.h;
        particlesRef.current.push(p);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        if (animIdRef.current !== null) {
          cancelAnimationFrame(animIdRef.current);
          animIdRef.current = null;
        }
      } else {
        isVisibleRef.current = true;
        if (animIdRef.current === null) {
          animIdRef.current = requestAnimationFrame(animate);
        }
      }
    };

    resize();
    initParticles();
    animIdRef.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (animIdRef.current !== null) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      ctxRef.current = null;
    };
  }, [animate, createParticle, isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
