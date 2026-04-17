export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="container-content flex flex-col items-center gap-6 text-center">
        <span className="eyebrow">Maison de couture</span>

        <h1 className="font-serif font-light text-display-xl text-balance text-ivoire">
          Chams Adams
        </h1>

        <p className="signature">l&apos;héritage en lumière</p>

        <p className="max-w-prose text-body-lg text-ivoire/70 text-pretty">
          Kaftan subsaharien de luxe. Pièces sur-mesure et prêt-à-porter, héritier du grand
          boubou ouest-africain.
        </p>

        <div className="mt-6 h-px w-24 bg-or/60" aria-hidden />

        <p className="text-caption uppercase tracking-luxe text-or/80">
          Site en construction · Étape 1 · Fondations
        </p>
      </div>
    </main>
  );
}
