import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page introuvable',
  description: 'La page que vous cherchez semble égarée.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex min-h-[calc(100svh-200px)] items-center justify-center bg-noir px-6 py-[120px]"
    >
      <div className="container-content flex flex-col items-center gap-8 text-center">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Erreur 404
        </span>

        <h1
          id="not-found-title"
          className="font-serif font-light leading-[0.95] text-ivoire text-[clamp(4rem,12vw,10rem)]"
        >
          Égarée
        </h1>

        <p className="max-w-[52ch] font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
          La page que vous cherchez semble s&apos;être perdue en chemin —
          comme un fil doré qui aurait quitté la trame.
        </p>

        <div
          aria-hidden
          className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-or to-transparent"
        />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <Link href="/" data-cursor="magnetic" className="btn-or">
            Retour à l&apos;accueil
          </Link>
          <Link href="/collections" data-cursor="hover" className="btn-ghost">
            Découvrir les collections
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
