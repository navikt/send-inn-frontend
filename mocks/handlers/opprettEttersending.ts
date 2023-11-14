import { HttpResponse, http } from 'msw';
import { soknadMock } from '../data/soknad';
const { REMOTE_API_URL } = process.env;

export const opprettEttersending = http.post(REMOTE_API_URL + '/frontend/v1/ettersendPaSkjema', async () => {
  return HttpResponse.json(await soknadMock('ettersending-default'), { status: 201 });
});
