import { HttpResponse, http } from 'msw';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

export const sendInn = http.post(REMOTE_API_URL + '/frontend/v1/sendInn/:innsendingsId', async (req) => {
  const { innsendingsId } = req.params;
  let file;
  switch (innsendingsId) {
    case 'lospost-default':
    case 'ettersending-default':
      file = innsendingsId;
      break;
    default:
      file = 'kvittering';
      break;
  }
  return HttpResponse.json(await importJSON(`kvittering/${file}.json`), { status: 200 });
});
