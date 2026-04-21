'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Boundary d'erreur globale — Next.js App Router.
 * Doit être un Client Component. Reçoit `error` et `reset` en props.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook d'intégration Sentry / Datadog à brancher ici le jour venu.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[App error boundary]', error);
    }
  }, [error]);

  return (
    <section
      aria-labelledby="error-title"
      className="relative flex min-h-[calc(100svh-200px)] items-center justify-center bg-noir px-6 py-[120px]"
    >
      <div className="container-content flex flex-col items-center gap-8 text-center">
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-or">
          Incident passager
        </span>

        <h1
          id="error-title"
          className="font-serif font-light leading-[0.95] text-ivoire text-[clamp(3rem,9vw,7rem)]"
        >
          Un fil s&apos;est rompu
        </h1>

        <p className="max-w-[54ch] font-serif italic leading-relaxed text-ivoire/75 text-xl md:text-2xl">
          Un incident inattendu nous empêche d&apos;afficher cette page. Nos
          équipes ont été averties&nbsp;; vous pouvez réessayer d&apos;un
          geste.
        </p>

        {error.digest && (
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-ivoire/40">
            Référence technique — {error.digest}
          </p>
        )}

        <div
          aria-hidden
          className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-or to-transparent"
        />

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <button
            type="button"
            onClick={() => reset()}
            data-cursor="magnetic"
            className="btn-or"
          >
            Réessayer
          </button>
          <Link href="/" data-cursor="hover" className="btn-ghost">
            Retour à l&apos;accueil
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
