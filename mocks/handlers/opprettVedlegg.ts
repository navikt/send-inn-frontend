import { HttpResponse, PathParams, http } from 'msw';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

export const opprettVedlegg = http.post<PathParams, { tittel: string }>(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg',
  async ({ request }) => {
    const { tittel } = await request.json();
    const vedleggBody = await importJSON('annetVedlegg.json');

    vedleggBody.tittel = tittel;
    vedleggBody.label = tittel;
    vedleggBody.id = Date.now();

    return HttpResponse.json(vedleggBody, { status: 201 });
  },
);
