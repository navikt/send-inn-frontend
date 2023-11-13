import { HttpResponse, http } from 'msw';
const { REMOTE_API_URL } = process.env;

export const endreVedlegg = http.patch(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId',
  async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(body, { status: 200 });
  },
);
