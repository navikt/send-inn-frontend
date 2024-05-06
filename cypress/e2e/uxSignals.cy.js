describe('uxSignals', () => {
  it('Should show uxSignals', () => {
    cy.defaultIntercepts();
    cy.visit('/fyll-ut-default');

    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(0).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(1).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(2).click();

    cy.findByRole('button', { name: 'Send til NAV' }).click();
    cy.findByRole('button', { name: 'Ja, send søknaden' }).click();

    // The first question in the uxSignals form
    cy.findByText('Hvor gammel er du?').should('exist');
  });
});
