import { create } from 'zustand';
import { I18N_TRANSLATIONS, type SupportedLanguage, type TranslationKey } from '@/constants/i18n';

interface I18nState {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
  t: (key) => {
    const { language } = get();
    return I18N_TRANSLATIONS[language]?.[key] ?? I18N_TRANSLATIONS.en[key] ?? key;
  },
}));
