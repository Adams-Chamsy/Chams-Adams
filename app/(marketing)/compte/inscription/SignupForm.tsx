'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { customerSignupAction, type AuthResult } from '../actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-60"
    >
      {pending ? 'Création…' : 'Créer mon accès'}
    </button>
  );
}

export function CustomerSignupForm() {
  const [state, formAction] = useFormState<AuthResult | null, FormData>(
    customerSignupAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Field label="Nom complet">
        <input
          name="full_name"
          type="text"
          autoComplete="name"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Adresse de courriel">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field
        label="Mot de passe"
        hint="8 caractères minimum — choisissez quelque chose dont vous vous souviendrez."
      >
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      {state && !state.ok && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton />

      <p className="font-serif italic text-sm text-ivoire/70">
        Vous avez déjà un compte ?{' '}
        <Link href="/compte/connexion" className="text-or hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
      {hint && (
        <span className="font-sans text-[10px] italic text-ivoire/50">
          {hint}
        </span>
      )}
    </label>
  );
}
