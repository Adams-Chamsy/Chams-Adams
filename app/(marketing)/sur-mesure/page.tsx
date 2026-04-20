import type { Metadata } from 'next';
import Image from 'next/image';
import { TextReveal } from '@/components/animations/TextReveal';
import { ZoomReveal } from '@/components/animations/ZoomReveal';
import { SurMesureForm } from '@/components/forms/SurMesureForm';

export const metadata: Metadata = {
  title: 'Sur-mesure — Composer votre pièce',
  description:
    'Le sur-mesure, pratique fondatrice de la maison Chams Adams. Entretien, prise de mesures en vingt-huit points, création et remise — quatre temps pour une œuvre unique.',
  openGraph: {
    title: 'Sur-mesure — Chams Adams',
    description:
      'Le kaftan pensé pour vous, par nos mains. Vingt-huit points de mesure, trois à huit semaines de création.',
  },
};

const PROCESS_STEPS = [
  {
    roman: 'I',
    duration: 'Jour 1',
    title: 'Le dialogue',
    body: "Tout commence par une conversation. En atelier ou à distance, nous écoutons votre vision, votre occasion, votre silhouette. Nous vous montrons les tissus, les teintures, les possibilités. Aucune pièce n'existe avant ce moment.",
  },
  {
    roman: 'II',
    duration: 'Semaine 1',
    title: 'Vingt-huit points',
    body: "Pour un tombé parfait, nos maîtres couturiers prennent vingt-huit mesures précises. Si vous êtes à distance, un guide détaillé et un mètre de couture vous sont transmis. Chaque détail compte.",
  },
  {
    roman: 'III',
    duration: 'Semaines 2 à 8',
    title: 'Les mains au travail',
    body: "Coupe, couture, teinture, broderie. Selon la complexité, votre pièce prendra entre trois et huit semaines à naître. Chaque étape est photographiée et partagée avec vous.",
  },
  {
    roman: 'IV',
    duration: 'Semaine finale',
    title: 'La remise',
    body: "Votre pièce vous est remise en main propre ou livrée avec le plus grand soin. Elle est accompagnée d'un certificat signé et d'un livret retraçant les étapes de sa création. Elle est à vous pour toujours.",
  },
];

const REALISATIONS = [
  { src: '/images/products/kaftan-indigo.svg', alt: 'Pièce sur-mesure, bazin indigo — Dakar, 2024', label: 'Mariage · Dakar · 2024' },
  { src: '/images/products/kaftan-bordeaux.svg', alt: 'Pièce sur-mesure, bazin bordeaux — Paris, 2025', label: 'Réception · Paris · 2025' },
  { src: '/images/products/kaftan-or.svg', alt: 'Pièce sur-mesure or — Abidjan, 2024', label: 'Tabaski · Abidjan · 2024' },
  { src: '/images/products/kaftan-ivoire.svg', alt: 'Pièce sur-mesure ivoire — Dakar, 2025', label: 'Baptême · Dakar · 2025' },
  { src: '/images/products/kaftan-bronze.svg', alt: 'Pièce sur-mesure bronze — Nouakchott, 2024', label: 'Magal · Nouakchott · 2024' },
  { src: '/images/products/kaftan-noir.svg', alt: 'Pièce sur-mesure noire — Paris, 2025', label: 'Gala · Paris · 2025' },
];

const TESTIMONIALS = [
  {
    quote:
      "Mon kaftan de mariage a été pensé pendant six semaines. Chaque essayage, chaque question posée. Le jour venu, il m'habillait comme une seconde peau.",
    attribution: 'M. S. · Dakar',
  },
  {
    quote:
      "J'avais apporté un tissu de ma grand-mère. Ils l'ont intégré à la doublure, en silence, comme une promesse tenue.",
    attribution: 'A. D. · Paris',
  },
  {
    quote:
      "On ne commande pas un kaftan chez Chams Adams. On le compose. Ce n'est pas la même chose.",
    attribution: 'B. T. · Abidjan',
  },
];

