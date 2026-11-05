"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/data/gallery";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scroll";

type Props = {
  items: GalleryItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export default function Lightbox({ items, index, onIndexChange, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const item = items[index];
  const total = items.length;

  const go = useCallback(
    (dir: 1 | -1) => onIndexChange((index + dir + total) % total),
    [index, total, onIndexChange]
  );

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(root.current, { opacity: 0, duration: 0.5, ease: "power2.out" });
    },
    { scope: root }
  );

  // Transition à chaque changement de photo
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-lb-media]",
        { opacity: 0, scale: 0.96, filter: "blur(6px)" },
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" }
      );
      gsap.fromTo("[data-lb-caption]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15 });
    },
    { scope: root, dependencies: [index] }
  );

  const close = contextSafe(() => {
    if (prefersReducedMotion()) return onClose();
    gsap.to(root.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: onClose });
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll();
    closeBtn.current?.focus();
    return () => {
      unlockScroll();
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && root.current) {
        // Piège de focus simple
        const focusables = root.current.querySelectorAll<HTMLElement>("button, video");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, close]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label="Galerie en plein écran"
      className="fixed inset-0 z-[95] flex flex-col bg-ink/95 text-cream backdrop-blur-sm"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="flex items-center justify-between px-[var(--gutter)] pt-5 pb-3">
        <span className="font-serif text-lg italic text-gold" aria-live="polite">
          {String(index + 1).padStart(2, "0")} <span className="text-cream/40">/ {String(total).padStart(2, "0")}</span>
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-cream/25 transition-colors hover:border-gold hover:text-gold"
          aria-label="Fermer"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-24" onClick={(e) => e.target === e.currentTarget && close()}>
        <div data-lb-media className="relative h-full max-h-[78svh] w-full max-w-5xl">
          {item.type === "video" ? (
            <video
              key={item.src}
              src={item.src}
              poster={item.poster}
              controls
              playsInline
              preload="none"
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              key={item.src}
              src={item.src}
              alt={item.alt}
              fill
              sizes="100vw"
              className={`object-contain ${item.cutout ? "rounded-sm" : ""}`}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => go(-1)}
          className="focus-ring absolute left-2 hidden h-12 w-12 place-items-center rounded-full border border-cream/20 bg-ink/40 transition-colors hover:border-gold hover:text-gold sm:grid md:left-8"
          aria-label="Photo précédente"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          className="focus-ring absolute right-2 hidden h-12 w-12 place-items-center rounded-full border border-cream/20 bg-ink/40 transition-colors hover:border-gold hover:text-gold sm:grid md:right-8"
          aria-label="Photo suivante"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 px-[var(--gutter)] pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={() => go(-1)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-cream/20 sm:hidden"
          aria-label="Photo précédente"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <p data-lb-caption className="flex-1 text-center font-serif text-xl italic text-cream/90 sm:text-2xl">
          {item.caption}
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-cream/20 sm:hidden"
          aria-label="Photo suivante"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
