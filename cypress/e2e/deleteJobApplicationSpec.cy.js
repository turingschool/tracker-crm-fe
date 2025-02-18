import { mockJobApplicationData } from "../fixtures/mockJobApplicationData.json";
import { mockDashboard } from "../fixtures/mockDashBoard.json";

describe('Delete a Job Application', () => {
  beforeEach(() => {
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
              companies: []
            }
          }
        }
      }
    }).as("postUserInfo")

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/job_applications", {
      statusCode: 200,
      body: mockJobApplicationData,
      headers: {
        "Content-Type": "application/json"
      }
    }).as("get-jobApplications")

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/dashboard", {
      statusCode: 200,
      fixture: "mockDashBoard",
    });
    
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");
  })

  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})