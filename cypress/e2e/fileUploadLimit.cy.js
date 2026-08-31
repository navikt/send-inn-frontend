/// <reference types="cypress" />
import { fileUtils } from '../../utils/file';

const MB = 1024 * 1024;

describe('File upload limit', () => {
  it('identifies files exceeding 150 MB', () => {
    expect(fileUtils.exceedsMaxSize(100 * MB, 150)).to.equal(false);
    expect(fileUtils.exceedsMaxSize(150 * MB, 150)).to.equal(false);
    expect(fileUtils.exceedsMaxSize(150 * MB + 1, 150)).to.equal(true);
  });

  it('shows the configured limit', () => {
    cy.visit('/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1');

    cy.findByRole('button', { name: 'Gyldige filtyper og filstørrelser' }).click();
    cy.contains('Du kan laste opp flere filer, men maksimalt kan ikke opplastingen være mer enn 150 MB.').should(
      'be.visible',
    );
  });
});
