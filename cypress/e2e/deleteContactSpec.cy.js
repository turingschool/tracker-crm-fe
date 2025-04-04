import { mockContactsData } from "../fixtures/mockContactsData";
import { mockDashboard } from "../fixtures/mockDashBoard.json";

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

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/2/companies/1/contacts",
      {
        statusCode: 200,
        body: {
          contacts: {
            data: [
              {
                id: "2",
                type: "contact",
                attributes: {
                  first_name: "Jane",
                  last_name: "Smith",
                  email: "jane@example.com",
                  phone_number: "987-654-3210",
                  notes: "Another team member at Future Designs LLC",
                },
              },
            ],
          },
        },
        headers: {
          Authorization: "Bearer The token",
          "Content-Type": "application/json",
        },
      }
    ).as("get-company-contacts");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/dashboard", {
      statusCode: 200,
      fixture: "mockDashBoard",
    });

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().click();
    cy.url().should("include", "/contacts/1");
    cy.wait("@get-contact-details");
  });

  it("Should display the delete button", () => {
    cy.get("button").contains("Delete").should("be.visible");
  });

  it("Should open the delete confirmation modal", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
  });

  it("Should close the delete confirmation modal when Cancel is clicked", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Cancel").click();
    cy.contains("Are you sure you want to delete this").should("not.exist");
    cy.url().should("include", "/contacts/1");
  });

  it("Should delete the contact when Delete is clicked", () => {
    cy.intercept(
      {
        method: "DELETE",
        url: "http://localhost:3001/api/v1/users/2/contacts/1",
        headers: {
          Authorization: "Bearer The token",
        },
      },
      { statusCode: 204 }
    ).as("deleteContact");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 200,
      body: {
        data: [
          {
            id: "2",
            type: "contact",
            attributes: {
              first_name: "Jane",
              last_name: "Smith",
              email: "jane@example.com",
              phone_number: "987-654-3210",
              notes: "Another team member at Future Designs LLC",
            },
          },
        ],
      },
    }).as("getContactsAfterDelete");

    cy.get('button').contains('Delete').click(); // Open the modal
    cy.get('[data-test="delete-modal"]').should('exist'); // Ensure modal exists
    cy.get('[data-test="delete-modal"]').should('be.visible'); // Ensure modal is visible
    cy.get('[data-test="confirm-delete"]').click(); // Click Delete inside modal


    cy.wait("@deleteContact");
    cy.wait("@getContactsAfterDelete");
    cy.url().should("include", "/contacts");
    cy.contains("John Smith").should("not.exist");
  });

  it("Should close the modal when clicking outside", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
    cy.get("div.fixed.inset-0").click("topLeft");
    cy.contains("Are you sure you want to delete this").should("not.exist");
  });

  it("Should show an error alert if deletion fails", () => {
    cy.contains("Delete").should("exist").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
    cy.intercept("DELETE", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 500,
      body: { error: "Something went wrong while deleting the contact" },
    }).as("deleteContactFail");
    cy.get('[data-test="delete-modal"]').should('exist'); // Ensure modal exists
    cy.get('[data-test="delete-modal"]').should('be.visible'); // Ensure modal is visible
    cy.get('[data-test="confirm-delete"]').click(); // Click Delete inside modal
    cy.wait("@deleteContactFail");
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Failed to delete contact. Please try again");
    });
  });
});
