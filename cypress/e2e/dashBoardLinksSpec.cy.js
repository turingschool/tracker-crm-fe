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

  it("Should be clickable to route you to job applications", () => {
    cy.contains('jobApplications').click();
    cy.url().should('include', 'http://localhost:3000/job_applications');
  });

  it("Should be clickable to route you to contacts", () => {
    cy.get('contacts').click();
    cy.url().should('include', 'http://localhost:3000/contacts');
  });

  it("Should be clickable to route you to companies", () => {
    cy.get('companies').click();
    cy.url().should('include', 'http://localhost:3000/companies');
  });
})