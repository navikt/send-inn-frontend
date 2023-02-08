/// <reference types="cypress" />

describe('Tester dokumentinnsendingsløpet', () => {
    it('Går igjennom fra åpning av url som oppretter søknad til kvitteringssiden', () => {
        cy.get;
        cy.visit(
            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2',
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

        cy.get('[data-cy="filvelgerKnapp"]').should('have.length', 3);

        cy.get('[data-cy="lasterOppNaaRadio"]')
            .eq(0)
            .should('be.checked')
            .should('have.value', 'IkkeValgt');

        cy.get('[data-cy="filvelgerKnapp"]').eq(0).click();
        cy.get('[data-cy="filvelgerKnapp"]')
            .eq(0)
            .selectFile('cypress/fixtures/MarcusAurelius.jpeg');

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');

        cy.get('[data-cy="lasterOppNaaRadio"]')
            .eq(0)
            .should('be.checked')
            .should('have.value', 'LastetOpp');

        cy.get('[data-cy="sendSenereRadio"]', {
            timeout: 10000,
        })
            .eq(1)
            .click()
            .should('be.checked');

        cy.get('[data-cy="sendSenereRadio"]')
            .eq(2)
            .click()
            .should('be.checked');

        cy.get('[data-cy="fileUploadSuccessIkon"]', {
            timeout: 10000,
        }).should('be.visible');

        cy.get('[data-cy="sendTilNAVKnapp"]', {
            timeout: 10000,
        }).click();

        cy.get('[data-cy="jaFellesModalKnapp"]', {
            timeout: 10000,
        })
            .should('be.visible')
            .click();

        cy.get('[data-cy="kvitteringOverskrift"]', {
            timeout: 10000,
        }).should('be.visible');
    });
});
