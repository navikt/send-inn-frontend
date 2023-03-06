import { rest } from 'msw';
import { importJSON } from '../utils/importJSON.js';
const { REMOTE_API_URL } = process.env;

export const sendInn = rest.post(
    REMOTE_API_URL + '/frontend/v1/sendInn/:innsendingsId',
    async (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json(await importJSON('../data/kvittering.json')),
        );
    },
);
