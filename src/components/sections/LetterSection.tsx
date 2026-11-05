"use client";

import { useRef } from "react";
import { content } from "@/data/birthday-content";
import { fontsReady, gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import ChapterMark from "@/components/ui/ChapterMark";
import Dust from "@/components/animations/Dust";

export default function LetterSection() {
  const root = useRef<HTMLElement>(null);
  const { letter } = content;
  const last = letter.paragraphs.length - 1;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      let cancelled = false;

      // La feuille se déplie doucement
      gsap.from(q("[data-sheet]"), {
        opacity: 0,
        y: 80,
        rotateX: 10,
        transformPerspective: 1400,
        transformOrigin: "50% 0%",
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-sheet]")[0], start: "top 85%", once: true },
      });
      gsap.from(q("[data-letter-head] > *"), {
        opacity: 0,
        y: 24,
        duration: 1.2,
        stagger: 0.15,
        scrollTrigger: { trigger: q("[data-letter-head]")[0], start: "top 85%", once: true },
      });

      fontsReady().then(() => {
        if (cancelled) return;
        // Chaque paragraphe s'écrit mot à mot, rapidement : lisible, jamais bloquant
        q("[data-lp]").forEach((p) => {
          const split = SplitText.create(p, { type: "words" });
          gsap.from(split.words, {
            opacity: 0,
            y: 8,
            filter: "blur(4px)",
            duration: 0.7,
            stagger: 0.018,
            ease: "power2.out",
            scrollTrigger: { trigger: p, start: "top 88%", once: true },
          });
        });
        gsap.from(q("[data-greeting]"), {
          opacity: 0,
          x: -20,
          duration: 1.4,
          scrollTrigger: { trigger: q("[data-greeting]")[0], start: "top 85%", once: true },
        });
        gsap.fromTo(
          q("[data-sign-line]"),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            scrollTrigger: { trigger: q("[data-sign]")[0], start: "top 90%", once: true },
          }
        );
        gsap.from(q("[data-sign]"), {
          opacity: 0,
          y: 12,
          duration: 1.2,
          scrollTrigger: { trigger: q("[data-sign]")[0], start: "top 90%", once: true },
        });
        ScrollTrigger.refresh();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="lettre"
      aria-labelledby="lettre-title"
      className="relative isolate overflow-hidden bg-candle py-28 md:py-40"
    >
      {/* Lumière de bougie très douce */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 30%, rgba(201,166,107,0.14), transparent 70%), radial-gradient(80% 60% at 50% 100%, rgba(92,16,32,0.35), transparent 70%)",
        }}
      />
      <Dust density={1.2} speed={0.06} colors={["220,192,140"]} className="-z-10 opacity-60" />

      <div className="mx-auto max-w-3xl px-[var(--gutter)]">
        <div data-letter-head className="mb-14 flex flex-col items-center text-center md:mb-20">
          <ChapterMark index="04" label="Une lettre" className="mb-8" />
          <h2
            id="lettre-title"
            className="max-w-[16ch] font-serif text-[clamp(2.1rem,5.4vw,4.2rem)] leading-[1.05] font-light italic text-cream"
          >
            {letter.eyebrow}
          </h2>
        </div>

        <article
          data-sheet
          className="relative rounded-[2px] bg-ivory px-6 py-12 text-cocoa shadow-[0_60px_120px_-40px_rgba(0,0,0,0.85)] sm:px-12 md:px-16 md:py-20"
          style={{
            backgroundImage:
              "radial-gradient(120% 70% at 50% 0%, #fffdf8, transparent 70%), linear-gradient(180deg, #fbf7f0, #f3eadc)",
          }}
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-3 border border-champagne/35 md:inset-4" />

          <p data-greeting className="font-script text-[clamp(2.6rem,7vw,3.6rem)] leading-none text-bordeaux">
            {letter.greeting}
          </p>

          <div className="mt-8 space-y-6 font-serif text-[1.22rem] leading-[1.75] text-cocoa/90 md:text-[1.35rem]">
            {letter.paragraphs.map((p, i) => (
              <p
                key={i}
                data-lp
                className={
                  i === last
                    ? "pt-4 font-serif text-[1.5rem] italic text-bordeaux md:text-[1.7rem]"
                    : i === 2
                      ? "italic text-bordeaux/90"
                      : ""
                }
              >
                {p}
              </p>
            ))}
          </div>

          <div data-sign className="mt-12 flex flex-col items-end">
            <p className="font-script text-[2.3rem] leading-none text-bordeaux md:text-[2.6rem]">{letter.signature}</p>
            <svg viewBox="0 0 200 20" className="mt-2 h-4 w-40 text-champagne" aria-hidden="true">
              <path
                data-sign-line
                d="M2 14 C 40 4, 80 18, 120 10 S 180 6, 198 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
              />
            </svg>
          </div>
        </article>
      </div>
    </section>
  );
}
