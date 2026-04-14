import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import rw from './locales/rw.json';
import es from './locales/es.json';
import zh from './locales/zh.json';

export const supportedLanguages = ['en', 'fr', 'rw', 'es', 'zh'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export const languageStorageKey = 'portfolio-language';

const fallbackLanguage: SupportedLanguage = 'en';

const normalizeBrowserLanguage = (language: string | null): SupportedLanguage => {
  if (!language) return fallbackLanguage;
  const normalized = language.toLowerCase().split('-')[0];
  return supportedLanguages.includes(normalized as SupportedLanguage)
    ? (normalized as SupportedLanguage)
    : fallbackLanguage;
};

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(languageStorageKey) as SupportedLanguage | null;
    if (stored && supportedLanguages.includes(stored)) {
      return stored;
    }
    return normalizeBrowserLanguage(navigator.language ?? null);
  }
  return fallbackLanguage;
};

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  rw: { translation: rw },
  es: { translation: es },
  zh: { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: fallbackLanguage,
  supportedLngs: [...supportedLanguages],
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export const loadLanguage = async (lng: SupportedLanguage) => {
  if (!supportedLanguages.includes(lng)) return;
  if (!i18n.hasResourceBundle(lng, 'translation')) {
    const locale = await import(`./locales/${lng}.json`);
    i18n.addResourceBundle(lng, 'translation', locale.default || locale, true, true);
  }
  await i18n.changeLanguage(lng);
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(languageStorageKey, lng);
  }
};

export default i18n;
