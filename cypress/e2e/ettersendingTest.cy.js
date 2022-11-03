/// <reference types="cypress" />

describe('Tester ettersendingsløpet', () => {
    it('Går igjennom fra åpning av url som oppretter ettersending til kvitteringssiden', () => {
        cy.viewport(2500, 1200);
        cy.get;
        cy.visit(
            'http://localhost:3000/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2',
        );
        cy.get('[data-cy="filvelgerKnapp"]', {
            timeout: 10000,
        }).should('be.visible');
        cy.wait(500);

        cy.get('[data-cy="filvelgerKnapp"]', {
            timeout: 10000,
        })
            .eq(0)
            .click();

        cy.get('[data-cy="filvelgerKnapp"]')
            .eq(0)
            .selectFile('cypress/fixtures/MarcusAurelius.jpeg');

        cy.wait(20);

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');

        cy.wait(500);
        cy.get('[data-cy="sendSenereRadio"]').eq(0).click();
        cy.wait(500);
        cy.get('[data-cy="sendSenereRadio"]').eq(1).click();

        cy.wait(1000);
        cy.get('[data-cy="sendTilNAVKnapp"]', {
            timeout: 10000,
        }).click();
        cy.wait(1000);

        cy.get('[data-cy="jaFellesModalKnapp"]', {
            timeout: 10000,
        }).should('be.visible');
        cy.wait(1000);

        cy.get('[data-cy="jaFellesModalKnapp"]').click();

        cy.wait(20);
        cy.get('[data-cy="kvitteringOverskrift"]', {
            timeout: 10000,
        }).should('be.visible');
    });
});
