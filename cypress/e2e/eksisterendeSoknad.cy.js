describe('Avbryt uten å slette søknaden', () => {
  [
    { id: 'dokumentinnsending-default', steg: 0 },
    { id: 'dokumentinnsending-default', steg: 1 },
    { id: 'dokumentinnsending-default', steg: 2 },
    { id: 'fyll-ut-default' },
    { id: 'ettersending-default' },
    { id: 'ettersending-saksbehandler' },
    { id: 'lospost-default' },
  ].forEach(({ id, steg }) => {
    it(`Bekrefter før navigasjon til nav.no fra ${id}${steg !== undefined ? ` steg ${steg}` : ''}`, () => {
      const heading = id === 'lospost-default' ? 'Vil du forlate sida?' : 'Vil du forlate siden?';
      const stay = id === 'lospost-default' ? 'Nei, bli på sida' : 'Nei, bli på siden';
      const deleteRequest = cy.spy().as('deleteRequest');
      cy.intercept('DELETE', '**/api/backend/**', (req) => {
        deleteRequest();
        req.reply({ statusCode: 204 });
      });
      cy.intercept('GET', 'https://www.nav.no/', {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html lang="nb"><head><title>Nav</title></head><body>Nav</body></html>',
      }).as('navFrontPage');
      if (steg !== undefined) {
        cy.intercept('GET', `/sendinn/api/backend/frontend/v1/soknad/${id}`, (req) => {
          req.continue((res) => {
            res.body.visningsSteg = steg;
          });
        });
      }

      cy.visit(`/${id}`);
      cy.findByRole('button', { name: 'Avbryt', exact: true }).click();
      cy.findByRole('dialog', { name: heading })
        .should('be.visible')
        .then(($dialog) => {
          $dialog[0].addEventListener('close', cy.stub().as('dialogClosed'), { once: true });
        })
        .within(() => {
          cy.findByRole('button', { name: stay }).click();
        });
      cy.get('@dialogClosed').should('have.been.calledOnce');
      cy.findByRole('dialog', { name: heading }).should('not.exist');
      cy.location('pathname').should('eq', `/sendinn/${id}`);
      cy.findByRole('button', { name: 'Avbryt', exact: true }).should('have.focus');
      cy.get('@navFrontPage.all').should('have.length', 0);
      cy.get('@deleteRequest').should('not.have.been.called');

      cy.findByRole('button', { name: 'Avbryt', exact: true }).click();
      cy.findByRole('dialog', { name: heading })
        .should('be.visible')
        .then(($dialog) => Promise.all($dialog[0].getAnimations().map((animation) => animation.finished)));
      cy.injectAxe();
      cy.checkA11y('dialog[open]');
      cy.findByRole('dialog', { name: heading }).within(() => {
        cy.findByRole('button', { name: 'Ja, gå til nav.no' }).click();
      });
      cy.wait('@navFrontPage');
      cy.origin('https://www.nav.no', () => {
        cy.location('href').should('eq', 'https://www.nav.no/');
      });
      cy.get('@deleteRequest').should('not.have.been.called');
    });
  });

  it('Blir på siden når bekreftelsen lukkes med Escape eller lukkeknappen', () => {
    cy.visit('/ettersending-default');
    cy.findByRole('button', { name: 'Avbryt', exact: true }).click();
    cy.findByRole('dialog', { name: 'Vil du forlate siden?' })
      .should('be.visible')
      .then(($dialog) => {
        $dialog[0].addEventListener('close', cy.stub().as('dialogClosed'), { once: true });
      })
      .within(() => {
        cy.findByRole('button', { name: 'Nei, bli på siden' }).focus();
      });
    // Send the virtual key code so the browser performs native dialog dismissal.
    cy.then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Input.dispatchKeyEvent',
        params: { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
      }),
    );
    cy.get('@dialogClosed').should('have.been.calledOnce');
    cy.then(() =>
      Cypress.automation('remote:debugger:protocol', {
        command: 'Input.dispatchKeyEvent',
        params: { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 },
      }),
    );
    cy.findByRole('dialog', { name: 'Vil du forlate siden?' }).should('not.exist');
    cy.findByRole('button', { name: 'Avbryt', exact: true }).should('have.focus').click();
    cy.findByRole('dialog', { name: 'Vil du forlate siden?' }).within(() => {
      cy.findByRole('button', { name: 'Lukk' }).click();
    });
    cy.findByRole('dialog', { name: 'Vil du forlate siden?' }).should('not.exist');
    cy.location('pathname').should('eq', '/sendinn/ettersending-default');
    cy.findByRole('button', { name: 'Avbryt', exact: true }).should('have.focus');
  });
});

describe('Vedlegg lastet opp, men ikke relevant lenger', () => {
  it("Skal vise 'andre vedlegg' seksjon med vedlegg som har status 'LastetOppIkkeRelevantLenger'", () => {
    cy.visit(`/fyll-ut-lastet-opp-ikke-relevant`);

    cy.contains('Annen dokumentasjon').should('exist');
    cy.contains('Urelevant vedlegg').should('exist');
  });
});

describe('Navigering til Fyllut', () => {
  it('Skal gå til fyllut ved klikk', () => {
    cy.visit(`/fyll-ut-default`);
    cy.get('[data-cy="forrigeStegKnapp"]').click();
    cy.url().should('include', '/fyllut/');
  });

  it('Skal gå til fyllut automatisk', () => {
    cy.visit(`/fyll-ut-ikke-utfylt`);
    cy.url().should('include', '/fyllut/');
  });
});
