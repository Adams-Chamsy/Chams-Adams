# Prompt d'Initialisation — Claude Code

> À coller dans Claude Code une fois que tu es dans le dossier `chams-adams/`.

---

## 🚀 Prompt à utiliser

```
Bonjour. Tu travailles sur le projet Chams Adams.

ÉTAPE 0 — Contexte
Lis intégralement le fichier CLAUDE.md à la racine du projet avant toute action.
Lis aussi docs/CHARTE-EDITORIALE.md et docs/GUIDE-DESIGN.md pour bien comprendre l'identité visuelle et éditoriale.

Confirme-moi en 3 phrases maximum que tu as bien compris :
1. La nature exacte de la marque (type de produit)
2. La stack technique à utiliser
3. Le mode de travail (validation par paliers)

ÉTAPE 1 — Initialisation du projet
Une fois la confirmation faite, procède dans cet ordre :

1. Initialise un projet Next.js 14 avec :
   - TypeScript
   - Tailwind CSS
   - App Router
   - ESLint
   - Import alias @/*
   - Sans src/ directory

2. Installe les dépendances suivantes :
   - Animations : gsap, @gsap/react, framer-motion, lenis
   - 3D : three, @react-three/fiber, @react-three/drei
   - UI : class-variance-authority, clsx, tailwind-merge, lucide-react
   - i18n : next-intl
   - Dev : prettier, prettier-plugin-tailwindcss

3. Initialise shadcn/ui avec le thème custom (base color: neutral, CSS variables: oui)

4. Configure tailwind.config.ts avec :
   - Les couleurs du design system (noir, or, ivoire, indigo, terre, bronze)
   - Les font families (display: Cormorant Garamond, sans: Inter, signature: Italianno)
   - Les breakpoints custom (voir docs/GUIDE-DESIGN.md)
   - Les easings personnalisés

5. Configure app/layout.tsx avec :
   - Les fonts via next/font/google (Cormorant Garamond, Inter, Italianno)
   - Les metadata de base (titre, description, OpenGraph)
   - Le thème sombre par défaut
   - La langue FR

6. Crée l'arborescence de dossiers exactement comme défini dans CLAUDE.md section 4
   (crée les dossiers vides avec un .gitkeep)

7. Crée un styles/globals.css avec :
   - Les variables CSS du design system
   - Le reset de base
   - La config de la police par défaut
   - Le scrollbar custom (fin, or sur fond noir)

8. Initialise un repo Git (s'il n'existe pas déjà) avec un premier commit :
   chore: initialize Next.js project with design system and architecture

RÈGLES À RESPECTER PENDANT L'ÉTAPE 1
- N'installe AUCUNE dépendance supplémentaire non listée ci-dessus sans me demander
- Ne crée AUCUNE page ou composant métier à cette étape (on fera ça à l'étape 2)
- Si un choix n'est pas évident (version d'un package, config spécifique), demande-moi
- Utilise npm (pas pnpm, pas yarn) sauf indication contraire

LIVRABLE ATTENDU DE L'ÉTAPE 1
À la fin, montre-moi :
- La structure du projet (arbre des dossiers)
- Le contenu de tailwind.config.ts
- Le contenu de package.json (section dependencies)
- Confirmation que npm run dev démarre sans erreur

Ensuite, ATTENDS MA VALIDATION avant de passer à l'étape 2 (Layout global : Header + Footer + SmoothScroll + CustomCursor).

Tu peux commencer.
```

---

## 📋 Checklist avant de lancer

- [ ] Node.js 20+ installé (`node -v`)
- [ ] npm 10+ installé (`npm -v`)
- [ ] Git installé (`git --version`)
- [ ] Claude Code installé (`claude --version`)
- [ ] Tu es dans le dossier `chams-adams/`
- [ ] Les fichiers suivants sont présents à la racine :
  - [ ] `CLAUDE.md`
  - [ ] `README.md`
  - [ ] `.env.example`
  - [ ] `.gitignore`
  - [ ] `.editorconfig`
  - [ ] `.prettierrc`
  - [ ] `.nvmrc`
- [ ] Le dossier `docs/` contient :
  - [ ] `CHARTE-EDITORIALE.md`
  - [ ] `GUIDE-DESIGN.md`
  - [ ] `ROADMAP.md`
- [ ] Le dossier `.vscode/` contient les settings
- [ ] Le dossier `.github/` contient le template PR

---

## 🎬 Commandes à lancer avant

```bash
# Vérifier la version de Node
nvm use  # Utilise la version du .nvmrc

# Lancer Claude Code
claude

# Coller le prompt ci-dessus
```
