import React, { FC, ReactElement, useRef } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

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

function TestComp({
    innsendingsId,
    id,
    vedleggsnr,
    tittel,
    uuid,
    mimetype,
    document,
    erHoveddokument,
    erVariant,
    erPdfa,
    skjemaurl,
    opplastingsStatus,
    opprettetdato,
}: VedleggProps) {
    return <h1>innsendingsId: {innsendingsId}</h1>;
}
export default TestComp;
