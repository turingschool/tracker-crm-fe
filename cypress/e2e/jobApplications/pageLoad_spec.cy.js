describe("Job Application Page Layout - Happy Path", () => {
  beforeEach(() => {
    cy.login('danny_de@email.com', 'jerseyMikesRox7');
  });

  it("Should have a header with the text 'Applications' once data is loaded", () => {
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      {
        statusCode: 200,
        fixture: "mockJobApps",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("getJobApplications");

    cy.visit("/job_applications");
    cy.wait("@getJobApplications");
    cy.get("h1").should("have.text", "Applications");
  });

  it("Should display a spinner while loading and show data after loading completes", () => {
    // code to establish delayed response to resolve flaky test
    let sendResponse;
    const trigger = new Promise((resolve) => {
      sendResponse = resolve;
    });

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      (req) => {
        return trigger.then(() => {
          req.reply({
            statusCode: 200,
            fixture: "mockJobApps",
            headers: {
              "Content-Type": "application/json",
            },
          });
        });
      }
    ).as("getJobApplications");

    cy.visit("/job_applications");

    // assert spinner is shown while data is loading
    cy.get(".flex.justify-center.items-center.h-64 > span").should("be.visible");

    // then trigger the response to continue
    sendResponse();

    // wait for the response to complete
    cy.wait("@getJobApplications");

    // Spinner should be gone and data should be visible
    cy.get(".flex.justify-center.items-center.h-64 > span").should("not.exist");
    cy.get("tbody > tr").should("have.length.at.least", 1);
  });

  it("Should allow searching for companies", () => {
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      {
        statusCode: 200,
        fixture: "mockJobApps",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("getJobApplications");

    cy.visit("/job_applications");
    cy.wait("@getJobApplications");

    cy.get('input[type="search"]').type("tech");
    cy.get("tbody > tr").contains("Tech").should("exist");
    cy.get("tbody > tr").should("have.length", 1);
    cy.get('input[type="search"]').clear();
    cy.get("tbody > tr").should("have.length", 3);
  });

  it("Should show 'No applications found.' if the search doesn't match any company", () => {
    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      {
        statusCode: 200,
        fixture: "mockJobApps",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("getJobApplications");

    cy.visit("/job_applications");
    cy.wait("@getJobApplications");

    cy.get('input[type="search"]').type("NonExistentCompany");
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("tbody > tr > td").should("contain.text", "No applications found.");
  });
});

describe("Job Application Page Layout - Sad Paths", () => {
  it("Should display an error message if unable to fetch data", () => {
    cy.login('danny_de@email.com', 'jerseyMikesRox7');

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/1/job_applications",
      {
        statusCode: 500,
        body: { error: "Internal Server Error" },
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("getJobApplicationsError");

    cy.visit("/job_applications");
    cy.wait("@getJobApplicationsError");
    cy.get(".p-6.text-red-600").should("contain.text", "Error loading applications.");
  });
});
