describe('Vedlegg lastet opp, men ikke relevant lenger', () => {
  const id = 'a0a16a31-a943-4c29-b954-d841c9f411e7';
  const formPath = `/sendinn/api/backend/frontend/v1/soknad/${id}`;

  beforeEach(() => {
    cy.intercept('GET', '/sendinn/api/user', {
      fixture: 'user.json',
    }).as('getUser');
    cy.intercept('GET', formPath, { fixture: `form.json` }).as('getForm');
    cy.intercept('GET', `${formPath}/vedlegg/**/fil`, []).as('fil');
    cy.intercept('PATCH', `${formPath}/vedlegg/**`, {
      fixture: 'file.json',
    }).as('patch');
    cy.visit(`/${id}`);
    cy.wait('@getUser');
    cy.wait('@getForm');
  });

  it("Skal vise 'andre vedlegg' seksjon med vedlegg som har status 'LastetOppIkkeRelevantLenger'", () => {
    cy.contains('Andre vedlegg').should('exist');
    cy.contains('Forsikring mot ansvar for sykepenger i arbeidsgiverperioden for små bedrifter').should('exist');
  });
});
