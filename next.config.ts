import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Génération 100 % statique (dossier `out/`), compatible Vercel et tout hébergeur statique.
  output: "export",
  images: {
    // L'optimiseur d'images nécessite un serveur : les photos sont déjà
    // pré-optimisées en WebP dans public/images.
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
