import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosError, AxiosResponse } from 'axios';
import VedleggsListe from '../components/VedleggsListe';
import { SoknadHeader } from '../components/SoknadHeader';

import { VedleggType, SoknadType } from '../types/types';

import getConfig from 'next/config';
import { useSoknadLanguage } from '../hooks/useSoknadLanguage';

const { publicRuntimeConfig } = getConfig();
const erEttersending = true;

const InnsendingsSide: NextPage = () => {
    const router = useRouter();
    const { query } = router;
    const [soknad, setSoknad] = useState<SoknadType | null>(null);
    const [vedleggsListe, setVedleggsListe] = useState<
        VedleggType[] | null
    >(null);
    const { changeLang } = useSoknadLanguage();
    const innsendingsId = query.innsendingsId;
    useEffect(() => {
        if (innsendingsId) {
            axios
                .get(
                    `${publicRuntimeConfig.apiUrl}/frontend/v1/soknad/${innsendingsId}`,
                )
                .then((response: AxiosResponse<SoknadType>) => {
                    changeLang(response.data.spraak);
                    setVedleggsListe(response.data.vedleggsListe);
                    setSoknad(response.data);
                })
                .catch((error: AxiosError) => {
                    const statusCode = error.response?.status;
                    if (statusCode && statusCode === 404) {
                        return router.push('/404');
                    }
                    if (statusCode && statusCode === 405) {
                        // Allerede sendt inn
                        return router.push('/soknad-er-slettet');
                    }
                    return router.push('/500');
                });
        }
    }, [innsendingsId, router, changeLang]);

    return (
        <div>
            <Head>
                <title>
                    {soknad ? soknad.tittel : 'Laster søknad'}
                </title>
            </Head>
            <main>
                {soknad && !!vedleggsListe && (
                    <>
                        <SoknadHeader
                            soknadoverskrift={soknad.tittel}
                            skjemanr={soknad.skjemanr}
                        />

                        <VedleggsListe
                            soknad={soknad}
                            setSoknad={setSoknad}
                            vedleggsliste={vedleggsListe}
                            setVedleggsListe={setVedleggsListe}
                            erEttersending={erEttersending}
                        />
                    </>
                )}
            </main>
        </div>
    );
};

export default InnsendingsSide;
