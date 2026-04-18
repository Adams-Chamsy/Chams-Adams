# Roadmap — Chams Adams

> Suivi des étapes du projet et des livrables.

---

## 🎯 Vision V1

Site e-commerce complet, animations cinématiques, responsive parfait, prêt pour la production.

**Deadline cible** : à définir

---

## 📍 Étapes

### ✅ Étape 0 — Préparation (terminée)
- [x] Définition de la marque et du positionnement
- [x] Rédaction du `CLAUDE.md`
- [x] Kit de démarrage (fichiers de config, docs)
- [x] Charte éditoriale
- [x] Guide design

### ✅ Étape 1 — Fondations (terminée)
- [ ] Initialisation Next.js 14 + TypeScript + Tailwind
- [ ] Installation des dépendances (GSAP, Framer, Lenis, R3F, shadcn)
- [ ] Configuration du design system (couleurs, fonts, variables CSS)
- [ ] Arborescence des dossiers
- [ ] Premier commit Git

### ⏳ Étape 2 — Layout global
- [ ] Header (transparent → opaque au scroll)
- [ ] Footer (riche, newsletter, réseaux, mentions)
- [ ] SmoothScroll (Lenis wrapper)
- [ ] CustomCursor (desktop uniquement)
- [ ] Metadata globale (SEO, OpenGraph)

### ⏳ Étape 3 — Home (Hero + Manifeste)
- [ ] HeroCinematic (vidéo placeholder + fade vers logo)
- [ ] Section Manifeste (storytelling)
- [ ] TextReveal (animation lettre par lettre)
- [ ] ParallaxLayer (composant générique)

### ⏳ Étape 4 — Home (Collections + 360°)
- [ ] HorizontalScroll (section pinnée)
- [ ] Cards collections avec hover animations
- [ ] Product360 (rotation 3D avec R3F)
- [ ] ZoomReveal sur détails broderie

### ⏳ Étape 5 — Home (Savoir-faire + Journal + Newsletter)
- [ ] Section Savoir-faire (vidéos ateliers)
- [ ] Preview Journal
- [ ] Newsletter avec Resend
- [ ] FabricTransition entre sections

### ✅ Étape 6 — E-commerce : Collections + Boutique + Fiche produit (terminée)
- [x] Types TypeScript produit/collection (compatibles Sanity/Shopify)
- [x] Mock data : 12 pièces × 4 collections, prix 1 200–4 500 €
- [x] ProductCard (3 variantes : default, editorial, compact)
- [x] ProductGallery avec lightbox plein écran (ESC, ←/→, swipe mobile)
- [x] SizeGuide drawer (6 tailles + sur-mesure, illustration silhouette)
- [x] VariantSelector (couleurs + tailles, disabled barré)
- [x] AddToBagButton (4 états : idle / choose-size / loading / success)
- [x] ProductFilters (sidebar desktop + drawer mobile, 5 filtres)
- [x] Page /collections — bento éditorial 4 univers
- [x] Page /collections/[slug] — 4 pages SSG (hero + intro + produits)
- [x] Page /boutique — filtres + tri + infinite scroll
- [x] Page /produit/[slug] — 12 pages SSG avec JSON-LD schema.org Product
- [x] Header : liens réels /collections et /boutique
- [ ] Intégration CMS Sanity (mock data à remplacer) — prévue étape 8+
- [ ] Vidéo du kaftan porté (asset à fournir) — étape 8+

### ⏳ Étape 7 — Panier & Checkout
- [ ] Store Zustand (panier persisté via localStorage)
- [ ] Drawer panier (slide depuis droite)
- [ ] Checkout Stripe
- [ ] Emails transactionnels (Resend)

### ⏳ Étape 8 — Sur-mesure
- [ ] Page dédiée avec process en 4 étapes
- [ ] Guide de prise de mesures
- [ ] Formulaire de prise de rendez-vous
- [ ] Galerie de réalisations sur-mesure

### ⏳ Étape 9 — Pages éditoriales
- [ ] Collections (page listing)
- [ ] Lookbook (galerie asymétrique)
- [ ] Savoir-faire (long-form storytelling)
- [ ] Journal (blog magazine avec catégories)

### ⏳ Étape 10 — E-commerce
- [ ] Panier (drawer latéral)
- [ ] Checkout Stripe
- [ ] Gestion commandes
- [ ] Emails transactionnels (confirmation, expédition)

### ⏳ Étape 11 — i18n
- [ ] Setup next-intl
- [ ] Traduction FR → EN de toutes les pages
- [ ] Toggle langue dans le footer

### ⏳ Étape 12 — Optimisation
- [ ] Audit Lighthouse (objectif 90+ sur tout)
- [ ] Optimisation images (tous formats)
- [ ] Lazy loading systématique
- [ ] Précharge des fonts
- [ ] Audit accessibilité WCAG AA
- [ ] Tests responsive 375px → 2560px

### ⏳ Étape 13 — Déploiement
- [ ] Setup Vercel
- [ ] Variables d'environnement production
- [ ] Domaine custom
- [ ] SSL
- [ ] Analytics
- [ ] Monitoring erreurs (Sentry)

### 🌟 V2 — Évolutions futures
- [ ] Paiements Afrique (Wave, Orange Money, MTN)
- [ ] Essayage virtuel (AR)
- [ ] Espace client (commandes, wishlist persistante)
- [ ] Programme de fidélité
- [ ] Application mobile
- [ ] Langue Wolof

---

*Mettre à jour cette roadmap à chaque étape terminée.*
