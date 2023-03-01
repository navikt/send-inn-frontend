import { rest } from 'msw';
import { importJSON } from '../utils/importJSON.js';
const { REMOTE_API_URL } = process.env;

export const opprettFil = rest.post(
    REMOTE_API_URL +
        '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
    async (req, res, ctx) => {
        // const { innsendingsId, vedleggId } = req.params;
        return res(
            ctx.status(201),
            ctx.json(await importJSON('../data/fil.json')),
        );
    },
);
