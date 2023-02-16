/// <reference types="cypress" />

describe('Tester ettersendingsløpet', () => {
    it('Går igjennom fra åpning av url som oppretter ettersending til kvitteringssiden', () => {
        cy.get;
        cy.visit(
            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2',
        );

        cy.get('[data-cy="filvelgerKnapp"]').should('have.length', 3);
        cy.get('[data-cy="filvelgerKnapp"]', {
            timeout: 10000,
        })
            .eq(0)
            .should('be.visible');

        cy.get('[data-cy="filvelgerKnapp"]').eq(0).click();

        cy.get('[data-cy="filvelgerKnapp"]')
            .eq(0)
            .should('be.visible')
            .selectFile('cypress/fixtures/MarcusAurelius.jpeg');

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');

        cy.get('[data-cy="sendSenereRadio"]')
            .eq(0)
            .click()
            .should('be.checked');

        cy.get('[data-cy="sendSenereRadio"]')
            .eq(1)
            .click()
            .should('be.checked');

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
