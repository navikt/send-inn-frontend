import { AxiosError } from 'axios';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ErrorContext,
    ErrorMessageType,
} from '../components/ErrorMessageProvider';
import { ErrorResponsDto } from '../types/types';

export const useErrorMessage = () => {
    const { setOpen, setError } = useContext(ErrorContext);
    const { t } = useTranslation();
    const { t: tB, i18n } = useTranslation('backend');

    const handleError = useCallback(
        (error: AxiosError<ErrorResponsDto>): ErrorMessageType => {
            if (error.response) {
                // Feil fra server (4xx eller 5xx)
                const errorCode = error.response.data?.errorCode;

                // i18next godtar any, men ikke en generell verdi
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const messageKey = `${errorCode}.message` as any;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const titleKey = `${errorCode}.title` as any;

                if (
                    i18n.exists(messageKey, {
                        ns: 'backend',
                    })
                ) {
                    return {
                        message: tB(messageKey),
                        title: i18n.exists(titleKey, {
                            ns: 'backend',
                        })
                            ? tB(titleKey)
                            : null,
                    };
                }
                return { message: t('feil.fraBackend') };
            } else if (error.request) {
                // Ingen respons. Bruker har f.eks mistet internett
                return { message: t('feil.medTilkobling') };
            } else {
                // Feil i klient (js-feil)
                return { message: t('feil.ukjent') };
            }
        },
        [t, tB, i18n],
    );

    const showError = useCallback(
        (error: AxiosError<ErrorResponsDto>) => {
            const formatedError = handleError(error);
            setError(formatedError);
            setOpen(true);
        },
        [setError, setOpen, handleError],
    );

    const customErrorMessage = useCallback(
        (ErrorMessage: ErrorMessageType) => {
            setError(ErrorMessage);
            setOpen(true);
        },
        [setError, setOpen],
    );

    return { showError, customErrorMessage };
};
