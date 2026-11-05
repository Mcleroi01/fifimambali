"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Play } from "lucide-react";
import { content } from "@/data/birthday-content";
import { gallery, type GalleryItem, type GallerySize } from "@/data/gallery";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import ChapterMark from "@/components/ui/ChapterMark";
import Lightbox from "./Lightbox";

/** Grille éditoriale asymétrique : chaque taille a sa place et son décalage. */
const LAYOUT: Record<GallerySize, { cell: string; aspect: string; speed: number }> = {
  feature: { cell: "col-span-2 md:col-span-6 md:row-span-2", aspect: "aspect-[1131/1600]", speed: 6 },
  tall: { cell: "col-span-1 md:col-span-3", aspect: "aspect-[3/5]", speed: 12 },
  small: { cell: "col-span-1 md:col-span-3 md:mt-24", aspect: "aspect-[4/5]", speed: 18 },
  wide: { cell: "col-span-2 md:col-span-6", aspect: "aspect-[3/2]", speed: 8 },
};

function Media({ item, sizes }: { item: GalleryItem; sizes: string }) {
  if (item.type === "video") {
    return (
      <>
        {item.poster ? (
          <Image src={item.poster} alt={item.alt} fill sizes={sizes} className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-wine" />
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-ink/50 text-ivory backdrop-blur">
            <Play size={20} aria-hidden="true" />
          </span>
        </span>
      </>
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      fill
      sizes={sizes}
      className={item.cutout ? "object-contain object-bottom" : "object-cover"}
    />
  );
}

export default function GallerySection() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { gallery: g } = content;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);

      gsap.from(q("[data-g-head] > *"), {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: q("[data-g-head]")[0], start: "top 80%", once: true },
      });

      q("[data-g-item]").forEach((el) => {
        const frame = el.querySelector("[data-g-frame]");
        const inner = el.querySelector("[data-g-inner]");
        const speed = Number((el as HTMLElement).dataset.speed || 10);

        gsap.fromTo(
          frame,
          { clipPath: "inset(18% 12% 18% 12%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          }
        );
        gsap.fromTo(
          inner,
          { yPercent: -speed / 2, scale: 1.12 },
          {
            yPercent: speed / 2,
            scale: 1.12,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    },
    { scope: root }
  );

  const close = useCallback(() => setOpen(null), []);

  return (
    <section
      ref={root}
      id="galerie"
      aria-labelledby="galerie-title"
      className="paper relative isolate overflow-hidden py-28 text-cocoa md:py-40"
    >
      <div className="mx-auto max-w-7xl px-[var(--gutter)]">
        <div data-g-head className="mb-16 grid grid-cols-1 items-end gap-6 md:mb-24 md:grid-cols-12">
          <ChapterMark index="03" label={g.eyebrow} tone="light" className="md:col-span-12" />
          <h2
            id="galerie-title"
            className="font-serif text-[clamp(2.4rem,6.4vw,5.6rem)] leading-[0.98] font-light text-bordeaux md:col-span-8"
          >
            {g.title}
          </h2>
          <p className="max-w-xs text-[0.95rem] text-cocoa/65 md:col-span-4 md:justify-self-end">{g.intro}</p>
        </div>

        <ul className="grid grid-flow-dense grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-6 md:gap-y-16">
          {gallery.map((item, i) => {
            const layout = LAYOUT[item.size];
            return (
              <li key={item.src + i} data-g-item data-speed={layout.speed} className={layout.cell}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="focus-ring group block w-full text-left"
                  aria-label={`Ouvrir la photo : ${item.caption || item.alt}`}
                >
                  <div
                    data-g-frame
                    className={`relative isolate overflow-hidden ${layout.aspect} ${
                      item.cutout ? "bg-[#efe5d6]" : "bg-blush"
                    }`}
                  >
                    <div
                      data-g-inner
                      className={`absolute inset-0 ${item.cutout ? "cutout" : ""} transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]`}
                    >
                      <Media
                        item={item}
                        sizes={item.size === "feature" || item.size === "wide" ? "(max-width: 768px) 92vw, 600px" : "(max-width: 768px) 46vw, 300px"}
                      />
                    </div>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-3 border border-ivory/0 transition-colors duration-700 group-hover:border-ivory/60"
                    />
                  </div>
                  {item.caption && (
                    <span className="mt-3 flex items-baseline gap-3 text-cocoa/70">
                      <span className="font-serif text-sm italic text-romance">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-serif text-[1.15rem] italic">{item.caption}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {open !== null && <Lightbox items={gallery} index={open} onIndexChange={setOpen} onClose={close} />}
    </section>
  );
}
