# POUR FIFI — Une histoire, une réussite, un anniversaire

Une expérience web cinématographique, 100 % statique, écrite pour **FIFI MAMBALI** :
son anniversaire (5 novembre 2026) et la fin de ses études (soutenance du 31 octobre 2026).

**Stack** : Next.js 15 (App Router, export statique) · TypeScript · Tailwind CSS 4 · GSAP
(ScrollTrigger + SplitText) · Lenis · lucide-react. Pas de backend, pas de base de données, pas de variable secrète.

---

## 1. Installation

Prérequis : Node.js 18.18 ou plus récent (testé avec Node 24).

```bash
npm install
```

## 2. Lancement local

```bash
npm run dev
```

Puis ouvrir http://localhost:3000.

## 3. Emplacement des photos

| Dossier | Contenu |
| --- | --- |
| `public/images/` | Photos utilisées par le site (copies WebP optimisées) |
| `public/videos/` | Vidéos optionnelles (vide pour l'instant) |
| `public/audio/` | Musique optionnelle (vide pour l'instant) |
| racine du projet | **Photos et vidéos originales WhatsApp, laissées intactes** |

Correspondance entre les originaux et les copies :

| Fichier du site | Original |
| --- | --- |
| `portrait-01` … `portrait-05` | `WhatsApp Image … 14.50.18(1)` … `(5)` |
| `portrait-06` … `portrait-08` | `… 14.50.19(1)` … `(3)` |
| `portrait-09` | `… 14.50.19` |
| `collage` | `… 14.50.18` |
| `selfie-01`, `selfie-02` | `… 15.01.19 (1)`, `… 15.01.19` |
| `soutenance-01` | `… 15.01.19 (2)` |
| `soutenance-02` … `04` | `… 15.01.20 (1)` … `(3)` |
| `soutenance-05` | `… 15.01.20` |

Pour **ajouter une photo** : dépose-la dans `public/images/` (JPG, PNG ou WebP), puis ajoute une
entrée dans `src/data/gallery.ts`, avec `src`, `alt`, `width`, `height`, `caption` et `size`.
Pour un portrait détouré sur fond blanc ou gris clair, ajoute `cutout: true` : le fond se fondra dans le papier ivoire.

Les 4 vidéos WhatsApp à la racine sont des démos TikTok d'autres sites. Elles ont servi de référence
de mouvement et ne sont pas intégrées au site.

## 4. Modifier les textes

Tout se trouve dans **`src/data/birthday-content.ts`** :

- `intro` : phrases d'ouverture et bouton
- `birthday` : titre, sous-titre et photo principale
- `achievement` : texte sur la réussite, date, étapes de la timeline, photos et légendes
- `letter` : la lettre, un paragraphe par ligne du tableau
- `magic` : bouton et message du moment magique
- `final` : phrase finale, titre, date et photo de fond
- `audio` : musique (voir ci-dessous)

Les légendes de la galerie sont dans **`src/data/gallery.ts`**.

### Ajouter une musique

1. Dépose un fichier dans `public/audio/`, par exemple `public/audio/musique.mp3`.
2. Dans `birthday-content.ts`, indique `audio: { src: "/audio/musique.mp3", title: "Notre musique" }`.

Le lecteur (lecture/pause et volume) apparaît alors en bas à droite. Il n'y a **jamais d'autoplay**.
Tant que `src` est vide, le lecteur reste invisible.

## 5. Ajouter des vidéos

1. Dépose le fichier dans `public/videos/` (MP4 H.264 recommandé, idéalement moins de 10 Mo).
2. Dans `src/data/gallery.ts`, décommente l'exemple `type: "video"` et adapte `src` et `poster`.

Les vidéos ne se chargent qu'à l'ouverture dans la visionneuse (`preload="none"`).

## 6. Build de production

```bash
npm run build
```

Le site statique est généré dans `out/`. Pour le prévisualiser localement :

```bash
npx serve out
```

Autres commandes : `npm run lint` et `npm run typecheck`.

## 7. Déploiement sur Vercel

**Option A, via GitHub** : pousse le projet sur un dépôt, puis sur vercel.com, choisis
*Add New → Project* et importe le dépôt. Vercel détecte Next.js automatiquement, aucun réglage
n'est nécessaire, puis clique sur *Deploy*.

**Option B, en ligne de commande** :

```bash
npx vercel
```

Puis, pour la version de production :

```bash
npx vercel --prod
```

Le fichier `.vercelignore` exclut les originaux WhatsApp, qui ne sont pas nécessaires au site.
Le site est marqué `noindex` : il ne sera pas référencé par les moteurs de recherche, seul le lien y donne accès.

---

## Notes techniques

- `prefers-reduced-motion` est respecté : sans parallaxe, découpage de texte ni smooth scroll, avec des fondus simples.
- Toutes les animations GSAP passent par `useGSAP` (nettoyage automatique des timelines et des ScrollTriggers au démontage).
- Les canvas (poussière dorée, pétales) se mettent en pause hors écran, plafonnent le DPR et réduisent leur densité sur mobile.
- Accessibilité : visionneuse au clavier (← → Échap) et au swipe, focus visible, textes alternatifs, `lang="fr"`.
