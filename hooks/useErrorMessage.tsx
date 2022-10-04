import { AxiosError } from 'axios';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorContext } from '../components/ErrorMessageProvider';

export const useErrorMessage = () => {
    const { open, setOpen, message, setMessage } =
        useContext(ErrorContext);
    const { t, i18n } = useTranslation();

    const handleError = useCallback(
        (error: AxiosError) => {
            if (error.response) {
                // Feil fra server (4xx eller 5xx)
                if (
                    i18n.exists(error.response.data?.errorCode, {
                        ns: 'backend',
                    })
                ) {
                    return t(error.response.data?.errorCode, {
                        ns: 'backend',
                    });
                }
                return t('feil.fraBackend');
            } else if (error.request) {
                // Ingen respons. Bruker har f.eks mistet internett
                return t('feil.medTilkobling');
            } else {
                // Feil i klient (js-feil)
                return t('feil.ukjent');
            }
        },
        [t, i18n],
    );

    const showError = useCallback(
        (error: AxiosError) => {
            const formatedMessage = handleError(error);
            setMessage(formatedMessage);
            setOpen(true);
        },
        [setMessage, setOpen, handleError],
    );

    return { showError };
};
