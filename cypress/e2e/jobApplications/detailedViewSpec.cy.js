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
  });

  it("displays the position title and company name", () => {
    cy.wait("@showSingleJobApp");

    cy.get("h1.text-cyan-600")
      .should("have.text", "Backend Developer")
    cy.get("[data-testid='job-companyName'")
      .should("have.text", 'Creative Solutions Inc.')
  });

  it("navigates to the company details page", () => {
    cy.wait("@showSingleJobApp");
    cy.get("h2").contains("Creative Solutions Inc.").click();
    cy.wait("@getCompanyDetails");

    cy.location("pathname").should("match", /\/companies\/3\/contacts$/);
  });

  it("displays application details", () => {
    cy.wait("@showSingleJobApp");
    cy.get("#applied-on")
      .should("contain.text", "Applied On");
    cy.get('[data-testid="application-date"]').should("have.text", "August 20, 2024"); 
    
    cy.get("#application-status")
      .should("contain.text", "Status:");
    cy.get('#appStatus').should("have.value", "2");
  });

  it("displays notes and edit button", () => {
    cy.wait("@showSingleJobApp");

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get('[data-testid="job-notes"]').should(
      "have.text",
      "Had a technical interview, awaiting decision."
    );
    cy.get("[data-testid='edit-button']").should("have.text", "Edit");
  });

  it("displays job description and link", () => {
    cy.wait("@showSingleJobApp");

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

    cy.wait("@showSingleJobApp");

    cy.get("h2.text-cyan-700").should("contain.text", "Contacts at Creative Solutions Inc.");
  });

  it("navigates to the contact's personal page when clicking on their name", () => {
    cy.wait("@showSingleJobApp");
    cy.get("a.text-cyan-600").contains("Michael Johnson").click();
    cy.location("pathname").should("match", /\/contacts\/\d+$/);
  });
  
  it("handles the modal for full job description", () => {
    cy.wait("@showSingleJobApp");

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
    cy.wait("@showSingleJobApp");

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
    cy.wait("@showSingleJobApp");

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

describe("View specific job app page with empty fields", () => {
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
      "http://localhost:3001/api/v1/users/1/job_applications/5",
      (req) => {
        req.on("response", (res) => {});
        req.reply({
          statusCode: 200,
          fixture: "mockSingleJobAppEmptyFields",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("showSingleJobAppEmptyFields");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("tbody > :nth-child(3) > :nth-child(1)").click();
  });

  it("should display unique message for empty notes field", () => {
    cy.wait("@showSingleJobAppEmptyFields");

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get("p.mb-6").should("have.text", "Click edit to add some notes.");
    {
      /* REFACTOR AWAITING UPDATE JOB APP ROUTE */
    }
  });

    it("should display a link for adding contacts when contact field is empty", () => {

      cy.wait("@showSingleJobAppEmptyFields");

      cy.get("p.text-cyan-600").should("contain.text", "Add a new contact");
      cy.contains('Add a new contact').click();

      cy.intercept("GET", "http://localhost:3001/api/v1/users/1/contacts/new", {
        statusCode: 200
      }).as("addContact");

      cy.url().should('include', '/contacts/new');
      cy.get("h1").should("have.text", "Add New Contact");
    })
});

describe("View specific job app page when data fails to load", () => {
  beforeEach(() => {
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
      {
        statusCode: 500,
        body: { error: "Internal Server Error" },
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("showJobApplicationError");
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

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("tbody > tr").contains("Creative").click();
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@showJobApplicationError");
    cy.get(".text-red-600").should('contain', 'Failed to fetch job application')
  });
});