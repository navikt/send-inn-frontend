/// <reference types="cypress" />

describe('Tester dokumentinnsendingsløpet', () => {
    it('Går igjennom fra åpning av url som oppretter søknad til kvitteringssiden', () => {
        cy.viewport(2500, 1200);
        cy.get;
        cy.visit(
            'http://localhost:3000/sendinn/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2',
        );

        cy.get('[data-cy="nesteStegKnapp"]', { timeout: 10000 })
            .should('be.visible')
            .click();

        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').selectFile(
            'cypress/fixtures/MarcusAurelius.jpeg',
        );

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');

        cy.get('[data-cy="nesteStegKnapp"]').click();

        cy.get('[data-cy="filvelgerKnapp"]').eq(0).click();
        cy.get('[data-cy="filvelgerKnapp"]')
            .eq(0)
            .selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.wait(50);

        cy.wait(1000);
        cy.get('[data-cy="sendSenereRadio"]', {
            timeout: 10000,
        })
            .eq(1)
            .click();
        cy.wait(1000);
        cy.get('[data-cy="sendSenereRadio"]').eq(2).click();

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');
        cy.wait(500);
        cy.get('[data-cy="sendTilNAVKnapp"]', {
            timeout: 10000,
        }).click();
        cy.wait(100);
        cy.get('[data-cy="jaFellesModalKnapp"]', {
            timeout: 10000,
        })
            .should('be.visible')
            .click();

        cy.wait(20);
        cy.get('[data-cy="kvitteringOverskrift"]', {
            timeout: 10000,
        }).should('be.visible');
    });
});
