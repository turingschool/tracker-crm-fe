import { mockCompanies } from "../support/mockCompanies";

describe("New Company page after logging in", () => {
  let uniqueCompanyName = `Test Company ${Date.now()}`;

  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.intercept('POST', 'http://localhost:3001/api/v1/users/2/companies', {
      statusCode: 201,
      body: {
        id: 123,
        name: uniqueCompanyName,
        website: 'www.testcompany.com',
        street_address: '123 Test St',
        city: 'Test City',
        state: 'CO',
        zip_code: '12345',
        notes: 'Test notes'
      }
    }).as('addCompany');
    
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: {
        data: [
          ...mockCompanies.data, 
          {
            id: 123,
            type: "company",
            attributes: {
              id: 123,
              name: uniqueCompanyName,
              website: 'www.testcompany.com',
              street_address: '123 Test St',
              city: 'Test City',
              state: 'CO',
              zip_code: '12345',
              notes: 'Test notes'
            }
          }
        ]
      },
      headers: {
        "Content-Type": "application/json"
      }
    }).as("getCompanies");
    
    cy.get("img[alt='Companies']").click();
    cy.contains("Add New").click();
    
    /*
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get("button").click();
`
    will be added when functionality for login is restored.
    */
  });
  
  it("Should display the new company form", () => {
    cy.url().should("include", "/companies/new");
    cy.get("h1").should("have.text", "Add New Company");
  });

  it('should have the correct labels for the form fields', () => {
    cy.get('label').contains('Company Name:').should('exist');
    cy.get('label').contains('Website:').should('exist');
    cy.get('label').contains('Street Address:').should('exist');
    cy.get('label').contains('City:').should('exist');
    cy.get('label').contains('State:').should('exist');
    cy.get('label').contains('Zip Code:').should('exist');
    cy.get('label').contains('Notes:').should('exist');
  });

  it('should allow input in all form fields', () => {
    cy.get('#companyName').type('Test Company').should('have.value', 'Test Company');
    cy.get('#website').type('www.testcompany.com').should('have.value', 'www.testcompany.com');
    cy.get('#streetAddress').type('123 Test St').should('have.value', '123 Test St');
    cy.get('#city').type('Test City').should('have.value', 'Test City');
    cy.get('select').select('CO').should('have.value', 'CO');
    cy.get('#zipCode').type('12345').should('have.value', '12345');
    cy.get('textarea').type('Test notes').should('have.value', 'Test notes');
  });

  it('should require Company Name, Street Address, City, State, and Zip Code', () => {
    cy.get('button[type="submit"]').click();
    cy.get('#companyName:invalid').should('exist');
    cy.get('#streetAddress:invalid').should('exist');
    cy.get('#city:invalid').should('exist');
    cy.get('select:invalid').should('exist');
    cy.get('#zipCode:invalid').should('exist');
  });

  it('should submit the form with valid data', () => {
    cy.get('#companyName').type(uniqueCompanyName);
    cy.get('#website').type('www.testcompany.com');
    cy.get('#streetAddress').type('123 Test St');
    cy.get('#city').type('Test City');
    cy.get('select').select('CO');
    cy.get('#zipCode').type('12345');
    cy.get('textarea').type('Test notes');

    cy.get('button[type="submit"]').click();

    cy.wait('@addCompany').then((interception) => {
      expect(interception.response.statusCode).to.equal(201);
    });
    cy.url().should('include', '/companies');
    cy.contains(uniqueCompanyName).should('exist');
  });
})