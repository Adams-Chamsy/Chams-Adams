# CLAUDE.md — Chams Adams

> Fichier de contexte persistant pour Claude Code.
> Lis-le intégralement au début de chaque session avant toute modification.

---

## 1. Identité du Projet

**Nom** : Chams Adams
**Type** : Site e-commerce haut de gamme
**Secteur** : Maison de couture — **kaftan subsaharien de luxe** (héritier du grand boubou ouest-africain)
**Référence visuelle** : https://www.instagram.com/chams_adams
**Positionnement** : élégance africaine contemporaine, qualité rivalisant avec Dior / Saint Laurent, ancrage culturel profond (mariages, Tabaski, Magal, Maouloud, cérémonies)

**Références créatives à garder en tête** :
- Pathé'O (Côte d'Ivoire)
- Tongoro (Sarah Diouf, Sénégal)
- Imane Ayissi (Cameroun / Paris Haute Couture)
- Esthétique éditoriale : Vogue Afrique, Nataal Magazine

**À éviter absolument** :
- Le folklorisme, les clichés "ethniques"
- Les motifs wax/bogolan/kente (ce n'est PAS l'univers de la marque)
- L'esthétique arabique / moyen-orientale (le kaftan ici est subsaharien)
- Les couleurs criardes, les mises en page chargées

---

## 2. Stack Technique (à ne pas modifier sans validation)

```
Framework      : Next.js 14 (App Router) + TypeScript
Styling        : Tailwind CSS + shadcn/ui
Animations     : GSAP + ScrollTrigger, Framer Motion, Lenis (smooth scroll)
3D             : Three.js / React Three Fiber
CMS            : Sanity.io (à confirmer avec le client)
E-commerce     : Shopify Hydrogen OU Stripe (à confirmer)
Images         : next/image (WebP/AVIF obligatoire)
i18n           : next-intl (FR par défaut, EN en V1)
Paiement       : Stripe + préparation Wave / Orange Money / MTN Mobile Money
Déploiement    : Vercel
```

---

## 3. Design System (strict)

### Couleurs
```ts
noir     : '#0A0A0A'    // fond principal
or       : '#C9A961'    // accents, CTA, broderies
ivoire   : '#F5F0E6'    // textes clairs
indigo   : '#1B2951'    // référence teintures traditionnelles
terre    : '#8B4513'    // touches rares
bronze   : '#4A3728'    // détails
```

### Typographies
- **Titres** : Cormorant Garamond (serif élégante)
- **Corps** : Inter (sans-serif raffinée)
- **Signatures/touches rares** : Italianno (cursive)

### Règles visuelles
- Mode **sombre par défaut** (met les broderies en valeur)
- Espacement **généreux** — l'espace vide est roi en luxe
- Ratios d'image **éditoriaux** : 4:5, 3:4 (jamais 1:1 sauf exception)
- CTA : bordure or fine + hover avec halo lumineux doré
- Tracking large sur boutons/nav : `tracking-widest` ou `tracking-[0.2em]`
- Transitions douces : `duration-500` à `duration-700` minimum
- Jamais de `box-shadow` criard : privilégier des ombres longues et diffuses

### Ton rédactionnel
Poétique, noble, intemporel. Le kaftan = œuvre d'art portable, héritage transmis.
**Mots-clés** : grâce, héritage, majesté, lumière, transmission, élégance, noblesse.
**À bannir** : "ethnique", "exotique", "tribal", "authentique" (cliché), emojis dans le contenu éditorial.

---

## 4. Architecture du Projet

```
chams-adams/
├── app/
│   ├── (marketing)/          # Pages éditoriales
│   │   ├── page.tsx
│   │   ├── collections/
│   │   ├── savoir-faire/
│   │   ├── lookbook/
│   │   ├── journal/
│   │   └── sur-mesure/
│   ├── (shop)/               # Pages e-commerce
│   │   ├── boutique/
│   │   ├── produit/[slug]/
│   │   ├── panier/
│   │   └── checkout/
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/                   # shadcn
│   ├── animations/           # GSAP/Framer réutilisables
│   ├── sections/             # Hero, Manifeste, Collections…
│   ├── product/
│   └── layout/               # Header, Footer, Nav
├── lib/
│   ├── animations/           # hooks GSAP custom
│   ├── shopify/ (ou stripe/)
│   └── utils/
├── styles/
├── public/
└── content/ (ou sanity/)
```

**Règle** : toute nouvelle section réutilisable doit aller dans `components/sections/`, toute animation réutilisable dans `components/animations/`.

---

## 5. Composants d'Animation Clés (à construire en priorité)

