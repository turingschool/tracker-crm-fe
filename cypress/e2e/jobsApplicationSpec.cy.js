describe("Job app page after logging in", () => {
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
        req.on("response", (res) => {
          res.setDelay(2000);
        });
        req.reply({
          statusCode: 200,
          fixture: "mockJobApps",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("getJobApplications");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
  });

  it("Should have a header with the text 'Applications' once data is loaded", () => {
    cy.wait("@getJobApplications");

    cy.get("h1").should("have.text", "Applications");
  });

  it("Should display a spinner while loading and show data after loading completes", () => {
    cy.get(".flex.justify-center.items-center.h-64 > span").should(
      "be.visible"
    );

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
});

describe("Job app page when data fails to load", () => {
  beforeEach(() => {
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
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@getJobApplicationsError");
    cy.get(".p-6.text-red-600").should(
      "contain.text",
      "Error loading applications."
    );
  });
});

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
      .next()
      .should("have.text", "Creative Solutions Inc.");
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
    cy.get(".mb-8 > .text-cyan-600")
      .should(
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

  it("displays the contact list", () => {

    cy.wait("@showSingleJobApp");

    cy.get("h2.text-cyan-700").should("contain.text", "Contacts at Creative Solutions Inc.");
    // cy.get("a.text-cyan-500").should("contain.text", "Michael Johnson");
  });

  it("navigates to the contact's personal page when clicking on their name", () => {
    cy.wait("@showSingleJobApp");
    cy.get("a.text-cyan-600").contains("Michael Johnson").click();
    cy.location("pathname").should("match", /\/contacts\/\d+$/);
  });
  

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

    cy.get(".text-red-600").should(
      "have.text",
      "Unable to fetch job application data."
    );
    cy.get(".text-gray-500").should("have.text", "Loading...");
  });
});

