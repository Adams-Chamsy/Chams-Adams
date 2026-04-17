# Guide Design — Chams Adams

> Référence visuelle et technique pour tous les composants UI.

---

## 🎨 Palette de couleurs

### Primaires

| Nom | Hex | Usage |
|-----|-----|-------|
| Noir velours | `#0A0A0A` | Fond principal, mode sombre |
| Or sahélien | `#C9A961` | Accents, CTA, broderies, hover |
| Ivoire | `#F5F0E6` | Textes sur fond sombre, fond clair |

### Secondaires

| Nom | Hex | Usage |
|-----|-----|-------|
| Indigo profond | `#1B2951` | Accents nobles (teintures traditionnelles) |
| Terre de Sienne | `#8B4513` | Touches rares, accents chauds |
| Bronze | `#4A3728` | Détails, bordures subtiles |

### Variations tonales (à générer)

Pour chaque couleur, prévoir des variations `50, 100, 200…900` via Tailwind.

### Usage
- **Fond par défaut** : Noir velours
- **Texte principal** : Ivoire (90% opacité)
- **Texte secondaire** : Ivoire (60% opacité)
- **CTA** : Bordure Or 1px, hover = fond Or + texte Noir
- **Liens** : Or sans soulignement, hover avec underline fin

---

## 🔤 Typographies

### Hiérarchie

| Niveau | Font | Size (desktop) | Size (mobile) | Tracking |
|--------|------|----------------|---------------|----------|
| H1 Hero | Cormorant Garamond | 80–120px | 48–64px | -0.02em |
| H2 Section | Cormorant Garamond | 56–72px | 36–48px | -0.01em |
| H3 Sous-section | Cormorant Garamond | 32–40px | 24–28px | normal |
| Display signature | Italianno | 48–64px | 32–40px | normal |
| Body large | Inter | 18–20px | 16–17px | 0.01em |
| Body | Inter | 16px | 15px | normal |
| Caption | Inter | 12–14px | 12px | 0.05em |
| Nav / CTA | Inter (uppercase) | 12–14px | 12px | 0.2em |

### Règles
- Les titres Cormorant **toujours en light ou regular**, jamais bold
- Les CTA **en uppercase** avec tracking large (0.15em à 0.25em)
- Line-height généreux : 1.6 pour le body, 1.1–1.2 pour les titres
- Italianno **seulement pour des touches rares** (citation, signature)

---

## 📐 Espacements & Grille

### Grille
- **Desktop** : 12 colonnes, gouttières 32px
- **Tablette** : 8 colonnes, gouttières 24px
- **Mobile** : 4 colonnes, gouttières 16px

### Espacements verticaux entre sections
- **Desktop** : 160–200px
- **Tablette** : 120px
- **Mobile** : 80px

**Principe luxe** : **toujours plus d'espace qu'on ne pense nécessaire**.

### Marges conteneur
- Max-width : 1440px (contenu principal), 1920px (sections pleine largeur)
- Padding latéral : 32px desktop / 24px tablette / 16px mobile

---

## 🖼️ Images & Ratios

### Ratios privilégiés
- **Portrait éditorial** : 4:5 (Vogue-like)
- **Portrait classique** : 3:4
- **Paysage éditorial** : 16:9 (vidéos, héros)
- **Paysage cinéma** : 21:9 (hero cinematic)

**Éviter** : 1:1 (trop Instagram, trop plat pour le luxe)

### Traitement
- Toutes les images en `next/image`
- Format : AVIF > WebP > JPG fallback
- Qualité : 85 (balance perf/qualité)
- `placeholder="blur"` systématique
- `priority` sur images above-the-fold uniquement

### Lumière
- Privilégier les photos avec **lumière chaude et dorée** (heure dorée)
- Contrastes doux, jamais criards
- Ombres profondes autorisées (drame)

---

## ✨ Animations

### Durées standards
- Micro-interactions : `200–300ms`
- Transitions UI : `400–500ms`
- Reveals au scroll : `600–900ms`
- Animations cinématiques : `1200ms+`

### Courbes (easings)
```
ease-out-expo    : cubic-bezier(0.19, 1, 0.22, 1)      // reveals
ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1)      // transitions
ease-out-quart   : cubic-bezier(0.25, 1, 0.5, 1)       // hover
luxe-smooth      : cubic-bezier(0.77, 0, 0.175, 1)     // signature
```

### Règles
- **Jamais de bounce** (trop cartoon, tue le luxe)
- **Jamais d'animation spring agressive**
- Préférer `ease-out` sur les entrées, `ease-in` sur les sorties
- Stagger des éléments listés : délai de 50–100ms entre chaque

---

## 🎯 Composants UI

### Boutons

**Primaire (CTA)**
```
- Bordure : 1px Or #C9A961
- Fond : transparent
- Texte : Ivoire, uppercase, tracking 0.2em, 12–14px
- Padding : 16px 32px (desktop), 14px 24px (mobile)
- Hover : fond Or, texte Noir, transition 400ms
- Halo lumineux subtil en hover (box-shadow or à 20% opacité)
```

**Secondaire**
```
- Pas de bordure
- Texte Or ou Ivoire, uppercase, underline fin
- Hover : translation verticale 2px + underline plus épais
```

### Cards produit
```
- Image ratio 4:5
- Pas de bordure (ou 1px bronze à 20%)
- Hover : légère scale 1.02, transition 600ms
- Prix : Inter 14px, tracking 0.1em
- Nom produit : Cormorant 20px, light
```

### Inputs
```
- Bordure bas uniquement (1px bronze)
- Pas de background
- Placeholder ivoire 40%
- Focus : bordure or, transition 300ms
- Pas de border-radius (ou 2px max)
```

---

## 🌙 Mode sombre / clair

### Mode sombre (défaut)
- Fond : `#0A0A0A`
- Texte : `#F5F0E6`
- Accents : `#C9A961`

### Mode clair (alternatif)
- Fond : `#F5F0E6`
- Texte : `#0A0A0A`
- Accents : `#C9A961` (inchangé)

Le toggle doit être **discret**, dans le footer ou menu secondaire, jamais dans le header.

---

## 📱 Breakpoints

```
sm  : 640px   → Mobile large
md  : 768px   → Tablette portrait
lg  : 1024px  → Tablette paysage
xl  : 1280px  → Desktop
2xl : 1536px  → Desktop large
3xl : 1920px  → Grand écran
```

---

## ♿ Accessibilité

- **Contrastes** : WCAG AA minimum (4.5:1 pour texte normal, 3:1 pour grand)
- **Focus visible** : ring or 2px, offset 4px
- **Navigation clavier** : tous les éléments interactifs accessibles
- **Alt text** sur toutes les images (sauf purement décoratives)
- **ARIA labels** sur les icônes sans texte
- **`prefers-reduced-motion`** : désactiver toutes les animations non-essentielles

---

*Ce guide est vivant. Toute nouvelle décision design doit être ajoutée ici.*
