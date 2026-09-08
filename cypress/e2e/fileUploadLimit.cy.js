/// <reference types="cypress" />
import { fileUtils } from '../../utils/file';

const MB = 1024 * 1024;

describe('File upload limit', () => {
  it('creates a memory-backed copy for Safari 26.5', async () => {
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

  it('keeps the original file in unaffected browsers', async () => {
    const file = new File(['file content'], 'attachment.txt', { type: 'text/plain' });
    const chromeUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

    const preparedFile = await fileUtils.prepareForUpload(file, chromeUserAgent);

    expect(preparedFile).to.equal(file);
  });

  it('identifies files exceeding 150 MB', () => {
    expect(fileUtils.exceedsMaxSize(100 * MB, 150)).to.equal(false);
    expect(fileUtils.exceedsMaxSize(150 * MB, 150)).to.equal(false);
    expect(fileUtils.exceedsMaxSize(150 * MB + 1, 150)).to.equal(true);
  });

  it('shows the configured limit', () => {
    cy.visit('/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1');

    cy.get('[data-cy="VedleggContainer"]')
      .first()
      .within(() => {
        cy.findByRole('button', { name: 'Gyldige filtyper og filstørrelser' }).click();
        cy.contains('Du kan laste opp flere filer, men maksimalt kan ikke opplastingen være mer enn 150 MB.').should(
          'be.visible',
        );
      });
  });
});
