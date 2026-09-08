/// <reference types="cypress" />
import { uploadFileWithFallback } from '../../utils/fileUpload';

const errorResponse = (status, errorCode) => ({
  isAxiosError: true,
  response: {
    status,
    data: { errorCode },
  },
});

describe('File upload fallback', () => {
  it('uploads the original file once when the first request succeeds', async () => {
    const originalFile = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    originalFile.arrayBuffer = () => Promise.reject(new Error('The file should not be materialized'));
    const attempts = [];

    const response = await uploadFileWithFallback(originalFile, async (formData) => {
      attempts.push(formData);
      return { status: 201 };
    });

    expect(response.status).to.equal(201);
    expect(attempts).to.have.length(1);
    expect(attempts[0].get('file')).to.equal(originalFile);
  });

  it('uploads the original file first, then retries once with a memory-backed copy for the missing part error', async () => {
    const originalFile = new File(['file content'], 'attachment.txt', {
      lastModified: 123,
      type: 'text/plain',
    });
    const attempts = [];
    const upload = async (formData) => {
      attempts.push(formData);
      if (attempts.length === 1) {
        throw errorResponse(400, 'invalidRequest.missingMultipartPart');
      }
      return { status: 201 };
    };

    const response = await uploadFileWithFallback(originalFile, upload);

    expect(response.status).to.equal(201);
    expect(attempts).to.have.length(2);
    expect(attempts[0]).not.to.equal(attempts[1]);
    expect(attempts[0].get('file')).to.equal(originalFile);

    const retryFile = attempts[1].get('file');
    expect(retryFile).to.be.instanceOf(File);
    expect(retryFile).not.to.equal(originalFile);
    expect(retryFile.name).to.equal(originalFile.name);
    expect(retryFile.type).to.equal(originalFile.type);
    expect(retryFile.lastModified).to.equal(originalFile.lastModified);
    expect(await retryFile.text()).to.equal('file content');
  });

  [
    ['the broad unreadable-file error', errorResponse(400, 'illegalAction.fileCannotBeRead')],
    ['an unrelated API error', errorResponse(400, 'illegalAction.virusScanFailed')],
    ['a 413 response', errorResponse(413, 'invalidRequest.missingMultipartPart')],
    ['a network error', { isAxiosError: true, request: {} }],
    ['a timeout', { isAxiosError: true, code: 'ECONNABORTED', request: {} }],
  ].forEach(([scenario, uploadError]) => {
    it(`does not retry ${scenario}`, async () => {
      const originalFile = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
      let attempts = 0;

      try {
        await uploadFileWithFallback(originalFile, async () => {
          attempts += 1;
          throw uploadError;
        });
        throw new Error('Expected upload to fail');
      } catch (error) {
        expect(error).to.equal(uploadError);
        expect(attempts).to.equal(1);
      }
    });
  });

  it('passes through materialization errors without another original-file upload', async () => {
    const originalFile = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const materializationError = new DOMException('File cannot be read', 'NotReadableError');
    originalFile.arrayBuffer = () => Promise.reject(materializationError);
    let attempts = 0;

    try {
      await uploadFileWithFallback(originalFile, async () => {
        attempts += 1;
        throw errorResponse(400, 'invalidRequest.missingMultipartPart');
      });
      throw new Error('Expected upload to fail');
    } catch (error) {
      expect(error).to.equal(materializationError);
      expect(attempts).to.equal(1);
    }
  });

  it('passes through the retry error and never retries recursively', async () => {
    const originalFile = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const initialError = errorResponse(400, 'invalidRequest.missingMultipartPart');
    const retryError = errorResponse(400, 'invalidRequest.missingMultipartPart');
    let attempts = 0;

    try {
      await uploadFileWithFallback(originalFile, async () => {
        attempts += 1;
        throw attempts === 1 ? initialError : retryError;
      });
      throw new Error('Expected upload to fail');
    } catch (error) {
      expect(error).to.equal(retryError);
      expect(attempts).to.equal(2);
    }
  });
});
