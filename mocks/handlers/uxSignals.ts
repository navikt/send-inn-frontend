import { HttpResponse, http } from 'msw';
import { uxSignalsMock } from '../data/uxsignals';

export const getUxSignals = http.get('https://api.uxsignals.com/v2/study/id/:uxSignalsId', async ({ params }) => {
  const { uxSignalsId } = params;
  const fyllutForm = await uxSignalsMock(uxSignalsId as string);
  return HttpResponse.json(fyllutForm, { status: 200 });
});
