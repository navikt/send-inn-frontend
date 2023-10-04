import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';

import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const OpprettSoknadResource: NextPage = () => {
  const router = useRouter();
  const { query } = router;
  const [innsendingsId, setInnsendingsId] = useState();

  const opprettSoknad = useCallback(() => {
    if (!Object.keys(query).length) {
      // query is empty before hydration
      return;
    }
    const { vedleggsIder } = query;

    const opprettSoknadEndpoint = '/frontend/v1/soknad';
    const opprettEttersendingEndpoint = '/frontend/v1/ettersendPaSkjema';
    const endpoint = query.erEttersendelse === 'true' ? opprettEttersendingEndpoint : opprettSoknadEndpoint;

    axios
      .post(publicRuntimeConfig.apiUrl + endpoint, {
        skjemanr: query.skjemanummer,
        sprak: query.sprak || 'NB_NO', // set bokmål som default
        vedleggsListe: (vedleggsIder as string)?.split(','),
      })
      .then((response) => {
        setInnsendingsId(response.data.innsendingsId);
      })
      .catch((error: AxiosError) => {
        const statusCode = error.response?.status;
        if (statusCode && statusCode === 404) {
          return router.push('/404');
        }
        return router.push('/500');
      });
  }, [query, router]);

  useEffect(() => {
    opprettSoknad();
  }, [opprettSoknad]);

  useEffect(() => {
    if (!innsendingsId) {
      return;
    }

    router.replace(`/${innsendingsId}`);
  }, [innsendingsId, router]);

  // TODO: Sett språk basert på query.sprak

  return (
    <div>
      <Head>
        <title>Laster søknad</title>
        <meta name="description" content="Laster søknad" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <p>Oppretter søknad...</p>
      </main>
    </div>
  );
};

export default OpprettSoknadResource;
