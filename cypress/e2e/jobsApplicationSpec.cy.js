
describe("Job app page after logging in", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); 
      });
      req.reply({
        statusCode: 200,
        fixture: "mockJobApps",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }).as("getJobApplications");
    
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('a[href="/job_applications"]').click();

  });

  it("Should have a header with the text 'Applications' once data is loaded", () => {
  
    cy.wait("@getJobApplications");

    cy.get("h1").should("have.text", "Applications");

    cy.get('.border.rounded-lg.overflow-hidden').should('exist');
  });
  
  it("Should display a spinner while loading and show data after loading completes", () => {

    cy.get('.flex.justify-center.items-center.h-64 > span').should("be.visible");

    cy.wait("@getJobApplications");


    cy.get('.flex.justify-center.items-center.h-64 > span').should('not.exist');
    cy.get("tbody > tr").should("have.length.at.least", 1);
  });

  it("Should allow searching for companies", () => {
   
    cy.wait("@getJobApplications");

   
    cy.get('input[type="search"]').type('tech');

    
    cy.get("tbody > tr").contains("Tech").should("exist");
    cy.get("tbody > tr").should('have.length', 1);

    
    cy.get('input[type="search"]').clear();
    cy.get("tbody > tr").should('have.length', 2);

  });

  it("Should show 'No applications found.' if the search doesn't match any company", () => {

    cy.wait("@getJobApplications");

    cy.get('input[type="search"]').type('NonExistentCompany');
    cy.get('tbody > tr').should('have.length', 1); 
    cy.get('tbody > tr > td').should('contain.text', 'No applications found.');
  });

})

describe("Job app page when data fails to load", () => {
  beforeEach(() => {

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getJobApplicationsError");
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('a[href="/job_applications"]').click();
    cy.get('a[href="/job_applications"]').click();
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@getJobApplicationsError");
    cy.get(".p-6.text-red-600").should("contain.text", "Error loading applications.");
  });
});