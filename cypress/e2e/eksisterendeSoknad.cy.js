describe('Vedlegg lastet opp, men ikke relevant lenger', () => {
  it("Skal vise 'andre vedlegg' seksjon med vedlegg som har status 'LastetOppIkkeRelevantLenger'", () => {
    cy.visit(`/fyll-ut-lastet-opp-ikke-relevant`);

    cy.contains('Annen dokumentasjon').should('exist');
    cy.contains('Urelevant vedlegg').should('exist');
  });
});

describe('Navigering til Fyllut', () => {
  it('Skal gå til fyllut ved klikk', () => {
    cy.visit(`/fyll-ut-default`);
    cy.get('[data-cy="forrigeStegKnapp"]').click();
    cy.url().should('include', '/fyllut/');
  });

  it('Skal gå til fyllut automatisk', () => {
    cy.visit(`/fyll-ut-ikke-utfylt`);
    cy.url().should('include', '/fyllut/');
  });
});

describe('Backend request language', () => {
  for (const language of ['nb', 'nn', 'en']) {
    it(`uses nb before loading the application and ${language} after loading it`, () => {
      cy.intercept('GET', '**/api/backend/frontend/v1/soknad/fyll-ut-med-vedleggsvalg', (req) => {
        req.continue((res) => {
          res.body.spraak = language;
        });
      }).as('application');
      cy.intercept('PATCH', '**/api/backend/frontend/v1/soknad/fyll-ut-med-vedleggsvalg/vedlegg/*').as(
        'updateAttachment',
      );

      cy.visit('/fyll-ut-med-vedleggsvalg');

      cy.wait('@application').its('request.headers.accept-language').should('eq', 'nb');
      cy.get('html').should('have.attr', 'lang', language);
      cy.get('[data-cy="VedleggContainer"]').eq(1).find('[data-cy="harIkkeDokumentasjonenRadio"]').click();

      cy.wait('@updateAttachment').its('request.headers.accept-language').should('eq', language);
    });
  }
});
