import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState, createContext, useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import axios from 'axios';
import Vedlegg from '../../components/Vedlegg';
import TestCompState from '../../components/TestCompState';

import { VedleggType, SoknadType } from '../../types/types';
import Link from 'next/link';

const qs = require('qs');


/*

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
*/
const initialSoknadsliste: SoknadType[] | [] = [];


const EttersendingSide: NextPage = () => {
    const { query } = useRouter();
    const [soknadListe, setsoknadListe] = useState<SoknadType[]>(
        initialSoknadsliste,
    );

    const brukerId = "1234567890" // query.brukerId // TODO hent fra brukerid isteden, må eventuelt støttes i kallet
    useEffect(() => {
        //const brukerId = query.brukerId // todo fix, fungerer ikke med en gang om man henter herifra, må kan
        // const brukerId = "d83c88e4-a3f3-4217-b561-fe0572e391e8";
        //const { brukerid } = data;
        //const { vedleggsIder } = query;
        if (brukerId) {

        axios
                .get(`http://localhost:3000/api/mock/frontend/v1/soknad/`)
            .then((response) => {
                // TOOD virker ikke nå pga api
                setsoknadListe(response.data);    

            })
            .catch((error) => {
                console.log(error)
            }).finally( () => {
                /*
                 const soknad : SoknadType = JSON.parse('{"id":41,"innsendingsId":"82554622-91a3-450e-91e9-51926761d957","ettersendingsId":null,"brukerId":"12345678901","skjemanr":"NAV 54-00.04","tittel":"Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)","tema":"BID","spraak":"NO_NB","status":"Opprettet","opprettetDato":"2022-02-10T15:14:23.267321","endretDato":"2022-02-10T15:14:23.268021","innsendtDato":null,"vedleggsListe":[{"id":161,"vedleggsnr":"NAV 54-00.04","tittel":"Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)","uuid":"e19363f4-f422-4d1e-8c33-7759fe96677a","mimetype":null,"document":null,"erHoveddokument":true,"erVariant":false,"erPdfa":true,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/df912aab748a2a9d911c4d99ff6aabfc016eadb5.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.377343"},{"id":162,"vedleggsnr":"C1","tittel":"Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ","uuid":"3086b5a3-5438-48ba-ac56-f012e2ad8a47","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/7146ae917cf8423f71edbf37369da5a6b2a23524.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.395902"},{"id":163,"vedleggsnr":"W1","tittel":"Dokumentasjon på mottatt bidrag","uuid":"9f2288c3-3911-49ed-9660-7b4a111bd990","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":null,"opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.399973"},{"id":164,"vedleggsnr":"G2","tittel":"Bekreftelse på arbeidsforhold og permittering","uuid":"3232db2a-e4c4-431d-9704-ce0abbb1d5ab","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/4f473293d31eee48921daecc72b1157e2a06542f.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.401027"}]}')
                const nySoknadListe = [soknad]
                //setsoknadListe(response.data.soknadListe);    
                setsoknadListe(nySoknadListe);
                */ 
               // sdfljsdfl
            }

            )
        }

    }, [brukerId]);

    return (<>
      

            {soknadListe.length === 0 && (
                <h1>Bruker har ingen soknader</h1>
            )}

        {soknadListe.length > 0 && (soknadListe.map((soknad, key) =>  (<Link key={key} href={'/dokumentinnsending/' + soknad.innsendingsId}> lenke til jobb-videre-med </Link>)))}
           

       </>
    )
};

export default EttersendingSide;