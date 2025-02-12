import { mockContactsData } from "../fixtures/mockContactsData";

describe("Delete a Contact", () => {
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

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 200,
      body: {
        data: {
          id: "1",
          type: "contacts",
          attributes: {
            first_name: "John",
            last_name: "Smith",
            company_id: 1,
            email: "123@example.com",
            phone_number: "123-555-6789",
            notes: "Detailed notes for John Smith",
            user_id: 2,
            company: {
              id: 1,
              name: "Future Designs LLC",
              website: "https://futuredesigns.com",
              street_address: "456 Future Blvd",
              city: "Austin",
              state: "TX",
              zip_code: "73301",
              notes: "Great partner for UI projects.",
            },
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().find("a").click();
    cy.url().should("include", "/contacts/1");
  });

  it

});  