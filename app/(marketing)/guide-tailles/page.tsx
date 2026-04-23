'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import {
  SIZES,
  MEASURE_LABELS,
  MEASURE_INSTRUCTIONS,
  MEASURE_ORDER,
  cmToInches,
  type MeasurePoint,
} from '@/lib/data/sizes';
import { cn } from '@/lib/utils';

type Unit = 'cm' | 'in';

type DotPos = { point: MeasurePoint; cx: number; cy: number };

// Positions des points sur la silhouette — coordonnées viewBox 300×500.
const DOTS: DotPos[] = [
  { point: 'shoulder', cx: 150, cy: 86 },
  { point: 'chest', cx: 150, cy: 140 },
  { point: 'waist', cx: 150, cy: 215 },
  { point: 'hip', cx: 150, cy: 300 },
  { point: 'sleeve', cx: 60, cy: 205 },
  { point: 'length', cx: 228, cy: 466 },
];

export default function GuideTaillesPage() {
  const [unit, setUnit] = useState<Unit>('cm');
  const [activePoint, setActivePoint] = useState<MeasurePoint>('chest');

  const display = (cm: number) =>
    unit === 'cm' ? `${cm}` : cmToInches(cm).toFixed(1);

  return (
    <>
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Guide des tailles' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Référence
          </span>
          <h1 className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.5rem,5vw,4.5rem)]">
            Guide des tailles
          </h1>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            Cliquez sur un point de la silhouette pour voir la mesure
            correspondante et la méthode de prise. Les tailles standard sont
            indicatives&nbsp;— pour un ajustement parfait, passez par le
            sur-mesure.
          </p>
        </div>
      </section>

      {/* Guide interactif */}
      <section className="bg-noir pb-[80px]">
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Silhouette — sticky desktop */}
          <div className="lg:sticky lg:top-28 lg:col-span-5 lg:h-fit lg:self-start">
            <figure className="flex flex-col items-center gap-6 border border-bronze/20 bg-noir p-8 md:p-12">
              <svg
                viewBox="0 0 300 500"
                role="group"
                aria-label="Silhouette kaftan avec points de mesure interactifs"
                className="h-auto w-full max-w-[320px] text-ivoire/35"
              >
                <title>Silhouette kaftan avec points de mesure</title>

                {/* Tête */}
                <circle
                  cx="150"
                  cy="40"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Kaftan — silhouette traits discontinus */}
                <path
                  d="M 85 85 L 45 130 L 55 210 L 90 180 L 70 470 L 230 470 L 210 180 L 245 210 L 255 130 L 215 85 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Lignes de mesure (subtiles) — seule la mesure active est mise en or */}
                {activePoint === 'shoulder' && (
                  <line x1="85" y1="86" x2="215" y2="86" stroke="#C9A961" strokeWidth="1.8" />
                )}
                {activePoint === 'chest' && (
                  <line x1="60" y1="140" x2="240" y2="140" stroke="#C9A961" strokeWidth="1.8" />
                )}
                {activePoint === 'waist' && (
                  <line x1="70" y1="215" x2="230" y2="215" stroke="#C9A961" strokeWidth="1.8" />
                )}
                {activePoint === 'hip' && (
                  <line x1="70" y1="300" x2="230" y2="300" stroke="#C9A961" strokeWidth="1.8" />
                )}
                {activePoint === 'sleeve' && (
                  <line x1="85" y1="85" x2="55" y2="210" stroke="#C9A961" strokeWidth="1.8" />
                )}
                {activePoint === 'length' && (
                  <line x1="215" y1="85" x2="230" y2="470" stroke="#C9A961" strokeWidth="1.8" />
                )}

                {/* Points cliquables — un seul élément interactif par point
                    pour éviter les nested-interactive controls flaggés par axe */}
                {DOTS.map((d) => {
                  const isActive = d.point === activePoint;
                  return (
                    <g key={d.point}>
                      {/* Halo au survol / actif — décoratif */}
                      {isActive && (
                        <motion.circle
                          cx={d.cx}
                          cy={d.cy}
                          initial={{ opacity: 0, r: 4 }}
                          animate={{ opacity: 1, r: 14 }}
                          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                          fill="#C9A961"
                          opacity="0.25"
                          aria-hidden
                        />
                      )}
                      {/* Cercle visuel — décoratif, pas d'onClick */}
                      <circle
                        cx={d.cx}
                        cy={d.cy}
                        r="6"
                        fill={isActive ? '#C9A961' : '#0A0A0A'}
                        stroke="#C9A961"
                        strokeWidth="1.5"
                        className="pointer-events-none transition-colors"
                        aria-hidden
                      />
                      {/* Unique cible interactive, zone de clic élargie */}
                      <rect
                        x={d.cx - 14}
                        y={d.cy - 14}
                        width="28"
                        height="28"
                        fill="transparent"
                        className="cursor-pointer focus:outline-none focus-visible:stroke-or"
                        onClick={() => setActivePoint(d.point)}
                        aria-label={`${MEASURE_LABELS[d.point]} — sélectionner`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActivePoint(d.point);
                          }
                        }}
                      />
                    </g>
                  );
                })}
              </svg>
              <figcaption className="font-serif italic text-center text-ivoire/60">
                {MEASURE_LABELS[activePoint]}
                <span className="mx-2 text-ivoire/30">·</span>
                <span className="font-sans not-italic text-xs uppercase tracking-[0.25em] text-or">
                  Point actif
                </span>
              </figcaption>

              {/* Instruction de la mesure active */}
              <p className="font-sans text-sm leading-relaxed text-ivoire/75">
                {MEASURE_INSTRUCTIONS[activePoint]}
              </p>
            </figure>
          </div>

          {/* Tableau */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Toggle cm / in */}
            <div className="flex items-center justify-between border-b border-bronze/20 pb-4">
              <h2 className="font-serif text-2xl font-light text-ivoire md:text-3xl">
                Tableau des mesures
              </h2>
              <div
                role="tablist"
                aria-label="Unité de mesure"
                className="inline-flex items-center border border-bronze/30"
              >
                {(['cm', 'in'] as Unit[]).map((u) => (
                  <button
                    key={u}
                    type="button"
                    role="tab"
                    aria-selected={unit === u}
                    onClick={() => setUnit(u)}
                    data-cursor="hover"
                    className={cn(
                      'px-3 py-2 font-sans text-[11px] uppercase tracking-[0.2em] transition-colors duration-300',
                      unit === u
                        ? 'bg-or text-noir'
                        : 'text-ivoire/70 hover:text-or'
                    )}
                  >
                    {u === 'cm' ? 'Centimètres' : 'Pouces'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-bronze/30 font-sans text-[11px] uppercase tracking-[0.2em] text-or/80">
                    <th className="py-4 pr-4 font-normal">Taille</th>
                    {MEASURE_ORDER.map((m) => (
                      <th
                        key={m}
                        scope="col"
                        className={cn(
                          'py-4 pr-4 font-normal transition-colors duration-300',
                          activePoint === m && 'text-or'
                        )}
                      >
                        {MEASURE_LABELS[m]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="font-serif text-ivoire">
                  {SIZES.map((row) => (
                    <tr
                      key={row.size}
                      className="border-b border-bronze/10 transition-colors duration-200 hover:bg-ivoire/[0.02]"
                    >
                      <td className="py-4 pr-4 text-lg">{row.size}</td>
                      {MEASURE_ORDER.map((m) => (
                        <td
                          key={m}
                          className={cn(
                            'py-4 pr-4 font-sans text-sm transition-colors duration-300',
                            activePoint === m
                              ? 'text-or'
                              : 'text-ivoire/80'
                          )}
                        >
                          {display(row[m])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4 pr-4 font-serif italic text-or">
                      Sur-mesure
                    </td>
                    <td
                      colSpan={MEASURE_ORDER.length}
                      className="py-4 font-serif italic text-ivoire/60"
                    >
                      Vingt-huit points pris en atelier. Aucune grille.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="font-serif italic text-sm text-ivoire/55">
              Valeurs indicatives. Une marge d&apos;un à deux centimètres est
              recommandée pour le confort sur une coupe fluide.
            </p>
          </div>
        </div>
      </section>

      {/* Comment prendre vos mesures */}
      <section
        aria-labelledby="howto-title"
        className="bg-noir py-[80px] md:py-[120px]"
      >
        <div className="container-content flex flex-col gap-12">
          <header className="flex max-w-3xl flex-col gap-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              La méthode
            </span>
            <h2
              id="howto-title"
              className="font-serif font-light leading-tight text-ivoire text-[clamp(1.75rem,3vw,2.75rem)]"
            >
              Comment prendre vos mesures
            </h2>
          </header>
          <ol className="grid grid-cols-1 gap-10 list-none md:grid-cols-2 lg:grid-cols-3">
            {MEASURE_ORDER.map((m, i) => (
              <li
                key={m}
                className="flex flex-col gap-3 border-t border-bronze/20 pt-5"
              >
                <span
                  aria-hidden
                  className="font-sans text-[10px] uppercase tracking-[0.3em] text-or/80"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-xl font-light text-ivoire md:text-2xl">
                  {MEASURE_LABELS[m]}
                </h3>
                <p className="font-serif italic leading-relaxed text-ivoire/70">
                  {MEASURE_INSTRUCTIONS[m]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA sur-mesure */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col items-center gap-6 border-t border-bronze/20 pt-20 text-center">
          <p className="max-w-prose font-serif italic text-ivoire/75 text-2xl md:text-3xl">
            Entre deux tailles&nbsp;? Une morphologie à part&nbsp;? Le
            sur-mesure est fait pour cela.
          </p>
          <Link href="/sur-mesure" data-cursor="magnetic" className="btn-or">
            Demander le sur-mesure
          </Link>
        </div>
      </section>
    </>
  );
}
