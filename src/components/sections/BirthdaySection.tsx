"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { content } from "@/data/birthday-content";
import { fontsReady, gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import Petals from "@/components/animations/Petals";
import ChapterMark from "@/components/ui/ChapterMark";

type Props = { play: boolean };

export default function BirthdaySection({ play }: Props) {
  const root = useRef<HTMLElement>(null);
  const entrance = useRef<gsap.core.Timeline | null>(null);
  const pending = useRef(false);
  const { birthday, person, dates } = content;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      let cancelled = false;

      // État initial caché (l'intro recouvre la section à ce moment-là)
      gsap.set(q("[data-arch]"), { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" });
      gsap.set(q("[data-arch-img]"), { scale: 1.35 });
      gsap.set(q("[data-fade]"), { opacity: 0, y: 24 });
      gsap.set(q("[data-title]"), { opacity: 0 });

      fontsReady().then(() => {
        if (cancelled) return;
        const top = SplitText.create(q("[data-title=top]")[0], { type: "lines", mask: "lines", linesClass: "split-line" });
        const name = SplitText.create(q("[data-title=name]")[0], { type: "chars", mask: "chars" });
        gsap.set(q("[data-title]"), { opacity: 1 });
        gsap.set(top.lines, { yPercent: 110 });
        gsap.set(name.chars, { yPercent: 115, rotate: 6 });

        entrance.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .to(q("[data-arch]"), { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", duration: 1.8, ease: "expo.inOut" }, 0)
          .to(q("[data-arch-img]"), { scale: 1, duration: 2.4, ease: "power3.out" }, 0.1)
          .to(top.lines, { yPercent: 0, duration: 1.4, stagger: 0.1 }, 0.5)
          .to(name.chars, { yPercent: 0, rotate: 0, duration: 1.6, stagger: 0.07 }, 0.7)
          .to(q("[data-fade]"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.12, ease: "power3.out" }, 1.1);

        if (pending.current) entrance.current.play();
      });

      // Parallaxe photographique subtile
      gsap.to(q("[data-arch-img-wrap]"), {
        yPercent: 10,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-float]"), {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q("[data-title-wrap]"), {
        yPercent: -12,
        opacity: 0.4,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root }
  );

  useEffect(() => {
    if (!play) return;
    if (entrance.current) entrance.current.restart();
    else pending.current = true;
  }, [play]);

  return (
    <section
      ref={root}
      id="anniversaire"
      aria-label="Happy Birthday"
      className="paper relative isolate min-h-[100svh] overflow-hidden text-cocoa"
    >
      <Petals ambient={14} className="z-[1]" />

      <div className="relative z-[2] mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-[var(--gutter)] pt-24 pb-16 md:grid-cols-12 md:gap-6 md:pt-28">
        {/* Titre */}
        <div data-title-wrap className="relative md:col-span-7">
          <ChapterMark index="01" label={birthday.eyebrow} tone="light" className="mb-8" />
          <h1 className="font-serif leading-[0.9] font-light text-bordeaux">
            <span data-title="top" className="block text-[clamp(2.7rem,8vw,6.6rem)] tracking-tight">
              {birthday.titleTop}
            </span>
            <span
              data-title="name"
              className="-mt-1 block text-[clamp(5.5rem,20vw,15rem)] leading-[0.85] font-normal italic text-romance"
            >
              {birthday.titleName}
            </span>
          </h1>
          <p data-fade className="mt-8 max-w-md text-[1.05rem] leading-relaxed text-cocoa/80 md:text-lg">
            {birthday.subtitle}
          </p>
          <div data-fade className="mt-10 flex items-center gap-4 text-bordeaux/70">
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
            <span className="eyebrow">{person.fullName}</span>
          </div>
        </div>

        {/* Photo en arche */}
        <div className="relative mx-auto w-[min(78vw,26rem)] md:col-span-5 md:w-full md:max-w-[27rem]">
          <div
            aria-hidden="true"
            className="absolute -inset-3 translate-x-4 translate-y-4 rounded-t-full border border-champagne/60 md:-inset-4"
          />
          <div data-arch className="relative aspect-[3/4.4] overflow-hidden rounded-t-full bg-blush">
            <div data-arch-img-wrap className="absolute inset-[-8%_0]">
              <div data-arch-img className="relative h-full w-full">
                <Image
                  src={birthday.photo.src}
                  alt={birthday.photo.alt}
                  fill
                  priority
                  sizes="(max-width: 768px) 78vw, 430px"
                  className="object-cover object-[50%_30%]"
                />
              </div>
            </div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bordeaux/25 via-transparent to-transparent" />
          </div>

          {/* Médaillon texte rotatif */}
          <div
            data-fade
            aria-hidden="true"
            className="absolute -bottom-10 -left-8 h-28 w-28 sm:h-32 sm:w-32 md:-left-14"
          >
            <svg viewBox="0 0 120 120" className="spin-slow h-full w-full text-bordeaux">
              <defs>
                <path id="circle-path" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <circle cx="60" cy="60" r="58" fill="#f7f0e4" />
              <text fontSize="9.4" letterSpacing="3.1" fill="currentColor" fontFamily="var(--font-manrope)">
                <textPath href="#circle-path">HAPPY BIRTHDAY · {dates.birthdayShort} ·</textPath>
              </text>
              <text x="60" y="69" textAnchor="middle" fontSize="26" fill="#a3142c" fontStyle="italic" fontFamily="var(--font-cormorant)">
                F
              </text>
            </svg>
          </div>

          {/* Portrait détouré flottant */}
          {birthday.accent && (
            <div
              data-float
              className="paper absolute -right-4 -bottom-16 hidden w-28 isolate overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(42,10,18,0.5)] sm:block md:-right-10 md:w-32"
            >
              <div data-fade className="cutout relative aspect-[339/600]">
                <Image
                  src={birthday.accent.src}
                  alt={birthday.accent.alt}
                  fill
                  sizes="130px"
                  className="object-cover object-top"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        data-fade
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 flex-col items-center gap-2 text-bordeaux/60 md:flex"
      >
        <span className="eyebrow text-[0.62rem]">Défiler</span>
        <span className="h-10 w-px bg-gradient-to-b from-bordeaux/50 to-transparent" />
      </div>
    </section>
  );
}
