import { I18N_TRANSLATIONS, type SupportedLanguage, type TranslationKey } from '@/constants/i18n';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => I18N_TRANSLATIONS.en[key] ?? key,
});

export function I18nProvider({
  children,
  defaultLanguage = 'en',
}: {
  children: ReactNode;
  defaultLanguage?: SupportedLanguage;
}) {
  const [language, setLanguage] = useState<SupportedLanguage>(defaultLanguage);

  const t = (key: TranslationKey): string => {
    return I18N_TRANSLATIONS[language]?.[key] ?? I18N_TRANSLATIONS.en[key] ?? key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access active language, language setter, and translate function `t(key)`.
 */
export function useI18n() {
  return useContext(I18nContext);
}

