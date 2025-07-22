/// <reference types="cypress" />
import saksbehandlerEttersending from '../../mocks/data/soknad/ettersending-saksbehandler.json';
const vedlegg = saksbehandlerEttersending.vedleggsListe[0];

describe('Tester ettersending opprettet av saksbehandler', () => {
  it('Går igjennom fra åpning og tester vedleggsvalg', () => {
    cy.visit('/ettersending-saksbehandler');

    // Laster opp fil på første vedlegg
    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible');
      });

    // Setter andre vedlegg til "Send senere""
    cy.get('[data-cy="VedleggContainer"]')
      .eq(1)
      .within(() => {
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
      });

    // Setter tredje til "har ikke dokumentasjon
    cy.get('[data-cy="VedleggContainer"]')
      .eq(2)
      .within(() => {
        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').click();
        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').should('be.checked');
      });

    // Sender inn
    cy.findByRole('button', { name: 'Send til Nav' }).should('exist').click();

    // Modal
    cy.findByRole('heading', {
      name: 'Er du sikker på at du vil sende søknaden nå, selv om ikke alle dokumenter er lastet opp?',
    }).should('exist');
    cy.findByRole('button', { name: 'Ja, send søknaden' }).should('exist').click();

    // Kvittering
    cy.get('[data-cy="kvitteringOverskrift"]').should('be.visible');
    cy.findByRole('heading', { name: /Vi mottok disse dokumentene/ })
      .should('exist')
      .closest('section')
      .within(() => {
        cy.findByRole('listitem')
          .should('have.length', 1)
          .should(
            'contain.text',
            'Dokumentasjon: Arbeidslogg for utprøving av Innowalk som grunnlag for helhetsvurdering og vedlegg til søknad',
          );
      });
    cy.findByRole('heading', { name: 'Dokumenter som må ettersendes:' })
      .should('exist')
      .closest('section')
      .within(() => {
        cy.findByRole('listitem').should('have.length', 1).should('contain.text', 'Dokumentasjon på mottatt bidrag');
      });
    cy.findByRole('heading', { name: 'Frist for å ettersende dokumentene: 11.07.2024' }).should('exist');
  });
});
