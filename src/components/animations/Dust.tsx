"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type DustProps = {
  /** Particules pour 100 000 px² (adapté automatiquement à la taille). */
  density?: number;
  colors?: string[];
  className?: string;
  /** Vitesse de montée (px / frame). */
  speed?: number;
  maxSize?: number;
};

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  twinkle: number;
  color: string;
};

/**
 * Poussière dorée / étoiles très discrètes sur canvas.
 * - Se met en pause hors écran (IntersectionObserver)
 * - DPR plafonné, densité réduite sur mobile
 * - Image fixe si prefers-reduced-motion
 */
export default function Dust({
  density = 4,
  colors = ["220,192,140", "244,236,225", "230,195,189"],
  className = "",
  speed = 0.12,
  maxSize = 1.6,
}: DustProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let visible = false;
    let t = 0;

    const make = (randomY = true): Particle => ({
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 10,
      r: 0.3 + Math.random() * maxSize,
      vy: speed * (0.4 + Math.random()),
      vx: (Math.random() - 0.5) * 0.08,
      phase: Math.random() * Math.PI * 2,
      twinkle: 0.005 + Math.random() * 0.02,
      color: colors[Math.floor(Math.random() * colors.length)],
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const mobileFactor = w < 768 ? 0.55 : 1;
      const count = Math.min(220, Math.round(((w * h) / 100000) * density * mobileFactor));
      particles = Array.from({ length: count }, () => make(true));
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(p.phase + t * p.twinkle * 60));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color},${a.toFixed(3)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = () => {
      t += 1 / 60;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.vy;
        p.x += p.vx + Math.sin(t + p.phase) * 0.05;
        if (p.y < -10) particles[i] = make(false);
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduced || raf) return;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : visible && start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, speed, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
