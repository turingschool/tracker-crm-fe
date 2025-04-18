describe("Happy Path- View specific job app page with all fields filled in", () => {
  beforeEach(() => {
    cy.login('danny_de@email.com', 'jerseyMikesRox7');
    cy.mockJobApplications();
    cy.mockSingleJobApplication(3, 'mockSingleJobApp');
    cy.mockCompanyContacts();
    cy.selectJobApplicationRow('Creative Solutions Inc.');
  });


  it('displays the position title and company name', () => {
    cy.wait('@showSingleJobApp-3');
    cy.get('h1.text-cyan-600').should('have.text', 'Backend Developer');
    cy.get("[data-testid='job-companyName']").should('have.text', 'Creative Solutions Inc.');
  });

  it("navigates to the company details page", () => {
    cy.wait('@showSingleJobApp-3');    cy.get("h2").contains("Creative Solutions Inc.").click();
    cy.wait("@getCompanyDetails");

    cy.location("pathname").should("match", /\/companies\/3\/contacts$/);
  });

  it("displays application details", () => {
    cy.wait('@showSingleJobApp-3');
    cy.get("#applied-on")
      .should("contain.text", "Applied On");
    cy.get('[data-testid="application-date"]').should("have.text", "August 20, 2024"); 
    
    cy.get("#application-status")
      .should("contain.text", "Status:");
    cy.get('#appStatus').should("have.value", "2");
  });

  it("displays notes and edit button", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get('[data-testid="job-notes"]').should(
      "have.text",
      "Had a technical interview, awaiting decision."
    );
    cy.get("[data-testid='edit-button']").should("have.text", "Edit");
  });

  it("displays job description and link", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get("h2.text-cyan-700").should("contain.text", "Job Description");
    cy.get('[data-testid="job-URL"]')
      .should(
        "have.attr",
        "href",
        "https://creativesolutions.com/careers/backend-developer"
      );

    cy.get("p.mt-4").should(
      "contain.text",
      "Developing RESTful APIs and optimizing server performance"
    );
    cy.get('[data-testid="read-more"]').should(
      "have.text",
      "Read More..."
    );
  });

  it("displays the contact list", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get("h2.text-cyan-700").should("contain.text", "Contacts at Creative Solutions Inc.");
  });

  it("navigates to the contact's personal page when clicking on their name", () => {
    cy.wait('@showSingleJobApp-3');
    cy.get("a.text-cyan-600").contains("Michael Johnson").click();
    cy.location("pathname").should("match", /\/contacts\/\d+$/);
  });
  
  it("handles the modal for full job description", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get('[data-testid="read-more"]').click();
    cy.get("div.bg-white").within(() => {
      cy.get("h2").should("have.text", "Full Job Description");
      cy.get("p").should(
        "contain.text",
        "Developing RESTful APIs and optimizing server performance"
      );
      cy.get("button").should("have.text", "Close").click();
    });
    cy.get("div.bg-white").should("not.exist");
  });

  it("Should allow user to open and close 'Read More...' modal via close button", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("not.exist");
    cy.get('[data-testid="read-more"]').click();
    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("be.visible");
    cy.get(".text-cyan-600.text-xl.font-bold.mb-4").should("be.visible");
    cy.get(".mb-4").should("be.visible");
    cy.get(
      ".bg-cyan-600.text-white.px-4.py-2.rounded.hover\\:bg-cyan-800"
    ).should("be.visible");
    cy.get(
      ".bg-cyan-600.text-white.px-4.py-2.rounded.hover\\:bg-cyan-800"
    ).click();
    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("not.exist");
  });

  it("Should allow user to open and close 'Read More...' modal when clicking outside of the modal", () => {
    cy.wait('@showSingleJobApp-3');

    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("not.exist");
    cy.get('[data-testid="read-more"]').click();
    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("be.visible");
    cy.get(".text-cyan-600.text-xl.font-bold.mb-4").should("be.visible");
    cy.get(".mb-4").should("be.visible");
    cy.get(
      ".bg-cyan-600.text-white.px-4.py-2.rounded.hover\\:bg-cyan-800"
    ).should("be.visible");
    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").click("topLeft");
    cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("not.exist");
  });
});

describe("Happy Path- View specific job app page with empty fields", () => {
  beforeEach(() => {
    cy.login("danny_de@email.com", "jerseyMikesRox7");
    cy.mockJobApplications();
    cy.mockSingleJobApplication(3, "mockSingleJobAppEmptyFields");
    cy.selectJobApplicationRow("Creative Solutions Inc.");
  });

  it("should display unique message for empty notes field", () => {
    cy.wait(`@showSingleJobApp-3`);
    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get("p.mb-6").should("have.text", "Click edit to add some notes.");

    /* REFACTOR AWAITING UPDATE JOB APP ROUTE */
  });

  it("should display a link for adding contacts when contact field is empty", () => {
    cy.wait(`@showSingleJobApp-3`);

    cy.get("p.text-cyan-600").should("contain.text", "Add a new contact");

    cy.contains("Add a new contact").click();

    cy.url().should("include", "/contacts/new");
    cy.get("h1").should("have.text", "Add New Contact");
  });
});

describe("Sad Path- View specific job app page when data fails to load", () => {
  beforeEach(() => {
    cy.login("danny_de@email.com", "jerseyMikesRox7");
    cy.mockJobApplications();
    cy.mockSingleJobApplicationError(3);
    cy.selectJobApplicationRow("Creative");
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@showJobApplicationError");
    cy.get(".text-red-600").should("contain", "Failed to fetch job application");
  });
});