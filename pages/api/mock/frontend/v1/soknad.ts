import type { NextApiRequest, NextApiResponse } from 'next';
const hentetfraapi = JSON.parse(
    '{"id":41,"innsendingsId":"82554622-91a3-450e-91e9-51926761d957","ettersendingsId":null,"brukerId":"12345678901","skjemanr":"NAV 54-00.04","tittel":"Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)","tema":"BID","spraak":"NO_NB","status":"Opprettet","opprettetDato":"2022-02-10T15:14:23.267321","endretDato":"2022-02-10T15:14:23.268021","innsendtDato":null,"vedleggsListe":[{"id":161,"vedleggsnr":"NAV 54-00.04","tittel":"Svar på forhåndsvarsel i sak om barnebidrag (bidragsmottaker)","uuid":"e19363f4-f422-4d1e-8c33-7759fe96677a","mimetype":null,"document":null,"erHoveddokument":true,"erVariant":false,"erPdfa":true,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/df912aab748a2a9d911c4d99ff6aabfc016eadb5.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.377343"},{"id":162,"vedleggsnr":"C1","tittel":"Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad ","uuid":"3086b5a3-5438-48ba-ac56-f012e2ad8a47","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/7146ae917cf8423f71edbf37369da5a6b2a23524.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.395902"},{"id":163,"vedleggsnr":"W1","tittel":"Dokumentasjon på mottatt bidrag","uuid":"9f2288c3-3911-49ed-9660-7b4a111bd990","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":null,"opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.399973"},{"id":164,"vedleggsnr":"G2","tittel":"Bekreftelse på arbeidsforhold og permittering","uuid":"3232db2a-e4c4-431d-9704-ce0abbb1d5ab","mimetype":null,"document":null,"erHoveddokument":false,"erVariant":false,"erPdfa":false,"skjemaurl":"https://cdn.sanity.io/files/gx9wf39f/soknadsveiviser-p/4f473293d31eee48921daecc72b1157e2a06542f.pdf","opplastingsStatus":"IKKE_VALGT","opprettetdato":"2022-02-10T15:14:23.401027"}]}',
);

const NAeks = [
    {
        id: 0,
        innsendingsId: 'string',
        ettersendingsId: 'string',
        brukerId: 'string',
        skjemanr: 'string',
        tittel: 'string',
        tema: 'string',
        spraak: 'string',
        status: 'Opprettet',
        opprettetDato: '2022-02-14T14:55:58.802Z',
        endretDato: '2022-02-14T14:55:58.802Z',
        innsendtDato: '2022-02-14T14:55:58.802Z',
        vedleggsListe: [
            {
                id: 0,
                vedleggsnr: 'string',
                tittel: 'string',
                uuid: 'string',
                mimetype: 'string',
                document: ['string'],
                erHoveddokument: true,
                erVariant: true,
                erPdfa: true,
                skjemaurl: 'string',
                opplastingsStatus: 'IKKE_VALGT',
                opprettetdato: '2022-02-14T14:55:58.802Z',
            },
        ],
    },
];

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    res.status(200).json(NAeks);
}
