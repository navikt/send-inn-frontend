import lospostSoknad from '../../mocks/data/soknad/lospost-default.json';
const vedlegg = lospostSoknad.vedleggsListe[0];

describe('Digital løspost', () => {
  it('renders page for løspost', () => {
    cy.visit('/lospost-default');
    cy.findByRole('heading', { name: 'Send dokument til NAV', level: 1 }).should('exist');
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

  it('validates and submits løspost application', () => {
    cy.visit('/lospost-default');
    cy.findByRole('button', { name: 'Send til NAV' }).should('exist').click();
    cy.findByRole('region', { name: 'Du må fikse disse feilene før du kan sende inn søknad.' })
      .should('exist')
      .within(() => {
        cy.findByRole('link', { name: `Last opp ${vedlegg.label}` })
          .should('exist')
          .click();
      });
    cy.findByRole('region', { name: vedlegg.label })
      .should('exist')
      .within(() => {
        cy.get('[data-cy="filvelgerKnapp"]').click();
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible').selectFile('cypress/fixtures/MarcusAurelius.jpeg');
        cy.get('[data-cy="fileUploadSuccessIkon"]').should('be.visible');
        cy.get('[data-cy="filvelgerKnapp"]').should('be.visible');
      });
    cy.findByRole('button', { name: 'Send til NAV' }).should('exist').click();

    // Modal
    cy.findByRole('heading', { name: 'Dokumenta er klare til å sendast inn. Vil du senda dem no?' }).should('exist');
    cy.findByRole('button', { name: 'Ja, send inn' }).should('exist').click();

    // Kvittering
    cy.findByRole('heading', { name: /Vi mottok desse dokumenta/ }).should('exist');
    cy.findAllByRole('listitem').should('have.length', 1);
    cy.findAllByRole('button').should('have.length', 1).should('contain.text', 'Gå til Min side');
  });
});
