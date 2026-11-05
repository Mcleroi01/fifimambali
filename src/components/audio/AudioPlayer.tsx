"use client";

import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { content } from "@/data/birthday-content";

/**
 * Lecteur discret et optionnel.
 * - Jamais d'autoplay : la musique ne démarre que sur action de l'utilisateur.
 * - Masqué si aucun fichier n'est configuré, ou si le fichier est introuvable.
 */
export default function AudioPlayer({ visible }: { visible: boolean }) {
  const { src, title } = content.audio;
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);

  if (!src || broken) return null;

  const toggle = async () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
      } catch {
        setBroken(true);
      }
    } else {
      el.pause();
    }
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-[85] flex items-center gap-2 rounded-full border border-cream/15 bg-ink/70 py-1.5 pr-4 pl-1.5 text-cream shadow-lg backdrop-blur-md transition-opacity duration-700 sm:right-6 sm:bottom-6 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <audio
        ref={audio}
        src={src}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setBroken(true)}
      />
      <button
        type="button"
        onClick={toggle}
        className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-gold text-ink transition-transform active:scale-95"
        aria-label={playing ? "Mettre la musique en pause" : "Lancer la musique"}
      >
        {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} className="translate-x-px" aria-hidden="true" />}
      </button>
      <span className="hidden items-center gap-1.5 text-[0.7rem] tracking-[0.16em] text-cream/70 uppercase sm:flex">
        <Music size={12} aria-hidden="true" />
        {title}
      </span>
      <button
        type="button"
        onClick={() => setVolume((v) => (v > 0 ? 0 : 0.6))}
        className="focus-ring ml-1 text-cream/70 hover:text-gold"
        aria-label={volume > 0 ? "Couper le son" : "Rétablir le son"}
      >
        {volume > 0 ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="range-lux w-16 sm:w-20"
        aria-label="Volume"
      />
    </div>
  );
}
