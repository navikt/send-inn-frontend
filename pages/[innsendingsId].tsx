import axios, { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SoknadHeader } from '../components/SoknadHeader';
import VedleggsListe from '../components/VedleggsListe';

import { SoknadType } from '../types/types';

import { TFunction } from 'i18next';
import getConfig from 'next/config';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../components/AppConfigContext';
import { useSoknadLanguage } from '../hooks/useSoknadLanguage';
import { navigerTil } from '../utils/navigerTil';
import { getPathForFyllutUrl } from '../utils/soknad';

const { publicRuntimeConfig } = getConfig();
const erEttersending = true;

const getSoknadoverskrift = (soknad: SoknadType, t: TFunction) => {
  if (soknad.visningsType === 'lospost') {
    return t('soknad.soknadoverskrift-lospost');
  }
  return soknad.tittel;
};

const InnsendingsSide: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { fyllutUrl } = useAppConfig();
  const { query } = router;
  const [soknad, setSoknad] = useState<SoknadType | null>(null);
  const { changeLang } = useSoknadLanguage();
  const innsendingsId = query.innsendingsId;
  useEffect(() => {
    if (innsendingsId) {
      axios
        .get(`${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}`)
        .then((response: AxiosResponse<SoknadType>) => {
          const { data } = response;
          if (data.visningsType === 'fyllUt' && data.status === 'Opprettet' && data.skjemaPath) {
            navigerTil(`${fyllutUrl}/${getPathForFyllutUrl(data)}`);
            return;
          }
          changeLang(data.spraak);
          setSoknad(data);
        })
        .catch((error: AxiosError) => {
          const statusCode = error.response?.status;

          if (statusCode === 400 || statusCode === 405) {
            return router.push('/feilside/soknad-sendt-inn');
          } else if (statusCode === 404) {
            return router.push('/404');
          }
          return router.push('/500');
        });
    }
  }, [innsendingsId, router, changeLang]);

  return (
    <>
      <Head>
        <title>{soknad ? soknad.tittel : 'Laster søknad'}</title>
      </Head>

      {soknad && (
        <>
          <div className="layout-header">
            <SoknadHeader
              soknadoverskrift={getSoknadoverskrift(soknad, t)}
              skjemanr={soknad.skjemanr}
              hideSkjemanr={soknad.visningsType === 'lospost'}
            />
          </div>

          <div className="side-column"></div>
          <div className="main-column">
            <VedleggsListe soknad={soknad} setSoknad={setSoknad} erEttersending={erEttersending} />
          </div>
        </>
      )}
    </>
  );
};

export default InnsendingsSide;
