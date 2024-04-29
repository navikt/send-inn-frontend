import { HttpResponse, http } from 'msw';
import { fyllutMock } from '../data/fyllut';

const { NEXT_PUBLIC_FYLLUT_URL } = process.env;

export const getFyllutForm = http.get(NEXT_PUBLIC_FYLLUT_URL + '/api/forms/:formPath', async ({ params }) => {
  const { formPath } = params;
  const fyllutForm = await fyllutMock(formPath as string);
  return HttpResponse.json(fyllutForm, { status: 200 });
});
