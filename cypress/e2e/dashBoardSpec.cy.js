import {mockCompanies} from "../fixtures/mockCompanies";
describe('Dash Board after loggging in', () => {
  beforeEach(()=>{
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Danny DeVito',
              email: 'danny_de@email.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/1/dashboard',
      { statusCode: 200, fixture: 'mockDashBoard' }
    );

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
  })

  it("Should have a header with the users name once data is loaded", () => {
    cy.get("h1").should("have.text", "Welcome,Danny DeVito");
  });

  it("Should show how many job applications where submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("have.text","Jobs")
    cy.get('[data-cy="dashJobNum"]').should("exist")
    cy.get('[data-cy="dashJobNum"]').should("have.text",2)
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("have.text","Apps submitted this week")
  });

  it("Should show how many connections where submitted in the week", () => {
    cy.get('.m-24').should("exist")
    cy.get('.m-24 > .mt-2').should("exist")
    cy.get('.m-24 > .mt-2').should("have.text","Contacts")
    cy.get('[data-cy="dashConNum"]').should("exist")
    cy.get('[data-cy="dashConNum"]').should("have.text",2)
    cy.get('[data-cy="conLabel"]').should("exist")
    cy.get('[data-cy="conLabel"]').should("have.text","New connections this week")
  });

  it("Should show how many companies where submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(3)').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("have.text","Companies")
    cy.get('[data-cy="dashCompNum"]').should("exist")
    cy.get('[data-cy="dashCompNum"]').should("have.text",2)
    cy.get(':nth-child(3) > .bg-cyan-600').should("exist")
    cy.get(':nth-child(3) > .bg-cyan-600').should("have.text","Add new company")
  });

  it("Should have a clickable button to route you to add a new company", () => {
    cy.get(':nth-child(3) > .bg-cyan-600').click();
    cy.url().should('include', 'http://localhost:3000/companies/new');
  });


})