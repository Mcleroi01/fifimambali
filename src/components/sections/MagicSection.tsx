"use client";

import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { content } from "@/data/birthday-content";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import Dust from "@/components/animations/Dust";
import Petals, { type PetalsHandle } from "@/components/animations/Petals";
import ChapterMark from "@/components/ui/ChapterMark";

/** Pétale en amande, de (0,0) vers le haut. */
const petal = (len: number, width: number) =>
  `M0 0 C ${width} ${-len * 0.3}, ${width} ${-len * 0.78}, 0 ${-len} C ${-width} ${-len * 0.78}, ${-width} ${-len * 0.3}, 0 0 Z`;

function LineFlower() {
  const outer = Array.from({ length: 10 }, (_, i) => i * 36);
  const inner = Array.from({ length: 10 }, (_, i) => i * 36 + 18);
  return (
    <svg viewBox="-110 -110 220 220" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        {outer.map((r) => (
          <path key={`o${r}`} data-draw d={petal(96, 26)} transform={`rotate(${r})`} strokeWidth="0.9" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        ))}
        {inner.map((r) => (
          <path key={`i${r}`} data-draw d={petal(58, 16)} transform={`rotate(${r})`} strokeWidth="0.8" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0.8" />
        ))}
        <circle data-draw r="14" strokeWidth="0.9" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        <circle data-draw r="104" strokeWidth="0.4" pathLength={1} strokeDasharray="1" strokeDashoffset="1" opacity="0.5" />
      </g>
      <g fill="currentColor">
        {outer.map((r) => (
          <circle key={`d${r}`} data-dot r="1.6" transform={`rotate(${r}) translate(0 -104)`} opacity="0" />
        ))}
      </g>
    </svg>
  );
}

export default function MagicSection() {
  const root = useRef<HTMLElement>(null);
  const petals = useRef<PetalsHandle>(null);
  const [revealed, setRevealed] = useState(false);
  const busy = useRef(false);
  const { magic } = content;

  const { contextSafe } = useGSAP({ scope: root });

  const reveal = contextSafe(() => {
    if (busy.current) return;
    busy.current = true;
    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();
    const first = !revealed;
    setRevealed(true);

    if (reduced) {
      gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
      gsap.set(q("[data-dot]"), { opacity: 1 });
      gsap.set(q("[data-msg], [data-again]"), { opacity: 1 });
      gsap.set(q("[data-flower]"), { opacity: 0.32 });
      gsap.set(q("[data-cta-wrap]"), { display: "none" });
      busy.current = false;
      return;
    }

    const tl = gsap.timeline({ onComplete: () => void (busy.current = false) });

    if (first) {
      tl.to(q("[data-cta-wrap]"), { opacity: 0, scale: 0.9, duration: 0.5, ease: "power2.in" })
        .set(q("[data-cta-wrap]"), { display: "none" });
    } else {
      tl.to(q("[data-msg], [data-again]"), { opacity: 0, duration: 0.4 })
        .set(q("[data-draw]"), { strokeDashoffset: 1 })
        .set(q("[data-dot]"), { opacity: 0 });
    }

    tl.fromTo(
      q("[data-ring]"),
      { scale: 0, opacity: 0.9 },
      { scale: 1, opacity: 0, duration: 1.6, ease: "expo.out", stagger: 0.18 },
      ">-0.05"
    )
      .add(() => petals.current?.burst(50, 48), "<")
      .set(q("[data-flower]"), { opacity: 1 }, "<")
      .fromTo(q("[data-flower]"), { rotate: -25, scale: 0.85 }, { rotate: 0, scale: 1, duration: 3, ease: "expo.out" }, "<")
      .to(q("[data-draw]"), { strokeDashoffset: 0, duration: 2.2, stagger: 0.035, ease: "power2.inOut" }, "<")
      .to(q("[data-dot]"), { opacity: 1, duration: 0.4, stagger: 0.05 }, "-=1");

    const msg = q("[data-msg]")[0];
    gsap.set(msg, { opacity: 1 });
    const split = SplitText.create(msg, { type: "words,chars" });
    tl.from(
      split.chars,
      { opacity: 0, y: 14, filter: "blur(6px)", duration: 0.9, stagger: 0.018, ease: "power2.out" },
      "-=2"
    )
      .to(q("[data-flower]"), { opacity: 0.32, duration: 1.4, ease: "power2.out" }, "<")
      .add(() => split.revert())
      .to(q("[data-again]"), { opacity: 1, duration: 0.8 }, "-=0.3");
  });

  return (
    <section
      ref={root}
      id="magie"
      aria-labelledby="magie-title"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink py-24 text-cream"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(55% 45% at 50% 50%, rgba(92,16,32,0.6), transparent 75%)" }}
      />
      <Dust density={6} maxSize={1.3} className="-z-10" />
      <Petals ref={petals} className="z-20" />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center px-[var(--gutter)] text-center">
        <ChapterMark index="05" label={magic.eyebrow} className="mb-10" />
        <h2 id="magie-title" className="sr-only">
          {magic.eyebrow}
        </h2>

        <div className="relative grid w-full place-items-center">
          {/* Fleur dessinée au trait */}
          <div
            data-flower
            className="pointer-events-none h-[min(82vw,26rem)] w-[min(82vw,26rem)] text-gold opacity-0 [grid-area:1/1]"
          >
            <LineFlower />
          </div>

          {/* Anneaux lumineux */}
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ring
              aria-hidden="true"
              className="pointer-events-none h-[min(90vw,30rem)] w-[min(90vw,30rem)] scale-0 rounded-full border border-gold/60 opacity-0 [grid-area:1/1]"
            />
          ))}

          <div data-cta-wrap className="[grid-area:1/1]">
            <button
              type="button"
              onClick={reveal}
              className="btn-lux soft-pulse inline-flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-full border border-gold/70 bg-ink/40 px-6 py-4 text-left text-[0.92rem] font-medium text-balance text-gold backdrop-blur-sm sm:px-9 sm:py-5 sm:text-base"
            >
              <Sparkles size={18} aria-hidden="true" />
              <span>{magic.cta}</span>
            </button>
          </div>

          <p
            data-msg
            aria-hidden={!revealed}
            className="pointer-events-none max-w-[15ch] font-serif text-[clamp(1.9rem,5.6vw,3.6rem)] leading-[1.12] font-light italic text-ivory opacity-0 [grid-area:1/1] [text-shadow:0_2px_30px_rgba(13,5,7,0.9)]"
          >
            {magic.message}
          </p>
        </div>

        <button
          data-again
          type="button"
          onClick={reveal}
          disabled={!revealed}
          className="focus-ring mt-10 text-[0.72rem] tracking-[0.3em] text-gold/80 uppercase underline-offset-8 opacity-0 transition-colors hover:text-gold hover:underline disabled:pointer-events-none"
        >
          {magic.again}
        </button>
      </div>
    </section>
  );
}
