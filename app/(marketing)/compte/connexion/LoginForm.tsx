'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { customerLoginAction, type AuthResult } from '../actions';

export function CustomerLoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<AuthResult | null, FormData>(
    customerLoginAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {next && <input type="hidden" name="next" value={next} />}

      <Field label="Adresse de courriel">
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      <Field label="Mot de passe">
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border-b border-bronze/40 bg-transparent py-2 font-serif text-ivoire focus:border-or focus:outline-none"
        />
      </Field>

      {state && !state.ok && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir hover:shadow-halo-or-strong disabled:opacity-60"
      >
        {pending ? 'Connexion…' : 'Se connecter'}
      </button>

      <p className="font-serif italic text-sm text-ivoire/70">
        Pas encore de compte ?{' '}
        <Link
          href="/compte/inscription"
          className="text-or hover:underline"
        >
          Créer un accès
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
        {label}
      </span>
      {children}
    </label>
  );
}
