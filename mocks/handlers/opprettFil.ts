import { HttpResponse, http } from 'msw';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

export const opprettFil = http.post(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
  async () => {
    return HttpResponse.json(await importJSON('fil.json'), { status: 201 });
  },
);
