"use client";

import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { lockScroll, scrollToTop, setLenis, unlockScroll } from "@/lib/scroll";
import Intro from "@/components/intro/Intro";
import BirthdaySection from "@/components/sections/BirthdaySection";
import AchievementSection from "@/components/sections/AchievementSection";
import GallerySection from "@/components/gallery/GallerySection";
import LetterSection from "@/components/sections/LetterSection";
import MagicSection from "@/components/sections/MagicSection";
import FinalSection from "@/components/sections/FinalSection";
import AudioPlayer from "@/components/audio/AudioPlayer";
import ScrollProgress from "@/components/ui/ScrollProgress";

export default function Experience() {
  const [showIntro, setShowIntro] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [introKey, setIntroKey] = useState(0);

  // Smooth scroll (Lenis) synchronisé avec ScrollTrigger — désactivé si mouvement réduit
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Défilement verrouillé pendant l'intro
  useEffect(() => {
    if (!showIntro) return;
    lockScroll();
    return () => unlockScroll();
  }, [showIntro]);

  const handleReveal = useCallback(() => setRevealed(true), []);
  const handleDone = useCallback(() => {
    setShowIntro(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const restart = useCallback(() => {
    setRevealed(false);
    setIntroKey((k) => k + 1);
    setShowIntro(true);
    // Laisse l'intro recouvrir l'écran avant de remonter
    requestAnimationFrame(() => scrollToTop());
  }, []);

  return (
    <>
      {showIntro && <Intro key={introKey} onReveal={handleReveal} onDone={handleDone} />}
      <ScrollProgress />

      <main aria-hidden={showIntro && !revealed} inert={showIntro && !revealed ? true : undefined}>
        <BirthdaySection play={revealed} />
        <AchievementSection />
        <GallerySection />
        <LetterSection />
        <MagicSection />
        <FinalSection onRestart={restart} />
      </main>

      <AudioPlayer visible={!showIntro} />
    </>
  );
}
