describe("Happy Path- Editing Job Application", () => {
  beforeEach(() => {
    cy.login("danny_de@email.com", "jerseyMikesRox7");
    cy.mockJobApplications();
    cy.mockSingleJobApplication(3, "mockSingleJobApp");
    cy.selectJobApplicationRow("Creative");
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
    cy.wait("@showSingleJobApp-3");
    
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

    cy.wait("@showSingleJobApp-3");
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
});

// describe("Happy Path - Editing Job Application Status", () => {
//   const jobAppId = 3;
//   const patchUrl = `http://localhost:3001/api/v1/users/1/job_applications/${jobAppId}`;

//   const statusOptions = {
//     "Submitted": 1,
//     "Interviewing": 2,
//     "Offer": 3,
//     "Rejected": 4,
//     "Phone Screen": 5,
//     "Code Challenge": 6,
//     "Not Yet Applied": 7,
//   };

//   beforeEach(() => {
//     cy.intercept("PATCH", patchUrl, (req) => {
//       req.body.status = req.body.status || 1;
//       req.reply({
//         statusCode: 200,
//         fixture: "mockJobAppStatusUpdate",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }).as("updateJobAppStatus");
//   });

//   Object.entries(statusOptions).forEach(([label, value]) => {
//     it(`should update application status to ${label}`, () => {
//       cy.get("#appStatus")
//         .select(label)
//         .should("have.value", `${value}`);

//       cy.wait("@updateJobAppStatus");

//       cy.get("#appStatus")
//         .should("have.value", `${value}`);
//     });
//   });
// });


describe('Happy Path- Adding a New Contact to Job Application', () => {
  beforeEach(() => {
    cy.login('danny_de@email.com', 'jerseyMikesRox7');
    cy.mockJobApplications();
    cy.mockSingleJobApplication(3, 'mockJobAppNoContacts');
    cy.mockCompanyContacts();


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

    cy.intercept("PATCH", "http://localhost:3001/api/v1/users/1/job_applications/3", {
      statusCode: 200,
    });

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/1/companies',
      {
        fixture: 'mockCompanies',
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    cy.intercept(  
      'POST',
      'http://localhost:3001/api/v1/users/1/companies/3/contacts',
      {
        statusCode: 201,
        body: {
          data: {
            id: 1,
            type: 'contact',
            attributes: {
              first_name: 'Jimmy',
              last_name: 'Jim',
              email: 'example@gmail.com',
              phone_number: '555-555-5555',
              notes: 'Add notes here',
            }
          }
        }
      }
    );

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/1/companies',
      {
        fixture: 'mockCompanies',
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).as('getCompanies');    
  });


  it('should be able to add a new contact from the job application page', () => {
    cy.wait('@getJobApplications')
    cy.get("[data-testid='job-link-3']").should("contain", "Backend Developer").click();

    cy.wait('@showSingleJobApp-3');
    
    cy.get("[data-testid='add-new-contact']")
      .scrollIntoView().click();
    cy.get("[data-testid='first-name-input']")
      .scrollIntoView().type("Jimmy");
    cy.get("[data-testid='last-name-input']")
      .scrollIntoView().type("Jim");

    cy.wait('@getCompanies')

    cy.get("[data-testid='select-company-name']")
      .select("Leave blank or select a company")
      .select("Creative Solutions Inc.");
    cy.get("[data-testid='save-new-contact']").click();
  });

  it('should be able to see the added contact after navigating back to the job app', () => {
    cy.intercept(
      {
        method: "GET",
        url: "http://localhost:3001/api/v1/users/1/job_applications/3",
        times: 1
      },
      {
        statusCode: 200,
        fixture: "mockJobAppWithContact.json",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).as("getJobAppWithContact");

    cy.get('[data-testid="applications-iconD"]').click();
    cy.get("[data-testid='job-link-3']").should("contain", "Backend Developer").click();
    cy.contains("Jimmy Jim").should("exist");
  });
});