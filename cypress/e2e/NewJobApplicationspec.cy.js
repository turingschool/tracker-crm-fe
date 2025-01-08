// import { mockJobApplicationData } from "../fixtures/mockJobApplicationData"

describe('Create New Job Application page after logging in', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.intercept('POST', 'http://localhost:3001/api/v1/sessions', {
      statusCode: 200,
      body:
      {
        token: "Example token",
        user: {
          data: {
            id: 2,
            type: "user",
            attributes: {
              name: "Dolly Parton",
              email: "dollyP@email.com",
              companies: []
            }
          }
        }
      },
    }).as('postUserInfo');

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: {
        data: [
          { id: 1, attributes: { name: "Company A" } },
          { id: 2, attributes: { name: "Company B" } },
        ],
      },
    }).as("getCompanies");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/job_applications", (req) => {
      req.on("response", (res) => {
        // cy.log("Intercepted Job Applications Response", res);
        res.setDelay(2000); 
      });
      req.reply({
        statusCode: 200,
        fixture: "mockJobApplicationData",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }).as("getJobApplications");

    cy.visit("http://localhost:3000/");
    cy.get('#email').type('dollyP@email.com');
    cy.get('#password').type('Jolene123');
    cy.get('.login-btn').click();
    cy.wait('@postUserInfo');
    // cy.get('[data-testid="update-user"]').click();
    cy.get('a[href="/job_applications"]').click();
    cy.wait('@getJobApplications')
    cy.get('.bg-teal-500').click();
  })


  it('accesses the add new application page and its content', () => {
    // cy.wait("@getJobApplications");
    cy.get('.flex-row.h-screen').should("be.visible");
    cy.get('.grid').should("be.visible");
    cy.get('.LEFT').should("be.visible");
    cy.get('div.m-2 > :nth-child(2)').should("be.visible");
    cy.get("h1").should("have.text", "Add New Application");


    // cy.visit('http://localhost:3000/jobapplications/new');
    // cy.wait('@getCompanies');
    // cy.get('form').should('exist');
    // cy.get('select').within(() => {
    //   cy.get('option').should('have.length', 3)
    //   cy.get('option').eq(1).should('have.text', 'Company A')
    //   cy.get('option').eq(2).should('have.text', 'Company B')
    // })
  })
})