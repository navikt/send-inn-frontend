describe('Axe testing', () => {
  const id = 'a0a16a31-a943-4c29-b954-d841c9f411e7';
  const formPath = `/sendinn/api/backend/frontend/v1/soknad/${id}`;
  before(() => {
    cy.intercept('POST', 'https://sentry.gc.nav.no/**', {}).as('sentry');
    cy.intercept('POST', 'https://amplitude.nav.no/**', {}).as('amplitude');
    cy.intercept('GET', 'https://www.nav.no/dekoratoren/client**', {}).as('dekoratoren');

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
    cy.injectAxe();
  });

  it('Basic axe check', () => {
    cy.get('[data-cy="lasterOppNaaRadio"]').eq(0).click();
    cy.get('[data-cy="opprettAnnetVedlegg"]').click();

    cy.checkA11y('#__next');
  });
});
