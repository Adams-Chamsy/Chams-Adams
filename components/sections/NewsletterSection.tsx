'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { TextReveal } from '@/components/animations/TextReveal';
import { cn } from '@/lib/utils';

const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];
const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = 'idle' | 'invalid' | 'submitting' | 'success' | 'error';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    try {
      // TODO: brancher Resend côté API en étape ultérieure.
      await new Promise((r) => setTimeout(r, 700));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';

  return (
    <section
      aria-labelledby="newsletter-section-title"
      className="relative isolate overflow-hidden bg-noir py-[120px] md:py-[180px]"
    >
      {/* Lueur dorée centrale très subtile */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(201, 169, 97, 0.055) 0%, rgba(10, 10, 10, 0) 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
        className="container-content relative flex max-w-[640px] flex-col items-center gap-8 text-center"
      >
        {/* Signature Italianno */}
        <TextReveal
          as="p"
          splitBy="chars"
          stagger={0.04}
          duration={1}
          className="font-script leading-none text-or text-[80px] md:text-[96px]"
        >
          Correspondances
        </TextReveal>

        {/* Séparateur décoratif (animation scaleX) */}
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
          className="block h-px w-10 origin-center bg-or/60"
        />

        <TextReveal
          as="h2"
          splitBy="words"
          stagger={0.06}
          delay={0.3}
          duration={0.9}
          className="font-serif font-light text-balance leading-tight text-ivoire text-[clamp(2rem,4vw,3rem)]"
        >
          Recevoir les lettres de la Maison
        </TextReveal>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.7 }}
          className="max-w-prose font-serif italic text-ivoire/80 text-lg md:text-xl leading-relaxed"
        >
          Chaque mois, une lettre. Nos inspirations, nos coulisses, nos
          collections naissantes. Jamais plus — jamais moins.
        </motion.p>

        {/* Formulaire — remplacé par le message de succès si accepté */}
        {isSuccess ? (
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-4 max-w-prose font-serif italic text-or text-xl md:text-2xl"
          >
            Votre adresse a rejoint nos correspondances.
          </motion.p>
        ) : (
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 1 }}
            noValidate
            className="mt-4 flex w-full flex-col items-stretch gap-6"
            aria-describedby="newsletter-note"
          >
            <div className="flex flex-col gap-2 text-left">
              <label htmlFor="newsletter-section-email" className="sr-only">
                Votre adresse de courriel
              </label>
              <div
                className={cn(
                  'flex items-end gap-3 border-b pb-2 transition-colors duration-300',
                  status === 'invalid'
                    ? 'border-destructive'
                    : 'border-bronze/40 focus-within:border-or'
                )}
              >
                <input
                  id="newsletter-section-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'invalid' || status === 'error') setStatus('idle');
                  }}
                  placeholder="Votre adresse"
                  disabled={isSubmitting}
                  data-cursor="hover"
                  aria-invalid={status === 'invalid'}
                  aria-describedby={status === 'invalid' ? 'newsletter-error' : undefined}
                  className="min-w-0 flex-1 bg-transparent font-sans text-base text-ivoire placeholder:text-ivoire/30 focus:outline-none"
                />
              </div>
              {status === 'invalid' && (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="font-sans text-xs italic text-destructive"
                >
                  Cette adresse ne semble pas valide. Vérifiez un instant.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || email.length === 0}
              data-cursor="magnetic"
              className={cn('btn-or justify-center', isSubmitting && 'pointer-events-none')}
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 animate-spin rounded-full border border-ivoire/40 border-t-ivoire"
                  />
                  Envoi…
                </span>
              ) : (
                'Transmettre'
              )}
            </button>

            <p
              id="newsletter-note"
              className="font-sans text-xs italic tracking-wide text-ivoire/50"
            >
              Nous respectons votre silence.
            </p>
          </motion.form>
        )}

        <h2 id="newsletter-section-title" className="sr-only">
          Inscription aux correspondances de la Maison
        </h2>
      </motion.div>
    </section>
  );
}
