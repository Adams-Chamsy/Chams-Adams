'use client';

import { useEffect } from 'react';

type Props = {
  /** Lien Cal.com — ex: "chams-adams/sur-mesure". */
  calLink?: string;
};

/**
 * Embed inline Cal.com — chargement lazy via le script officiel.
 * À configurer dans .env.local : NEXT_PUBLIC_CAL_LINK="<user>/<event>".
 *
 * Si la variable est absente, on n'affiche rien (les visiteurs voient
 * uniquement le formulaire texte plus bas).
 */
export function CalBooking({ calLink }: Props) {
  const link = calLink ?? process.env.NEXT_PUBLIC_CAL_LINK;

  useEffect(() => {
    if (!link) return;
    if (typeof window === 'undefined') return;

    // Inject Cal.com embed script (idempotent)
    const w = window as unknown as {
      Cal?: ((..._args: unknown[]) => unknown) & {
        loaded?: boolean;
        ns?: Record<string, unknown>;
        q?: unknown[];
      };
    };

    if (!w.Cal) {
      const script = document.createElement('script');
      script.src = 'https://app.cal.com/embed/embed.js';
      script.async = true;
      script.onload = () => init(link);
      document.head.appendChild(script);
    } else {
      init(link);
    }

    function init(l: string) {
      const Cal = (window as unknown as { Cal?: (..._args: unknown[]) => unknown }).Cal;
      if (!Cal) return;
      Cal('init', 'sur-mesure', { origin: 'https://app.cal.com' });
      Cal('inline', {
        elementOrSelector: '#cal-embed-sur-mesure',
        calLink: l,
        config: { theme: 'dark', layout: 'month_view' },
      });
      Cal('ui', {
        theme: 'dark',
        cssVarsPerTheme: {
          dark: {
            'cal-bg': '#0A0A0A',
            'cal-bg-emphasis': '#1A1814',
            'cal-text': '#F5F0E6',
            'cal-text-emphasis': '#C9A961',
            'cal-brand': '#C9A961',
          },
        },
        hideEventTypeDetails: false,
      });
    }
  }, [link]);

  if (!link) {
    return (
      <p className="font-serif italic text-ivoire/60">
        La prise de rendez-vous en ligne est en cours d&apos;activation.
        Écrivez-nous à{' '}
        <a href="mailto:contact@chams-adams.com" className="text-or hover:underline">
          contact@chams-adams.com
        </a>{' '}
        pour fixer un entretien.
      </p>
    );
  }

  return (
    <div
      id="cal-embed-sur-mesure"
      className="min-h-[640px] w-full border border-bronze/20"
      aria-label="Calendrier de prise de rendez-vous"
    />
  );
}
