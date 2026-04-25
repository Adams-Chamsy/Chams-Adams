import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { TextReveal } from '@/components/animations/TextReveal';
import { ReturnRequestForm } from '@/components/forms/ReturnRequestForm';

export const metadata: Metadata = {
  title: 'Demande de retour',
  description:
    'Initiez une demande de retour ou d’échange. Notre service vous répond sous 48 h ouvrées.',
};

export default function ReturnRequestPage() {
  return (
    <>
      <section className="bg-noir pt-[140px] pb-[60px] md:pt-[180px]">
        <div className="container-content flex flex-col gap-6">
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Livraison & retours', href: '/livraison-retours' },
              { label: 'Demande de retour' },
            ]}
          />
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
            Service client
          </span>
          <TextReveal
            as="h1"
            splitBy="words"
            stagger={0.06}
            duration={0.9}
            className="font-serif font-light text-balance leading-[1.05] text-ivoire text-[clamp(2.5rem,5.5vw,4.5rem)]"
          >
            Initier un retour
          </TextReveal>
          <p className="max-w-prose font-serif italic leading-relaxed text-ivoire/75 text-lg md:text-xl">
            Vous disposez de 30 jours après réception pour nous renvoyer une
            pièce non portée, dans son emballage d&apos;origine. Renseignez ce
            formulaire&nbsp;— nous vous répondrons sous 48 h avec
            l&apos;étiquette de renvoi prépayée.
          </p>
        </div>
      </section>

      <section className="bg-noir pb-[160px]">
        <div className="container-content grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <ReturnRequestForm />
          </div>
          <aside className="lg:col-span-5">
            <div className="border border-bronze/30 p-8">
              <h2 className="font-serif text-2xl font-light text-ivoire">
                Conditions
              </h2>
              <ul className="mt-5 flex flex-col gap-3 font-serif italic text-ivoire/70">
                <li>· Pièce non portée, étiquettes intactes</li>
                <li>· Emballage d&apos;origine</li>
                <li>· 30 jours après réception</li>
                <li>· Sur-mesure et personnalisations exclus</li>
                <li>· Remboursement sous 7 jours après réception</li>
              </ul>
              <p className="mt-6 font-sans text-xs italic text-ivoire/50">
                Pour toute question préalable, écrivez à{' '}
                <a
                  href="mailto:contact@chams-adams.com"
                  className="text-or hover:underline"
                >
                  contact@chams-adams.com
                </a>
                .
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
