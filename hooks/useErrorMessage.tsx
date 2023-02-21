import { AxiosError } from 'axios';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorContext } from '../components/ErrorMessageProvider';
import { ErrorResponsDto } from '../types/types';

export const useErrorMessage = () => {
    const { setOpen, setMessage } = useContext(ErrorContext);
    const { t } = useTranslation();
    const { t: tB, i18n } = useTranslation('backend');

    const handleError = useCallback(
        (error: AxiosError<ErrorResponsDto>) => {
            if (error.response) {
                // Feil fra server (4xx eller 5xx)
                if (
                    i18n.exists(error.response.data?.errorCode, {
                        ns: 'backend',
                    })
                ) {
                    return tB(error.response.data?.errorCode);
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
        [t, tB, i18n],
    );

    const showError = useCallback(
        (error: AxiosError<ErrorResponsDto>) => {
            const formatedMessage = handleError(error);
            setMessage(formatedMessage);
            setOpen(true);
        },
        [setMessage, setOpen, handleError],
    );

    const customErrorMessage = useCallback(
        (message: string) => {
            setMessage(message);
            setOpen(true);
        },
        [setMessage, setOpen],
    );

    return { showError, customErrorMessage };
};
