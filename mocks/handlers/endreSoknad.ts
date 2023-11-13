import { http } from 'msw';
const { REMOTE_API_URL } = process.env;

export const endreSoknad = http.patch(REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId', () => {
  return new Response(null, { status: 204 });
});
