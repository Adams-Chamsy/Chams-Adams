import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqSchema } from '@/lib/seo/json-ld';
import {
  getFAQ,
  FAQ_CATEGORY_LABELS,
  groupFAQ,
  type FAQCategory,
} from '@/lib/data/faq';

export const metadata: Metadata = {
  title: 'Questions fréquentes',
  description:
    'Livraison, sur-mesure, entretien, paiement, retours — toutes les réponses pour commander et vivre vos pièces Chams Adams en toute sérénité.',
  openGraph: {
    title: 'Questions fréquentes — Chams Adams',
    description:
      'Livraison, sur-mesure, entretien, paiement, retours — toutes les réponses.',
  },
};

const CATEGORY_ORDER: FAQCategory[] = [
  'livraison',
  'sur-mesure',
  'entretien',
  'paiement',
  'retours',
  'atelier',
];

export default async function FaqPage() {
  const faq = await getFAQ();
  const grouped = groupFAQ(faq);
  const faqJsonLd = faqSchema(
    faq.map((item) => ({ question: item.question, answer: item.answer }))
  );

  return (
    <>
      <JsonLd data={faqJsonLd} />
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[40px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Questions fréquentes' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Questions fréquentes
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.5rem,5vw,4.5rem)]"
          >
            Vos questions, nos réponses
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            Si une réponse vous manque, écrivez-nous directement&nbsp;—
            nous revenons personnellement sous 48 heures ouvrées.
          </p>
        </div>
      </section>

      {/* Navigation ancrée + corps */}
      <section className="bg-noir pb-[120px]">
        <div className="container-content grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Nav ancrée — sticky desktop */}
          <nav
            aria-label="Catégories"
            className="lg:sticky lg:top-28 lg:col-span-3 lg:h-fit"
          >
            <p className="mb-4 font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
              Naviguer
            </p>
            <ul className="flex flex-col gap-2 border-l border-bronze/25 pl-4">
              {CATEGORY_ORDER.map((cat) => (
                <li key={cat}>
                  <a
                    href={`#${cat}`}
                    data-cursor="hover"
                    className="inline-block font-serif italic text-ivoire/70 transition-colors duration-300 hover:text-or"
                  >
                    {FAQ_CATEGORY_LABELS[cat]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Corps */}
          <div className="flex flex-col gap-16 lg:col-span-9">
            {CATEGORY_ORDER.map((cat) => {
              const items = grouped[cat] ?? [];
              if (items.length === 0) return null;
              return (
                <section
                  key={cat}
                  id={cat}
                  aria-labelledby={`faq-${cat}-title`}
                  className="scroll-mt-28 flex flex-col gap-6"
                >
                  <header className="flex items-baseline gap-4 border-b border-bronze/25 pb-4">
                    <h2
                      id={`faq-${cat}-title`}
                      className="font-serif text-2xl font-light text-ivoire md:text-3xl"
                    >
                      {FAQ_CATEGORY_LABELS[cat]}
                    </h2>
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/40">
                      {items.length}
                    </span>
                  </header>
                  <ul className="flex flex-col divide-y divide-bronze/15">
                    {items.map((item) => (
                      <li key={item.id} className="py-2">
                        <details className="group">
                          <summary
                            data-cursor="hover"
                            className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-serif text-lg text-ivoire transition-colors duration-300 hover:text-or md:text-xl"
                          >
                            <span className="flex-1">{item.question}</span>
                            <span
                              aria-hidden
                              className="mt-2 inline-block h-px w-4 shrink-0 bg-ivoire transition-transform duration-300 group-open:rotate-90"
                            />
                          </summary>
                          <p className="pb-5 font-sans leading-relaxed text-ivoire/75">
                            {item.answer}
                          </p>
                        </details>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA contact */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content flex flex-col items-center gap-6 border-t border-bronze/25 pt-16 text-center">
          <p className="max-w-prose font-serif italic text-ivoire/75 text-xl md:text-2xl">
            Une question qui n&apos;est pas ici&nbsp;? Écrivez-nous, nous
            serons ravis d&apos;échanger.
          </p>
          <Link href="/contact" data-cursor="magnetic" className="btn-or">
            Nous écrire
          </Link>
        </div>
      </section>
    </>
  );
}
