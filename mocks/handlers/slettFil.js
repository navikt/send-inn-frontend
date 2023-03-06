import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;

export const slettFil = rest.delete(
    REMOTE_API_URL +
        '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil/:filId',
    async (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                opplastingsStatus: 'IkkeValgt',
            }),
        );
    },
);
