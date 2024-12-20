import { mockCompanies } from "../fixtures/mockCompanies.js";

describe("Company Show Page", () => {
  beforeEach(() => {
    // Intercept the login POST request
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          data: {
            id: 2,
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

    // Mock the company data
    const mockCompany = {
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
    };

    // Intercept the GET request to fetch companies list
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: mockCompanies,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
    }).as("getCompanies");

    // Intercept the GET request to fetch company details with Authorization header
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies/1/contacts", {
      statusCode: 200,
      body: mockCompany,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
    }).as("getCompany");

    // Visit the login page and perform login
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");

    // Store the token in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("token", "fake-token");
    });

    // Navigate to the Companies page
    cy.get('a[href="/companies"]').click();
    cy.wait("@getCompanies");

    // Click on the first company in the table (assuming it's "Google")
    cy.get("table tbody tr").first().click();
    cy.wait("@getCompany");
  });

  it("Should display the correct company details", () => {
    cy.get("h1").should("have.text", "Company Details");

    cy.get("h2").contains("Company Name:").next().should("have.text", "Google");
    cy.get("h2").contains("Website:").next().should("have.text", "https://google.com");
    cy.get("h2").contains("Address:").next().should("have.text", "1600 Amphitheatre Parkway Mountain View, CA 94043");
    cy.get("h2").contains("Notes:").next().should("have.text", "Innovative tech company.");
  });

  it("Should display the contacts correctly", () => {
    cy.get("h2").contains("Contacts").should("exist");

    cy.contains("John Doe").should("have.attr", "href", "/contacts/101");
    cy.contains("Jane Smith").should("have.attr", "href", "/contacts/102");
    cy.contains("Alice Johnson").should("have.attr", "href", "/contacts/103");
  });

  it("Should show a loading message while fetching company details", () => {
    // Intercept with a delay to simulate loading state
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies/1", (req) => {
      req.reply((res) => {
        res.delay = 4000; // Increase delay to 4000ms
        res.send({
          statusCode: 200,
          body: mockCompany,
        });
      });
    }).as("delayedGetCompany");
  
    // Reload the page to trigger the loading state
    cy.visit("http://localhost:3000/companies/1");
    cy.wait(500); // Brief wait to ensure the loading state appears
    cy.contains("Loading company details...", { timeout: 10000 }).should("exist");
    cy.wait("@delayedGetCompany");
  });

  it("Should show an error message if the company data fails to load", () => {
    // Intercept with an error response
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies/1", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("getCompanyError");

    cy.visit("http://localhost:3000/companies/1");
    cy.wait("@getCompanyError");

    cy.contains("Error: Internal Server Error").should("be.visible");
  });

  it("Should navigate back to the companies page when clicking 'Back to Companies'", () => {
    cy.contains("Back to Companies").click();
    cy.url().should("include", "/companies");
  });
});