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
};

export type OpplastetFil = {
    id: string;
    filnavn: string;
    storrelse: number;
};

export type setOpplastingStatusType = (
    id: number,
    opplastingStatus: string,
) => void;

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
    endretDato: string;
    innsendtDato: null;
    vedleggsListe: [] | VedleggType;
    visningsType: string;
    visningsSteg: number;
    kanLasteOppAnnet: boolean;
};

// APP
