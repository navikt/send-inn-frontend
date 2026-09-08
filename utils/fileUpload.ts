import axios from 'axios';
import type { ErrorResponsDto } from '../types/types';
import { sendLog } from './frontendLogger';

const MISSING_MULTIPART_PART = 'invalidRequest.missingMultipartPart';

type Upload<T> = (formData: FormData) => Promise<T>;
type RetryOutcome = 'started' | 'succeeded' | 'materialization_failed' | 'failed';

const uploadFile = <T>(file: File, upload: Upload<T>) => {
  const formData = new FormData();
  formData.append('file', file);
  return upload(formData);
};

const logFallback = (file: File, responseStatus: number, retryOutcome: RetryOutcome) => {
  const mimeType = (file.type || 'unknown').replace(/[^a-zA-Z0-9.+/-]/g, '_').slice(0, 100);
  void sendLog({
    message: `event=missing_multipart_part_fallback responseStatus=${responseStatus} responseCode=${MISSING_MULTIPART_PART} fileSize=${file.size} mimeType=${mimeType} retryOutcome=${retryOutcome}`,
    level: 'warn',
  });
};

export const uploadFileWithFallback = async <T>(file: File, upload: Upload<T>): Promise<T> => {
  try {
    return await uploadFile(file, upload);
  } catch (error) {
    if (
      !axios.isAxiosError<ErrorResponsDto>(error) ||
      !error.response ||
      error.response.status === 413 ||
      error.response.data?.errorCode !== MISSING_MULTIPART_PART
    ) {
      throw error;
    }

    const responseStatus = error.response.status;
    logFallback(file, responseStatus, 'started');

    let memoryBackedFile: File;
    try {
      memoryBackedFile = new File([await file.arrayBuffer()], file.name, {
        lastModified: file.lastModified,
        type: file.type,
      });
    } catch (materializationError) {
      logFallback(file, responseStatus, 'materialization_failed');
      throw materializationError;
    }

    try {
      const response = await uploadFile(memoryBackedFile, upload);
      logFallback(file, responseStatus, 'succeeded');
      return response;
    } catch (retryError) {
      logFallback(file, responseStatus, 'failed');
      throw retryError;
    }
  }
};
