'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction, type LoginResult } from './actions';

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useFormState<LoginResult | null, FormData>(
    loginAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next ?? '/admin'} />

      <label className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Courriel
        </span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire placeholder:italic placeholder:text-ivoire/30 focus:border-or focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-ivoire/70">
          Mot de passe
        </span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="border-b border-bronze/40 bg-transparent py-2 font-serif text-lg text-ivoire focus:border-or focus:outline-none"
        />
      </label>

      {state && !state.ok && (
        <p role="alert" className="font-sans text-xs italic text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center border border-or bg-or px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-noir transition-all duration-500 hover:shadow-halo-or-strong disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Connexion…' : 'Se connecter'}
    </button>
  );
}
