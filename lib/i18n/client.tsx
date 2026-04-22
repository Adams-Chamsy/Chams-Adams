'use client';

import { createContext, useContext, useMemo } from 'react';
import { translate, type Locale } from './messages';

type LocaleContextValue = {
  locale: Locale;
  t: (keyPath: string) => string;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'fr',
  t: (k) => k,
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      t: (keyPath: string) => translate(locale, keyPath),
    }),
    [locale]
  );
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useT() {
  return useContext(LocaleContext).t;
}
