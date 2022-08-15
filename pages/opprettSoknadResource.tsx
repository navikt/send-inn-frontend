import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import axios from 'axios';

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
        console.log({ query });
        const { vedleggsIder } = query;

        const opprettSoknadEndpoint = '/frontend/v1/soknad';
        const opprettEttersendingEndpoint =
            '/frontend/v1/ettersendPaSkjema';
        const endpoint =
            query.erEttersendelse === 'true'
                ? opprettEttersendingEndpoint
                : opprettSoknadEndpoint;

        axios
            .post(publicRuntimeConfig.apiUrl + endpoint, {
                brukerId: '27928799005', // TODO: Fjerne denne når API ikke feiler når brukerId mangler
                skjemanr: query.skjemanummer,
                sprak: query.sprak || 'NB_NO', // set bokmål som default
                vedleggsListe: (vedleggsIder as string)?.split(','),
            })
            .then((response) => {
                console.log({ response: response.data });
                setInnsendingsId(response.data.innsendingsId);
            })
            .catch((error) => {
                // TODO: Error handling
                throw error;
            });
    }, [query]);

    useEffect(() => {
        opprettSoknad();
    }, [opprettSoknad]);

    useEffect(() => {
        if (!innsendingsId) {
            return;
        }
        if (query.erEttersendelse === 'true') {
            router.replace(`/ettersending/${innsendingsId}`);
        } else {
            router.replace(`/dokumentinnsending/${innsendingsId}`);
        }
    }, [innsendingsId, query]);

    // TODO: Sett språk basert på query.sprak

    return (
        <div>
            <Head>
                <title>Oppretter søknad</title>
                <meta name="description" content="Oppretter søknad" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <p>Oppretter søknad...</p>
            </main>
        </div>
    );
};

export default OpprettSoknadResource;
