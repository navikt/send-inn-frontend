/// <reference types="cypress" />
import translations from '../../assets/locales/nb/translation.json';

describe('Tester dokumentinnsendingsløpet', () => {
  it('Går igjennom fra åpning av url som oppretter søknad til kvitteringssiden', () => {
    cy.visit(
      '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=false&vedleggsIder=C1,W1,G2',
    );

    // Bekrefter at siden er rendret
    cy.get('[data-cy="nesteStegKnapp"]').should('be.visible').click();
    cy.injectAxe();
    cy.checkA11y('#__next');

    // Laster opp fil på hoveddokument
    cy.get('[data-cy="filvelgerKnapp"]').click();
    cy.get('[data-cy="filvelgerKnapp"]').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
    cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');

    // Går til vedleggsiden
    cy.get('[data-cy="nesteStegKnapp"]').click();

    cy.get('[data-cy="filvelgerKnapp"]').should('have.length', 3);
    cy.checkA11y('#__next');

    // Laster opp fil på første vedlegg
    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="lasterOppNaaRadio"]').should('be.checked').should('have.value', 'IkkeValgt');
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible');
      });

    // Setter de to neste vedleggene til "Sendes senere"
    cy.get('[data-cy="VedleggContainer"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    cy.get('[data-cy="VedleggContainer"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    // Oppretter nytt annet vedlegg
    cy.get('[data-cy="opprettAnnetVedlegg"]').click();
    cy.get('[data-cy="opprettAnnetVedleggPanel"]')
      .should('be.visible')
      .within(() => {
        cy.checkA11y('#__next');
        cy.get('input').type('Ekstra vedlegg #1');
        cy.contains(translations.soknad.vedlegg.annet.bekreft).click();
      });
    cy.get('[data-cy="VedleggContainer"]').should('have.length', 4);

    // Laster opp to filer, og sletter den ene
    cy.get('[data-cy="VedleggContainer"]')
      .eq(3)
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('have.length', 2);
        cy.get('[data-cy="slettFilKnapp"]').eq(1).click();
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('have.length', 1);
      });

    // Oppretter nytt annet vedlegg, og sletter det
    cy.get('[data-cy="opprettAnnetVedlegg"]').click();
    cy.get('[data-cy="opprettAnnetVedleggPanel"]')
      .should('be.visible')
      .within(() => {
        cy.get('input').type('Ekstra vedlegg #2');
        cy.contains(translations.soknad.vedlegg.annet.bekreft).click();
      });

    cy.get('[data-cy="VedleggContainer"]').should('have.length', 5);
    cy.get('[data-cy="VedleggContainer"]')
      .eq(4)
      .within(() => {
        cy.contains(translations.soknad.vedlegg.annet.slett).click();
      });
    cy.get('[data-cy="VedleggContainer"]').should('have.length', 4);

    cy.checkA11y('#__next');

    // Sender inn
    cy.get('[data-cy="sendTilNAVKnapp"]').click();

    cy.get('[data-cy="jaFellesModalKnapp"]').should('be.visible').click();

    cy.get('[data-cy="kvitteringOverskrift"]').should('be.visible');
    cy.checkA11y('#__next');
  });
});