const FAQ = [
  {
    q: 'Quel est le délai minimum avant un événement ?',
    a: "Quatre semaines minimum pour une pièce sur-mesure simple. Six à huit semaines pour les pièces richement brodées ou teintées en plusieurs bains. Nous préférons refuser une commande plutôt que sacrifier un délai.",
  },
  {
    q: 'Comment se passe la prise de mesures à distance ?',
    a: "Nous vous adressons un mètre de couture et un guide photographique en vingt-huit points. Nous organisons une visioconférence pour vous accompagner. Une vérification finale a lieu au premier essayage.",
  },
  {
    q: 'Puis-je apporter mon propre tissu ?',
    a: "Oui. Nous acceptons les tissus confiés après analyse de leur qualité et compatibilité avec nos techniques de coupe et broderie. Un devis spécifique est établi.",
  },
  {
    q: 'Quels moyens de paiement pour le sur-mesure ?',
    a: "Virement bancaire ou Stripe (carte). Un acompte de 40 % est demandé au lancement, le solde au premier essayage. Nous préparons l'intégration des paiements mobiles Afrique (Wave, Orange Money, MTN) pour fin 2026.",
  },
  {
    q: 'Puis-je annuler ou modifier ma commande ?',
    a: "Les modifications restent possibles jusqu'à la fin du premier essayage. Au-delà, la pièce étant façonnée main, nous ne pouvons plus la modifier sans coût additionnel. L'annulation totale n'est pas possible après le lancement de la coupe.",
  },
];

