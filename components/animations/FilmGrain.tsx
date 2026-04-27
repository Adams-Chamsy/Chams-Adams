/**
 * Grain de pellicule subtil — overlay fixe sur tout le viewport.
 *
 * Implémentation : SVG turbulence (filter natif navigateur). Aucun JS,
 * aucun redraw, GPU-accéléré. Respecte automatiquement reduced-motion
 * (le filtre est statique de toute façon).
 *
 * Codes Vogue Afrique / Cartier : matérialité subtile (3-5% opacité)
 * pour casser le flat noir et donner de la profondeur photographique.
 *
 * À monter UNE FOIS dans le layout root, en `pointer-events-none`,
 * `mix-blend-mode: overlay` pour que le grain apparaisse seulement
 * sur les zones colorées (et non sur les fonds 100% noirs).
 */
export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] motion-reduce:hidden"
      style={{
        mixBlendMode: 'overlay',
        opacity: 0.18,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="block h-full w-full"
      >
        <filter id="chams-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.78
                    0 0 0 0 0.66
                    0 0 0 0 0.38
                    0 0 0 0.55 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#chams-grain)" />
      </svg>
    </div>
  );
}
