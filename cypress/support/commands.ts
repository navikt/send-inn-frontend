/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import '@testing-library/cypress/add-commands';

Cypress.Commands.add('defaultIntercepts', () => {
  cy.intercept('POST', 'https://sentry.gc.nav.no/**', {}).as('sentry');
  cy.intercept('POST', 'https://amplitude.nav.no/**', {}).as('amplitude');
  cy.intercept('GET', 'https://www.nav.no/dekoratoren/client**').as('decorator');
  cy.intercept('GET', '/sendinn/api/user', {
    fixture: 'user.json',
  }).as('getUser');
  cy.intercept('GET', '/sendinn/api/fyllut/forms/*').as('getForm');
  cy.intercept('GET', `**/vedlegg/**/fil`, []).as('getFile');
});