describe("Editability of specific job application fields", () => {
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
    cy.get("tbody > tr").contains("Creative").click();
  });

  it("edits an application date", () => {
    cy.intercept(
      "PATCH",
      "http://localhost:3001/api/v1/users/1/job_applications/3",
      (req) => {
        console.log(req.body);
        req.on("response", (res) => {});
        req.reply({
          statusCode: 200,
          fixture: "mockJobAppDateUpdate",
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
    ).as("updateJobAppDate");

    cy.wait("@showSingleJobApp");
    cy.get('[data-testid="application-date"]').click();
    cy.get('[aria-label="Choose Thursday, August 1st, 2024"]').click();
    cy.get('[data-testid="application-date"]')
      .should(
        "have.text",
        "August 1, 2024"
    );
    cy.wait("@updateJobAppDate");
    cy.get('[data-testid="application-date"]')
      .should(
        "have.text",
        "August 1, 2024"
    );
  });

  describe("Updating job application status from the application show page", () => {
    beforeEach(() => {
      cy.intercept(
        "PATCH",
        "http://localhost:3001/api/v1/users/1/job_applications/3",
        (req) => {
          console.log("request body:", req.body);
          req.body.status = status; 
          req.reply({
            statusCode: 200,
            fixture: "mockJobAppStatusUpdate",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      ).as("updateJobAppStatus");
    })

    const statuses = [
      "Submitted",
      "Interviewing",
      "Offer",
      "Rejected",
      "Phone Screen",
      "Code Challenge",
      "Not Yet Applied",
    ];

    statuses.forEach((status, index) => {
      it(`should update application status to ${status}`, () => {
        if (status === "Interviewing") {
          cy.get("#appStatus")
            .select("Submitted")
            .should("have.value", "1");
        }

        cy.get("#appStatus")
          .select(status)
          .should("have.value", `${index + 1}`);

        cy.wait("@updateJobAppStatus");

        cy.get("#appStatus")
          .select(status)
          .should("have.value", `${index + 1}`);
      });
    });
  });

    it("Should display the edit modal when edit button is clicked", () => {
      cy.get('[data-testid="edit-modal"]')
        .should("not.exist");
      cy.get('[data-testid="edit-modal-title"]')
        .should("not.exist");
      cy.get('[data-testid="edit-modal-form"]')
        .should("not.exist");
      
      cy.get('[data-testid="edit-button"]').click();
      
      cy.get('[data-testid="edit-modal"]')
        .should("be.visible");
      cy.get('[data-testid="edit-modal-title"]')
        .should("be.visible");
      cy.get('[data-testid="edit-modal-form"]')
        .should("be.visible");
      
      cy.get('[data-testid="edit-modal-form-title"]')
        .should(
          "have.value",
          "Backend Developer"
      );

      cy.get('[data-testid="edit-modal-form-status"]')
        .should(
          "have.value", 
          "2"
      );
      cy.get('[data-testid="edit-modal-form-description"]')
        .should(
          "have.value",
          "Developing RESTful APIs and optimizing server performance."
      );
      cy.get('[data-testid="edit-modal-form-url"]')
        .should(
          "have.value",
          "https://creativesolutions.com/careers/backend-developer"
        );
      cy.get('[data-testid="edit-modal-form-notes"]')
        .should(
          "have.value",
          "Had a technical interview, awaiting decision."
      );
    });
    
    it("Should close the edit modal when cancel button is clicked", () => {
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="edit-modal-form-cancel-button"]').click();
      
      cy.get('[data-testid="edit-modal"]')
        .should("not.exist");
      cy.get('[data-testid="edit-modal-title"]')
        .should("not.exist");
      cy.get('[data-testid="edit-modal-form"]')
        .should("not.exist");
    });
    
    it("Should make a fetch call when update info button is clicked", () => {
      cy.intercept(
        "PATCH",
          "http://localhost:3001/api/v1/users/1/job_applications/3",
          (req) => {
            req.on("response", (res) => {});
            req.reply({
              statusCode: 200,
              fixture: "mockSingleJobAppUpdate",
              headers: {
                "Content-Type": "application/json",
              },
            });
          }
      ).as("updateJobApp");
    
      cy.get('[data-testid="edit-button"]').click();
    
      cy.get('[data-testid="edit-modal-form-title"]')
        .clear()
        .type("Frontend Developer");
      cy.get('[data-testid="edit-modal-form-status"]')
        .select("3");
      cy.get('[data-testid="edit-modal-form-description"]')
        .clear()
        .type("Frontend Developer of React only with no CSS");
      cy.get('[data-testid="edit-modal-form-url"]')
        .clear()
        .type("https://example.com");
      cy.get('[data-testid="edit-modal-form-notes"]')
        .clear()
        .type(
          "Talked with recruiter, sounds like a great opportunity to learn new things");
      cy.get('[data-testid="edit-modal-form-submit-button"]').click();
    
      cy.wait("@updateJobApp");
    
      cy.get('[data-testid="job-Title"]')
        .should(
          "contain", 
          "Frontend Developer"
        );
      cy.get('[data-testid="job-companyName"]')
        .should(
          "contain",
          "Creative Solutions Inc."
        );
      cy.get('#appStatus')
        .should(
          "have.value", 
          "3"
        );
      cy.get('[data-testid="job-notes"]')
        .should(
          "contain",
          "Talked with recruiter, sounds like a great opportunity to learn new things"
        );
      cy.get('[data-testid="job-URL"]')
        .should(
          "contain", 
          "https://example.com"
          );
      cy.get('[data-testid="job-URL"]')
        .should(
          "have.attr", 
          "href"
        )
        .and("include", "https://example.com"
        );
      cy.get('[data-testid="job-description"]')
        .should(
          "contain",
          "Frontend Developer of React only with no CSS"
        );
    });
    
    it("Should not create an error when update info button is clicked and no info changed", () => {
      cy.intercept(
          "PATCH",
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
      ).as("showSingleJobAppEmptyFields");
    
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="edit-modal-form-submit-button"]').click();
      cy.wait("@showSingleJobAppEmptyFields");
      
      cy.wait("@getJobApplications");
      cy.wait("@showSingleJobApp");
      
      cy.get('[data-testid="job-Title"]')
        .should(
          "contain", 
          "Backend Developer"
        );
      cy.get('[data-testid="job-companyName"]')
        .should(
          "contain",
          "Creative Solutions Inc."
      );
      cy.get('#appStatus')
        .should(
          "have.value", 
          "2"
        );
      cy.get('[data-testid="job-notes"]')
        .should(
          "contain",
          "Had a technical interview, awaiting decision."
        );
      cy.get('[data-testid="job-URL"]')
        .should(
          "contain",
          "https://creativesolutions.com/careers/backend-developer"
        );
      cy.get('[data-testid="job-URL"]')
        .should(
          "have.attr", 
          "href"
        )
        .and(
          "include",
          "https://creativesolutions.com/careers/backend-developer"
      );
      cy.get('[data-testid="job-description"]')
        .should(
          "contain",
          "Developing RESTful APIs and optimizing server performance."
        );
    });
  });
    