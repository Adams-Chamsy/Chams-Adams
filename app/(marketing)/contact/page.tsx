import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ContactForm } from '@/components/forms/ContactForm';
import { TextReveal } from '@/components/animations/TextReveal';

export const metadata: Metadata = {
  title: 'Nous écrire',
  description:
    'Échangeons. Pour une demande sur-mesure, une question de presse, un partenariat ou simplement nous rencontrer.',
  openGraph: {
    title: 'Nous écrire — Chams Adams',
    description:
      'Échangeons. Pour une demande sur-mesure, une question de presse, un partenariat ou simplement nous rencontrer.',
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Contact' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Écrivez-nous
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.75rem,6vw,5rem)]"
          >
            Échangeons
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
            Une demande sur-mesure, une curiosité, une demande presse, un
            partenariat&nbsp;— ou simplement l&apos;envie de pousser la porte.
          </p>
        </div>
      </section>

      {/* Corps : 2 colonnes */}
      <section className="bg-noir pb-[160px]">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Colonne infos — sticky desktop */}
          <aside
            aria-label="Coordonnées de la Maison"
            className="flex flex-col gap-10 lg:col-span-5 lg:sticky lg:top-[120px] lg:h-fit"
          >
            <InfoBlock
              eyebrow="Showroom"
              title="Sur rendez-vous"
              body={
                <>
                  <p>{'{{ADRESSE DU SHOWROOM}}'}</p>
                  <p className="mt-1 italic text-ivoire/55">
                    Rendez-vous privés — du mardi au samedi.
                  </p>
                </>
              }
            />

            <InfoBlock
              eyebrow="Horaires"
              title="Nous recevons"
              body={
                <ul className="flex flex-col gap-1 font-serif text-ivoire/75">
                  <li>
                    <span className="text-ivoire/55">Mar. – Ven.</span>{' '}
                    11h&nbsp;— 19h
                  </li>
                  <li>
                    <span className="text-ivoire/55">Samedi</span>{' '}
                    10h&nbsp;— 18h
                  </li>
                  <li>
                    <span className="text-ivoire/55">Dim. — Lun.</span> Fermé
                  </li>
                </ul>
              }
            />

            <InfoBlock
              eyebrow="Par correspondance"
              title="Nous joindre"
              body={
                <ul className="flex flex-col gap-2 font-serif text-ivoire/80">
                  <li>
                    <a
                      href="mailto:contact@chams-adams.com"
                      data-cursor="hover"
                      className="border-b border-transparent text-or transition-colors duration-300 hover:border-or"
                    >
                      contact@chams-adams.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:presse@chams-adams.com"
                      data-cursor="hover"
                      className="border-b border-transparent text-ivoire/80 transition-colors duration-300 hover:text-or"
                    >
                      presse@chams-adams.com
                    </a>{' '}
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-ivoire/40">
                      — Presse
                    </span>
                  </li>
                  <li className="font-sans tracking-[0.1em] text-ivoire/70">
                    {'{{+33 … }}'}
                  </li>
                </ul>
              }
            />

            <InfoBlock
              eyebrow="Rendez-vous sur-mesure"
              title="Atelier Chams Adams"
              body={
                <p>
                  Pour une première esquisse, prenez directement rendez-vous
                  via notre page{' '}
                  <a
                    href="/sur-mesure"
                    data-cursor="hover"
                    className="text-or underline decoration-1 underline-offset-4 hover:text-ivoire"
                  >
                    sur-mesure
                  </a>
                  &nbsp;— formulaire dédié, réponse sous 48h.
                </p>
              }
            />
          </aside>

          {/* Colonne formulaire */}
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-serif text-2xl font-light text-ivoire md:text-3xl">
              Un mot&nbsp;?
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-bronze/20 pt-6">
      <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
        {eyebrow}
      </span>
      <h3 className="font-serif text-xl font-light text-ivoire md:text-2xl">
        {title}
      </h3>
      <div className="font-serif text-base leading-relaxed text-ivoire/75">
        {body}
      </div>
    </div>
  );
}
