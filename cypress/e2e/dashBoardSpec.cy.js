import { mockCompanies, mockContactsData } from "../fixtures/mockCompanies.js";

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
    cy.get('[data-cy="dashNum"]').first().should("exist")
    cy.get('[data-cy="dashNum"]').first().should("contain","2")

    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').should("have.text",222)
    cy.get('#jobApplications').find('label').first().should("have.text", "Jobs")
    cy.get('#jobApplications').find('label').last().should("have.text","New apps submitted this week")
  });

  it("Should show how many connections were submitted in the week", () => {
    cy.get('[data-cy="contactsCard"]').should("exist")
    cy.get('#contacts').find('label').first().should("have.text", "Contacts")
    cy.get('#contacts').find('label').last().should("have.text","New connections this week")
  });

  it("Should show how many companies were submitted in the week", () => {
    cy.get('[data-cy="companiesCard"]').should("exist")
    cy.get('#companies').should("exist")
    cy.get('#companies').find('label').first().should("have.text", "Companies")
    cy.get('#companies').find('label').last().should("have.text", "New companies this week")
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
    cy.get('[data-cy="dashNum"]').first().should("exist")
    cy.get('[data-cy="dashNum"]').first().should("contain","0")

    cy.get('[data-cy="dashNum"]').should("exist")
    cy.get('[data-cy="dashNum"]').first().should("have.text", "0")
    cy.get('#jobApplications').find('label').first().should("have.text", "Jobs")
    cy.get('#jobApplications').find('label').last().should("have.text", "New job applications this week")
  });

  it("Should show how many connections were submitted in the week", () => {
    cy.get('[data-cy="contactsCard"]').should("exist")
    cy.get('#contacts').find('label').first().should("have.text", "Contacts")
    cy.get('#contacts').find('label').last().should("have.text","New contacts this week")
  });

  it("Should show how many companies were submitted in the week", () => {
    cy.get('[data-cy="companiesCard"]').should("exist")
    cy.get('#companies').should("exist")
    cy.get('[data-cy="dashNum"]').last().should("have.text", "0")
    cy.get('#companies').find('label').first().should("have.text", "Companies")
    cy.get('#companies').find('label').last().should("have.text", "New companies this week")
  });
})

describe('Dash Board buttons to add new resources', () => {
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
    ).as("getDashboardData");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: { "Content-Type": "application/json" },
    }).as("getContacts");

    cy.intercept("GET", `http://localhost:3001/api/v1/users/1/companies`, {
      statusCode: 200,
      body: mockCompanies,
      headers: { "Content-Type": "application/json" },
    }).as("getCompanies");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
  });

  it("Should have a clickable button to route you to add a new job application", () => {
    cy.get('[data-cy="jobApplicationBtn"]').click();
    cy.url().should('include', 'http://localhost:3000/jobapplications/new');
  });

  it("Should have a clickable button to route you to add a new contact", () => {
    cy.get('[data-cy="contactBtn"]').click();
    cy.url().should('include', 'http://localhost:3000/contacts/new');
  });

  it("Should have a clickable button to route you to add a new company", () => {
    cy.get('[data-cy="companyBtn"]').click();
    cy.url().should('include', 'http://localhost:3000/companies/new');
  });

  it("should render all 'Add new' buttons when there are no resources", () => {
    cy.fixture("mockDashBoardNoJobsContactsOrCompanies").then((data) => {
      data.jobApplications = [];
      data.contacts = [];
      data.companies = [];
      
      cy.intercept("GET", "**/api/v1/users/1/dashboard", {
        statusCode: 200,
        body: data,
      }).as("getDashboardData");
    });
  
    cy.reload();
    cy.wait("@getDashboardData");
  
    cy.get('[data-cy="jobApplicationBtn"]').should("exist").and("have.text", "Add new job application");
    cy.get('[data-cy="contactBtn"]').should("exist").and("have.text", "Add new contact");
    cy.get('[data-cy="companyBtn"]').should("exist").and("have.text", "Add new company");
  });

  it("should render all 'Add new' buttons when one resource has data", () => {
    cy.fixture("mockDashBoardSingleJobData").then((data) => {
      data.jobApplications = [
        {
          id: 1,
          position_title: "Jr. CTO",
          date_applied: "2024-10-31",
          status: 1,
          notes: "Fingers crossed!",
          job_description: "Looking for Turing grad/jr dev to be CTO",
          application_url: "www.example.com",
          created_at: "2024-12-16T21:16:09.601Z",
          updated_at: "2024-12-16T21:16:09.601Z",
          company_id: 1,
          user_id: 1
        }
      ]
      cy.intercept("GET", "**/api/v1/users/1/dashboard", {
        statusCode: 200,
        body: data,
      }).as("getDashboardData");
      cy.reload()
      cy.wait("@getDashboardData")

      cy.get('[data-cy="jobApplicationBtn"]').should("exist").and("have.text", "Add new job application");
      cy.get('[data-cy="contactBtn"]').should("exist").and("have.text", "Add new contact");
      cy.get('[data-cy="companyBtn"]').should("exist").and("have.text", "Add new company");
    })
  })

  it("should not render any buttons when all sections have data", () => {
    cy.fixture("mockDashBoardNoJobsContactsOrCompanies").then((data) => {
      const modifiedData = { ...data, jobApplications: [{ id: 1 }], contacts: [{ id: 1 }], companies: [{ id: 1 }] };
      cy.intercept("GET", "**/api/v1/users/1/dashboard", {
        statusCode: 200,
        body: modifiedData
      }).as("getDashboardData");
    });

    cy.reload();
    cy.wait("@getDashboardData");
    cy.get('[data-cy="jobBtn"]').should("not.exist");
    cy.get('[data-cy="contactBtn"]').should("not.exist");
    cy.get('[data-cy="companyBtn"]').should("not.exist");
  });

});