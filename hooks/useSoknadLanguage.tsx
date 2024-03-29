import { DecoratorLocale, setParams } from '@navikt/nav-dekoratoren-moduler';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// nb / nn / en / se / pl støttede språk per 2022 for dekoratoren
const supportedLanguageCodes: Record<string, DecoratorLocale> = {
  no: 'nb',
  nb: 'nb',
  nn: 'nn',
  en: 'en',
  se: 'se',
  pl: 'pl',
};

const FALLBACK_LANGUAGE = 'en';

export const useSoknadLanguage = () => {
  const { i18n } = useTranslation();

  const changeLang = useCallback(
    (lng: string) => {
      const validatedLanguage = supportedLanguageCodes[lng.toLowerCase()] || FALLBACK_LANGUAGE;
      i18n.changeLanguage(validatedLanguage);
      setParams({
        language: validatedLanguage,
      });
      document.documentElement.lang = i18n.language;
    },
    [i18n],
  );

  return { changeLang };
};
