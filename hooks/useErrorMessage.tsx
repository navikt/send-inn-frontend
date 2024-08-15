import { AxiosError } from 'axios';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessageType, useErrorMessageContext } from '../components/ErrorMessageProvider';
import { TranslationKey } from '../i18next';
import { ErrorResponsDto } from '../types/types';

export const useErrorMessage = () => {
  const { setOpen, setError } = useErrorMessageContext();
  const { t } = useTranslation();
  const { t: tB, i18n } = useTranslation('backend');

  const handleError = useCallback(
    (error: AxiosError<ErrorResponsDto>): ErrorMessageType => {
      if (error.response) {
        // Feil fra server (4xx eller 5xx)
        const errorCode = error.response.data?.errorCode;

        const messageKey: TranslationKey<'backend'> = `${errorCode}.message`;
        const titleKey = `${errorCode}.title`;

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
              ? tB(titleKey as TranslationKey<'backend'>)
              : undefined,
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
