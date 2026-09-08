/// <reference types="cypress" />
import { fileUtils } from '../../utils/file';

describe('File preparation', () => {
  it('creates a memory-backed copy for affected Safari versions', async () => {
    const file = new File(['file content'], 'attachment.txt', {
      lastModified: 123,
      type: 'text/plain',
    });
    const safari265UserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5.2 Safari/605.1.15';

    const preparedFile = await fileUtils.prepareForUpload(file, safari265UserAgent);

    expect(preparedFile).not.to.equal(file);
    expect(preparedFile.name).to.equal(file.name);
    expect(preparedFile.type).to.equal(file.type);
    expect(preparedFile.lastModified).to.equal(file.lastModified);
    expect(await preparedFile.text()).to.equal('file content');
  });

  it('creates a memory-backed copy for Safari versions after 26.5', async () => {
    const file = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const safari266UserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Safari/605.1.15';

    expect(await fileUtils.prepareForUpload(file, safari266UserAgent)).not.to.equal(file);
  });

  it('creates a memory-backed copy for affected iOS versions', async () => {
    const file = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const iosUserAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 27_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1';

    expect(await fileUtils.prepareForUpload(file, iosUserAgent)).not.to.equal(file);
  });

  it('keeps the original file when the memory-backed copy fails', async () => {
    const file = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const safariUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15';
    file.arrayBuffer = () => Promise.reject(new DOMException('File cannot be read', 'NotReadableError'));

    expect(await fileUtils.prepareForUpload(file, safariUserAgent)).to.equal(file);
  });

  it('keeps the original file in unaffected browsers and Safari versions', async () => {
    const file = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const chromeUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
    const safari264UserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15';

    expect(await fileUtils.prepareForUpload(file, chromeUserAgent)).to.equal(file);
    expect(await fileUtils.prepareForUpload(file, safari264UserAgent)).to.equal(file);
  });
});
