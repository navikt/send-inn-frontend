import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import TestComp from '../components/TestComp';

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

function VedleggsListe(vedleggsListe : VedleggProps[]) {

    return (
        <div>
            { vedleggsListe.map((vedlegg) => {
              <TestComp {...vedlegg} />;
            })}

        </div>

    );
}
export default VedleggsListe;
