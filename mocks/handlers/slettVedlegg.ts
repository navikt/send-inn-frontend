import { rest } from 'msw';
const { REMOTE_API_URL } = process.env;

export const slettVedlegg = rest.delete(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId',
  async (req, res, ctx) => {
    const { vedleggId } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        status: 'OK',
        info: 'Slettet vedlegg med id ' + vedleggId,
      }),
    );
  },
);
