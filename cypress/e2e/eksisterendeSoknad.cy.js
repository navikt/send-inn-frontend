describe('Vedlegg lastet opp, men ikke relevant lenger', () => {
  it("Skal vise 'andre vedlegg' seksjon med vedlegg som har status 'LastetOppIkkeRelevantLenger'", () => {
    cy.visit(`/fyll-ut-lastet-opp-ikke-relevant`);

    cy.contains('Andre vedlegg').should('exist');
    cy.contains('Urelevant vedlegg').should('exist');
  });
});
