import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;

export const endreSoknad = rest.patch(
    REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId',
    (req, res, ctx) => {
        // const { innsendingsId } = req.params;
        return res(ctx.status(204));
    },
);
