import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { supportedLanguages, loadLanguage } from '@/i18n';

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'language.english',
  fr: 'language.french',
  rw: 'language.kinyarwanda',
  es: 'language.spanish',
  zh: 'language.chinese',
};

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [value, setValue] = useState(i18n.language || 'en');

  useEffect(() => {
    setValue(i18n.language);
  }, [i18n.language]);

  const languageOptions = useMemo(
    () =>
      supportedLanguages.map((lang) => ({
        value: lang,
        label: t(LANGUAGE_LABELS[lang] ?? `language.${lang}`),
      })),
    [t]
  );

  return (
    <div className="min-w-[6rem]">
      <label className="sr-only" htmlFor="language-switcher">
        {t('language.selectLabel')}
      </label>
      <Select
        value={value}
        onValueChange={(newValue) => {
          const lang = newValue as typeof supportedLanguages[number];
          setValue(lang);
          void loadLanguage(lang);
        }}
      >
        <SelectTrigger id="language-switcher" className="w-full text-sm">
          <SelectValue placeholder={t('language.selectLabel')} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
