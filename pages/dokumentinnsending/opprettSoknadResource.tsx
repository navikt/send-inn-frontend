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
import TestComp from '../../components/TestComp';
import TestCompState from '../../components/TestCompState';
import VedleggsListe from '../../components/VedleggsListe';

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


type VedleggProps = {
    innsendingsId: string;
    id: number;
    vedleggsnr: string;
    tittel: string;
    uuid: string;
    mimetype: string;
    document: string;
    erHoveddokument: boolean;
    erVariant: boolean;
    erPdfa: boolean;
    skjemaurl: string;
    opplastingsStatus: string;
    opprettetdato: string;
};


interface contextValue {
    value: VedleggProps | null;
}

// same const ThemeContext = React.createContext(themes.light);
// why is this duplicated?
export const AppContext = React.createContext<
    VedleggProps | undefined
>(undefined);

const vedleggsListe : VedleggProps[] =  [{
    innsendingsId: 'sdadas',
    id: 1,
    vedleggsnr: 'W1',
    tittel: 'Dokumentasjon på mottatt bidrag',
    uuid: '6a2b67d2-b6aa-45bd-874b-7efaf9876f66',
    mimetype: 'dkwaop',
    document: 'dkwaop',
    erHoveddokument: false,
    erVariant: false,
    erPdfa: false,
    skjemaurl: 'dkwaop',
    opplastingsStatus: 'IKKE_VALGT',
    opprettetdato: '2022-01-19T13:35:51.091965',
},
    {
        innsendingsId: 'sdadas',
        id: 2,
        vedleggsnr: 'W1',
        tittel: 'Dokumentasjon på mottatt bidrag',
        uuid: '6a2b67d2-b6aa-45bd-874b-7efaf9876f66',
        mimetype: 'dkwaop',
        document: 'dkwaop',
        erHoveddokument: false,
        erVariant: false,
        erPdfa: false,
        skjemaurl: 'dkwaop',
        opplastingsStatus: 'IKKE_VALGT',
        opprettetdato: '2022-01-19T13:35:51.091965',
    },
    {
        innsendingsId: 'sdadas',
        id: 3,
        vedleggsnr: 'W1',
        tittel: 'Dokumentasjon på mottatt bidrag',
        uuid: '6a2b67d2-b6aa-45bd-874b-7efaf9876f66',
        mimetype: 'dkwaop',
        document: 'dkwaop',
        erHoveddokument: false,
        erVariant: false,
        erPdfa: false,
        skjemaurl: 'dkwaop',
        opplastingsStatus: 'IKKE_VALGT',
        opprettetdato: '2022-01-19T13:35:51.091965',
    }]

// type Query = NextRouter & {
//     query: {
//         skjemanummer: string;
//         erEttersendelse: string;
//         vedleggsIder: string;
//         brukerid: string;
//         sprak: string;
//     };
// };

//https://tjenester-q1.nav.no/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1
//http://localhost:3000/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1,

// http://localhost:3000/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,
// todo make the url case insensitive?
// todo get qparams    https://reactgo.com/next-get-query-params/   <p>{query.name}</p>

/* 
interface PropStructure{
  firstName: string;
  lastName: number;
}

interface Props {
  somevalue?: string;
}

 */
