import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, createContext } from 'react';
import { useRouter, NextRouter } from 'next/router';
import axios from 'axios';
import VedleggsListe from '../../components/VedleggsListe';
import { VedleggType, SoknadType } from '../../types/types';
import { Button, Panel } from '@navikt/ds-react';
import Link from 'next/link';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

type FormValues = {
    file: File;
    brukerid: string;
    sprak: string;
};

const initialVedleggsliste: VedleggType[] | [] = [];

const OpprettSoknadResource: NextPage = () => {
    const { query } = useRouter();
    const [soknad, setSoknad] = useState<SoknadType | null>(null);
    const [vedleggsListe, setVedleggsListe] = useState<VedleggType[]>(
        initialVedleggsliste,
    );

    const { register, handleSubmit } = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);

        const { brukerid } = data;
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
                brukerId: brukerid,
                skjemanr: query.skjemanummer,
                sprak: query.sprak || 'NB_NO', // set bokmål som default
                vedleggsListe: (vedleggsIder as string)?.split(','),
            })
            .then((response) => {
                setSoknad(response.data);
                setVedleggsListe(response.data.vedleggsListe);
                console.log({ response: response.data });
            });
    };
    return (
        <div>
            {publicRuntimeConfig.apiUrl}
            <Head>
                <title>Trykk </title>
                <meta
                    name="description"
                    content="Her kan du opprette en søknad "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {/*<div> {JSON.stringify(query)} </div>*/}
                <Panel border>
                    <h3>Data hentet fra URL parametre: </h3>
                    <p>skjemanummer: {query.skjemanummer}</p>
                    <p>erEttersendelse: {query.erEttersendelse}</p>
                    <p>språk: {query.sprak}</p>
                    <p>vedleggsIder: {query.vedleggsIder}</p>
                    <h3>
                        Opprett en søknad basert på disse parametrene:{' '}
                    </h3>

                    {soknad && (
                        <div>
                            <Link
                                href={
                                    '/ettersending/' +
                                    soknad.innsendingsId
                                }
                            >
                                lenke til ettersending
                            </Link>
                        </div>
                    )}
                    {soknad && (
                        <div>
                            <Link
                                href={
                                    '/dokumentinnsending/' +
                                    soknad.innsendingsId
                                }
                            >
                                lenke til jobb-videre-med
                            </Link>
                        </div>
                    )}

                    {soknad && (
                        <div>
                            {' '}
                            soknad.innsendingsId:{' '}
                            {soknad.innsendingsId}{' '}
                        </div>
                    )}
                </Panel>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="brukerid"
                        defaultValue={'27928799005'}
                        {...register('brukerid')}
                    />

                    <input type="submit" value="opprett" />
                </form>
            </main>

            <footer></footer>
        </div>
    );
};

/*
export const getServerSideProps: GetServerSideProps = async (context) => {
  // get whatever you can get from the service at rendertime here  
  // return {props: {hello: 'hello'}}
  prop : Props = {somevalue = 'string'}
  return prop
}
*/

export default OpprettSoknadResource;
