declare global {
  namespace Cypress {
    interface Chainable {
      formIntercepts(formPath: string): Cypress.Chainable<Element>;
      defaultIntercepts(): Cypress.Chainable<Element>;
    }
  }
}
