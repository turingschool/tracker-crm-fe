import { mockJobApplicationData } from "../fixtures/mockJobApplicationData.json";
import { mockJobApplicationDataDeleted} from "../fixtures/mockJobApplicationDataDeleted.json";
import { mockDashboard } from "../fixtures/mockDashBoard.json";

describe('Delete a Job Application', () => {
  beforeEach(() => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "The token",
        user: {
          data: {
            id: 2,
            type: "user",
            attributes: {
              name: "Dolly Parton",
              email: "dollyP@email.com",
              companies: []
            },
          },
        },
      },
    }).as("postUserInfo")

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/job_applications", (req) => {
      req.on("response", (res) => {
        res.setDelay(2000); 
      });
      req.reply({
        statusCode: 200,
        fixture: "mockJobApplicationData",
        headers: {
          "Content-Type": "application/json",
        },
      });
    }).as("getJobApplications");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/job_applications/3", {
      statusCode: 200,
      body: {
        data: {
          id: "3",
          type: "job_application",
          attributes: {
            position_title: "Backend Developer",
            date_applied: "2024-08-20",
            status: 2,
            notes: "Had a technical interview, awaiting decision.",
            job_description: "Developing RESTful APIs and optimizing server performance.",
            application_url: "https://creativesolutions.com/careers/backend-developer",
            contact_information: "techlead@creativesolutions.com",
            company_id: 3,
            contact_id: null,
            contacts: []
          },
        },
      },
    }).as("getJobApplicationDetails")

    cy.intercept("PATCH", "http://localhost:3001/api/v1/users/2/job_applications/3", {
      statusCode: 200,
      body: {
        data: {
          id: "3",
          type: "job_application",
          attributes: {
            position_title: "Backend Developer",
            date_applied: "2024-08-20",
            status: 2,
            notes: "Had a technical interview, awaiting decision.",
            job_description: "Developing RESTful APIs and optimizing server performance.",
            application_url: "https://creativesolutions.com/careers/backend-developer",
            contact_information: "techlead@creativesolutions.com",
            company_id: 3
          },
        },
      },
    }).as("patchJobApplicationDetails")

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/dashboard", {
      statusCode: 200,
      fixture: "mockDashBoard",
    });

    cy.visit("http://localhost:3000/");
    cy.get('#email').type('dollyP@email.com');
    cy.get('#password').type('Jolene123');
    cy.get('.login-btn').click();
    cy.wait('@postUserInfo');
    cy.get('a[href="/job_applications"]').first().click();
    cy.wait('@getJobApplications')
    cy.get('tr td').contains('3').click();
    cy.url().should('include', '/job_applications/3')
    cy.wait('@getJobApplicationDetails');
  })

  it("Should display the delete button on the job application show page", () => {
    cy.contains("button", "Delete").should("be.visible");
    cy.wait("@patchJobApplicationDetails")
  });

  it("Should open the delete confirmation modal", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
  });

  it("Should close the delete confirmation modal when Cancel is clicked", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Cancel").click();
    cy.contains("Are you sure you want to delete this").should("not.exist");
    cy.url().should("include", "/job_applications/3");
  });

  it("Should close the modal when clicking outside", () => {
    cy.get("button").contains("Delete").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
    cy.get("body").click(0, 1);
    cy.contains("Are you sure you want to delete this").should("not.exist");
  });

  it("Should delete the job application when Delete is clicked", () => {
    cy.intercept(
      {
        method: "DELETE",
        url: "http://localhost:3001/api/v1/users/2/job_applications/3",
      },
      {statusCode: 200}
    ).as("deleteJobApplication")

    cy.get("button").contains("Delete").click();
    cy.contains("Delete").click();

    cy.wait("@deleteJobApplication");
    cy.url().should("include", "/job_applications");
  })

  it("Should show an error alert if deletion fails", () => {
    cy.contains("Delete").should("exist").click();
    cy.contains("Are you sure you want to delete this").should("be.visible");
    cy.intercept("DELETE", "http://localhost:3001/api/v1/users/2/job_applications/3", {
      statusCode: 500,
      body: { error: "Something went wrong while deleting the job application" },
    }).as("deleteJobApplicationFail");
    cy.contains("Delete").should("exist").click();
    cy.wait("@deleteJobApplicationFail");
    cy.on("window:alert", (text) => {
      expect(text).to.contains("Failed to delete job_application. Please try again");
    });
  });
})