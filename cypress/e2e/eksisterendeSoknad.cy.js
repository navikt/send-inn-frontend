describe('Avbryt uten å slette søknaden', () => {
  [
    { id: 'dokumentinnsending-default', steg: 0 },
    { id: 'dokumentinnsending-default', steg: 1 },
    { id: 'dokumentinnsending-default', steg: 2 },
    { id: 'fyll-ut-default' },
    { id: 'ettersending-default' },
    { id: 'ettersending-saksbehandler' },
    { id: 'lospost-default' },
  ].forEach(({ id, steg }) => {
    it(`Går direkte til nav.no fra ${id}${steg !== undefined ? ` steg ${steg}` : ''}`, () => {
      const deleteRequest = cy.spy().as('deleteRequest');
      cy.intercept('DELETE', '**/api/backend/**', (req) => {
        deleteRequest();
        req.reply({ statusCode: 204 });
      });
      cy.intercept('GET', 'https://www.nav.no/', {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html lang="nb"><head><title>Nav</title></head><body>Nav</body></html>',
      }).as('navFrontPage');
      if (steg !== undefined) {
        cy.intercept('GET', `/sendinn/api/backend/frontend/v1/soknad/${id}`, (req) => {
          req.continue((res) => {
            res.body.visningsSteg = steg;
          });
        });
      }

      cy.visit(`/${id}`, {
        onBeforeLoad(win) {
          cy.spy(win.HTMLDialogElement.prototype, 'showModal').as('showModal');
        },
      });
      cy.findByRole('button', { name: 'Avbryt', exact: true }).click();
      cy.get('@showModal').should('not.have.been.called');
      cy.wait('@navFrontPage');
      cy.origin('https://www.nav.no', () => {
        cy.location('href').should('eq', 'https://www.nav.no/');
      });
      cy.get('@deleteRequest').should('not.have.been.called');
      cy.get('@showModal').should('not.have.been.called');
    });
  });
});

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
