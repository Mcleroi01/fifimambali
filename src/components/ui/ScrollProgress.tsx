"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Fine barre champagne de progression, en haut de l'écran. */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-bordeaux via-champagne to-gold" />
    </div>
  );
}