| Composant | Rôle |
|-----------|------|
| `<SmoothScroll>` | Wrapper Lenis global |
| `<HeroCinematic>` | Vidéo kaftan en mouvement + fade vers logo |
| `<HorizontalScroll>` | Section pinnée, défilement horizontal au scroll vertical |
| `<ZoomReveal>` | Plongée caméra sur détails broderie (scale 1 → 3) |
| `<Product360>` | Rotation 3D du kaftan au scroll (R3F) |
| `<TextReveal>` | Titres lettre par lettre (SplitText GSAP) |
| `<ParallaxLayer>` | Parallax multi-couches, prop `speed` |
| `<CustomCursor>` | Curseur doré (desktop uniquement) |
| `<FabricTransition>` | Transition SVG ondulante entre sections |

**Règle d'accessibilité** : chaque composant doit respecter `prefers-reduced-motion` et dégrader proprement sur mobile bas de gamme.

---

## 6. Pages à Construire (ordre de priorité)

1. Layout global (Header + Footer)
2. Home (Hero + Manifeste + Collections + 360° + Savoir-faire + Journal + Newsletter)
3. Collections (univers : Cérémonies, Tabaski/Magal, Prêt-à-porter, Sur-mesure)
4. Boutique (grille + filtres)
5. Fiche produit (galerie zoom, vidéo porté, tailles, panier)
6. Sur-mesure (process + RDV)
7. Savoir-faire (ateliers, vidéos artisans)
8. Lookbook (galerie asymétrique éditoriale)
9. Journal (blog magazine)
10. Panier & Checkout

---

## 7. Exigences Non-Négociables

- **Responsive** : 375px → 2560px+ parfaitement fluide
- **Lighthouse ≥ 90** sur Performance / Accessibilité / Best Practices / SEO
- **WCAG AA** : contrastes, navigation clavier, ARIA, focus visible
- **SEO** : metadata dynamiques, schema.org Product, sitemap, OpenGraph
- **Images** : 100 % `next/image` en WebP/AVIF, lazy loading par défaut
- **i18n** : FR (défaut) + EN
- **`prefers-reduced-motion`** respecté sur toutes les animations

---

## 8. Méthode de Travail

### À chaque tâche :
1. Lire ce fichier intégralement si nouvelle session
2. Vérifier l'existant avant de créer (éviter les doublons)
3. Proposer un plan avant de coder les gros chantiers
4. Valider avec l'utilisateur aux étapes clés
5. Commits Git fréquents avec convention :
   - `feat:` nouvelle fonctionnalité
   - `style:` mise en forme / CSS
   - `refactor:` refonte sans changement fonctionnel
   - `fix:` correction
   - `perf:` optimisation
   - `a11y:` accessibilité
   - `docs:` documentation

### Checkpoints obligatoires :
- Après l'init du projet
- Après le design system
- Après la Hero section
- Après chaque page majeure
- Avant tout passage en production

### Interdictions :
- Ne jamais push sur `main` directement (toujours via PR ou avec validation)
- Ne jamais commit de clés API ou secrets (.env.local uniquement)
- Ne jamais supprimer de fichiers sans confirmation explicite
- Ne jamais installer de dépendances lourdes sans justification

---

## 9. Assets & Contenus

**À fournir par le client** :
- Logo vectoriel (SVG) — haute résolution
- Photos produits (haute déf, fond neutre + portées)
- Vidéos ateliers / défilé / kaftans en mouvement
- Textes éditoriaux (manifeste, histoire, bios artisans)
- Modèles 3D des kaftans (GLB) — optionnel, mockups dans un premier temps
- Liste des tailles et guide de mesures
- Catalogue produits (fiches, prix, matières, origines)

**En attendant** : utiliser des placeholders propres (unsplash avec licence OK, couleurs solides noires/or, vidéos libres de droits).

---

## 10. Contacts & Environnement

- **Repo Git** : à créer
- **Environnement de dev** : local
- **Staging** : Vercel preview
- **Production** : Vercel (domaine à définir)
- **Variables d'environnement** : documentées dans `.env.example`

---

## 11. Historique des Décisions Majeures

> Mettre à jour cette section à chaque choix structurant pour garder la trace.

| Date | Décision | Justification |
|------|----------|---------------|
| — | Stack Next.js 14 + GSAP + R3F | Performance + animations premium |
| — | Mode sombre par défaut | Met les broderies en valeur |
| — | Kaftan subsaharien (pas wax, pas arabique) | Identité précise de la marque |

---

## 12. Rappels Finaux

- **Chaque pixel compte** : on vise le niveau Dior / Apple
- **L'âme africaine doit se sentir sans folklorisme** : à travers la lumière, la noblesse des cadrages, le vocabulaire, la majesté
- **La performance n'est pas négociable** : un site lent tue le luxe
- **Le sur-mesure est culturellement central** dans le kaftan — le mettre en valeur comme un service signature, pas comme une option

---

*Ce fichier est vivant. Le mettre à jour au fil du projet.*
