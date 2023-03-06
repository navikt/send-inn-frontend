import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;

export const hentFiler = rest.get(
    REMOTE_API_URL +
        '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
    async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
    },
);
