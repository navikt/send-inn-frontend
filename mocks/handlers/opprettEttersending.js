import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;
import { soknadMock } from '../data/soknad/index.js';

export const opprettEttersending = rest.post(
    REMOTE_API_URL + '/frontend/v1/ettersendPaSkjema',
    async (req, res, ctx) => {
        return res(
            ctx.status(201),
            ctx.json(await soknadMock('ettersending-default')),
        );
    },
);
