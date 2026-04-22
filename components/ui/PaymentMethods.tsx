import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  /** Affiche une seconde rangée avec Wave / Orange Money / MTN Mobile Money. */
  showMobileMoney?: boolean;
};

/**
 * Rangée des moyens de paiement acceptés — SVG / badges silhouettes monochromes
 * (ivoire sur fond noir). Préféré aux logos officiels colorés qui cassent
 * l'esthétique luxe sombre.
 *
 * Utilisé dans le CartDrawer footer et sur la page /checkout.
 * `showMobileMoney` déploie une ligne secondaire (Wave / OM / MTN) avec
 * badge "bientôt" tant que les comptes marchands ne sont pas ouverts.
 */
export function PaymentMethods({ className, showMobileMoney }: Props) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div
        aria-label="Moyens de paiement acceptés : Visa, Mastercard, American Express, Apple Pay, Stripe"
        className="inline-flex flex-wrap items-center gap-4 text-ivoire/50"
      >
        <VisaMark />
        <MastercardMark />
        <AmexMark />
        <ApplePayMark />
        <StripeMark />
      </div>

      {showMobileMoney && (
        <div className="flex flex-col gap-2">
          <div
            aria-label="Paiements mobiles en préparation : Wave, Orange Money, MTN Mobile Money"
            className="inline-flex flex-wrap items-center gap-4 text-ivoire/40"
          >
            <WaveMark />
            <OrangeMoneyMark />
            <MtnMoneyMark />
            <span className="inline-flex items-center border border-or/40 px-2 py-1 font-sans text-[9px] uppercase tracking-[0.25em] text-or/80">
              Bientôt
            </span>
          </div>
          <p className="font-sans text-[10px] italic leading-relaxed text-ivoire/45">
            Paiement mobile pour l&apos;Afrique de l&apos;Ouest — en cours
            d&apos;activation.
          </p>
        </div>
      )}
    </div>
  );
}

const BADGE_CLASS =
  'inline-flex h-6 items-center rounded-[3px] border border-current px-2 font-sans text-[9px] font-medium uppercase tracking-[0.25em] leading-none';

function VisaMark() {
  return (
    <span aria-hidden className={BADGE_CLASS}>
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          letterSpacing: '0.08em',
        }}
      >
        Visa
      </span>
    </span>
  );
}

function MastercardMark() {
  return (
    <span aria-hidden className="inline-flex items-center gap-[-4px]">
      <span className="relative inline-block h-[18px] w-[18px] rounded-full border border-current" />
      <span className="relative -ml-2 inline-block h-[18px] w-[18px] rounded-full border border-current" />
    </span>
  );
}

function AmexMark() {
  return (
    <span aria-hidden className={BADGE_CLASS}>
      Amex
    </span>
  );
}

function ApplePayMark() {
  return (
    <span aria-hidden className={cn(BADGE_CLASS, 'gap-1 pl-1.5 pr-2')}>
      <svg
        viewBox="0 0 14 16"
        className="h-[11px] w-[11px]"
        fill="currentColor"
        aria-hidden
      >
        <path d="M11.37 8.33c-.02-2.1 1.72-3.1 1.8-3.15-.98-1.43-2.5-1.63-3.05-1.65-1.3-.13-2.53.76-3.19.76-.67 0-1.68-.74-2.76-.72-1.42.02-2.73.83-3.46 2.1-1.48 2.56-.38 6.35 1.06 8.43.7 1.02 1.54 2.16 2.64 2.12 1.06-.04 1.46-.69 2.74-.69 1.27 0 1.64.69 2.76.66 1.14-.02 1.86-1.03 2.56-2.05.81-1.17 1.14-2.32 1.16-2.38-.03-.01-2.23-.86-2.26-3.43zM9.4 2.04c.58-.7.97-1.68.86-2.65-.83.03-1.84.56-2.44 1.26-.54.62-1.01 1.61-.88 2.57.92.07 1.87-.47 2.46-1.18z" />
      </svg>
      <span>Pay</span>
    </span>
  );
}

function StripeMark() {
  return (
    <span aria-hidden className={cn(BADGE_CLASS, 'tracking-[0.2em]')}>
      Stripe
    </span>
  );
}

// --------------------------------------------------------------------
// Mobile Money — Afrique de l'Ouest
// --------------------------------------------------------------------

function WaveMark() {
  return (
    <span
      aria-hidden
      className={cn(BADGE_CLASS, 'gap-1 pr-2.5')}
    >
      <svg
        viewBox="0 0 14 14"
        className="h-[11px] w-[11px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M1 7 Q 3.5 3, 6 7 T 11 7 T 13 7" />
      </svg>
      <span>Wave</span>
    </span>
  );
}

function OrangeMoneyMark() {
  return (
    <span aria-hidden className={BADGE_CLASS}>
      OM
    </span>
  );
}

function MtnMoneyMark() {
  return (
    <span aria-hidden className={BADGE_CLASS}>
      MTN
    </span>
  );
}
