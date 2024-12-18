import { mockContactsData } from "../fixtures/mockContactsData";

describe("Navigation to Contacts Page from Menu Bar", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json"
      }
    }).as("get-contacts");
    cy.visit("http://localhost:3000/");
  });

  it ("Should have a header with the text 'Contacts'", () => {
    cy.get('[data-testid="PersonIcon"]').click();
    cy.url().should("include", "/contacts");
  });
});

describe("Contacts page", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json"
      }
    }).as("get-contacts");
    
    cy.visit("http://localhost:3000/contacts");
  });

  it ("Should have a header with the text 'Contacts'", () => {
    cy.get("h1").should("have.text", "Contacts");
  });

  it ("Should have a search bar", () => {
    cy.get("input[type='search']").should("have.attr", "placeholder", "Search Contacts...");
  });

  it ("Should have a button with the text 'Add Contact +'", () => {
    cy.contains("Add New").click();
    cy.url().should("include", "/contacts/new");
  });
  
  it("Should display the correct table headers", () => {
    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Name");
    cy.get("table").find("th").eq(1).should("have.text", "Company"); 
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });

  it("Should display the correct number of companies", () => {
    cy.wait("@get-contacts");
    cy.get("table").find("tr").should("have.length", 3);
  });

  it("Should display the correct company information", () => {
    cy.wait("@get-contacts");
    cy.get("table tbody tr").eq(0).find("td").eq(0).should("have.text", "John Smith");
    cy.get("table tbody tr").eq(0).find("td").eq(1).should("have.text", "Future Designs LLC");
    cy.get("table tbody tr").eq(0).find("td").eq(2).should("have.text", "Type notes here...");
    cy.get("table tbody tr").eq(1).find("td").eq(0).should("have.text", "Jane Smith");
    cy.get("table tbody tr").eq(1).find("td").eq(1).should("have.text", "Future Designs LLC");
    cy.get("table tbody tr").eq(1).find("td").eq(2).should("have.text", "Type notes here...");
  });

  it("Should search for contacts by first name", () => {

  });

  it("Should display 'No contacts found' when no contacts exist", () => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
      statusCode: 200,
      body: { data: [] },
      headers: {
        "Content-Type": "application/json"
      }
    }).as("empty-contacts");
  
    cy.reload(); 
    cy.wait("@empty-contacts");
  
    cy.get("table").find("th").should("have.length", 3);
    cy.get("table tbody tr").should("not.exist");
    cy.get('[data-cy="no-contacts-message"]').should("have.text", 'No contacts saved. Click "Add New +" to start saving contacts.');
  });
});

describe("Sad Paths - Contacts Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
      statusCode: 500
    }).as("sad-contacts");
    
    cy.visit("http://localhost:3000/contacts");
  });

  it ("Should have a header, search bar, add new button, and table header", () => {
    cy.get("h1").should("have.text", "Contacts");

    cy.get("input[type='search']").should("have.attr", "placeholder", "Search Contacts...");

    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Name");
    cy.get("table").find("th").eq(1).should("have.text", "Company"); 
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });

  it ("Schould render an error message when a fetch request fails", () => {
    cy.get('[data-cy="failed-fetch-message"]')
  });
});