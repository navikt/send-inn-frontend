import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;

export const endreVedlegg = rest.patch(
    REMOTE_API_URL +
        '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId',
    async (req, res, ctx) => {
        const body = await req.json();
        return res(
            ctx.status(200),
            ctx.json({
                tittel: body.tittel,
                opplastingsStatus: body.opplastingsStatus,
            }),
        );
    },
);
