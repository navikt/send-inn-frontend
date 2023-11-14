import { HttpResponse, http } from 'msw';
const { REMOTE_API_URL } = process.env;

export const hentFiler = http.get(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
  async () => {
    return HttpResponse.json([], { status: 200 });
  },
);
