import { mockCompanies } from "../fixtures/mockCompanies.js";
import { mockEmptyCompanies } from "../fixtures/emptyMockCompanies.js";

describe("Delete Company", () => {
  const userId = 2;

  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          data: {
            id: userId,
            type: "user",
            attributes: {
              name: "Test User",
              email: "testuser@example.com",
              companies: [],
            },
          },
        },
      },
    }).as("mockSession");
    
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/contacts`, {
      statusCode: 200,
      body: {
        data: [
          {
            id: "101",
            type: "contact",
            attributes: {
              first_name: "John",
              last_name: "Doe",
              email: "johndoe@example.com",
              phone_number: "555-1234",
              notes: "",
              user_id: userId,
            },
          },
          {
            id: "102",
            type: "contact",
            attributes: {
              first_name: "Jane",
              last_name: "Smith",
              email: "janesmith@example.com",
              phone_number: "555-5678",
              notes: "",
              user_id: userId,
            },
          },
        ],
      },
      headers: { Authorization: "Bearer fake-token" },
    }).as("getContacts");

    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 200,
      body: mockCompanies,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
    }).as("getCompanies");

    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies/1/contacts`, {
      statusCode: 200,
      body: {
        company: {
          data: {
            attributes: {
              name: "Google",
              website: "https://google.com",
              street_address: "1600 Amphitheatre Parkway",
              city: "Mountain View",
              state: "CA",
              zip_code: "94043",
              notes: "Innovative tech company.",
            },
          },
        },
        contacts: {
          data: [
            {
              id: "101",
              type: "contact",
              attributes: {
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@example.com",
                phone_number: "555-1234",
                notes: "",
                user_id: userId,
              },
            },
            {
              id: "102",
              type: "contact",
              attributes: {
                first_name: "Jane",
                last_name: "Smith",
                email: "janesmith@example.com",
                phone_number: "555-5678",
                notes: "",
                user_id: userId,
              },
            },
          ],
        },
      },
      headers: { "Authorization": "Bearer fake-token" },
    }).as("getCompany");


    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/contacts`, {
      statusCode: 200,
      body: {
        data: [
          {
            id: "101",
            type: "contact",
            attributes: {
              first_name: "John",
              last_name: "Doe",
              email: "johndoe@example.com",
              phone_number: "555-1234",
              notes: "",
              user_id: userId,
            },
          },
          {
            id: "102",
            type: "contact",
            attributes: {
              first_name: "Jane",
              last_name: "Smith",
              email: "janesmith@example.com",
              phone_number: "555-5678",
              notes: "",
              user_id: userId,
            },
          },
        ],
      },
      headers: { Authorization: "Bearer fake-token" },
    }).as("getContactsAfterDelete");

    cy.visit("/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");

    cy.get('a[href="/companies"]').first().click(); 
    cy.wait("@getCompanies");

    cy.get("table tbody tr").first().click();
    cy.wait("@getCompany");
  });

  it("Should display the delete button on the company show page", () => {
    cy.contains("button", "Delete").should("be.visible");
  });

  it("Should open the delete confirmation modal", () => {
    cy.contains("button", "Delete").click();
    cy.contains("Are you sure you want to delete this?").should("be.visible");
    cy.get("button").contains("Ok").should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
  });

  it("Clicking outside the modal should close it", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this?").should("be.visible");
    cy.get("button").contains("Ok").should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
    
    cy.get(".fixed.inset-0").click("topLeft"); // Click outside the modal
    cy.contains("Are you sure you want to delete this?").should("not.exist");
  });

  it("Clicking 'Cancel' should close the modal", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this?").should("be.visible");
    cy.get("button").contains("Ok").should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
  
    cy.get("button").contains("Cancel").click();
    cy.contains("Are you sure you want to delete this?").should("not.exist");
  });

  it("Clicking 'OK' should trigger the delete request", () => {
    cy.intercept(
      "DELETE",
      `http://localhost:3001/api/v1/users/${userId}/companies/1`,
      { statusCode: 204 }
    ).as("deleteCompany");
  
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this?").should("be.visible");
    cy.get("button").contains("Ok").should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
  
    cy.get("button").contains("Ok").click();
  
    cy.wait("@deleteCompany");
    
    cy.url().should("include", "/companies"); 
  });

  it("Should not delete associated contacts when deleting a company", () => {
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/contacts`).as("getContacts")

    cy.intercept("DELETE", `http://localhost:3001/api/v1/users/${userId}/companies/1`).as("deleteCompany");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.wait("@getContacts")
  
    cy.contains("John Doe").should("exist");
    cy.contains("Jane Smith").should("exist");
  
    cy.get('[data-testid="companies-iconD"]').click();
    cy.wait("@getCompanies");
  
    cy.get("table tbody tr").first().click();
    cy.wait("@getCompany");
  
    cy.contains("Contacts").should("exist");
    cy.contains("John Doe").should("exist");
  
    cy.contains("Delete").click();
    cy.contains("Ok").click();
    cy.wait("@deleteCompany");
  
    cy.get('[data-testid="contacts-iconD"]').click();
    cy.wait("@getContactsAfterDelete");
  
    cy.contains("John Doe").should("exist");
    cy.contains("Jane Smith").should("exist");
  });
  
  it("Should show an error alert if deletion fails", () => {  
    cy.contains("Delete").should("exist").click();    
    cy.contains("Are you sure you want to delete this?").should("be.visible");  
    cy.get("button").contains("Ok").should("be.visible");
    cy.get("button").contains("Cancel").should("be.visible");
  
    cy.intercept("DELETE", `http://localhost:3001/api/v1/users/${userId}/companies/1`, {
      statusCode: 500,
      body: { error: "Something went wrong while deleting the company" },
    }).as("deleteCompanyFail");  
  
    cy.contains("Ok").should("exist").click();  
    cy.wait("@deleteCompanyFail");  
  
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Failed to delete company. Please try again");
    });
  });
});

