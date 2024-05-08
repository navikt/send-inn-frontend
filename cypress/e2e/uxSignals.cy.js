describe('uxSignals', () => {
  beforeEach(() => {
    cy.intercept('GET', '/sendinn/api/fyllut/forms/*', cy.spy().as('getFormSpy'));
  });
  it('Should show uxSignals', () => {
    cy.defaultIntercepts();
    cy.visit('/fyll-ut-default');
    cy.get('@getFormSpy').should('have.been.calledOnce');

    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(0).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(1).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(2).click();

    cy.findByRole('button', { name: 'Send til NAV' }).click();
    cy.findByRole('button', { name: 'Ja, send søknaden' }).click();

    // The first question in the uxSignals form
    cy.findByText('Hvor gammel er du?').should('exist');
  });

  it('Should not make request to fyllut if visningsType is dokumentinnsending', () => {
    cy.defaultIntercepts();
    cy.visit('/dokumentinnsending-default');
    cy.get('@getFormSpy').should('not.have.been.called');
  });
});
