# Vidéos — Hero Cinematic

## Fichiers attendus

| Fichier | Rôle |
|---------|------|
| `hero-placeholder.mp4` | Vidéo de fond du Hero (autoPlay, muted, loop) |
| `hero-placeholder-poster.svg` | Poster fallback (déjà fourni — gradient éditorial + particules or) |

## Spécifications vidéo

- **Durée** : 10–15 s, boucle parfaite (premier et dernier frame identiques)
- **Résolution** : 1920×1080 (ou 2560×1440 si source premium disponible)
- **Codec** : H.264 (MP4), profile `main` ou `high`
- **Bitrate** : ≈ 3 000–5 000 kb/s (objectif fichier final ≤ 5 Mo)
- **Audio** : aucune piste (on joue systématiquement `muted`)
- **Couleurs** : sombre, chaleureuse, tons or/bronze/noir (cohérent avec le design system)
- **Sujet** : un tissu qui ondule au ralenti, une silhouette floutée, une broderie qui se dessine, une fumée dorée

## Sources libres de droits possibles

- [Pexels — tissu](https://www.pexels.com/search/videos/fabric/)
- [Pixabay — silk flowing](https://pixabay.com/videos/search/silk/)
- [Mixkit — slow motion](https://mixkit.co/free-stock-video/)

## Pipeline de compression (ffmpeg)

```bash
ffmpeg -i source.mov \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -preset slow -crf 24 \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,fps=24" \
  -movflags +faststart \
  -an \
  hero-placeholder.mp4
```

- `crf 24` : qualité visuelle élevée, taille raisonnable. Descendre à 22 pour plus de qualité, monter à 26 pour alléger.
- `movflags +faststart` : indispensable pour la lecture streamée.
- `-an` : retire la piste audio.

## Poster

Le poster `hero-placeholder-poster.svg` est référencé par le `<video>`. Le
navigateur l'affiche avant le premier frame de la vidéo, et en fallback si la
vidéo est absente ou indisponible.

Pour régénérer un poster à partir d'une vidéo :

```bash
ffmpeg -i hero-placeholder.mp4 -ss 00:00:02 -vframes 1 -q:v 2 \
  hero-placeholder-poster.jpg
```

Puis mettre à jour la constante `POSTER` dans
`components/sections/HeroCinematic.tsx`.
