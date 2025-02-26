describe("View specific job app page with all fields filled in", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          data: {
            id: 1,
            type: "user",
            attributes: {
              name: "Test User",
              email: "testuser@example.com",
              companies: [],
            },
          },
        },
      },
    }).as("mockSession");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      (req) => {
        req.on("response", (res) => {});
        req.reply({
          statusCode: 200,
          fixture: "mockJobApps",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("getJobApplications");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3",
      (req) => {
        req.on("response", (res) => {});
        req.reply({
          statusCode: 200,
          fixture: "mockSingleJobApp",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("showSingleJobApp");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3/interviewQuestions",
      (req) => {
        req.on("response", (res) => {});
        req.reply({
          statusCode: 200,
          fixture: "mockInterviewQuestions",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("showJobInterviewQuestions");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/companies/3/contacts",
      (req) => {
        req.headers["Authorization"] = "Bearer fake-token";
        req.reply({
          statusCode: 200,
          fixture: "mockCompanyDetails",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("getCompanyDetails");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("tbody > tr").contains("Creative Solutions Inc.").click();
    cy.get('[data-testid="interview-questions"] button').click();
  });

  it("displays the position title and company name", () => {
    cy.get("h1.text-cyan-600")
      .should("have.text", "Backend Developer")
      .next()
      .should("have.text", "Creative Solutions Inc.")
      .next()
      .should("have.text", "Back to job application details");
  });

  it("navigates to the company details page", () => {
    cy.get("h2").contains("Creative Solutions Inc.").click();
    cy.wait("@getCompanyDetails");

    cy.location("pathname").should("match", /\/companies\/3\/contacts$/);
  });

  it("has interview questions", () => {
    cy.url().should('include', '/interviewQuestions');
    
    cy.get('[data-testid="interview-questions-list"]')
      .should('exist')
      .and('have.length', 10);
  });

  it("displays interview questions", () => {
    cy.get('[data-testid="interview-questions-list"]')
      .should("have.text", "1. Can you explain the difference between state and props in React?2. Given a React component that fetches data from an API, how would you manage loading, success, and error states?3. How would you handle form submission and validation in a React application?4. How does JavaScript handle asynchronous operations? Can you explain async/await and provide an example?5. What are some techniques to improve performance in a React application?6. How would you define a RESTful API in Ruby on Rails?7. Given a User model with has_many :bookings, how would you retrieve all bookings for a user in Rails?8. How would you implement authentication in a Rails API using Devise or JWT?9. Given an array of integers, write a function that returns the two numbers that sum to a given target.10. Imagine you're working on a React/Rails app and an API request fails with a 500 error. How would you go about debugging the issue?")
  });

  it("navigates back to the job application details page", () => {
    cy.get("h3").contains("Back to job application details").click();
    cy.wait("@showSingleJobApp");

    cy.location("pathname").should("match", /\/job_applications\/3$/);
  });
});