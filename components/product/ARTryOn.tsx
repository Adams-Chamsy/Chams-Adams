'use client';

import { useEffect, useState } from 'react';
import { Eye, X } from 'lucide-react';

type Props = {
  productName: string;
  glbUrl: string;
  usdzUrl?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          ar?: boolean;
          'ar-modes'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          'shadow-intensity'?: string;
          alt?: string;
          poster?: string;
          loading?: 'lazy' | 'eager';
          reveal?: 'auto' | 'manual';
        },
        HTMLElement
      >;
    }
  }
}

/**
 * Bouton "Essayage" — ouvre une modale avec model-viewer.
 * Sur Android, le bouton AR de model-viewer ouvre Scene Viewer ;
 * sur iOS, il bascule vers Quick Look avec le .usdz si fourni.
 *
 * Le script model-viewer est chargé à la demande (premier clic).
 */
export function ARTryOn({ productName, glbUrl, usdzUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!open || scriptLoaded) return;
    if (typeof window === 'undefined') return;

    // Si déjà défini dans le custom elements registry → no-op
    if (customElements.get('model-viewer')) {
      setScriptLoaded(true);
      return;
    }

    const s = document.createElement('script');
    s.type = 'module';
    s.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    s.onload = () => setScriptLoaded(true);
    document.head.appendChild(s);
  }, [open, scriptLoaded]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border border-or/60 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.25em] text-or transition-colors duration-300 hover:bg-or/10"
      >
        <Eye className="h-4 w-4" aria-hidden />
        Essayer en 3D · AR
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Essayage 3D de ${productName}`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-noir/95 p-4"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center text-ivoire hover:text-or"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-4">
            {scriptLoaded ? (
              <model-viewer
                src={glbUrl}
                ios-src={usdzUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                alt={`Modèle 3D de ${productName}`}
                loading="eager"
                style={{
                  width: '100%',
                  height: '70vh',
                  backgroundColor: '#0A0A0A',
                }}
              />
            ) : (
              <p className="font-serif italic text-ivoire/60">
                Chargement du visualiseur 3D…
              </p>
            )}
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/60">
              Faites pivoter ·{' '}
              <span className="text-or">
                Bouton AR pour l&apos;essayage immersif
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
