import { HttpResponse, http } from 'msw';
import { soknadMock } from '../data/soknad';
const { REMOTE_API_URL } = process.env;

export const hentSoknad = http.get(REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId', async ({ params }) => {
  const { innsendingsId } = params;
  const soknad = await soknadMock(innsendingsId as string);
  soknad.innsendingsId = innsendingsId;
  return HttpResponse.json(soknad, { status: 200 });
});
