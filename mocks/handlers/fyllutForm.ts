import { HttpResponse, http } from 'msw';
import { fyllutMock } from '../data/fyllut';

const { FYLLUT_API_URL } = process.env;

export const getFyllutForm = http.get(FYLLUT_API_URL + '/api/forms/:formPath', async ({ params }) => {
  const { formPath } = params;
  const fyllutForm = await fyllutMock(formPath as string);
  return HttpResponse.json(fyllutForm, { status: 200 });
});
