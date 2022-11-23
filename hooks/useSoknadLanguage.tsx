import { useEffect } from 'react';
import { setParams } from '@navikt/nav-dekoratoren-moduler';
import { useTranslation } from 'react-i18next';

export const useSoknadLanguage = (lng: string) => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const changeLang = (lng) => {
            // nb / nn / en / se / pl støttede språk per 2022 for dekoratoren

            if (lng === 'no' || lng === 'nb') {
                i18n.changeLanguage('nb');
                setParams({
                    language: 'nb',
                });
                return;
            }
            if (lng === 'nn') {
                i18n.changeLanguage('nn');
                setParams({
                    language: 'nn',
                });
                return;
            }
            if (lng === 'en') {
                i18n.changeLanguage('en');
                setParams({
                    language: 'en',
                });
                return;
            }

            if (lng === 'se') {
                i18n.changeLanguage('se');
                setParams({
                    language: 'se',
                });
                return;
            }

            if (lng === 'pl') {
                i18n.changeLanguage('pl');
                setParams({
                    language: 'pl',
                });
                return;
            }

            i18n.changeLanguage('en');
        };

        changeLang(lng);
        document.documentElement.lang = i18n.language;
    }, [lng, i18n]);
};
