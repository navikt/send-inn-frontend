/// <reference types="cypress" />

describe('Tester ettersendingsløpet', () => {
  it('Går igjennom fra åpning av url som oppretter ettersending til kvitteringssiden', () => {
    cy.get;
    cy.visit(
      '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2',
    );

    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible');
      });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="sendesAvAndreRadio"]').click();
        cy.get('[data-cy="sendesAvAndreRadio"]').should('be.checked');
      });

    cy.get('[data-cy="sendTilNAVKnapp"]', {
      timeout: 10000,
    }).click();

    cy.get('[data-cy="jaFellesModalKnapp"]', {
      timeout: 10000,
    }).should('be.visible');

    cy.get('[data-cy="jaFellesModalKnapp"]').click();

    cy.get('[data-cy="kvitteringOverskrift"]', {
      timeout: 10000,
    }).should('be.visible');
  });
});
