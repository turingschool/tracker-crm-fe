describe("Job Application Interview Questions", () => {
  beforeEach(() => {
    // Mock the login request
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
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    // Set up other intercepts
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/dashboard",
      {
        statusCode: 200,
        body: {
          data: {
            id: "1",
            type: "dashboard",
            attributes: {
              dashboard: {
                weekly_summary: {
                  job_applications: [],
                  contacts: [],
                  companies: []
                }
              }
            }
          }
        }
      }
    ).as("getDashboard");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      {
        statusCode: 200,
        body: {
          data: [
            {
              id: "3",
              type: "job_application",
              attributes: {
                position_title: "Backend Developer",
                date_applied: "2024-08-20",
                status: 2,
                notes: "Had a technical interview, awaiting decision.",
                job_description: "Developing RESTful APIs and optimizing server performance.",
                application_url: "https://creativesolutions.com/careers/backend-developer",
                company_id: 3,
                company_name: "Creative Solutions Inc."
              }
            }
          ]
        }
      }
    ).as("getJobApplications");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3",
      {
        statusCode: 200,
        fixture: "mockSingleJobApp",
        headers: {
          "Authorization": "Bearer fake-token"
        }
      }
    ).as("showSingleJobApp");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3/interview_questions/fetch_or_create",
      {
        statusCode: 200,
        fixture: "mockInterviewQuestions",
        headers: {
          "Authorization": "Bearer fake-token"
        }
      }
    ).as("showJobInterviewQuestions");

    // Start with login
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("testuser@example.com");
    cy.get("#password").type("password123");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");
    cy.wait("@getDashboard");

    // Navigate to job applications
    cy.visit("http://localhost:3000/job_applications");
    cy.wait("@getJobApplications");

    // Click on the specific job application
    cy.contains("Backend Developer").click();
    cy.wait("@showSingleJobApp");
  });

  it("displays the page header information correctly", () => {
    cy.contains("Practice Interview").click();
    cy.wait("@showJobInterviewQuestions");
    cy.get("h1").should("contain", "Backend Developer");
    cy.get("h2").should("contain", "Creative Solutions Inc.");
  });

  it("displays interview questions when loaded", () => {
    cy.contains("Practice Interview").click();
    cy.wait("@showJobInterviewQuestions");
    cy.get("[data-testid='interview-questions-list']").should("exist");
    cy.get("[data-testid='interview-questions-list'] li").should("have.length.at.least", 1);
  });

  it("displays a loading state while fetching questions", () => {
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3/interview_questions/fetch_or_create",
      {
        statusCode: 200,
        delayMs: 1000,
        fixture: "mockInterviewQuestions"
      }
    ).as("loadingQuestions");

    cy.contains("Practice Interview").click();
    cy.get("[data-testid='loading-spinner']").should("be.visible");
    cy.wait("@loadingQuestions");
  });

  it("should show error message when API request fails", () => {
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications/3/interview_questions/fetch_or_create",
      {
        statusCode: 500,
        body: {
          error: "Internal Server Error"
        }
      }
    ).as("failedRequest");

    cy.contains("Practice Interview").click();
    cy.wait("@failedRequest");
    
    cy.get("[data-testid='error-message']").should("be.visible")
      .and("contain", "Failed to fetch interview questions. Please try again.");
  });
});