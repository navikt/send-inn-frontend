import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import Vedlegg from '../components/Vedlegg';

type FormValues = {
    filnavn: string | null;
    file: FileList | null;
};

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

// https://stackoverflow.com/a/35435158
// type VedleggPropsList = {
//     [index:number]: VedleggProps;
// }

/*
export interface VedleggPropsList extends Array<{
    [index: number]: VedleggProps;
}> { };

 */

//let array: VedleggProps[] = []; // https://www.codegrepper.com/code-examples/typescript/array+of+jsx+element+typescript

function VedleggsListe2(vedleggsListe: VedleggProps[]) {
    /*let list = vedleggsListe.map((vedlegg) => {
        <Vedlegg {...vedlegg} />;
    })
    list = Object.keys(vedleggsListe).map(function(key, index) {
        vedleggsListe[key] *= 2;
    });
    list = (vedleggsListe) => {
    for (var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            myObject[key] *= 2;
        }
    }
    }

     */
    //let newlist = Array.from(props.data);

    return (
        <div>
            {console.log(vedleggsListe)}
            {vedleggsListe.toString()}

            {/*vedleggsListe.map(item => {
                return(
                    <Vedlegg key={item["id"]} {...item}/>
                )
            })
            }
            */}
            {vedleggsListe.map((vedlegg) => {
                <Vedlegg {...vedlegg} />;
            })}
        </div>
    );
}
export default VedleggsListe2;
