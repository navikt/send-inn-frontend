import { HttpResponse, http } from 'msw';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

export const opprettFil = http.post(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
  async ({ request }) => {
    const file = (await request.formData()).get('file');
    if (!(file instanceof File) || file.size === 0) {
      return HttpResponse.json(await importJSON('filFeil.json'), { status: 400 });
    }

    return HttpResponse.json(await importJSON('fil.json'), { status: 201 });
  },
);
