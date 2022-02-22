import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import styles from '../../styles/Home.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, createContext, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Vedlegg from '../../components/Vedlegg';
import TestCompState from '../../components/TestCompState';
import VedleggsListe2 from '../../components/VedleggsListe2';
import VedleggsListe from '../../components/VedleggsListe';

import { VedleggType, SoknadType } from '../../types/types';

const qs = require('qs');
// todo https://dev.to/fadiamg/multiple-file-inputs-with-one-submit-button-with-react-hooks-kle
const erEttersending = false;
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



const EttersendingSide: NextPage = () => {
    const { query } = useRouter();
    const [soknad, setSoknad] = useState<SoknadType | null>(null);
    const [vedleggsListe, setVedleggsListe] = useState<VedleggType[]>(
        initialVedleggsliste,
    );

    const { register, handleSubmit } = useForm<FormValues>();
    const innsendingsId = query.innsendingsId
    useEffect(() => {
        //const innsendingsId = query.innsendingsId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
        // const innsendingsId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
        //const { brukerid } = data;
        //const { vedleggsIder } = query;
        if (innsendingsId) {

        axios
            .get(`http://localhost:9064/frontend/v1/soknad/${innsendingsId}` /*, {
                brukerId: brukerid,
                skjemanr: query.skjemanummer,
                sprak: query.sprak, // set bokmål som default
                // TODO rett til vedleggsListe
                vedleggsListe: (vedleggsIder as string)?.split(','),
            }*/)
            .then((response) => {
                setSoknad(response.data);
                setVedleggsListe(response.data.vedleggsListe);

            })
            .catch((error) => {
                console.log(error)
            })
        }

    }, [innsendingsId]);

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data);
        const innsendingsId = query.innsendingsId
        //const { brukerid } = data;
        //const { vedleggsIder } = query;

        axios
            .get(`http://localhost:9064/frontend/v1/soknad/${innsendingsId}` /*, {
                brukerId: brukerid,
                skjemanr: query.skjemanummer,
                sprak: query.sprak, // set bokmål som default
                // TODO rett til vedleggsListe
                vedleggsListe: (vedleggsIder as string)?.split(','),
            }*/)
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
                    content="Her kan du ettersende vedlegg til en søknad"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
           <main>
                {soknad && (
                    <VedleggsListe soknad={soknad} setSoknad={setSoknad} vedleggsliste={vedleggsListe} setVedleggsListe={setVedleggsListe} erEttersending={erEttersending}/>
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

export default EttersendingSide;