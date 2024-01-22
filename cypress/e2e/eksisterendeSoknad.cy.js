describe('Vedlegg lastet opp, men ikke relevant lenger', () => {
  it("Skal vise 'andre vedlegg' seksjon med vedlegg som har status 'LastetOppIkkeRelevantLenger'", () => {
    cy.visit(`/fyll-ut-lastet-opp-ikke-relevant`);

    cy.contains('Andre vedlegg').should('exist');
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
