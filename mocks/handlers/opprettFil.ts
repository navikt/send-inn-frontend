import { HttpResponse, http } from 'msw';
import type { ErrorResponsDto } from '../../types/types';
import { importJSON } from '../utils/importJSON';
const { REMOTE_API_URL } = process.env;

const missingMultipartPartResponse = {
  arsak: 'Required multipart file part is missing or empty',
  errorCode: 'invalidRequest.missingMultipartPart',
  message: 'Required multipart file part is missing or empty',
  timeStamp: '2026-09-08T00:00:00Z',
} satisfies ErrorResponsDto;

export const opprettFil = http.post(
  REMOTE_API_URL + '/frontend/v1/soknad/:innsendingsId/vedlegg/:vedleggId/fil',
  async ({ request }) => {
    const file = (await request.formData()).get('file');
    if (!(file instanceof File) || file.size === 0) {
      return HttpResponse.json(missingMultipartPartResponse, { status: 400 });
    }

    return HttpResponse.json(await importJSON('fil.json'), { status: 201 });
  },
);
