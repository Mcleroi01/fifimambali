"use client";

import Image from "next/image";
import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { content } from "@/data/birthday-content";
import { fontsReady, gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import ChapterMark from "@/components/ui/ChapterMark";

type Props = { onRestart: () => void };

export default function FinalSection({ onRestart }: Props) {
  const root = useRef<HTMLElement>(null);
  const { final, person } = content;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      let cancelled = false;

      // Lent zoom cinématographique sur la photo
      gsap.fromTo(
        q("[data-bg]"),
        { scale: 1.25, yPercent: -6 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
        }
      );

      fontsReady().then(() => {
        if (cancelled) return;
        const title = SplitText.create(q("[data-final-title]")[0], {
          type: "lines,chars",
          mask: "lines",
          linesClass: "split-line",
        });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: q("[data-final-content]")[0], start: "top 75%", once: true },
        });
        tl.from(q("[data-final-line]"), { opacity: 0, y: 30, filter: "blur(8px)", duration: 1.4, ease: "power3.out" })
          .from(title.chars, { yPercent: 110, duration: 1.3, stagger: 0.025, ease: "expo.out" }, "-=0.6")
          .from(q("[data-final-rest] > *"), { opacity: 0, y: 16, duration: 1, stagger: 0.15 }, "-=0.6");
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
      id="final"
      aria-labelledby="final-title"
      className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-cream md:items-center"
    >
      <div className="absolute inset-0 -z-10 overflow-hidden md:left-[40%]">
        <div data-bg className="absolute inset-0">
          <Image
            src={final.photo.src}
            alt={final.photo.alt}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-[50%_18%]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-bordeaux/30 mix-blend-multiply" />
        {/* Mobile : fondu vertical — Desktop : fondu latéral vers le texte */}
        <div
          aria-hidden="true"
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,5,7,0.35) 0%, rgba(13,5,7,0.05) 22%, rgba(13,5,7,0.6) 45%, rgba(13,5,7,0.96) 68%, #0d0507 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #0d0507 0%, rgba(13,5,7,0.75) 18%, rgba(13,5,7,0.1) 55%, rgba(13,5,7,0.25) 100%), linear-gradient(0deg, rgba(13,5,7,0.8) 0%, transparent 30%), linear-gradient(180deg, #0d0507 0%, transparent 22%)",
          }}
        />
      </div>

      <div
        data-final-content
        className="mx-auto w-full max-w-7xl px-[var(--gutter)] pt-[48svh] pb-[max(3rem,env(safe-area-inset-bottom))] text-center md:py-28 md:text-left"
      >
        <div className="md:max-w-[52%]">
        <ChapterMark index="06" label="Pour toujours" className="mb-8 justify-center md:justify-start" />
        <p
          data-final-line
          className="mx-auto max-w-[26ch] font-serif text-[clamp(1.45rem,3vw,2.3rem)] leading-[1.3] font-light italic text-cream/95 md:mx-0"
        >
          {final.line}
        </p>

        <h2
          id="final-title"
          data-final-title
          className="mx-auto mt-10 font-serif text-[clamp(2.4rem,6.2vw,5.6rem)] leading-[0.95] font-light text-gold md:mx-0"
        >
          {final.title.includes(", ") ? (
            <>
              {final.title.slice(0, final.title.indexOf(", ") + 1)}
              <br />
              {final.title.slice(final.title.indexOf(", ") + 2)}
            </>
          ) : (
            final.title
          )}
        </h2>

        <div data-final-rest className="mt-10 flex flex-col items-center gap-10 md:items-start">
          <p className="eyebrow text-cream/70">
            <time dateTime="2026-11-05">{final.date}</time>
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="btn-lux inline-flex items-center gap-3 rounded-full border border-cream/40 px-7 py-4 text-[0.75rem] font-medium tracking-[0.24em] text-cream uppercase"
          >
            <RotateCcw size={15} aria-hidden="true" />
            {final.restart}
          </button>
          <p className="mt-6 text-[0.7rem] tracking-[0.2em] text-cream/45 uppercase">
            Pour {person.fullName} — Une histoire, une réussite, un anniversaire
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
