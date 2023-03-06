import { rest } from 'msw';
import { importJSON } from '../utils/importJSON.js';
const { REMOTE_API_URL } = process.env;

export const opprettVedlegg = rest.post(
    REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg',
    async (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json(await importJSON('../data/annetVedlegg.json')),
        );
    },
);
