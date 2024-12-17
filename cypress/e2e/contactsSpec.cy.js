import { mockContactsData } from "../fixtures/mockContactsData";

// describe("Navigation to Contacts", () => {
//   beforeEach(() => {
//     cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
//       statusCode: 200,
//       body: mockCompanies,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }).as("getCompanies");
    
//     cy.visit("http://localhost:3000/");
//     cy.get("img[alt='Companies']").click();
//   })
// });


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
    cy.get("input[type='search']").should("exist");
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
    cy.get("table tbody tr").eq(0).find("td").eq(1).should("have.text", "Company Name");
    cy.get("table tbody tr").eq(0).find("td").eq(2).should("have.text", "Type notes here...");
    cy.get("table tbody tr").eq(1).find("td").eq(0).should("have.text", "Jane Smith");
    cy.get("table tbody tr").eq(1).find("td").eq(1).should("have.text", "Company Name");
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
    cy.get("table tbody tr").eq(0).find("td").eq(0).should("not.exist");
    // cy.get("[data-testid='no-companies']").should("exist").and("have.text", "No companies found");
    // cy.get("table").should("not.exist");
  });
})