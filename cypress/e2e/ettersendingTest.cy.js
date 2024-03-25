/// <reference types="cypress" />

describe('Tester ettersendingsløpet', () => {
  it('Går igjennom fra åpning av url som oppretter ettersending til kvitteringssiden', () => {
    cy.get;
    cy.visit(
      '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2',
    );

    // Laster opp fil på første vedlegg
    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible');
      });

    // Setter andre vedlegg til "Send senere", og tredje til "sendes av andre"
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

    // Sender inn
    cy.get('[data-cy="sendTilNAVKnapp"]').click();

    cy.get('[data-cy="jaFellesModalKnapp"]').filter(':visible').should('be.visible').click();

    cy.get('[data-cy="kvitteringOverskrift"]').should('be.visible');
  });
});
