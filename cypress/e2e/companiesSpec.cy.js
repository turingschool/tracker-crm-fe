import { mockCompanies } from "../support/mockCompanies.js";

describe("Companies page after logging in", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: mockCompanies,
      headers: {
        "Content-Type": "application/json"
      }
    }).as("getCompanies");
    
    cy.visit("http://localhost:3000/");
    cy.get("img[alt='Companies']").click();
    /*
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get("button").click();

    will be added when functionality for login is restored.
    */
  })
  
  it ("Should have a header with the text 'Companies'", () => {
    cy.get("h1").should("have.text", "Companies");
  })

  it ("Should have a search bar", () => {
    cy.get("input[type='text']").should("exist");
    cy.get("input[type='text']").should("have.attr", "placeholder", "Search companies...");
  })

  it ("Should have a button with the text 'Add Company'", () => {
    cy.contains("Add New").click();
    cy.url().should("include", "/companies/new");
  })
  
  it("Should display the correct table headers", () => {
    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Company Name");
    cy.get("table").find("th").eq(1).should("have.text", "Application Status"); 
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });

  it("Should display the correct number of companies", () => {
    cy.wait("@getCompanies");
    cy.get("table").find("tr").should("have.length", 3);
  });

  it("Should display the correct company information", () => {
    cy.wait("@getCompanies");
    cy.get("table tbody tr").eq(0).find("td").eq(0).should("have.text", "Google");
    cy.get("table tbody tr").eq(0).find("td").eq(1).should("have.text", "Not Applied Yet");
    cy.get("table tbody tr").eq(0).find("td").eq(2).should("have.text", "Innovative tech company.");
    cy.get("table tbody tr").eq(1).find("td").eq(0).should("have.text", "Amazon");
    cy.get("table tbody tr").eq(1).find("td").eq(1).should("have.text", "Not Applied Yet");
    cy.get("table tbody tr").eq(1).find("td").eq(2).should("have.text", "Leading e-commerce platform.");
  });

  it("Should display 'No companies found' when no companies exist", () => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: { data: [] },
      headers: {
        "Content-Type": "application/json"
      }
    }).as("getEmptyCompanies");
  
    cy.reload(); 
    cy.wait("@getEmptyCompanies");
  
    cy.get("[data-testid='no-companies']").should("exist").and("have.text", "No companies found");
    cy.get("table").should("not.exist");
  });
})