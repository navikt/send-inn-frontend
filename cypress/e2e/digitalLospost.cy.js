import lospostSoknad from '../../mocks/data/soknad/lospost-default.json';

describe('Digital løspost', () => {
  it('renders page for løspost', () => {
    const vedlegg = lospostSoknad.vedleggsListe[0];

    cy.visit('/lospost-default');
    cy.findByRole('heading', { name: lospostSoknad.tittel, level: 1 }).should('exist');
    cy.findByText(lospostSoknad.skjemanr).should('not.exist');
    cy.findByRole('heading', { name: vedlegg.label, level: 3 }).should('exist');
    cy.findByRole('region', { name: vedlegg.label })
      .should('exist')
      .within(() => {
        cy.findByText('Slik gjer du:').should('not.exist');
        cy.findByLabelText('Velg dine filer').should('exist');
      });
    cy.findByRole('button', { name: 'Legg til anna dokumentasjon' }).should('exist');
    cy.findByRole('button', { name: 'Send til NAV' }).should('exist');
  });
});
