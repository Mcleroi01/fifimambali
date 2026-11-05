"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

export type PetalsHandle = {
  /** Explosion de pétales et d'étoiles depuis un point (en % du canvas). */
  burst: (originX?: number, originY?: number) => void;
};

type PetalsProps = {
  /** Nombre de pétales qui tombent en continu (0 = aucun). */
  ambient?: number;
  className?: string;
};

type Petal = {
  kind: "petal" | "star";
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vr: number;
  flip: number;
  vflip: number;
  sway: number;
  color: string;
  life: number;
  maxLife: number;
  ambient: boolean;
};

const PETAL_COLORS = ["#e6c3bd", "#f2ddd7", "#c9677a", "#a3142c", "#dcc08c", "#7a1528"];
const STAR_COLORS = ["#f4e3bf", "#dcc08c", "#ffffff"];

/**
 * Pétales élégants sur canvas (mode ambiant + explosion à la demande).
 */
const Petals = forwardRef<PetalsHandle, PetalsProps>(function Petals(
  { ambient = 0, className = "" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<PetalsHandle>({ burst: () => {} });

  useImperativeHandle(ref, () => ({ burst: (x, y) => api.current.burst(x, y) }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handle = api.current;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let items: Petal[] = [];
    const small = () => w < 768;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const ambientPetal = (initial: boolean): Petal => ({
      kind: "petal",
      x: rand(0, w),
      y: initial ? rand(-h, h) : rand(-60, -20),
      vx: rand(-0.15, 0.15),
      vy: rand(0.25, 0.6),
      size: rand(5, 10),
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.01, 0.01),
      flip: rand(0, Math.PI * 2),
      vflip: rand(0.01, 0.03),
      sway: rand(0.4, 1),
      color: pick(PETAL_COLORS.slice(0, 5)),
      life: 0,
      maxLife: Infinity,
      ambient: true,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      items = items.filter((p) => !p.ambient);
      const n = reduced ? 0 : Math.round(ambient * (small() ? 0.6 : 1));
      for (let i = 0; i < n; i++) items.push(ambientPetal(true));
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const sx = Math.max(0.15, Math.abs(Math.cos(p.flip)));
      ctx.scale(sx, 1);
      const alpha = p.ambient ? 0.75 : Math.max(0, 1 - p.life / p.maxLife) * 0.95;
      ctx.globalAlpha = alpha;
      if (p.kind === "petal") {
        const s = p.size;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
        ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else {
        const s = p.size;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const a = (i * Math.PI) / 2;
          ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
          ctx.lineTo(Math.cos(a + Math.PI / 4) * s * 0.28, Math.sin(a + Math.PI / 4) * s * 0.28);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    };

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      const next: Petal[] = [];
      for (const p of items) {
        p.life += 1;
        if (p.ambient) {
          p.x += p.vx + Math.sin(p.flip) * 0.3 * p.sway;
          p.y += p.vy;
          if (p.y > h + 30) Object.assign(p, ambientPetal(false));
        } else {
          p.vx *= 0.985;
          p.vy = p.vy * 0.985 + (p.kind === "petal" ? 0.045 : 0.012);
          p.x += p.vx + (p.kind === "petal" ? Math.sin(p.flip) * 0.4 : 0);
          p.y += p.vy;
        }
        p.rot += p.vr;
        p.flip += p.vflip;
        drawPetal(p);
        if (p.life < p.maxLife && p.y < h + 40) next.push(p);
      }
      items = next;
    };

    const loop = () => {
      step();
      raf = items.length ? requestAnimationFrame(loop) : 0;
    };

    const start = () => {
      if (!raf && items.length) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    handle.burst = (ox = 50, oy = 50) => {
      const cx = (ox / 100) * w;
      const cy = (oy / 100) * h;
      const count = reduced ? 0 : small() ? 70 : 140;
      for (let i = 0; i < count; i++) {
        const star = Math.random() < 0.35;
        const angle = rand(0, Math.PI * 2);
        const force = star ? rand(2, 9) : rand(2.5, 8.5);
        items.push({
          kind: star ? "star" : "petal",
          x: cx,
          y: cy,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force - 2.2,
          size: star ? rand(2, 5) : rand(5, 11),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.06, 0.06),
          flip: rand(0, Math.PI * 2),
          vflip: rand(0.03, 0.09),
          sway: 1,
          color: star ? pick(STAR_COLORS) : pick(PETAL_COLORS),
          life: 0,
          maxLife: rand(160, 280),
          ambient: false,
        });
      }
      start();
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

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      handle.burst = () => {};
    };
  }, [ambient]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
});

export default Petals;
