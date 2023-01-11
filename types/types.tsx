// API
export type VedleggType = {
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
    label: string;
    beskrivelse: string;
    erPakrevd: boolean;
    innsendtdato: string | null;
};

export type OpplastetFil = {
    id: string;
    filnavn: string;
    storrelse: number;
};

export type VisningsType =
    | 'fyllUt'
    | 'dokumentinnsending'
    | 'ettersending';

export type SoknadType = {
    id: number;
    innsendingsId: string;
    ettersendingsId: null;
    brukerId: string;
    skjemanr: string;
    tittel: string;
    tema: string;
    spraak: string;
    status: string;
    opprettetDato: string;
    fristForEttersendelse: number; // dager til en evt. ettersendingsfrist etter innsending
    innsendingsFristDato: string;
    endretDato: string;
    innsendtDato: null;
    vedleggsListe: VedleggType[];
    visningsType: VisningsType;
    visningsSteg: number;
    kanLasteOppAnnet: boolean;
};

export type ErrorResponsDto = {
    arsak: string;
    errorCode: string;
    message: string;
    timeStamp: string;
};

// APP
