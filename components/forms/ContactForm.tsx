'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  contactSchema,
  CONTACT_TOPICS,
  CONTACT_TOPIC_LABELS,
  type ContactInput,
} from '@/lib/schemas/contact';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

/**
 * Formulaire de contact — RHF + Zod resolver, double validation.
 * Accessibilité : labels associés, aria-invalid, aria-describedby, aria-live
 * sur le statut. Respecte le ton éditorial (typo Cormorant + Inter).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      topic: 'information',
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus('submitting');
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
        transition={{ duration: 0.8, ease: EASE }}
        className="flex flex-col gap-5 border border-or/40 p-10 text-center"
      >
        <span aria-hidden className="mx-auto block h-px w-16 bg-or/80" />
        <h3 className="font-serif text-2xl text-ivoire">Message bien reçu</h3>
        <p className="font-serif italic leading-relaxed text-ivoire/75">
          Nous revenons vers vous sous 48&nbsp;heures ouvrées. D&apos;ici là,
          peut-être aurez-vous envie d&apos;un détour par nos collections.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-8"
      aria-describedby={serverError ? 'contact-server-error' : undefined}
    >
      {/* Nom */}
      <Field
        label="Votre nom"
        htmlFor="contact-name"
        error={errors.name?.message}
      >
        <input
          id="contact-name"
          type="text"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
          className={inputClasses(!!errors.name)}
        />
      </Field>

      {/* Email + téléphone */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field
          label="Courriel"
          htmlFor="contact-email"
          error={errors.email?.message}
        >
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email')}
            className={inputClasses(!!errors.email)}
          />
        </Field>

        <Field
          label="Téléphone (optionnel)"
          htmlFor="contact-phone"
          error={errors.phone?.message}
        >
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            {...register('phone')}
            className={inputClasses(!!errors.phone)}
          />
        </Field>
      </div>

      {/* Sujet */}
      <Field label="Sujet" htmlFor="contact-topic" error={errors.topic?.message}>
        <select
          id="contact-topic"
          aria-invalid={!!errors.topic}
          {...register('topic')}
          className={cn(inputClasses(!!errors.topic), 'bg-noir')}
        >
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t} className="bg-noir text-ivoire">
              {CONTACT_TOPIC_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      {/* Message */}
      <Field
        label="Votre message"
        htmlFor="contact-message"
        error={errors.message?.message}
        hint="20 caractères minimum. Décrivez votre demande en toute liberté."
      >
        <textarea
          id="contact-message"
          rows={6}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? 'contact-message-error' : 'contact-message-hint'
          }
          {...register('message')}
          className={cn(inputClasses(!!errors.message), 'resize-y')}
        />
      </Field>

      {/* Consentement */}
      <div className="flex items-start gap-3">
        <input
          id="contact-consent"
          type="checkbox"
          {...register('consent')}
          aria-invalid={!!errors.consent}
          className="mt-1 h-4 w-4 shrink-0 accent-or"
        />
        <label
          htmlFor="contact-consent"
          className="font-sans text-sm leading-relaxed text-ivoire/75"
        >
          J&apos;accepte que mes informations soient utilisées uniquement pour
          le traitement de ma demande, conformément à la{' '}
          <a
            href="/confidentialite"
            className="text-or underline decoration-1 underline-offset-4 hover:text-ivoire"
          >
            politique de confidentialité
          </a>
          .
        </label>
      </div>
      {errors.consent?.message && (
        <p className="-mt-4 font-sans text-xs italic text-destructive">
          {errors.consent.message}
        </p>
      )}

      {/* Erreur serveur */}
      {serverError && (
        <p
          id="contact-server-error"
          role="alert"
          aria-live="assertive"
          className="border border-destructive/50 px-4 py-3 font-sans text-sm text-destructive"
        >
          {serverError}
        </p>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={status === 'submitting' || !isValid}
        data-cursor="magnetic"
        className={cn(
          'btn-or mt-2 self-start disabled:cursor-not-allowed disabled:opacity-50',
          status === 'submitting' && 'animate-pulse'
        )}
      >
        {status === 'submitting' ? 'Transmission…' : 'Envoyer le message'}
      </button>
    </form>
  );
}

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function inputClasses(hasError: boolean) {
  return cn(
    'w-full border-b bg-transparent py-3 font-serif text-lg text-ivoire',
    'placeholder:italic placeholder:text-ivoire/40',
    'transition-colors duration-300 focus:outline-none',
    hasError
      ? 'border-destructive focus:border-destructive'
      : 'border-bronze/40 focus:border-or'
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-sans text-xs uppercase tracking-[0.25em] text-ivoire/70"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p
          id={`${htmlFor}-hint`}
          className="font-sans text-xs italic text-ivoire/50"
        >
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="font-sans text-xs italic text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
