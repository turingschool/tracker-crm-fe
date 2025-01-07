import { mockContactsData } from "../fixtures/mockContactsData";

describe("Show a single contact page", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "The token",
        user: {
          data: {
            id: 2,
            type: "user",
            attributes: {
              name: "Dolly Parton",
              email: "dollyP@email.com",
              companies: [],
            },
          },
        },
      },
    }).as("postUserInfo");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("get-contacts");

    cy.visit('http://localhost:3000/')
    cy.get('#email').type('dollyP@email.com');
    cy.get('#password').type('Jolene123');
    cy.get('.login-btn').click();
    cy.wait('@postUserInfo');

    cy.get('[data-testid="PersonIcon"]').click();
    cy.url().should("include", "/contacts");
  });
});
