import { mockCompanies } from "../fixtures/mockCompanies.js";
import { mockEmptyCompanies } from "../fixtures/emptyMockCompanies.js";

describe("Companies page after logging in", () => {
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
    headers: {
      "Content-Type": "application/json",
    },
  }).as("getCompanies");

  // Intercept the GET request to fetch job applications
  cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`,{
    statusCode: 200,
    body: {
      data: [],
    },
  })

  // Visit the login page and perform login
  cy.visit("http://localhost:3000/");
  cy.get("#email").type("danny_de@email.com");
  cy.get("#password").type("jerseyMikesRox7");
  cy.get('[data-testid="login-button"]').click();

  // Wait for the login request to complete
  cy.wait("@mockSession");

  // Store the token in localStorage
  cy.window().then((win) => {
    win.localStorage.setItem("token", "fake-token");
  });

  // Navigate to the companies page
  cy.get('[data-testid="companies-iconD"]').click();
  cy.wait("@getCompanies");
});

  it("Should have a header with the text 'Companies'", () => {
    cy.wait("@getCompanies");
    cy.get("h1").should("have.text", "Companies");
  });

  it("Should have a search bar", () => {
    cy.get("input[type='text']").should("exist");
    cy.get("input[type='text']").should("have.attr", "placeholder", "Search companies...");
  });

  it("Should have a button with the text 'Add Company'", () => {
    cy.get('.bg-blue-500').click();
    cy.url().should("include", "/companies/new");
  });

  it("Should display the correct table headers", () => {
    cy.wait("@getCompanies");
    cy.get("table").find("th").should("have.length", 2);
    cy.get("table").find("th").eq(0).should("have.text", "Company Name");
    cy.get("table").find("th").eq(1).should("have.text", "Notes");
  });

  it("Should display the correct number of companies", () => {
    cy.wait("@getCompanies");
    cy.get("table").find("tr").should("have.length", 3);
  });

  it("Should display the correct company information", () => {
    cy.wait("@getCompanies");
    cy.get("table tbody tr").eq(0).find("td").eq(0).should("have.text", "Google");
    cy.get("table tbody tr").eq(0).find("td").eq(1).should("have.text", "Innovative tech company.");
    cy.get("table tbody tr").eq(1).find("td").eq(0).should("have.text", "Amazon");
    cy.get("table tbody tr").eq(1).find("td").eq(1).should("have.text", "Leading e-commerce platform.");
  });
});

describe("Companies page with no companies", () => {
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

    // Intercept the GET request with empty companies
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 200,
      body: mockEmptyCompanies,
      headers: {
        "Content-Type": "application/json",
      }
    }).as("getEmptyCompanies");

    // Intercept the GET request to fetch job applications
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`,{
      statusCode: 200,
      body: {
        data: [],
      },
    })

    // Visit the login page and perform login
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();

    // Wait for the login request to complete
    cy.wait("@mockSession");

    // Store the token in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem("token", "fake-token");
    });

    // Navigate to the companies page
    cy.get('[data-testid="companies-iconD"]').click();
    cy.wait("@getEmptyCompanies");
  });

  it("Should display 'No companies found' when no companies exist", () => {
    cy.get("[data-testid='no-companies']")
      .should("be.visible")
      .and("have.text", "No companies found");
      
    cy.get("table").should("not.exist");
  });
});