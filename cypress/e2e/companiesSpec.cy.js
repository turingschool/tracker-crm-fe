import { mockCompanies } from "../fixtures/mockCompanies.js";
import { mockEmptyCompanies } from "../fixtures/emptyMockCompanies.js";

describe("Companies page after logging in", () => {
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

    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 200,
      body: mockCompanies,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getCompanies");

    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`, {
      statusCode: 200,
      body: { data: [] },
    });

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");

    cy.window().then((win) => {
      win.localStorage.setItem("token", "fake-token");
    });

    cy.get('[data-testid="companies-iconD"]').click();
    cy.wait("@getCompanies");
  });

  it("Should have a header with the text 'Companies'", () => {
    cy.get("h1").should("have.text", "Companies");
  });

  it("Should have a search bar", () => {
    cy.get("input[type='text']").should("exist");
    cy.get("input[type='text']").should(
      "have.attr",
      "placeholder",
      "🔍 Search Companies"
    );
  });

  it("Should have a button with the text 'Add New +'", () => {
    cy.get('a > .bg-cyan-600').click();
    cy.url().should("include", "/companies/new");
  });

  it("Should display the correct table headers", () => {
    cy.get("table").find("th").should("have.length", 2);
    cy.get("table").find("th").eq(0).should("have.text", "Name");
    cy.get("table").find("th").eq(1).should("have.text", "Notes");
  });

  it("Should display the correct number of companies", () => {
    cy.get("table").find("tr").should("have.length", 3);
  });

  it("Should display the correct company information", () => {
    cy.get("table tbody tr").eq(0).find("td").eq(0).should("have.text", "Google");
    cy.get("table tbody tr").eq(0).find("td").eq(1).should("have.text", "Innovative tech company.");
    cy.get("table tbody tr").eq(1).find("td").eq(0).should("have.text", "Amazon");
    cy.get("table tbody tr").eq(1).find("td").eq(1).should("have.text", "Leading e-commerce platform.");
  });
});

describe("Companies page backend error handling", () => {
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

    cy.intercept(
      "GET",
      `http://localhost:3001/api/v1/users/${userId}/companies`,
      {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        body: { error: "Server error" },
      }
    ).as("getCompaniesError");

    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`, {
      statusCode: 200,
      body: { data: [] },
    });
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");
    cy.window().then((win) => {
      win.localStorage.setItem("token", "fake-token");
    });
  });

  it("should display generic backend error messages and auto-dismiss them after 5 seconds", () => {
    cy.visit("http://localhost:3000/companies");
    cy.wait("@getCompaniesError");
    cy.get("p.text-red-700")
      .should("be.visible")
      .and("contain.text", "Server error");
    cy.wait(6000);
    cy.get("p.text-red-700").should("not.exist");
  });
});
