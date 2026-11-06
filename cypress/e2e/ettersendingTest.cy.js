/// <reference types="cypress" />
import kvittering from '../../mocks/data/kvittering/ettersending-default.json';

describe('Tester ettersendingsløpet', () => {
  [
    { name: 'no outstanding documents', ettersendes: false, sendesAvAndre: false },
    { name: 'documents to submit later', ettersendes: true, sendesAvAndre: false },
    { name: 'documents to be submitted by others', ettersendes: false, sendesAvAndre: true },
    { name: 'documents to submit both later and by others', ettersendes: true, sendesAvAndre: true },
  ].forEach(({ name, ettersendes, sendesAvAndre }) => {
    it(`Shows receipt with ${name}`, () => {
      cy.intercept('POST', '/sendinn/api/backend/frontend/v1/sendInn/ettersending-default', {
        ...kvittering,
        skalEttersendes: ettersendes ? kvittering.skalEttersendes : [],
        skalSendesAvAndre: sendesAvAndre ? kvittering.skalSendesAvAndre : [],
      }).as('sendInn');
      cy.visit('/ettersending-default');

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
      cy.findByRole('button', { name: 'Send til Nav' }).should('exist').click();

      // Modal
      cy.findByRole('heading', {
        name: 'Er du sikker på at du vil sende søknaden nå, selv om ikke alle dokumenter er lastet opp?',
      }).should('exist');
      cy.findByRole('button', { name: 'Ja, send søknaden' }).should('exist').click();
      cy.wait('@sendInn');

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
      if (ettersendes) {
        cy.findByRole('heading', { name: 'Dokumenter som må ettersendes:' })
          .should('exist')
          .closest('section')
          .within(() => {
            cy.findByRole('listitem')
              .should('have.length', 1)
              .should('contain.text', 'Dokumentasjon på mottatt bidrag');
          });
      } else {
        cy.findByRole('heading', { name: 'Dokumenter som må ettersendes:' }).should('not.exist');
      }
      if (sendesAvAndre) {
        cy.findByRole('heading', { name: 'Dokumenter som skal sendes av andre:' })
          .should('exist')
          .closest('section')
          .within(() => {
            cy.findByRole('listitem')
              .should('have.length', 1)
              .should('contain.text', 'Bekreftelse på arbeidsforhold og permittering');
          });
      } else {
        cy.findByRole('heading', { name: 'Dokumenter som skal sendes av andre:' }).should('not.exist');
      }
      cy.findByRole('heading', { name: 'Frist for å ettersende dokumentene: 11.07.2024' }).should(
        ettersendes || sendesAvAndre ? 'exist' : 'not.exist',
      );
      cy.findAllByText('På Min side kan du se dokumentene du har sendt inn for deg selv.')
        .should('have.length', 1)
        .and('be.visible')
        .parent()
        .within(() => {
          cy.contains('For at søknaden skal bli komplett må du sende inn dokumentasjonen som mangler.').should(
            ettersendes ? 'exist' : 'not.exist',
          );
          cy.contains(/Sørg (også )?for at dokumentene som skal sendes inn av andre blir sendt inn\./).should(
            sendesAvAndre ? 'exist' : 'not.exist',
          );
          cy.get('p').each(($paragraph) => {
            expect($paragraph.text().trim()).not.to.equal('');
          });
        });
      cy.contains('På Min side kan du se hvilke dokumenter som er sendt inn.').should('not.exist');
      cy.contains('På Min side kan du se dokumentene som er sendt inn.').should('not.exist');
      cy.injectAxe();
      cy.checkA11y('#__next');
    });
  });

  it('Limits document archive guidance to documents submitted on your own behalf', () => {
    cy.visit('/feilside/soknad-sendt-inn');
    [
      'Du kan se dokumentene du har sendt inn for deg selv i dokumentarkivet.',
      'Du kan sjå dokumenta du har sendt inn for deg sjølv i dokumentarkivet.',
      'You can see the documents you have submitted on your own behalf in the document archive.',
    ].forEach((text) => {
      cy.contains('p', text).should('be.visible');
    });
  });
});
