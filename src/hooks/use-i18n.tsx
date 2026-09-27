import { type SupportedLanguage, type TranslationKey } from '@/constants/i18n';
import { useI18nStore } from '@/store/i18n-store';
import { type ReactNode } from 'react';

export function I18nProvider({
  children,
  defaultLanguage,
}: {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}) {
  return <>{children}</>;
}

/**
 * Hook to access active language, language setter, and translate function `t(key)`.
 * Backed by Zustand store.
 */
export function useI18n() {
  const language = useI18nStore((state) => state.language);
  const setLanguage = useI18nStore((state) => state.setLanguage);
  const t = useI18nStore((state) => state.t);

  return { language, setLanguage, t };
}
