/**
 * ============================================================
 *  GALERIE — photos et légendes éditables
 * ============================================================
 *  - `src`      : chemin dans public/ (ex. "/images/ma-photo.jpg")
 *  - `width` / `height` : dimensions réelles (ou au moins le bon ratio)
 *  - `caption`  : courte légende (laisser "" pour aucune)
 *  - `cutout`   : true si la photo est un portrait détouré sur fond clair
 *  - `size`     : "tall" | "wide" | "small" | "feature" — place dans la grille
 *  - `type`     : "video" pour une vidéo (fichier dans public/videos/),
 *                 `poster` = image affichée avant lecture
 *
 *  L'ordre du tableau = l'ordre d'affichage.
 * ============================================================
 */

export type GallerySize = "feature" | "tall" | "wide" | "small";

export type GalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  size: GallerySize;
  cutout?: boolean;
  type?: "image" | "video";
  poster?: string;
};

export const gallery: GalleryItem[] = [
  {
    src: "/images/collage.webp",
    alt: "Collage artistique « Fifi Mambali » entouré de roses",
    width: 1131,
    height: 1600,
    caption: "Fifi Mambali, en collage",
    size: "feature",
  },
  {
    src: "/images/portrait-01.webp",
    alt: "Portrait de Fifi en haut rouge, cheveux longs",
    width: 339,
    height: 735,
    caption: "Douceur",
    size: "tall",
    cutout: true,
  },
  {
    src: "/images/portrait-02.webp",
    alt: "Fifi debout en robe fleurie",
    width: 375,
    height: 666,
    caption: "Élégance",
    size: "small",
    cutout: true,
  },
  {
    src: "/images/selfie-02.webp",
    alt: "Selfie de Fifi, la main près du visage",
    width: 720,
    height: 1280,
    caption: "Un éclat de rire",
    size: "tall",
  },
  {
    src: "/images/soutenance-01.webp",
    alt: "Fifi entourée, un document à la main",
    width: 1280,
    height: 854,
    caption: "Entourée",
    size: "wide",
  },
  {
    src: "/images/portrait-03.webp",
    alt: "Fifi assise, haut rose et pantalon vert",
    width: 375,
    height: 666,
    caption: "Assurance",
    size: "small",
    cutout: true,
  },
  {
    src: "/images/portrait-06.webp",
    alt: "Fifi en selfie miroir, haut corail",
    width: 624,
    height: 1110,
    caption: "Sourire",
    size: "small",
    cutout: true,
  },
  {
    src: "/images/portrait-05.webp",
    alt: "Portrait de Fifi, tresses cuivrées",
    width: 339,
    height: 735,
    caption: "Éclat",
    size: "tall",
    cutout: true,
  },

  /* Exemple pour ajouter une vidéo :
  {
    type: "video",
    src: "/videos/mon-clip.mp4",
    poster: "/images/selfie-01.webp",
    alt: "Description de la vidéo",
    width: 720,
    height: 1280,
    caption: "Un moment",
    size: "tall",
  },
  */
];