export default function SurMesurePage() {
  return (
    <>
      {/* HERO */}
      <section
        aria-labelledby="sur-mesure-title"
        className="relative flex h-[92vh] min-h-[700px] items-end overflow-hidden bg-noir"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-placeholder-poster.jpg"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/hero-placeholder.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-noir/40 via-noir/30 to-noir"
        />
        <div className="container-content relative z-10 flex flex-col gap-6 pb-20 md:pb-28">
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Service signature
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            className="font-serif font-light leading-[1.02] text-ivoire text-[clamp(3rem,7vw,6rem)]"
          >
            Composer votre pièce
          </TextReveal>
          <p
            id="sur-mesure-title"
            className="max-w-prose font-serif italic text-ivoire/80 text-xl md:text-2xl"
          >
            Le kaftan pensé pour vous, par nos mains.
          </p>
          <div>
            <a href="#formulaire" data-cursor="magnetic" className="btn-or mt-4 inline-flex">
              Commencer la composition
            </a>
          </div>
        </div>
      </section>

      {/* INTRO MANIFESTE */}
      <section className="bg-noir py-[120px] md:py-[180px]">
        <div className="container-content">
          <p className="mx-auto max-w-2xl text-center font-serif italic text-ivoire/85 text-[clamp(1.5rem,2.5vw,2rem)] leading-[1.5]">
            Le sur-mesure est la manière la plus ancienne et la plus vivante
            d&apos;habiller un corps. Chez Chams Adams, il n&apos;est pas une option.
            Il est la pratique fondatrice de la maison.
          </p>
        </div>
      </section>

      {/* PROCESS EN 4 TEMPS */}
      <section aria-labelledby="process-title" className="bg-noir pb-[120px] md:pb-[180px]">
        <div className="container-content">
          <header className="mb-20 flex flex-col gap-4 md:mb-28">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Le process
            </span>
            <TextReveal
              as="h2"
              splitBy="words"
              stagger={0.06}
              className="font-serif font-light leading-tight text-ivoire text-[clamp(2rem,4.5vw,3.75rem)]"
            >
              Quatre temps, une œuvre
            </TextReveal>
          </header>
          <ol className="relative flex flex-col gap-20 md:gap-28" id="process-title">
            {/* Ligne or verticale */}
            <span
              aria-hidden
              className="absolute left-10 top-8 bottom-8 hidden w-px bg-or/30 md:block"
              style={{ left: 'clamp(3rem, 5vw, 6rem)' }}
            />
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step.roman}
                className="relative grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:gap-16"
              >
                <div className="relative flex items-start">
                  <span
                    aria-hidden
                    className="font-serif font-light leading-none text-or/20 text-[clamp(4.5rem,9vw,8rem)]"
                  >
                    {step.roman}
                  </span>
                </div>
                <div className="flex flex-col gap-4 md:pt-4">
                  <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
                    {step.duration}
                  </span>
                  <h3 className="font-serif font-light text-ivoire text-[clamp(1.5rem,3vw,2.25rem)] leading-tight">
                    {step.title}
                  </h3>
                  <p className="max-w-prose font-serif text-ivoire/80 text-lg leading-[1.75]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section className="bg-noir py-[120px]">
        <div className="container-content">
          <header className="mb-16 flex flex-col gap-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Archives
            </span>
            <h2 className="font-serif font-light text-ivoire text-[clamp(1.75rem,3.5vw,3rem)] leading-tight">
              Pièces composées pour eux
            </h2>
          </header>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
            {REALISATIONS.map((r, i) => (
              <li key={i} className={i % 3 === 1 ? 'lg:mt-16' : undefined}>
                <figure className="flex flex-col gap-3">
                  <ZoomReveal
                    scale={[1, 1.1]}
                    className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800"
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={r.src}
                        alt={r.alt}
                        fill
                        sizes="(max-width: 768px) 90vw, 32vw"
                        className="object-cover"
                      />
                    </div>
                  </ZoomReveal>
                  <figcaption className="font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/60">
                    {r.label}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FORMULAIRE */}
      <section id="formulaire" className="bg-noir py-[120px] md:py-[180px]">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Colonne gauche sticky */}
            <aside className="flex flex-col gap-8 lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
              <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
                Demande
              </span>
              <h2 className="font-serif font-light text-ivoire text-[clamp(2rem,4vw,3rem)] leading-tight">
                Initier la conversation
              </h2>
              <p className="font-serif italic text-ivoire/75 text-lg leading-relaxed">
                Renseignez quelques informations, nous vous recontactons sous 48 h
                pour convenir d&apos;un entretien.
              </p>
              <ul className="flex flex-col gap-3 border-t border-bronze/15 pt-6 font-sans text-sm text-ivoire/70">
                <li className="flex gap-3">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-or/60" />
                  Entretiens en atelier ou par visioconférence
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-or/60" />
                  Délai minimum : 4 semaines avant l&apos;événement
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-or/60" />
                  Devis gratuit sous 7 jours
                </li>
              </ul>
              <div className="border-t border-bronze/15 pt-6 font-sans text-sm text-ivoire/70">
                <p className="mb-2 uppercase tracking-[0.2em] text-ivoire/50 text-[11px]">
                  Contact direct
                </p>
                <p>contact@chams-adams.com</p>
              </div>
            </aside>

            {/* Colonne droite formulaire */}
            <div className="lg:col-span-7 lg:col-start-6">
              <SurMesureForm />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-noir py-[120px]">
        <div className="container-content">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="flex flex-col gap-6">
                <span aria-hidden className="h-px w-10 bg-or/60" />
                <blockquote className="font-serif italic text-ivoire/85 text-xl leading-[1.5]">
                  « {t.quote} »
                </blockquote>
                <figcaption className="font-sans text-[11px] uppercase tracking-[0.25em] text-or/80">
                  {t.attribution}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-noir py-[120px]">
        <div className="container-content">
          <header className="mb-12 flex flex-col gap-4">
            <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
              Questions
            </span>
            <h2 className="font-serif font-light text-ivoire text-[clamp(1.75rem,3.5vw,3rem)]">
              Les interrogations fréquentes
            </h2>
          </header>
          <ul className="flex flex-col divide-y divide-bronze/15 border-y border-bronze/15">
            {FAQ.map((item) => (
              <li key={item.q}>
                <details className="group">
                  <summary
                    data-cursor="hover"
                    className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-serif text-ivoire text-lg md:text-xl transition-colors duration-300 hover:text-or"
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="mt-3 inline-block h-px w-3 shrink-0 bg-ivoire transition-transform duration-300 group-open:rotate-90"
                    />
                  </summary>
                  <p className="pb-6 pr-10 font-serif text-ivoire/75 text-base leading-[1.75]">
                    {item.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-noir py-[120px]">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <p className="font-serif italic text-ivoire/75 text-2xl md:text-3xl">
            Une question ? Écrivez-nous.
          </p>
          <a
            href="mailto:contact@chams-adams.com"
            data-cursor="magnetic"
            className="btn-or"
          >
            contact@chams-adams.com
          </a>
        </div>
      </section>
    </>
  );
}
