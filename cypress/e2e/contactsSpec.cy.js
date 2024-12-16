// describe('template spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })


describe("Contacts page", () => {
  beforeEach(() => {
    // cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
    //   statusCode: 200,
    //   body: mockCompanies,
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // }).as("getCompanies");
    
    cy.visit("http://localhost:3000/contacts");
    // cy.get("img[alt='Contacts']").click();
  });

  it ("Should have a header with the text 'Contacts'", () => {
    cy.get("h1").should("have.text", "Contacts");
  });

  it ("Should have a search bar", () => {
    cy.get("input[type='search']").should("exist");
    cy.get("input[type='search']").should("have.attr", "placeholder", "Search Contacts...");
  })

  it ("Should have a button with the text 'Add Contact +'", () => {
    cy.contains("Add New").click();
    cy.url().should("include", "/newContacts");
  })
  
  it("Should display the correct table headers", () => {
    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Company Name");
    cy.get("table").find("th").eq(1).should("have.text", "Application Status"); 
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });
})