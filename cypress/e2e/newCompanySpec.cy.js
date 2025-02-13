import { mockCompanies } from "../fixtures/mockCompanies";

describe("New Company page after logging in", () => {
  let uniqueCompanyName = `Test Company ${Date.now()}`;
  const userId = 2;

  beforeEach(() => {
    // Intercept the login POST request
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

    // Intercept the GET request to fetch companies
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 200,
      body: mockCompanies,
    }).as("getCompanies");

    // Intercept the GET request to fetch job applications
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`,{
      statusCode: 200,
      body: {
        data: [],
      },
    });

    // Intercept the POST request to create a new company
    cy.intercept("POST", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 201,
      body: {
        data: {
          id: 123,
          type: "company",
          attributes: {
            name: uniqueCompanyName,
            website: "www.testcompany.com",
            street_address: "123 Test St",
            city: "Test City",
            state: "CO",
            zip_code: "12345",
            notes: "Test notes",
          },
        },
      },
    }).as("addCompany");

    // Visit the login page and perform login
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");

    // Navigate to the Companies page
    cy.get('[data-testid="companies-iconD"]').click();
    cy.wait("@getCompanies");

    // Navigate to the New Company page
    cy.get('.bg-cyan-600').click();
  });

  it("Should display the new company form", () => {
    cy.url().should("include", "/companies/new");
    cy.get("h1").should("have.text", "Add New Company");
  });

  it("Should have the correct labels for all form fields", () => {
    cy.get("label").contains("Company Name:").should("exist");
    cy.get("label").contains("Website:").should("exist");
    cy.get("label").contains("Street Address:").should("exist");
    cy.get("label").contains("City:").should("exist");
    cy.get("label").contains("State:").should("exist");
    cy.get("label").contains("Zip Code:").should("exist");
    cy.get("label").contains("Notes:").should("exist");
  });

  it("Should display correct placeholder text in all input fields", () => {
    cy.get("#companyName").should("have.attr", "placeholder", "Company Name");
    cy.get("#website").should("have.attr", "placeholder", "https://example.com");
    cy.get("#streetAddress").should("have.attr", "placeholder", "123 Main St");
    cy.get("#city").should("have.attr", "placeholder", "City");
    cy.get("#zipCode").should("have.attr", "placeholder", "12345");
    cy.get("textarea").should("have.attr", "placeholder", "Notes about the company");
  });

  it("Should allow input in all form fields", () => {
    cy.get("#companyName").type(uniqueCompanyName).should("have.value", uniqueCompanyName);
    cy.get("#website").type("www.testcompany.com").should("have.value", "www.testcompany.com");
    cy.get("#streetAddress").type("123 Test St").should("have.value", "123 Test St");
    cy.get("#city").type("Test City").should("have.value", "Test City");
    cy.get("select").select("CO").should("have.value", "CO");
    cy.get("#zipCode").type("12345").should("have.value", "12345");
    cy.get("textarea").type("Test notes").should("have.value", "Test notes");
  });

  it("Should require mandatory fields", () => {
    cy.get('button[type="submit"]').click();
    cy.get("#companyName:invalid").should("exist");
  });

  it("should allow submission with only the company name filled in", () => {
    cy.get("#companyName").type(uniqueCompanyName);
    cy.get('button[type="submit"]').click();

    cy.wait("@addCompany");
    cy.get(".bg-green-100").should("contain.text", "Company added successfully!");
    cy.url().should("include", "/companies");
  });

  it("Should show error for duplicate company name", () => {
    cy.intercept("POST", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 422,
      body: {
        error: "A company with this name already exists.",
      },
    }).as("duplicateCompany");

    cy.get("#companyName").type("Google");
    cy.get("#website").type("www.google.com");
    cy.get("#streetAddress").type("1600 Amphitheatre Parkway");
    cy.get("#city").type("Mountain View");
    cy.get("select").select("CA");
    cy.get("#zipCode").type("94043");
    cy.get("button[type='submit']").click();
    cy.get(".text-red-500").should("contain.text", "A company with this name already exists.");
  });

  it("Should show a success message when a new company is added", () => {
    cy.get("#companyName").type(uniqueCompanyName);
    cy.get("#website").type("www.testcompany.com");
    cy.get("#streetAddress").type("123 Test St");
    cy.get("#city").type("Test City");
    cy.get("select").select("CO");
    cy.get("#zipCode").type("12345");
    cy.get("textarea").type("Test notes");

    cy.get("button[type='submit']").click();

    cy.wait("@addCompany");
    cy.get(".bg-green-100").should("contain.text", "Company added successfully!");
    cy.url().should("include", "/companies");
  });
});