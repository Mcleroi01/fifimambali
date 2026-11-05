"use client";

import Image from "next/image";
import { useRef } from "react";
import { content } from "@/data/birthday-content";
import { fontsReady, gsap, prefersReducedMotion, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import ChapterMark from "@/components/ui/ChapterMark";
import Dust from "@/components/animations/Dust";

export default function AchievementSection() {
  const root = useRef<HTMLElement>(null);
  const { achievement } = content;
  const [mainPhoto, ...sidePhotos] = achievement.photos;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      let cancelled = false;

      fontsReady().then(() => {
        if (cancelled) return;
        SplitText.create(q("[data-split-title]")[0], {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.3,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: { trigger: self.elements[0], start: "top 82%", once: true },
            }),
        });
        ScrollTrigger.refresh();
      });

      // Date monumentale
      gsap.from(q("[data-date] > *"), {
        yPercent: 40,
        opacity: 0,
        duration: 1.4,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-date]")[0], start: "top 80%", once: true },
      });

      // Paragraphes
      q("[data-para]").forEach((el) =>
        gsap.from(el, {
          opacity: 0,
          y: 28,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        })
      );

      // Photos : révélation par masque + parallaxe
      q("[data-photo]").forEach((el, i) => {
        const img = el.querySelector("[data-photo-img]");
        gsap.fromTo(
          el,
          { clipPath: i % 2 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
        gsap.fromTo(
          img,
          { yPercent: -6, scale: 1.18 },
          {
            yPercent: 6,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Timeline : ligne qui se dessine + points qui s'allument
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop;
        const fill = q("[data-tl-fill]")[0];
        const steps = q("[data-tl-step]");
        gsap.set(fill, desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-timeline]")[0],
            start: desktop ? "top 75%" : "top 70%",
            end: desktop ? "bottom 55%" : "bottom 60%",
            scrub: 0.6,
          },
        });
        tl.to(fill, { [desktop ? "scaleX" : "scaleY"]: 1, ease: "none", duration: steps.length }, 0);
        steps.forEach((step, i) => {
          tl.fromTo(
            step,
            { opacity: 0.25 },
            { opacity: 1, duration: 0.4, ease: "none" },
            i * 0.95
          ).fromTo(
            step.querySelector("[data-tl-dot]"),
            { scale: 0.5, backgroundColor: "rgba(220,192,140,0)" },
            { scale: 1, backgroundColor: "rgba(220,192,140,1)", duration: 0.3, ease: "none" },
            i * 0.95
          );
        });
      });

      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="reussite"
      aria-labelledby="reussite-title"
      className="relative isolate overflow-hidden bg-night py-28 text-cream md:py-40"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 85% 10%, rgba(92,16,32,0.55), transparent 70%), radial-gradient(60% 40% at 0% 80%, rgba(92,16,32,0.35), transparent 70%)",
        }}
      />
      <Dust density={1.6} className="-z-10 opacity-70" />

      <div className="mx-auto max-w-7xl px-[var(--gutter)]">
        <ChapterMark index="02" label={achievement.eyebrow} className="mb-10 md:mb-14" />

        <h2
          id="reussite-title"
          data-split-title
          className="max-w-[18ch] font-serif text-[clamp(2.3rem,6vw,5.2rem)] leading-[1.02] font-light text-ivory"
        >
          {achievement.title}
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-16 md:mt-24 md:grid-cols-12 md:gap-10">
          {/* Date + texte */}
          <div className="md:col-span-5">
            <div data-date className="flex items-end gap-4 overflow-hidden pb-2 md:gap-5" aria-label={`${achievement.dateDay} ${achievement.dateMonth} ${achievement.dateYear}`}>
              <span className="text-outline font-serif text-[clamp(6.5rem,16vw,11rem)] leading-[0.8] font-light">
                {achievement.dateDay}
              </span>
              <span className="mb-2 flex flex-col">
                <span className="font-serif text-[clamp(1.8rem,4vw,2.8rem)] leading-none italic text-gold">
                  {achievement.dateMonth}
                </span>
                <span className="eyebrow mt-3 text-cream/60">{achievement.dateYear}</span>
              </span>
            </div>

            <div className="mt-12 space-y-6 text-[1.05rem] leading-[1.8] text-cream/85 md:text-[1.1rem]">
              {achievement.paragraphs.map((p, i) => (
                <p
                  key={i}
                  data-para
                  className={
                    i === 2
                      ? "border-l border-gold/50 pl-5 font-serif text-[1.45rem] leading-snug italic text-ivory md:text-[1.6rem]"
                      : ""
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Photos du jour J */}
          <div className="relative md:col-span-6 md:col-start-7">
            {mainPhoto && (
              <figure className="relative">
                <div data-photo className="relative aspect-[4/5] overflow-hidden bg-wine md:ml-12">
                  <div data-photo-img className="absolute inset-0">
                    <Image
                      src={mainPhoto.src}
                      alt={mainPhoto.alt}
                      fill
                      sizes="(max-width: 768px) 92vw, 520px"
                      className="object-cover object-[50%_25%]"
                    />
                  </div>
                </div>
                <figcaption className="mt-3 flex items-center gap-3 text-cream/60 md:ml-12">
                  <span className="font-serif italic">01</span>
                  <span className="eyebrow">{mainPhoto.caption}</span>
                </figcaption>
              </figure>
            )}

            <div className="mt-10 grid grid-cols-2 gap-4 md:-mt-24 md:mr-24 md:gap-5">
              {sidePhotos.map((photo, i) => (
                <figure key={photo.src} className={i === 1 ? "mt-12" : ""}>
                  <div data-photo className="relative aspect-[4/3] overflow-hidden bg-wine shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
                    <div data-photo-img className="absolute inset-0">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 768px) 46vw, 260px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 flex items-center gap-3 text-cream/60">
                    <span className="font-serif italic">0{i + 2}</span>
                    <span className="eyebrow text-[0.62rem]">{photo.caption}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-28 md:mt-40">
          <p className="eyebrow mb-12 text-gold/80">Le chemin</p>
          <div data-timeline className="relative">
            <div
              aria-hidden="true"
              className="absolute top-[0.45rem] bottom-0 left-[0.45rem] w-px bg-cream/15 md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
            >
              <div data-tl-fill className="h-full w-full origin-top bg-gold md:origin-left" />
            </div>
            <ol className="relative grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
              {achievement.timeline.map((step) => (
                <li key={step.label} data-tl-step className="relative pl-10 md:pt-10 md:pl-0">
                  <span
                    data-tl-dot
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-[0.95rem] w-[0.95rem] rounded-full border border-gold bg-gold"
                  />
                  <h3 className="font-serif text-2xl leading-none text-ivory italic md:text-[1.7rem]">{step.label}</h3>
                  <p className="mt-3 max-w-xs text-[0.98rem] leading-relaxed text-cream/70">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