const OpprettSoknadResource: NextPage = () => {
    const { query } = useRouter();
    const [soknad, setSoknad] = useState<{} | null>(null);
    const [filesUploaded, setFilesUploaded] = useState<File[]>([]);

    const { register, handleSubmit } = useForm<FormValues>();
    const onSubmit: SubmitHandler<FormValues> = (data) => {
        // setFilesUploaded((filesUploaded) => [
        //     ...filesUploaded,
        //     data.file,
        // ]);
        console.log(data);

        const { brukerid } = data;
        const { vedleggsIder } = query;

        axios
            .post('http://localhost:9064/frontend/soknad', {
                brukerId: brukerid,
                skjemanr: query.skjemanummer,
                sprak: query.sprak, // set bokmål som default
                // TODO rett til vedleggsListe
                vedleggListe: (vedleggsIder as string)?.split(','),
            })
            .then((response) => {
                setSoknad(response.data);
                console.log({ response: response.data });
                // let context = React.useContext(AppContext);
                // context = {
                //     innsendingsId: 'sdadas',
                //     id: 13,
                //     vedleggsnr: 'W1',
                //     tittel: 'Dokumentasjon på mottatt bidrag',
                //     uuid: '6a2b67d2-b6aa-45bd-874b-7efaf9876f66',
                //     mimetype: null,
                //     document: null,
                //     erHoveddokument: false,
                //     erVariant: false,
                //     erPdfa: false,
                //     skjemaurl: null,
                //     opplastingsStatus: 'IKKE_VALGT',
                //     opprettetdato: '2022-01-19T13:35:51.091965',
                // };
            });
        // set authenticated to false
    };
    const obj = {
        innsendingsId: 'sdadas',
        id: 13,
        vedleggsnr: 'W1',
        tittel: 'Dokumentasjon på mottatt bidrag',
        uuid: '6a2b67d2-b6aa-45bd-874b-7efaf9876f66',
        mimetype: 'dkwaop',
        document: 'dkwaop',
        erHoveddokument: false,
        erVariant: false,
        erPdfa: false,
        skjemaurl: 'dkwaop',
        opplastingsStatus: 'IKKE_VALGT',
        opprettetdato: '2022-01-19T13:35:51.091965',
    };
    return (
        <AppContext.Provider value={undefined}>
            {/* <ThemeContext.Provider value={themes.dark}>
            same
 */}
            {/* {VedleggsListe.map((vedlegg) => {
              <Vedlegg {...vedlegg} />;
            })} */}
            <TestComp {...obj} />
            <TestCompState />
            <VedleggsListe {...vedleggsListe} />


            <div className={styles.container}>
                <Head>
                    <title>Send inn her</title>
                    <meta
                        name="description"
                        content="Her kan du sende inn vedlegg"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className={styles.main}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* <input type="file" {...registe {
      "id": 11,
      "vedleggsnr": "NAV 54-00.04",
      "tittel": "Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)",
      "uuid": "85941dba-27ee-4b18-a263-51e24f89d57b",
      "mimetype": null,
      "document": null,
      "erHoveddokument": true,
      "erVariant": false,
      "erPdfa": true,
      "skjemaurl": "https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/b896b856728119c489376644df4a189b339ffe62.pdf",
      "opplastingsStatus": "IKKE_VALGT",
      "opprettetdato": "2022-01-19T13:35:51.082981"
    },r("file")} /> */}
                        <input
                            type="text"
                            placeholder="brukerid"
                            defaultValue={'12345678901'}
                            {...register('brukerid')}
                        />

                        <input type="submit" />
                        <div> {JSON.stringify(query)} </div>
                        <p>{query.skjemanummer}</p>
                        <p>{query.erEttersendelse}</p>
                        <p>{query.vedleggsIder}</p>
                        {/*
      https://tjenester-q1.nav.no/dokumentinnsending/opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1]&brukerid=12345678901&sprak=NO_NB&vedleggListe=W1,W2
      opprettSoknadResource?skjemanummer=NAV%2054-00.04&erEttersendelse=false&vedleggsIder=W2,W1]&brukerid=12345678901&sprak=NO_NB&vedleggListe=W1,W2
      ting vi har:
      skjemanummer=NAV%2054-00
      erEttersendelse=false
      vedleggsIder=W2,W1
      

      brukerid=12345678901
      sprak=NO_NB
      vedleggListe=W1,W2 (samme som vedleggsliste)
      */}

                        {/*
                    vi tar inn dette
                    vi har en skjema/søknad komponent
                    denne har en dokument komponent, dette er
                    {

  {
  "id": 7,
  "innsendingsId": "7835e28d-b9cf-403f-b68d-db625fefa017",
  "ettersendingsId": null,
  "brukerId": "12345678901",
  "skjemanr": "NAV 54-00.04",
  "tittel": "Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)",
  "tema": "BID",
  "spraak": "NO_NB",
  "status": "Opprettet",
  "opprettetDato": "2022-01-19T13:35:51.064305",
  "endretDato": "2022-01-19T13:35:51.064339",
  "innsendtDato": null,
  "vedleggsListe": [

    {
      "id": 12,
      "vedleggsnr": "NAV 10-07.75",
      "tittel": "Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ",
      "uuid": "85190897-e17b-43d6-a8ac-375e87d7af8e",
      "mimetype": null,
      "document": null,
      "erHoveddokument": false,
      "erVariant": false,
      "erPdfa": false,
      "skjemaurl": "",
      "opplastingsStatus": "IKKE_VALGT",
      "opprettetdato": "2022-01-19T13:35:51.087687"
    },
    {
      "id": 13,
      "vedleggsnr": "W1",
      "tittel": "Dokumentasjon på mottatt bidrag",
      "uuid": "6a2b67d2-b6aa-45bd-874b-7efaf9876f66",
      "mimetype": null,
      "document": null,
      "erHoveddokument": false,
      "erVariant": false,
      "erPdfa": false,
      "skjemaurl": null,
      "opplastingsStatus": "IKKE_VALGT",
      "opprettetdato": "2022-01-19T13:35:51.091965"
    }
  ]
}
                    */}
                    </form>
                </main>

                <footer className={styles.footer}></footer>
            </div>
        </AppContext.Provider>
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
