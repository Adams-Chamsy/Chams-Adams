# Chams Adams

> Maison de couture — Kaftan subsaharien de luxe

Site e-commerce haut de gamme pour la marque **Chams Adams**, spécialisée dans le kaftan subsaharien de luxe, héritier du grand boubou ouest-africain.

---

## ✨ Vision

Un site qui rivalise avec les références du luxe (Dior, Saint Laurent) tout en portant fièrement l'élégance africaine contemporaine. Animations scroll-driven dignes d'apple.com, identité visuelle raffinée, expérience utilisateur immersive.

**Instagram** : [@chams_adams](https://www.instagram.com/chams_adams)

---

## 🛠️ Stack

- **Framework** : Next.js 14 (App Router) + TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **Animations** : GSAP + ScrollTrigger, Framer Motion, Lenis
- **3D** : Three.js / React Three Fiber
- **CMS** : Sanity.io
- **E-commerce** : Stripe (+ Wave / Orange Money en préparation)
- **i18n** : next-intl (FR / EN)
- **Déploiement** : Vercel

---

## 🚀 Démarrage

### Prérequis

- Node.js 20+
- npm 10+
- Git

### Installation

```bash
# Cloner le repo
git clone <repo-url>
cd chams-adams

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lancer le build de production |
| `npm run lint` | Linter ESLint |
| `npm run format` | Formater avec Prettier |
| `npm run type-check` | Vérification TypeScript |

---

## 📁 Structure

```
chams-adams/
├── app/                    # Pages Next.js (App Router)
│   ├── (marketing)/       # Pages éditoriales
│   ├── (shop)/            # Pages e-commerce
│   └── api/               # Routes API
├── components/
│   ├── ui/                # Composants shadcn
│   ├── animations/        # Animations GSAP/Framer
│   ├── sections/          # Sections réutilisables
│   ├── product/           # Composants produit
│   └── layout/            # Header, Footer, Nav
├── lib/                   # Utilitaires et helpers
├── public/                # Assets statiques
├── styles/                # CSS global
├── CLAUDE.md              # Contexte projet pour Claude Code
└── README.md
```

---

## 🎨 Design System

**Couleurs principales** :
- Noir velours `#0A0A0A`
- Or sahélien `#C9A961`
- Ivoire `#F5F0E6`
- Indigo profond `#1B2951`

**Typographies** :
- Titres : Cormorant Garamond
- Corps : Inter
- Signatures : Italianno

Plus de détails dans [CLAUDE.md](./CLAUDE.md).

---

## 🤖 Travail avec Claude Code

Ce projet est conçu pour être développé avec [Claude Code](https://docs.claude.com/claude-code).

Le fichier [`CLAUDE.md`](./CLAUDE.md) à la racine contient tout le contexte nécessaire (identité de marque, stack, design system, conventions). Claude Code le lit automatiquement à chaque session.

---

## 📝 Conventions de Commit

On suit la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `style:` mise en forme / CSS
- `refactor:` refonte sans changement fonctionnel
- `perf:` optimisation
- `a11y:` accessibilité
- `docs:` documentation
- `chore:` maintenance

---

## 🌍 Accessibilité & Performance

- **WCAG AA** respecté
- **Lighthouse ≥ 90** sur toutes les métriques
- **`prefers-reduced-motion`** pris en charge
- **Responsive** de 375px à 2560px+

---

## 📄 Licence

© Chams Adams — Tous droits réservés.
