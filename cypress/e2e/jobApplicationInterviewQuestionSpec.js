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
      .next()
      .should("have.text", "Creative Solutions Inc.");
  });

  it("navigates to the company details page", () => {
    cy.wait("@showSingleJobApp");
    cy.get("h2").contains("Creative Solutions Inc.").click();
    cy.wait("@getCompanyDetails");

    cy.location("pathname").should("match", /\/companies\/3\/contacts$/);
  });

  it("displays the correct company details", () => {
    cy.wait("@showSingleJobApp");
    cy.get("h2").contains("Creative Solutions Inc.").click();
    cy.wait("@getCompanyDetails");
    cy.get("h1").should("have.text", "Company Details");

    cy.get("h2")
      .contains("Website:")
      .next()
      .should("have.text", "https://creativesolutions.com");

    cy.get("h2")
      .contains("Address:")
      .next()
      .should("have.text", "789 Creative Street Seattle, WA 98101");

    cy.get("h2")
      .contains("Notes:")
      .next()
      .should("have.text", "Follow up scheduled for next week.");
    cy.get("h2")
      .contains("Contacts")
      .next()
      .should("have.text", "Michael Johnson");
    cy.get("h2")
      .contains("Contacts")
      .next()
      .within(() => {
        cy.get("a").should("have.length.greaterThan", 0);
      });
  });

  it("displays application details", () => {
    cy.wait("@showSingleJobApp");

    cy.get("p.font-bold").should("contain.text", "Applied On");
    cy.get('[data-testid="application-date"]').should(
      "have.text",
      "August 20, 2024"
    );
    {
      /* REFACTOR AWAITING UPDATE JOB APP ROUTE */
    }

    cy.get("p.mb-6").should("contain.text", "Status:");
    cy.get('[data-testid="job-status"]').should("have.text", "Interviewing");
    {
      /* REFACTOR AWAITING UPDATE JOB APP ROUTE */
    }
  });

  it("displays notes and edit button", () => {
    cy.wait("@showSingleJobApp");

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get("p.mb-8").should(
      "have.text",
      "Had a technical interview, awaiting decision."
    );
    cy.get("button.bg-transparent").should("have.text", "Edit");
    {
      /* REFACTOR AWAITING UPDATE JOB APP ROUTE */
    }
  });

  it("displays job description and link", () => {
    cy.wait("@showSingleJobApp");

    cy.get("h2.text-cyan-600").should("contain.text", "Job Description");
    cy.get(".mb-8 > .text-cyan-500")
      .should(
        "have.text",
        "https://creativesolutions.com/careers/backend-developer"
      )
      .and(
        "have.attr",
        "href",
        "https://creativesolutions.com/careers/backend-developer"
      );

    cy.get("p.mt-4").should(
      "contain.text",
      "Developing RESTful APIs and optimizing server performance"
    );
    cy.get("section.mt-8 button.text-cyan-600").should(
      "have.text",
      "Read More..."
    );
  });

  // it("displays the contact list", () => {

  //   cy.wait("@showSingleJobApp");

  //   cy.get("h2.text-cyan-600").should("contain.text", "My Contacts at Creative Solutions Inc.");
  //   cy.get("p.text-cyan-500").should("contain.text", "Michael Johnson");{/* REFACTOR AWAITING SHOW CONTACT ROUTE */}
  // });

  it("handles the modal for full job description", () => {
    cy.wait("@showSingleJobApp");

    cy.get("section.mt-8 button.text-cyan-600").click();
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
    cy.get("section.mt-8 button.text-cyan-600").click();
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
    cy.get("section.mt-8 button.text-cyan-600").click();
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