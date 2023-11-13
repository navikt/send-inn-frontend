import { HttpResponse, http } from 'msw';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

export const sendInn = http.post(REMOTE_API_URL + '/frontend/v1/sendInn/:innsendingsId', async () => {
  return HttpResponse.json(await importJSON('kvittering.json'), { status: 200 });
});
