describe('Tester redirect ved 401', () => {
    before(() => {
        cy.intercept('GET', `**/vedlegg/**/fil`, {
            statusCode: 401,
        }).as('unauthenticated');
    });
    it('Går igjennom fra åpning av url som oppretter ettersending til kvitteringssiden', () => {
        cy.get;
        cy.visit(
            '/opprettSoknadResource?skjemanummer=NAV%2054-00.04&sprak=NO_NB&erEttersendelse=true&vedleggsIder=C1,W1,G2',
        );
        cy.url().should(
            'include',
            '/oauth2/login?redirect=%2Fsendinn%2F',
        );
    });
});
