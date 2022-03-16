import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
// import styles from '../../styles/Home.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, createContext } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Vedlegg from '../../components/Vedlegg';
import TestCompState from '../../components/TestCompState';
import VedleggsListe2 from '../../components/VedleggsListe2';
import VedleggsListe from '../../components/VedleggsListe';
import { VedleggType, SoknadType } from '../../types/types';
import { Button, Panel } from '@navikt/ds-react';
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import type { ReactElement } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

const qs = require('qs');
// todo https://dev.to/fadiamg/multiple-file-inputs-with-one-submit-button-with-react-hooks-kle

type FormValues = {
    file: File;
    brukerid: string;
    sprak: string;
};

/*
interface VedleggProps {
    innsendingsId: string;
    id: number;
    vedleggsnr: string;
    tittel: string;
    uuid: string;
    mimetype: string | null;
    document: string | null;
    erHoveddokument: boolean;
    erVariant: boolean;
    erPdfa: boolean;
    skjemaurl: string | null;
    opplastingsStatus: string;
    opprettetdato: string;
}
*/

type VedleggProps = VedleggType & {
    innsendingsId: string | undefined;
};

interface contextValue {
    value: VedleggProps | null;
}

// why is this duplicated?
export const AppContext = React.createContext<
    VedleggProps | undefined
>(undefined);

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

        axios
            .post('http://localhost:9064/frontend/v1/soknad', {
                brukerId: brukerid,
                skjemanr: query.skjemanummer,
                sprak: query.sprak || 'NO_NB', // set bokmål som default
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
                    <p>språk: {query.erEttersendelse}</p>
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
                        defaultValue={'02097225454'}
                        {...register('brukerid')}
                    />

                    <input type="submit" value="opprett" />
                </form>
                {soknad && (
                    <VedleggsListe
                        soknad={soknad}
                        setSoknad={setSoknad}
                        vedleggsliste={vedleggsListe}
                        setVedleggsListe={setVedleggsListe}
                        erEttersending={query.erEttersendelse}
                    />
                )}
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
