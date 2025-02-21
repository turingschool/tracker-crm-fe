describe('Dash Board after loggging in with recent jobs, contacts and companies', () => {
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
    cy.get("h1").should("have.text", "Welcome, Danny DeVito");
  });

  it("Should show how many job applications were submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("have.text","Jobs")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text",222)
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("have.text","Apps submitted this week")
  });

  it("Should show how many connections where submitted in the week", () => {
    cy.get('.m-24').should("exist")
    cy.get('.m-24 > .mt-2').should("exist")
    cy.get('.m-24 > .mt-2').should("have.text","Contacts")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text",222)
    cy.get('.ml-2 > :nth-child(2) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(2) > :nth-child(3)').should("have.text","New connections this week")
  });

  it("Should show how many companies where submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(3)').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("have.text","Companies")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text",222)
    cy.get('.ml-2 > :nth-child(3) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(3) > :nth-child(3)').should("have.text","New companies this week")
  });
})

describe('Dash Board after loggging in with zero recent jobs, contacts and companies', () => {
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
    }).as("mockSession2");

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/1/dashboard',
      { statusCode: 200, fixture: 'mockDashBoardNoJobsContactsOrCompanies' }
    );

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
  })

  it("Should show how many job applications were submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(1)').should("have.text","Jobs")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text","000")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(1) > :nth-child(3)').should("have.text","Add new job application")
  });

  it("Should show how many connections were submitted in the week", () => {
    cy.get('.m-24').should("exist")
    cy.get('.m-24 > .mt-2').should("exist")
    cy.get('.m-24 > .mt-2').should("have.text","Contacts")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text","000")
    cy.get('.ml-2 > :nth-child(2) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(2) > :nth-child(3)').should("have.text","Add new contact")
  });

  it("Should show how many companies were submitted in the week", () => {
    cy.get('.ml-2 > :nth-child(3)').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("exist")
    cy.get(':nth-child(3) > .mt-2').should("have.text","Companies")
    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text","000")
    cy.get('.ml-2 > :nth-child(3) > :nth-child(3)').should("exist")
    cy.get('.ml-2 > :nth-child(3) > :nth-child(3)').should("have.text","Add new company")
  });

  it("Should have a clickable button to route you to add a new job application", () => {
    cy.get(':nth-child(1) > .bg-cyan-600').click();
    cy.url().should('include', 'http://localhost:3000/jobapplications/new');
  });

  it("Should have a clickable button to route you to add a new contact", () => {
    cy.get(':nth-child(2) > .bg-cyan-600').click();
    cy.url().should('include', 'http://localhost:3000/contacts/new');
  });

  it("Should have a clickable button to route you to add a new company", () => {
    cy.get(':nth-child(3) > .bg-cyan-600').click();
    cy.url().should('include', 'http://localhost:3000/companies/new');
  });
})