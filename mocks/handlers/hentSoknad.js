import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;
import { soknadMock } from '../data/soknad/index.js';

export const hentSoknad = rest.get(
    REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId',
    async (req, res, ctx) => {
        const { innsendingsId } = req.params;
        const soknad = await soknadMock(innsendingsId);
        soknad.innsendingsId = innsendingsId;
        return res(ctx.status(200), ctx.json(soknad));
    },
);
