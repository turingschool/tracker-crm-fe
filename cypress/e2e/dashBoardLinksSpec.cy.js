import { mockCompanies } from "../fixtures/mockCompanies.js";
import { mockDashBoardNoJobsContactsOrCompanies } from "../fixtures/mockDashBoardNoJobsContactsOrCompanies.json";

describe('Dash Board after loggging in with recent jobs, contacts and companies', () => {
  beforeEach(()=>{
    cy.clearLocalStorage();
    cy.clearCookies();
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

  // it("Should have a header with the users name once data is loaded", () => {
  //   cy.get("h1").should("have.text", "Welcome, Danny DeVito");
  // });

  // it("Should be clickable to route you to job applications", () => {
  //   cy.intercept(
  //     "GET",
  //     "http://localhost:3001/api/v1/users/1/job_applications",
  //     (req) => {
  //       req.on("response", (res) => {
  //         res.setDelay(2000);
  //       });
  //       req.reply({
  //         statusCode: 200,
  //         fixture: "mockJobApps",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //     }
  //   ).as("getJobApplications");

  //   cy.get("label").contains('Jobs').click();
  //   cy.url().should('include', 'http://localhost:3000/job_applications');
  // });

  // it("Should be clickable to route you to contacts", () => {
  //   cy.intercept(
  //     "GET",
  //     "http://localhost:3001/api/v1/users/2/companies/1/contacts",
  //     {
  //       statusCode: 200,
  //       body: {
  //         contacts: {
  //           data: [
  //             {
  //               id: "2",
  //               type: "contact",
  //               attributes: {
  //                 first_name: "Jane",
  //                 last_name: "Smith",
  //                 email: "jane@example.com",
  //                 phone_number: "987-654-3210",
  //                 notes: "Another team member at Future Designs LLC",
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     }
  //   ).as("get-company-contacts");

  //   cy.get("label").contains('Contacts').click();
  //   cy.url().should('include', 'http://localhost:3000/contacts');
  // });

  // it("Should be clickable to route you to companies", () => {
  //   cy.intercept("GET", `http://localhost:3001/api/v1/users/1/companies`, {
  //     statusCode: 200,
  //     body: mockCompanies,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer fake-token",
  //     },
  //   }).as("getCompanies");

  //   cy.get("label").contains('Companies').click();
  //   cy.url().should('include', 'http://localhost:3000/companies');
  // });

  // it("Should not show the button with at least 1 job application/contact/company", () => {
  //   cy.get('[data-cy="jobApplicationBtn"]').should('not.exist');
  //   cy.get('[data-cy="contactBtn"]').should('not.exist');
  //   cy.get('[data-cy="companyBtn"]').should('not.exist');
  // })

  it("Should display button with no job applications and go to the new job application page when the button is clicked", () => {
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

    cy.get('[data-cy="jobHuntingTips"]').contains('Job Hunt Tips');
    cy.get('[data-cy="jobHuntTip"]').contains("Try to make at least one new contact, research a new company, and apply to one job each week to keep up your momentum. You've got this!")
    cy.get('[data-cy="jobApplicationBtn"]').should('exist');
    cy.get('[data-cy="contactBtn"]').should('exist');
    cy.get('[data-cy="companyBtn"]').scrollIntoView().should('exist');

    cy.get('[data-cy="jobApplicationBtn"]').click();
    cy.url().should("include", "/jobapplications/new");
  })

  it("Should display button with no contacts and go to the new contacts page when clicked", () => {
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

    cy.get('[data-cy="jobHuntingTips"]').contains('Job Hunt Tips');
    cy.get('[data-cy="jobHuntTip"]').contains("Try to make at least one new contact, research a new company, and apply to one job each week to keep up your momentum. You've got this!")
    cy.get('[data-cy="jobApplicationBtn"]').should('exist');
    cy.get('[data-cy="contactBtn"]').should('exist');
    cy.get('[data-cy="companyBtn"]').scrollIntoView().should('exist');

    cy.get('[data-cy="contactBtn"]').click();
    cy.url().should("include", "/contacts/new");
  })

  it("Should display button with no companies and go to the new company page when clicked", () => {
    cy.viewport(1400, 1020)
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

    cy.get('[data-cy="jobHuntingTips"]').contains('Job Hunt Tips');
    cy.get('[data-cy="jobHuntTip"]').contains("Try to make at least one new contact, research a new company, and apply to one job each week to keep up your momentum. You've got this!")
    cy.get('[data-cy="jobApplicationBtn"]').should('exist');
    cy.get('[data-cy="contactBtn"]').should('exist');
    cy.get('[data-cy="companyBtn"]').scrollIntoView().should('exist');

    cy.get('[data-cy="companyBtn"]').click();
    cy.url().should("include", "/companies/new");
  })
})