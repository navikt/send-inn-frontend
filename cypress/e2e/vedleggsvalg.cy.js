/// <reference types="cypress" />

describe('Tester validering', () => {
  it('Legger til valideringsfeil, og fikser dem', () => {
    cy.visit('http://localhost:3100/sendinn/fyll-ut-med-vedleggsvalg');

    cy.injectAxe();

    cy.intercept(
      {
        method: 'PATCH',
        url: '/sendinn/api/backend/frontend/v1/soknad/fyll-ut-med-vedleggsvalg/vedlegg/*',
      },
      (req) => {
        req.on('response', (res) => {
          // Wait for delay in milliseconds before sending the response to the client.
          res.setDelay(500);
        });
      },
    ).as('patchVedlegg');

    // Prøver å sende inn uten å laste opp noe, for å trigge valideringsfeil

    cy.get('[data-cy="sendTilNAVKnapp"]').click();

    cy.get('[data-cy=valideringsfeil]').within(() => {
      cy.get('h2').should('have.focus');
      cy.get('li').should('have.length', 5);
    });

    cy.checkA11y('#__next');

    // Checks that conditional elements is visible/hidden
    cy.get('[data-cy="VedleggContainer"]')
      .eq(0)
      .within(() => {
        cy.get('[data-cy="paakrevdAlert"]').should('be.visible');
        cy.get('[data-cy="ettersendingAlert"]').should('not.exist');
        cy.get('[data-cy="lasterOppNaaRadio"]').should('not.exist');
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="VedleggsKommentar"]').type('Test beskrivelse');
      });

    cy.get('[data-cy="valideringsfeil"]').within(() => {
      cy.get('li').should('have.length', 3);
    });

    cy.wait('@patchVedlegg').its('request.body.opplastingsValgKommentar').should('eq', 'Test beskrivelse');

    cy.get('[data-cy="VedleggContainer"]')
      .eq(1)
      .within(() => {
        cy.get('input').its('length').should('eq', 4);

        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').click();
        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').should('be.checked');
        cy.get('[data-cy="sendSenereRadio"]').click();
        cy.get('[data-cy="sendSenereRadio"]').should('be.checked');
        cy.get('[data-cy="VedleggsKommentar"]').type('Test beskrivelse');

        cy.get('input').its('length').should('eq', 3);
        cy.get('[data-cy="paakrevdAlert"]').should('not.exist');
        cy.get('[data-cy="ettersendingAlert"]').should('be.visible');
      });

    cy.get('[data-cy="valideringsfeil"]').within(() => {
      cy.get('li').should('have.length', 2);
    });

    // expected to be canceled
    cy.wait('@patchVedlegg').then((result) => {
      cy.wrap(result).its('request.body.opplastingsStatus').should('eq', 'HarIkkeDokumentasjonen');
      cy.wrap(result).should('have.property', 'error');
    });

    // Should not be canceled by the next request
    cy.wait('@patchVedlegg').then((result) => {
      cy.wrap(result).its('request.body').its('opplastingsStatus').should('eq', 'SendSenere');
      cy.wrap(result).its('response.statusCode').should('eq', 200);
    });

    cy.wait('@patchVedlegg')
      .its('request.body')
      .should('not.include.any.keys', ['opplastingsStatus'])
      .its('opplastingsValgKommentar')
      .should('eq', 'Test beskrivelse');

    cy.get('[data-cy="VedleggContainer"]')
      .eq(2)
      .within(() => {
        cy.get('input').its('length').should('eq', 7);
        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').click();
        cy.get('[data-cy="harIkkeDokumentasjonenRadio"]').should('be.checked');
        cy.get('[data-cy="VedleggsKommentar"]').type('Test beskrivelse');
        cy.get('[data-cy="levertTidligereRadio"]').click();
        cy.get('[data-cy="levertTidligereRadio"]').should('be.checked');
        cy.get('input').its('length').should('eq', 6);
      });

    cy.get('[data-cy="valideringsfeil"]').should('not.exist');

    cy.wait('@patchVedlegg')
      .its('request.body')
      .should('include.all.keys', [
        'opplastingsStatus',
        'opplastingsValgKommentar',
        'opplastingsValgKommentarLedetekst',
      ]);

    // expected to be canceled
    cy.wait('@patchVedlegg').then((result) => {
      cy.wrap(result)
        .its('request.body')
        .should('not.include.any.keys', ['opplastingsStatus'])
        .its('opplastingsValgKommentar')
        .should('eq', 'Test beskrivelse');
      cy.wrap(result).should('have.property', 'error');
    });

    cy.wait('@patchVedlegg').its('request.body.opplastingsStatus').should('eq', 'LevertDokumentasjonTidligere');

    cy.get('@patchVedlegg.all').should('have.length', 7);
    cy.get('[data-cy="sendTilNAVKnapp"]').click();
    cy.get('[data-cy="jaFellesModalKnapp"]').should('be.visible');
  });
});
