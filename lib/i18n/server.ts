import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, translate, type Locale } from './messages';

export const LOCALE_COOKIE = 'chams-locale';

/**
 * Lecture de la locale depuis les cookies côté serveur. Fallback FR.
 * À appeler uniquement dans Server Components / layouts.
 */
export function getLocale(): Locale {
  const raw = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function getT(locale?: Locale) {
  const loc = locale ?? getLocale();
  return (keyPath: string) => translate(loc, keyPath);
}
