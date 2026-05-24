import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (prefersReduced()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    const particles: Particle[] = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      const parent = canvas!.parentElement!;
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas!.width = w;
      canvas!.height = h;
    }

    function createParticle(): Particle {
      return {
        x: Math.random() * w,
        y: h + Math.random() * h * 0.5,
        size: 1.5 + Math.random() * 3,
        speedY: -(0.15 + Math.random() * 0.35),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: 0.04 + Math.random() * 0.12,
      };
    }

    function initParticles() {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.y = Math.random() * h;
        particles.push(p);
      }
    }

    function drawCap(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
    ) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "#D4A853";
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
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);

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
          drawCap(ctx!, p.x, p.y, p.size, p.opacity);
        } else {
          ctx!.globalAlpha = p.opacity;
          ctx!.fillStyle = "#D4A853";
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0"
      aria-hidden="true"
    />
  );
}
