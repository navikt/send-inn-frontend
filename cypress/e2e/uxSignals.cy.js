describe('uxSignals', () => {
  const uxSignalsScriptUrl = 'https://widget.uxsignals.com/embed.js';

  beforeEach(() => {
    cy.intercept('GET', '/sendinn/api/fyllut/forms/*', cy.spy().as('getFormSpy'));
    cy.intercept('GET', uxSignalsScriptUrl, {
      body: '',
      headers: { 'content-type': 'application/javascript' },
    }).as('getUxSignalsScript');
  });

  it('Should show uxSignals', () => {
    cy.defaultIntercepts();
    cy.visit('/fyll-ut-default');
    cy.get('@getFormSpy').should('have.been.calledOnce');

    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(0).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(1).click();
    cy.findAllByRole('radio', { name: 'Jeg laster opp dette senere' }).eq(2).click();

    cy.findByRole('button', { name: 'Send til Nav' }).click();
    cy.findByRole('button', { name: 'Ja, send søknaden' }).click();

    cy.wait('@getUxSignalsScript');
    cy.get(`script[src="${uxSignalsScriptUrl}"]`).should('exist');
    cy.get('[data-uxsignals-embed="panel-uzn9037kdp"]').should('have.attr', 'data-uxsignals-mode', 'demo');
  });

  it('Should not make request to fyllut if visningsType is dokumentinnsending', () => {
    cy.defaultIntercepts();
    cy.visit('/dokumentinnsending-default');
    cy.get('@getFormSpy').should('not.have.been.called');
  });
});
