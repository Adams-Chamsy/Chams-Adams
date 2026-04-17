import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* 1 — Héros de test : titre éditorial centré sur plein écran noir */}
      <section className="relative flex h-screen items-center justify-center bg-noir px-6">
        <div className="container-content flex flex-col items-center gap-8 text-center">
          <span className="eyebrow" data-cursor="hover">
            Maison de couture
          </span>
          <h1 className="font-serif font-light text-display-xl text-balance text-ivoire">
            Le kaftan comme héritage
          </h1>
          <p className="max-w-prose text-body-lg text-ivoire/60 text-pretty">
            Chaque fil raconte un matin. Chaque broderie, un serment.
          </p>
          <div aria-hidden className="mt-4 h-px w-24 bg-or/60" />
          <Link
            href="/collections"
            data-cursor="magnetic"
            className="btn-or mt-4"
          >
            Entrer dans l&apos;univers
          </Link>
        </div>

        {/* Indicateur de scroll discret */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <span className="font-sans text-eyebrow uppercase text-ivoire/40">
            Défiler
          </span>
        </div>
      </section>

      {/* 2 — Section indigo très sombre : test du passage transparent → opaque du Header */}
      <section className="flex h-screen items-center justify-center bg-indigo-900 px-6">
        <div className="container-content flex flex-col items-center gap-6 text-center">
          <span className="eyebrow">Manifeste</span>
          <h2 className="font-serif font-light text-display-lg text-balance text-ivoire">
            La grâce se transmet, elle ne s&apos;achète pas.
          </h2>
          <p className="max-w-prose text-body-lg text-ivoire/60 text-pretty">
            De Dakar à Paris, nos ateliers façonnent des œuvres destinées à
            traverser les générations.
          </p>
        </div>
      </section>

      {/* 3 — Retour au noir : test CustomCursor sur multiples cibles */}
      <section className="flex h-screen items-center justify-center bg-noir px-6">
        <div className="container-content grid grid-cols-1 gap-12 text-center md:grid-cols-3">
          <TestBlock label="Collections" href="/collections" />
          <TestBlock label="Sur-mesure" href="/sur-mesure" magnetic />
          <TestBlock label="Savoir-faire" href="/savoir-faire" />
        </div>
      </section>

      {/* 4 — Indigo profond : respiration finale avant Footer */}
      <section className="flex h-screen items-center justify-center bg-indigo-900 px-6">
        <div className="container-content flex flex-col items-center gap-8 text-center">
          <p className="signature">l&apos;héritage en lumière</p>
          <h2 className="font-serif font-light italic text-display-md text-balance text-ivoire/80">
            Rien ne presse. La noblesse prend le temps.
          </h2>
        </div>
      </section>
    </>
  );
}

function TestBlock({
  label,
  href,
  magnetic,
}: {
  label: string;
  href: string;
  magnetic?: boolean;
}) {
  return (
    <Link
      href={href}
      data-cursor={magnetic ? 'magnetic' : 'hover'}
      className="group flex flex-col items-center gap-3 p-8 transition-all duration-500 ease-luxe hover:-translate-y-1"
    >
      <span className="font-serif text-display-sm font-light text-ivoire transition-colors duration-500 group-hover:text-or">
        {label}
      </span>
      <span className="h-px w-0 bg-or transition-all duration-500 ease-out-expo group-hover:w-16" />
    </Link>
  );
}
