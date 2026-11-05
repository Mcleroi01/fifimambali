"use client";

import { useRef } from "react";
import { content } from "@/data/birthday-content";
import { fontsReady, gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import Dust from "@/components/animations/Dust";

type IntroProps = {
  /** Appelé quand le rideau commence à s'ouvrir (lance l'entrée du hero). */
  onReveal: () => void;
  /** Appelé quand l'intro a totalement disparu. */
  onDone: () => void;
};

function withName(text: string, name: string) {
  const i = text.lastIndexOf(name);
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <span className="not-italic text-gold">{name}</span>
      {text.slice(i + name.length)}
    </>
  );
}

export default function Intro({ onReveal, onDone }: IntroProps) {
  const root = useRef<HTMLDivElement>(null);
  const introTl = useRef<gsap.core.Timeline | null>(null);
  const leaving = useRef(false);
  const { intro, person, dates } = content;

  const { contextSafe } = useGSAP(
    () => {
      const reduced = prefersReducedMotion();
      const q = gsap.utils.selector(root);
      let cancelled = false;

      fontsReady().then(() => {
        if (cancelled || !root.current) return;
        const tl = gsap.timeline({ delay: 0.35 });
        introTl.current = tl;

        tl.to(q("[data-chrome]"), { opacity: 1, duration: 1.2, ease: "power2.out" }, 0);

        if (reduced) {
          tl.to(q("[data-l1]"), { opacity: 1, duration: 0.8 }, 0.2)
            .to(q("[data-l1]"), { opacity: 0, duration: 0.6 }, "+=2.6")
            .to(q("[data-l2]"), { opacity: 1, duration: 0.8 })
            .to(q("[data-cta]"), { opacity: 1, duration: 0.6 }, "+=0.2");
          return;
        }

        const s1 = SplitText.create(q("[data-l1]")[0], { type: "words" });
        const s2 = SplitText.create(q("[data-l2]")[0], { type: "words" });
        gsap.set(q("[data-l1], [data-l2]"), { opacity: 1 });
        gsap.set([...s1.words, ...s2.words], { opacity: 0, y: 16, filter: "blur(10px)" });

        tl.to(
          s1.words,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, stagger: 0.075, ease: "power2.out" },
          0.25
        )
          .to(
            s1.words,
            { opacity: 0, y: -12, filter: "blur(8px)", duration: 0.8, stagger: 0.02, ease: "power2.in" },
            "+=2.2"
          )
          .to(
            s2.words,
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, stagger: 0.09, ease: "power2.out" },
            "-=0.2"
          )
          .fromTo(
            q("[data-cta]"),
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
            "+=0.15"
          );
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  /** Un tap pendant l'animation l'accélère jusqu'au bouton. */
  const fastForward = () => {
    const tl = introTl.current;
    if (tl && tl.progress() < 1 && !leaving.current) tl.timeScale(5);
  };

  const leave = contextSafe(() => {
    if (leaving.current) return;
    leaving.current = true;
    introTl.current?.progress(1);
    const q = gsap.utils.selector(root);
    const reduced = prefersReducedMotion();

    if (reduced) {
      onReveal();
      gsap.to(root.current, { opacity: 0, duration: 0.6, onComplete: onDone });
      return;
    }

    gsap
      .timeline({ onComplete: onDone })
      .to(q("[data-cta]"), { opacity: 0, scale: 0.94, duration: 0.45, ease: "power2.in" }, 0)
      .to(
        q("[data-l2] div"),
        { opacity: 0, y: -26, filter: "blur(8px)", duration: 0.7, stagger: 0.035, ease: "power2.in" },
        0.05
      )
      .to(q("[data-chrome], [data-glow], [data-dust]"), { opacity: 0, duration: 0.8 }, 0.1)
      .fromTo(
        q("[data-seam]"),
        { scaleX: 0, opacity: 1 },
        { scaleX: 1, duration: 1, ease: "expo.inOut" },
        0.35
      )
      .add(() => onReveal(), 1.15)
      .to(q("[data-panel=top]"), { yPercent: -100, duration: 1.4, ease: "expo.inOut" }, 1.25)
      .to(q("[data-panel=bottom]"), { yPercent: 100, duration: 1.4, ease: "expo.inOut" }, 1.25)
      .to(q("[data-seam]"), { opacity: 0, duration: 0.5 }, 1.45);
  });

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] overflow-hidden"
      onPointerDown={fastForward}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
    >
      <div data-panel="top" className="absolute inset-x-0 top-0 h-[50.5%] bg-ink" />
      <div data-panel="bottom" className="absolute inset-x-0 bottom-0 h-[50.5%] bg-ink" />

      <div
        data-glow
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 55%, rgba(92,16,32,0.55), transparent 70%), radial-gradient(30% 25% at 50% 50%, rgba(201,166,107,0.08), transparent 70%)",
        }}
      />
      <div data-dust className="absolute inset-0">
        <Dust density={5} />
      </div>

      <div
        data-seam
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      {/* Habillage : nom du projet et date */}
      <div
        data-chrome
        className="absolute inset-x-0 top-0 flex items-center justify-between px-[var(--gutter)] pt-6 text-cream/60"
        style={{ opacity: 0 }}
      >
        <span className="eyebrow">Pour {person.firstName.charAt(0) + person.firstName.slice(1).toLowerCase()}</span>
        <span className="eyebrow">{dates.birthdayShort}</span>
      </div>

      <div className="relative flex h-full flex-col items-center justify-center px-[var(--gutter)] text-center">
        <div className="grid w-full max-w-4xl place-items-center">
          <p
            data-l1
            className="font-serif text-[clamp(1.65rem,4.6vw,3.4rem)] leading-[1.18] font-light italic text-cream [grid-area:1/1]"
            style={{ opacity: 0 }}
          >
            {intro.line1}
          </p>
          <p
            data-l2
            className="font-serif text-[clamp(1.8rem,5.2vw,3.9rem)] leading-[1.15] font-light italic text-cream [grid-area:1/1]"
            style={{ opacity: 0 }}
          >
            {withName(intro.line2, person.firstName)}
          </p>
        </div>

        <button
          data-cta
          type="button"
          onClick={leave}
          className="btn-lux soft-pulse mt-12 rounded-full border border-gold/60 px-8 py-4 text-[0.8rem] font-medium tracking-[0.24em] text-gold uppercase sm:mt-14"
          style={{ opacity: 0 }}
        >
          {intro.cta}
        </button>
      </div>
    </div>
  );
}
