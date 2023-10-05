import type { NextApiRequest, NextApiResponse } from 'next';

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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(NAeks);
}
