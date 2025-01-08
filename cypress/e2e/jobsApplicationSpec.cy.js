
describe("Job app page after logging in", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", (req) => {
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
    }).as("getJobApplications");
    
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();

  });

  it("Should have a header with the text 'Applications' once data is loaded", () => {
  
    cy.wait("@getJobApplications");

    cy.get("h1").should("have.text", "Applications");

    cy.get('.border.rounded-lg.overflow-hidden').should('exist');
  });
  
  it("Should display a spinner while loading and show data after loading completes", () => {

    cy.get('.flex.justify-center.items-center.h-64 > span').should("be.visible");

    cy.wait("@getJobApplications");


    cy.get('.flex.justify-center.items-center.h-64 > span').should('not.exist');
    cy.get("tbody > tr").should("have.length.at.least", 1);
  });

  it("Should allow searching for companies", () => {
   
    cy.wait("@getJobApplications");

   
    cy.get('input[type="search"]').type('tech');

    
    cy.get("tbody > tr").contains("Tech").should("exist");
    cy.get("tbody > tr").should('have.length', 1);

    
    cy.get('input[type="search"]').clear();
    cy.get("tbody > tr").should('have.length', 3);

  });

  it("Should show 'No applications found.' if the search doesn't match any company", () => {

    cy.wait("@getJobApplications");

    cy.get('input[type="search"]').type('NonExistentCompany');
    cy.get('tbody > tr').should('have.length', 1); 
    cy.get('tbody > tr > td').should('contain.text', 'No applications found.');
  });

})

describe("Job app page when data fails to load", () => {
  beforeEach(() => {

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getJobApplicationsError");
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
  });

  it("Should display an error message if unable to fetch data", () => {
    cy.wait("@getJobApplicationsError");
    cy.get(".p-6.text-red-600").should("contain.text", "Error loading applications.");
  });
});

describe("View specific job app page with all fields filled in", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", (req) => {
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
    }).as("getJobApplications");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications/3", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); 
      });
      req.reply({
        statusCode: 200,
        fixture: "mockSingleJobApp",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }).as("showSingleJobApp");
    
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("tbody > tr").contains("Creative").click();
  });

  it("displays the position title and company name", () => {

    cy.wait("@showSingleJobApp");

    cy.get('h1.text-cyan-600').should("have.text", "Backend Developer");
    cy.get('.flex > :nth-child(1) > .sm\\:text-3xl').should("contain.text", "Creative Solutions Inc.");{/* REFACTOR AWAITING SHOW COMPANY ROUTE */}
  });

  it("displays application details", () => {

    cy.wait("@showSingleJobApp");

    cy.get("p.font-medium")
      .should("contain.text", "Applied On")
      .within(() => {
        cy.get("span.font-semibold").should("have.text", "2024-08-20"); {/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
      });

    cy.get("p.mb-6")
      .should("contain.text", "Status:")
      .within(() => {
        cy.get("span").should("have.text", "Interviewing");{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
      });
  });

  it("displays notes and edit button", () => {

    cy.wait("@showSingleJobApp");

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get("p.mb-8").should("have.text", "Had a technical interview, awaiting decision.");
    cy.get("button.bg-transparent").should("have.text", "Edit");{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
  });

  it("displays job description and link", () => {

    cy.wait("@showSingleJobApp");

    cy.get("h2.text-cyan-600").should("contain.text", "Job Description");
    cy.get('.mb-8 > .text-cyan-500')
      .should("have.text", "https://creativesolutions.com/careers/backend-developer")
      .and("have.attr", "href", "https://creativesolutions.com/careers/backend-developer");

    cy.get("p.mt-4").should("contain.text", "Developing RESTful APIs and optimizing server performance");
    cy.get('section.mt-8 button.text-cyan-600').should("have.text", "Read More...");
  });

  it("displays the contact list", () => {

    cy.wait("@showSingleJobApp");

    cy.get("h2.text-cyan-600").should("contain.text", "My Contacts at Creative Solutions Inc.");
    cy.get("p.text-cyan-500").should("contain.text", "Michael Johnson");{/* REFACTOR AWAITING SHOW CONTACT ROUTE */}
  });

  it("handles the modal for full job description", () => {

    cy.wait("@showSingleJobApp");

    cy.get('section.mt-8 button.text-cyan-600').click();
    cy.get("div.bg-white").within(() => {
      cy.get("h2").should("have.text", "Full Job Description");
      cy.get("p").should("contain.text", "Developing RESTful APIs and optimizing server performance");
      cy.get("button").should("have.text", "Close").click();
    });
    cy.get("div.bg-white").should("not.exist");
  });

  it("Should allow user to open and close 'Read More...' modal", () => {

    cy.wait("@showSingleJobApp");

    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').should('not.exist');
    cy.get('section.mt-8 button.text-cyan-600').click();
    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').should('be.visible');
    cy.get('.text-cyan-600.text-xl.font-bold.mb-4').should('be.visible');
    cy.get('.mb-4').should('be.visible');
    cy.get('.bg-cyan-600.text-white.px-4.py-2.rounded.hover\\:bg-cyan-800').should('be.visible');
    cy.get('.bg-cyan-600.text-white.px-4.py-2.rounded.hover\\:bg-cyan-800').click();
    cy.get('.fixed.inset-0.bg-black.bg-opacity-50').should('not.exist');
  });
});

describe("View specific job app page with empty fields", () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", (req) => {
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
    }).as("getJobApplications");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications/5", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); 
      });
      req.reply({
        statusCode: 200,
        fixture: "mockSingleJobAppEmptyFields",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }).as("showSingleJobAppEmptyFields");
    
    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('tbody > :nth-child(3) > :nth-child(1)').click();
  });

  it("should display unique message for empty notes field", () => {

    cy.wait("@showSingleJobAppEmptyFields");

    cy.get("h3.text-cyan-600").should("have.text", "Notes");
    cy.get("p.mb-8").should("have.text", "Click edit to add some notes.");{/* REFACTOR AWAITING UPDATE JOB APP ROUTE */}
  })

  it("should display a link for adding contacts when contact field is empty", () => {

    cy.wait("@showSingleJobAppEmptyFields");

    cy.get("p.text-cyan-500").should("contain.text", "Add a new contact");
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

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications", (req) => {
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
    }).as("getJobApplications");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/1/job_applications/3", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("showJobApplicationError");
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Test User',
              email: 'testuser@example.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("tbody > tr").contains("Creative").click();
  });

  it("Should display an error message if unable to fetch data", () => {

    cy.wait("@showJobApplicationError");

    cy.get('.text-red-600').should("have.text", "Unable to fetch job application data.");
    cy.get('.text-gray-500').should("have.text", "Loading...")
  });
})