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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('login', (email, password) => {
  cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
    statusCode: 200,
    body: {
      token: "fake-token",
      user: {
        data: {
          id: 1,
          type: "user",
          attributes: {
            name: "Test User",
            email: "testuser@example.com",
            companies: [],
          },
        },
      },
    },
  }).as('loginRequest');

  cy.visit('http://localhost:3000/');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.wait('@loginRequest')
});

Cypress.Commands.add('mockJobApplications', () => {
  cy.intercept('GET', 'http://localhost:3001/api/v1/users/1/job_applications', {
    statusCode: 200,
    fixture: 'mockJobApps',
    headers: {
      'Content-Type': 'application/json',
    },
  }).as('getJobApplications');
});
