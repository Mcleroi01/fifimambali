/**
 * ============================================================
 *  POUR FIFI — Contenu éditable
 * ============================================================
 *  Tous les textes, dates et chemins de photos du site sont ici.
 *  Modifie librement les chaînes de caractères : la mise en page
 *  s'adapte automatiquement.
 *
 *  Les chemins d'images sont relatifs au dossier `public/`.
 *  Exemple : "/images/selfie-01.webp" => public/images/selfie-01.webp
 * ============================================================
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Portrait détouré sur fond clair : fondu dans le papier ivoire (mix-blend-multiply). */
  cutout?: boolean;
};

export const content = {
  meta: {
    title: "Pour Fifi — Une histoire, une réussite, un anniversaire",
    description:
      "Une expérience écrite pour FIFI MAMBALI, pour son anniversaire et la fin de ses études.",
  },

  person: {
    firstName: "FIFI",
    fullName: "FIFI MAMBALI",
  },

  dates: {
    birthdayLabel: "5 novembre 2026",
    birthdayShort: "05 · 11 · 2026",
  },

  /* ---------- 01 · Intro ---------- */
  intro: {
    line1:
      "Certaines personnes rendent le monde un peu plus beau simplement par leur présence...",
    line2: "Aujourd'hui, cette histoire est pour toi, FIFI.",
    cta: "Découvrir ta surprise",
  },

  /* ---------- 02 · Happy Birthday ---------- */
  birthday: {
    eyebrow: "05 novembre",
    titleTop: "Happy Birthday,",
    titleName: "FIFI",
    subtitle: "Une journée spéciale pour une personne qui mérite de belles choses.",
    photo: {
      src: "/images/selfie-01.webp",
      alt: "Portrait de Fifi, souriante, en tenue en pagne",
      width: 720,
      height: 1280,
    } satisfies Photo,
    /** Petit portrait détouré qui flotte à côté du titre. */
    accent: {
      src: "/images/portrait-04.webp",
      alt: "Portrait de Fifi en haut jaune, tresses cuivrées",
      width: 339,
      height: 735,
      cutout: true,
    } satisfies Photo,
  },

  /* ---------- 03 · Réussite ---------- */
  achievement: {
    eyebrow: "Une femme, un parcours, une réussite",
    title: "Et si aujourd'hui, on célébrait aussi tout le chemin parcouru ?",
    dateDay: "31",
    dateMonth: "octobre",
    dateYear: "2026",
    paragraphs: [
      "Le 31 octobre, tu as franchi une étape importante de ton histoire. Tu as défendu ton mémoire et terminé un chapitre essentiel de ton parcours académique.",
      "Je sais que derrière cette réussite se cachent des efforts, des sacrifices, des moments de doute et beaucoup de détermination.",
      "Je veux simplement te dire une chose : sois fière de toi. Tu as accompli quelque chose d'important et tu mérites de savourer cette victoire.",
      "Que cette nouvelle étape t'ouvre des portes encore plus belles.",
    ],
    timeline: [
      { label: "Les années d'études", text: "Des efforts, des sacrifices, des doutes — et beaucoup de détermination." },
      { label: "31 octobre 2026", text: "La défense du mémoire. Un chapitre essentiel se termine." },
      { label: "5 novembre 2026", text: "Ton anniversaire. Une nouvelle année commence." },
      { label: "Et maintenant", text: "De nouvelles portes, encore plus belles." },
    ],
    /** Photos du jour de la soutenance. Légendes modifiables. */
    photos: [
      {
        src: "/images/soutenance-02.webp",
        alt: "Fifi relit une feuille, concentrée",
        width: 854,
        height: 1280,
        caption: "Concentration",
      },
      {
        src: "/images/soutenance-05.webp",
        alt: "Fifi serre la main d'un membre du jury",
        width: 1280,
        height: 854,
        caption: "Le jour J",
      },
      {
        src: "/images/soutenance-04.webp",
        alt: "Fifi souriante, assise dans la salle",
        width: 1280,
        height: 854,
        caption: "Le sourire d'après",
      },
    ],
  },

  /* ---------- 04 · Galerie (les photos sont dans data/gallery.ts) ---------- */
  gallery: {
    eyebrow: "Galerie",
    title: "Une galerie qui raconte une histoire",
    intro: "Touche une photo pour l'ouvrir en grand.",
  },

  /* ---------- 05 · Lettre ---------- */
  letter: {
    eyebrow: "Quelques mots que je n'ai pas su dire",
    greeting: "FIFI,",
    paragraphs: [
      "Je sais que ces derniers jours n'ont pas été comme ils auraient dû l'être.",
      "Le 31 octobre était un moment important pour toi. Tu avais travaillé pour arriver à cette étape, et j'aurais aimé être présent pour te soutenir, partager ta joie et te féliciter comme tu le méritais.",
      "Je regrette sincèrement de ne pas avoir été là.",
      "Je ne veux pas utiliser ton anniversaire pour trouver des excuses à mon absence. Je veux simplement reconnaître que j'aurais aimé faire les choses autrement.",
      "Malgré le silence qui s'est installé entre nous, je n'ai pas oublié cette date importante ni la personne que tu es.",
      "Aujourd'hui, je veux te souhaiter un joyeux anniversaire et te féliciter pour cette belle réussite.",
      "Je te souhaite une vie remplie de paix, de réussite, de belles opportunités et de raisons de sourire.",
      "Continue de croire en toi. Ton histoire ne fait que commencer.",
      "Joyeux anniversaire, FIFI.",
    ],
    signature: "Avec affection.",
  },

  /* ---------- 06 · Moment magique ---------- */
  magic: {
    eyebrow: "Un petit moment magique",
    cta: "J'ai encore une petite surprise pour toi",
    message: "N'oublie jamais à quel point tu es capable de belles choses.",
    again: "Encore une fois",
  },

  /* ---------- 07 · Final ---------- */
  final: {
    line: "Que cette nouvelle année de ta vie soit aussi belle que les rêves que tu portes en toi.",
    title: "Happy Birthday, FIFI MAMBALI.",
    date: "5 novembre 2026",
    restart: "Revivre l'expérience",
    photo: {
      src: "/images/soutenance-03.webp",
      alt: "Portrait de Fifi, élégante, en tenue en pagne",
      width: 854,
      height: 1280,
    } satisfies Photo,
  },

  /* ---------- Musique (optionnelle) ----------
   * Dépose un fichier dans public/audio/ (ex. public/audio/musique.mp3)
   * puis indique son chemin ci-dessous : src: "/audio/musique.mp3".
   * Laisse src vide pour masquer complètement le lecteur.
   */
  audio: {
    src: "",
    title: "Notre musique",
  },
};

export type Content = typeof content;
