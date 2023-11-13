import { HttpResponse, http } from 'msw';
const { REMOTE_API_URL } = process.env;

export const slettVedlegg = http.delete(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId',
  async ({ params }) => {
    const { vedleggId } = params;
    return HttpResponse.json(
      {
        status: 'OK',
        info: 'Slettet vedlegg med id ' + vedleggId,
      },
      { status: 200 },
    );
  },
);
