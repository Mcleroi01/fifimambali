"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// SplitText, ScrollTrigger et tous les plugins GSAP sont gratuits (licence GSAP standard) depuis la v3.13.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  gsap.defaults({ ease: "power3.out" });
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isSmallScreen = () =>
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

/** Attend le chargement des polices avant de découper du texte (évite des lignes mal calculées). */
export const fontsReady = (): Promise<unknown> =>
  typeof document !== "undefined" && "fonts" in document
    ? document.fonts.ready
    : Promise.resolve();

export { gsap, ScrollTrigger, SplitText, useGSAP };
