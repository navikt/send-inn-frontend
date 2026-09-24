describe('Redirect on 401', () => {
  it('Redirects to login when fetching attachments without authentication', () => {
    cy.intercept('GET', `**/vedlegg/**/fil`, {
      statusCode: 401,
    }).as('unauthenticated');
    cy.visit('/ettersending-default');
    cy.wait('@unauthenticated');
    cy.url().should('include', '/oauth2/login?redirect=%2Fsendinn%2Fettersending-default');
  });
});
