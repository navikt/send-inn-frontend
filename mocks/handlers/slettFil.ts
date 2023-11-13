import { HttpResponse, http } from 'msw';
const { REMOTE_API_URL } = process.env;

export const slettFil = http.delete(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil/:filId',
  async () => {
    return HttpResponse.json(
      {
        opplastingsStatus: 'IkkeValgt',
      },
      { status: 200 },
    );
  },
);
