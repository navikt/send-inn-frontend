import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../../styles/Home.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, createContext } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Vedlegg from '../../components/Vedlegg';
import TestCompState from '../../components/TestCompState';
import VedleggsListe from '../../components/VedleggsListe';
import { VedleggType, SoknadType } from '../../types/api';

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

// same const ThemeContext = React.createContext(themes.light);
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
                sprak: query.sprak, // set bokmål som default
                // TODO rett til vedleggsListe
                vedleggsListe: (vedleggsIder as string)?.split(','),
            })
            .then((response) => {
                setSoknad(response.data);
                setVedleggsListe(response.data.vedleggsListe);
                console.log({ response: response.data });
            });
    };
    const onSendInn = () => {
        axios
            .post(
                `http://localhost:9064/frontend/v1/sendInn/${soknad?.innsendingsId}`,
            )
            .finally(() => {
                resetState();
                //TODO: Endre til "then", og gå til kvitteringside
                alert('Sendt inn');
            })
            .catch((e) => {
                //TODO: Error håndtering
                console.error(e);
            });
    };

    const resetState = () => {
        setVedleggsListe(initialVedleggsliste);
        setSoknad(null);
    };
    return (
        <div className={styles.container}>
            <Head>
                <title>Trykk </title>
                <meta
                    name="description"
                    content="Her kan du opprette en søknad "
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                {/*<div> {JSON.stringify(query)} </div>*/}
                <h3>Data hentet fra URL parametre: </h3>
                <p>skjemanummer: {query.skjemanummer}</p>
                <p>erEttersendelse: {query.erEttersendelse}</p>
                <p>språk: {query.erEttersendelse}</p>
                <p>vedleggsIder: {query.vedleggsIder}</p>
                <h3>
                    Opprett en søknad basert på disse parametrene:{' '}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        placeholder="brukerid"
                        defaultValue={'12345678901'}
                        {...register('brukerid')}
                    />

                    <input type="submit" value="opprett" />
                </form>

                {vedleggsListe.length !== 0 && (
                    <h1>Last opp vedlegg her:</h1>
                )}
                {soknad &&
                    vedleggsListe.map((vedlegg, key) => {
                        console.log(vedlegg);
                        return (
                            <Vedlegg
                                key={key}
                                innsendingsId={soknad.innsendingsId}
                                {...vedlegg}
                            />
                        );
                    })}
                {soknad && (
                    <button onClick={onSendInn}>Send inn</button>
                )}
            </main>

            <footer className={styles.footer}></footer>
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
