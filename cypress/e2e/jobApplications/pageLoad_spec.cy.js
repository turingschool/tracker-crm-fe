describe("Job Application Page Layout- Happy Path", () => {
  beforeEach(() => {
    cy.login('danny_de@email.com', 'jerseyMikesRox7');
    cy.mockJobApplications();
    cy.get('[data-testid="applications-iconD"]').click();
  });

  it("Should have a header with the text 'Applications' once data is loaded", () => {
    cy.wait("@getJobApplications");
    cy.get("h1").should("have.text", "Applications");
  });

  it("Should display a spinner while loading and show data after loading completes", () => {
    cy.get(".flex.justify-center.items-center.h-64 > span").should("be.visible");
    cy.wait("@getJobApplications");
    cy.get(".flex.justify-center.items-center.h-64 > span").should("not.exist");
    cy.get("tbody > tr").should("have.length.at.least", 1);
  });

  it("Should allow searching for companies", () => {
    cy.wait("@getJobApplications");
    cy.get('input[type="search"]').type("tech");
    cy.get("tbody > tr").contains("Tech").should("exist");
    cy.get("tbody > tr").should("have.length", 1);

    cy.get('input[type="search"]').clear();
    cy.get("tbody > tr").should("have.length", 3);
  });

  it("Should show 'No applications found.' if the search doesn't match any company", () => {
    cy.wait("@getJobApplications");
    cy.get('input[type="search"]').type("NonExistentCompany");
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("tbody > tr > td").should("contain.text", "No applications found.");
  });

describe("Job Application Page Layout- Sad Paths", () => {
  beforeEach(() => {
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

    cy.get('[data-testid="applications-iconD"]').click();
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@getJobApplicationsError");
    cy.get(".p-6.text-red-600").should("contain.text", "Error loading applications.");
  });
});
})