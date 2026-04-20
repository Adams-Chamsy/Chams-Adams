'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { formatArticleDate, type JournalArticleMeta } from '@/lib/journal-shared';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];
const PAGE_SIZE = 9;

type Props = {
  articles: JournalArticleMeta[];
  categories: string[];
};

export function JournalClient({ articles, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      activeCategory
        ? articles.filter((a) => a.category === activeCategory)
        : articles,
    [articles, activeCategory]
  );

  const [featured, ...rest] = filtered;
  const visibleRest = rest.slice(0, visibleCount);

  return (
    <>
      {/* HERO */}
      <section className="bg-noir pt-[140px] pb-[80px] md:pt-[180px] md:pb-[120px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Récits de la maison
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light leading-[0.95] text-ivoire text-[clamp(4rem,11vw,8rem)]"
          >
            Journal
          </TextReveal>
        </div>
      </section>

      {/* ARTICLE À LA UNE */}
      {featured && (
        <section aria-labelledby="featured-title" className="bg-noir pb-[80px]">
          <div className="container-content">
            <Link
              href={`/journal/${featured.slug}`}
              data-cursor="hover"
              className="group grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
            >
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
                  <Image
                    src={featured.coverImage}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 60vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="flex items-baseline gap-3 font-sans text-xs uppercase tracking-[0.25em]">
                  <span className="text-or">{featured.category}</span>
                  <span className="text-ivoire/40">·</span>
                  <time className="italic text-ivoire/50 normal-case">
                    {formatArticleDate(featured.date)}
                  </time>
                </div>
                <h2
                  id="featured-title"
                  className="font-serif font-light leading-[1.05] text-ivoire text-[clamp(2.25rem,4.5vw,3.75rem)] transition-colors duration-300 group-hover:text-or"
                >
                  {featured.title}
                </h2>
                <p className="max-w-prose font-serif italic text-ivoire/75 text-lg leading-relaxed">
                  {featured.excerpt}
                </p>
                <span className="mt-2 inline-flex items-center gap-2 font-serif italic text-or">
                  Lire l&apos;article
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* FILTRES */}
      <section className="bg-noir pb-10">
        <div className="container-content">
          <div className="flex flex-wrap items-center gap-4 border-y border-bronze/15 py-6">
            <span className="mr-4 font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/60">
              Catégories
            </span>
            <CategoryChip
              label="Tous"
              active={activeCategory === null}
              onClick={() => {
                setActiveCategory(null);
                setVisibleCount(PAGE_SIZE);
              }}
            />
            {categories.map((c) => (
              <CategoryChip
                key={c}
                label={c}
                active={activeCategory === c}
                onClick={() => {
                  setActiveCategory(c);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* GRILLE D'ARTICLES */}
      <section className="bg-noir pb-[120px]">
        <div className="container-content">
          {visibleRest.length === 0 && !featured ? (
            <p className="font-serif italic text-ivoire/60">
              Aucun article dans cette catégorie pour l&apos;instant.
            </p>
          ) : visibleRest.length === 0 ? null : (
            <ul className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
              {visibleRest.map((a, i) => (
                <li key={a.slug} className={i % 3 === 1 ? 'lg:mt-16' : undefined}>
                  <ArticleCard article={a} index={i} />
                </li>
              ))}
            </ul>
          )}

          {visibleCount < rest.length && (
            <div className="mt-16 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                data-cursor="magnetic"
                className="btn-or"
              >
                Lire davantage
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="hover"
      aria-pressed={active}
      className={cn(
        'inline-flex items-center border px-4 py-2 font-sans text-[11px] uppercase tracking-[0.25em] transition-all duration-300',
        active
          ? 'border-or bg-or/10 text-or'
          : 'border-bronze/30 text-ivoire/70 hover:border-or hover:text-ivoire'
      )}
    >
      {label}
    </button>
  );
}

function ArticleCard({
  article: a,
  index,
}: {
  article: JournalArticleMeta;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: (index % 3) * 0.1 }}
      className="group flex flex-col gap-5"
    >
      <Link href={`/journal/${a.slug}`} data-cursor="hover" className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-noir-800">
          <Image
            src={a.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
          />
        </div>
      </Link>

      <div className="flex items-baseline justify-between gap-4">
        <span className="font-sans text-xs uppercase tracking-[0.25em] text-or">
          {a.category}
        </span>
        <time className="font-sans text-xs italic text-ivoire/50">
          {formatArticleDate(a.date)}
        </time>
      </div>

      <h3 className="font-serif font-light text-ivoire text-2xl leading-tight md:text-[26px]">
        <Link
          href={`/journal/${a.slug}`}
          data-cursor="hover"
          className="transition-colors duration-300 hover:text-or"
        >
          {a.title}
        </Link>
      </h3>

      <p className="line-clamp-2 font-sans text-sm leading-relaxed text-ivoire/70">
        {a.excerpt}
      </p>

      <Link
        href={`/journal/${a.slug}`}
        data-cursor="hover"
        className="group/link inline-flex items-center gap-2 font-serif italic text-or transition-colors duration-300 hover:text-or/80"
      >
        Lire
        <span
          aria-hidden
          className="inline-block transition-transform duration-300 group-hover/link:translate-x-1"
        >
          →
        </span>
      </Link>
    </motion.article>
  );
}
