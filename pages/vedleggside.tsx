import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from 'react';
import Link  from 'next/link'
import Vedlegg from '../components/Vedlegg'
import Vedlegg2 from '../components/Vedlegg2'

const VedleggSide: NextPage = () => {
    let propexample = {
        id: 13,
        vedleggsnr: "W1",
        tittel: "Dokumentasjon på mottatt bidrag",
        uuid: "6a2b67d2-b6aa-45bd-874b-7efaf9876f66",
        mimetype: null,
        document: null,
        erHoveddokument: false,
        erVariant: false,
        erPdfa: false,
        skjemaurl: null,
        opplastingsStatus: "IKKE_VALGT",
        opprettetdato: "2022-01-19T13:35:51.091965"
    }
    return (
        // TODO Can you send this in as an object?
        <div className={styles.container}>
            <Vedlegg2 id={13}/>
            <Vedlegg    id={13} vedleggsnr="W1"
            tittel="Dokumentasjon på mottatt bidrag"
            uuid="6a2b67d2-b6aa-45bd-874b-7efaf9876f66"
            mimetype=""
            document=""
            erHoveddokument={false}
            erVariant={false}
            erPdfa={false}
            skjemaurl="https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/b896b856728119c489376644df4a189b339ffe62.pdf"
            opplastingsStatus="IKKE_VALGT"
            opprettetdato="2022-01-19T13:35:51.091965"/>
        </div>
    )
}

export default VedleggSide

/*

   "id"= 13,
"vedleggsnr"= "W1",
    "tittel"= "Dokumentasjon på mottatt bidrag",
    "uuid"= "6a2b67d2-b6aa-45bd-874b-7efaf9876f66",
    "mimetype"= null,
    "document"= null,
    "erHoveddokument"= false,
    "erVariant"= false,
    "erPdfa"= false,
    "skjemaurl"= null,
    "opplastingsStatus"= "IKKE_VALGT",
    "opprettetdato"= "2022-01-19T13:35:51.091965"
 */