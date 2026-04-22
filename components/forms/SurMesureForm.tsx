'use client';

import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TurnstileCaptcha } from '@/components/forms/TurnstileCaptcha';
import {
  surMesureSchema,
  OCCASIONS,
  OCCASION_LABELS,
  BUDGETS,
  BUDGET_LABELS,
  CONTACT_MODES,
  CONTACT_MODE_LABELS,
  CRENEAUX,
  CRENEAU_LABELS,
  COUNTRIES,
  type SurMesureInput,
} from '@/lib/schemas/surMesure';

type Status = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Formulaire de demande sur-mesure.
 * - Validation client via react-hook-form + zodResolver
 * - Même schéma utilisé côté serveur (double validation)
 * - Accessibilité : labels associés, aria-invalid, aria-describedby, aria-live
 */
export function SurMesureForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRequired = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const onCaptchaToken = useCallback(
    (token: string | null) => setCaptchaToken(token),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<SurMesureInput>({
    resolver: zodResolver(surMesureSchema),
    mode: 'onBlur',
    defaultValues: {
      contactMode: 'email',
      creneau: 'peu-importe',
      budget: 'a-discuter',
    },
  });

  const onSubmit = async (data: SurMesureInput) => {
    if (captchaRequired && !captchaToken) {
      setStatus('error');
      setServerError('Merci de valider le captcha pour continuer.');
      return;
    }
    setStatus('submitting');
    setServerError(null);
    try {
      const res = await fetch('/api/sur-mesure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, captchaToken }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: 'Erreur inconnue.' }));
        throw new Error(error ?? 'La transmission a échoué.');
      }
      setStatus('success');
      reset();
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="flex flex-col gap-5 border border-or/40 p-10 text-center"
      >
        <span aria-hidden className="mx-auto block h-px w-16 bg-or/80" />
        <p className="font-serif text-2xl text-ivoire md:text-3xl">
          Votre demande nous est parvenue.
        </p>
        <p className="font-serif italic text-ivoire/70 text-lg">
          Nous vous répondons personnellement sous 48 heures.
        </p>
        <p className="mt-2 font-sans text-xs uppercase tracking-[0.25em] text-or/80">
          — La Maison Chams Adams —
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-12">
      {/* Informations personnelles */}
      <fieldset className="flex flex-col gap-6">
        <legend className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
          Informations personnelles
        </legend>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Prénom" error={errors.firstName?.message} required>
            <input type="text" {...register('firstName')} {...fieldInput('firstName', !!errors.firstName)} />
          </Field>
          <Field label="Nom" error={errors.lastName?.message} required>
            <input type="text" {...register('lastName')} {...fieldInput('lastName', !!errors.lastName)} />
          </Field>
        </div>
        <Field label="Adresse de courriel" error={errors.email?.message} required>
          <input type="email" autoComplete="email" {...register('email')} {...fieldInput('email', !!errors.email)} />
        </Field>
        <Field label="Téléphone" hint="Optionnel" error={errors.phone?.message}>
          <input type="tel" autoComplete="tel" {...register('phone')} {...fieldInput('phone', !!errors.phone)} />
        </Field>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Pays de résidence" error={errors.country?.message} required>
            <select {...register('country')} {...fieldInput('country', !!errors.country)} defaultValue="">
              <option value="" disabled>
                Sélectionner…
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-noir text-ivoire">
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ville" error={errors.city?.message} required>
            <input type="text" {...register('city')} {...fieldInput('city', !!errors.city)} />
          </Field>
        </div>
      </fieldset>

      {/* Votre projet */}
      <fieldset className="flex flex-col gap-6">
        <legend className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
          Votre projet
        </legend>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Occasion" error={errors.occasion?.message} required>
            <select {...register('occasion')} {...fieldInput('occasion', !!errors.occasion)} defaultValue="">
              <option value="" disabled>
                Sélectionner…
              </option>
              {OCCASIONS.map((o) => (
                <option key={o} value={o} className="bg-noir text-ivoire">
                  {OCCASION_LABELS[o]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Date de l’événement" hint="Optionnel" error={errors.eventDate?.message}>
            <input type="date" {...register('eventDate')} {...fieldInput('eventDate', !!errors.eventDate)} />
          </Field>
        </div>
        <Field label="Votre vision" error={errors.vision?.message} required>
          <textarea
            rows={5}
            placeholder="Décrivez votre idée, les couleurs, l'ambiance, les inspirations…"
            {...register('vision')}
            {...fieldInput('vision', !!errors.vision)}
          />
        </Field>
        <Field label="Budget indicatif" error={errors.budget?.message} required>
          <select {...register('budget')} {...fieldInput('budget', !!errors.budget)}>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-noir text-ivoire">
                {BUDGET_LABELS[b]}
              </option>
            ))}
          </select>
        </Field>
      </fieldset>

      {/* Préférences */}
      <fieldset className="flex flex-col gap-6">
        <legend className="font-sans text-[11px] uppercase tracking-[0.3em] text-or">
          Préférences de contact
        </legend>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Mode de contact préféré" error={errors.contactMode?.message} required>
            <select {...register('contactMode')} {...fieldInput('contactMode', !!errors.contactMode)}>
              {CONTACT_MODES.map((m) => (
                <option key={m} value={m} className="bg-noir text-ivoire">
                  {CONTACT_MODE_LABELS[m]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Créneau préféré" error={errors.creneau?.message} required>
            <select {...register('creneau')} {...fieldInput('creneau', !!errors.creneau)}>
              {CRENEAUX.map((c) => (
                <option key={c} value={c} className="bg-noir text-ivoire">
                  {CRENEAU_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* Consentement */}
      <label className="flex cursor-pointer items-start gap-3" data-cursor="hover">
        <input
          type="checkbox"
          {...register('consent')}
          aria-describedby={errors.consent ? 'consent-error' : undefined}
          className="mt-1 h-4 w-4 accent-or"
        />
        <span className="font-sans text-sm leading-relaxed text-ivoire/75">
          J&apos;accepte que mes données soient utilisées dans le cadre de ma demande.
          Elles ne seront pas partagées.
        </span>
      </label>
      {errors.consent && (
        <p id="consent-error" className="-mt-6 font-sans text-xs italic text-destructive">
          {errors.consent.message}
        </p>
      )}

      {/* Captcha (si configuré) */}
      <TurnstileCaptcha onToken={onCaptchaToken} />

      {/* Erreur serveur globale */}
      {status === 'error' && serverError && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting' || (captchaRequired && !captchaToken)}
        data-cursor="magnetic"
        className={cn(
          'inline-flex w-full items-center justify-center border border-or bg-or px-8 py-4',
          'font-sans text-xs uppercase tracking-[0.2em] text-noir',
          'transition-all duration-500 ease-out-expo hover:shadow-halo-or-strong',
          status === 'submitting' && 'pointer-events-none opacity-70',
          !isValid && 'opacity-90'
        )}
      >
        {status === 'submitting' ? (
          <span className="inline-flex items-center gap-3">
            <span
              aria-hidden
              className="inline-block h-3 w-3 animate-spin rounded-full border border-noir/40 border-t-noir"
            />
            Transmission en cours…
          </span>
        ) : (
          'Transmettre ma demande'
        )}
      </button>
    </form>
  );
}

// --------------------------------------------------------------------
// Helpers visuels
// --------------------------------------------------------------------

function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex items-baseline justify-between gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-ivoire/70">
        <span>
          {label}
          {required && <span className="ml-1 text-or">*</span>}
        </span>
        {hint && <span className="font-serif text-[11px] italic normal-case text-ivoire/40">{hint}</span>}
      </span>
      {children}
      {error && (
        <span className="font-sans text-xs italic text-destructive" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function fieldInput(name: string, hasError: boolean) {
  return {
    id: `field-${name}`,
    'aria-invalid': hasError,
    'aria-describedby': hasError ? `${name}-error` : undefined,
    'data-cursor': 'hover' as const,
    className: cn(
      'w-full border-b bg-transparent py-2 font-sans text-base text-ivoire placeholder:text-ivoire/30 focus:outline-none',
      hasError ? 'border-destructive' : 'border-bronze/40 focus:border-or'
    ),
  };
}
