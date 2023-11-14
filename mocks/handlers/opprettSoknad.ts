import { http, HttpResponse } from 'msw';
import { soknadMock } from '../data/soknad';
const { REMOTE_API_URL } = process.env;

export const opprettSoknad = http.post(REMOTE_API_URL + '/frontend/v1/soknad', async () => {
  return HttpResponse.json(await soknadMock('dokumentinnsending-default'), { status: 201 });
});
