"use client";

import type Lenis from "lenis";

/**
 * Petit registre global pour le smooth scroll (Lenis).
 * Permet de verrouiller le défilement (intro, lightbox) depuis n'importe quel composant.
 */
let lenis: Lenis | null = null;
let locks = 0;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

export function lockScroll() {
  locks += 1;
  lenis?.stop();
  document.documentElement.classList.add("is-locked");
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.documentElement.classList.remove("is-locked");
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
}
