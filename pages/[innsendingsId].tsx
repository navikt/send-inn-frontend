import axios, { AxiosError, AxiosResponse } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SoknadHeader } from '../components/SoknadHeader';
import VedleggsListe from '../components/VedleggsListe';

import { SoknadType } from '../types/types';

import getConfig from 'next/config';
import { useSoknadLanguage } from '../hooks/useSoknadLanguage';
import { navigerTilFyllut } from '../utils/navigerTilFyllut';

const { publicRuntimeConfig } = getConfig();
const erEttersending = true;

const InnsendingsSide: NextPage = () => {
  console.log('NAIS CLUSTER NAME', process.env.NAIS_CLUSTER_NAME);

  const router = useRouter();
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
            navigerTilFyllut(data);
            return;
          }
          changeLang(data.spraak);
          setSoknad(data);
        })
        .catch((error: AxiosError) => {
          const statusCode = error.response?.status;
          if (statusCode && statusCode === 404) {
            return router.push('/404');
          }
          if (statusCode && statusCode === 405) {
            // Allerede sendt inn
            return router.push('/feilside/soknad-sendt-inn');
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
            <SoknadHeader soknadoverskrift={soknad.tittel} skjemanr={soknad.skjemanr} />
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
