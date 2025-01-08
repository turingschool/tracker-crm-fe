import { mockContactsData } from "../fixtures/mockContactsData";
import { mockCompanies } from "../fixtures/mockCompanies";

describe("Landing page after logging in spec", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

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
    }).as("getContacts");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: mockCompanies,
    }).as("getCompanies");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/2/job_applications",
      {
        statusCode: 200,
        fixture: "mockJobApps",
      }
    ).as("getApplications");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");
  });

  it("Should have images in the sidebar", () => {
    cy.get('img[alt="Logo"]')
      .should("have.attr", "src")
      .should("include", "turing-logo-gray");

    cy.get('[href="/home"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/contacts"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/companies"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/job_applications"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/userInformation"] > .MuiSvgIcon-root').should("exist");
  });

  it("Should have clickable links for each icon", () => {
    cy.get('[data-testid="home-iconD"]').click();
    cy.url().should("include", "/home");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get('[data-testid="companies-iconD"]').click();
    cy.url().should("include", "/companies");

    cy.get('[data-testid="applications-iconD"]').click();
    cy.url().should("include", "/job_applications");

    cy.get('[data-testid="updateUser-iconD"]').click();
    cy.url().should("include", "/userInformation");
  });

  describe("DropDown Menu", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
    });

    it("has a container for dropdown elements", () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get(".bg-cyan-600").should("exist");
    });

    it("should render dropdown menu with link to add new contact", () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get(".bg-cyan-600").should("exist");
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains("Add New Contact").should("exist");
      cy.get('[data-testid="newContactLink"]').click();
      cy.url().should("include", "/contacts/new");
    });

    it("should render dropdown menu with link to add new company", () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get(".bg-cyan-600").should("exist");
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains("Add New Company").should("exist");
      cy.get('[data-testid="newCompanyLink"]').click();
      cy.url().should("include", "/companies/new");
    });

    it("should render dropdown menu with link to add new job application", () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get(".bg-cyan-600").should("exist");
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains("Add New Job Application").should("exist");
      cy.get('[data-testid="newAppLink"]').click();
      cy.url().should("include", "/jobapplications/new");
    });
  });
});
