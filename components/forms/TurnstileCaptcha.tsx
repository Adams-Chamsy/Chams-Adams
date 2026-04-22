'use client';

import { useEffect, useRef } from 'react';

type TurnstileOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  appearance?: 'always' | 'execute' | 'interaction-only';
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: string | HTMLElement, opts: TurnstileOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId?: string) => void;
    };
    __turnstileOnLoad?: () => void;
  }
}

type Props = {
  onToken: (token: string | null) => void;
  className?: string;
};

/**
 * Widget Cloudflare Turnstile — anti-spam invisible/visible.
 *
 * - Si `NEXT_PUBLIC_TURNSTILE_SITE_KEY` est absent, le composant ne rend rien
 *   (dev mode : les formulaires passent sans captcha).
 * - Thème `dark` pour s'intégrer au fond noir.
 * - Zéro dépendance npm : le script officiel Cloudflare est chargé à la
 *   volée et nettoyé au démontage.
 */
export function TurnstileCaptcha({ onToken, className }: Props) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    const mountWidget = () => {
      if (!window.turnstile || !containerRef.current) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token: string) => onToken(token),
        'error-callback': () => onToken(null),
        'expired-callback': () => onToken(null),
      });
    };

    if (window.turnstile) {
      mountWidget();
    } else {
      window.__turnstileOnLoad = mountWidget;
      if (!document.getElementById('cf-turnstile-script')) {
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src =
          'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__turnstileOnLoad';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* noop — widget déjà démonté */
        }
      }
    };
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={containerRef} className={className} aria-hidden="false" />;
}
