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
};

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
    vedleggsListe: [];
};
