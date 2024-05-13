declare namespace Cypress {
  interface Chainable {
    defaultIntercepts(name: string): void;
  }
}
