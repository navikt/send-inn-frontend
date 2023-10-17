/// <reference types="cypress" />
import translations from '../../assets/locales/nb/translation.json';

describe('Tester validering', () => {
  it('Legger til valideringsfeil, og fikser dem', () => {
    cy.get;
    cy.visit(
      '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2',
    );

    // sjekker at valideringsfeil stopper neste steg, og at valideringsfeil-boksen får fokus
    cy.get('[data-cy="nesteStegKnapp"]').should('be.visible').click();
    cy.get('[data-cy="nesteStegKnapp"]').click();

    cy.focused()
      .should('have.attr', 'data-cy', 'valideringsfeil')
      .within(() => {
        cy.get('li').should('have.length', 1);
      });

    // fikser feil, og går til neste steg
    cy.get('[data-cy="filvelgerKnapp"]').click();
    cy.get('[data-cy="filvelgerKnapp"]').selectFile('cypress/fixtures/MarcusAurelius.jpeg');

    cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');

    cy.get('[data-cy="nesteStegKnapp"]').click();

    cy.get('[data-cy="filvelgerKnapp"]').should('have.length', 3);

    // Oppretter annet vedlegg, og prøver å sende inn uten å laste opp noe
    cy.get('[data-cy="opprettAnnetVedlegg"]').click();
    cy.get('[data-cy="opprettAnnetVedleggPanel"]').should('be.visible');
    cy.get('[data-cy="opprettAnnetVedleggPanel"]').within(() => {
      cy.get('input').type('Ekstra vedlegg #1');
      cy.contains(translations.soknad.vedlegg.annet.bekreft).click();
    });
    cy.get('[data-cy="VedleggContainer"]').should('have.length', 4);

    cy.get('[data-cy="sendTilNAVKnapp"]').click();

    cy.focused()
      .should('have.attr', 'data-cy', 'valideringsfeil')
      .within(() => {
        cy.get('li').should('have.length', 4);
      });

    // fikser alle valideringsfeil, og sender inn
    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
      });

    cy.get('[data-cy="valideringsfeil"]').within(() => {
      cy.get('li').should('have.length', 3);
    });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    cy.get('[data-cy="valideringsfeil"]').within(() => {
      cy.get('li').should('have.length', 2);
    });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    cy.get('[data-cy="valideringsfeil"]').within(() => {
      cy.get('li').should('have.length', 1);
    });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(3)
      .within(() => {
        cy.contains(translations.soknad.vedlegg.annet.slett).click();
      });

    cy.get('[data-cy="valideringsfeil"]').should('not.exist');

    cy.get('[data-cy="sendTilNAVKnapp"]').click();
    cy.get('[data-cy="jaFellesModalKnapp"]').should('be.visible');
  });
});
