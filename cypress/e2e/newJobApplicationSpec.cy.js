describe('Create New Job Application page after logging in', () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.intercept('POST', 'http://localhost:3001/api/v1/sessions', {
      statusCode: 200,
      body:
      {
        token: "Example token",
        user: {
          data: {
            id: 2,
            type: "user",
            attributes: {
              name: "Dolly Parton",
              email: "dollyP@email.com",
              companies: []
            }
          }
        }
      },
    }).as('postUserInfo');

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: {
        data: [
          { id: 1, attributes: { name: "Company A" } },
          { id: 2, attributes: { name: "Company B" } },
        ],
      },
    }).as("getCompanies");


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

    cy.intercept('POST', 'http://localhost:3001/api/v1/users/2/job_applications', {
      statusCode: 201,
      body: {
        id: 456,
        position_title: 'Test Position',
        company_id: 1,
        company_name: 'Company A',
        date_applied: '2025-01-01',
        status: 'Offer',
        job_description: 'Test Description',
        application_url: 'www.example.com',
        notes: 'Test Notes',
      }
    }).as('addJobApplication');

      cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
        statusCode: 200,
        body: {
            "data": [
                {
                    "id": "2",
                    "type": "contacts",
                    "attributes": {
                        "first_name": "Jane",
                        "last_name": "Smith",
                        "company_id": 1,
                        "email": "jane.smith@example.com",
                        "phone_number": "123-555-5678",
                        "notes": "HR contact at Future Designs LLC",
                        "user_id": 2,
                        "company": {
                            "id": 1,
                            "name": "Future Designs LLC",
                            "website": "https://futuredesigns.com",
                            "street_address": "456 Future Blvd",
                            "city": "Austin",
                            "state": "TX",
                            "zip_code": "73301",
                            "notes": "Submitted application for the UI Designer role."
                        }
                    }
                }
            ]
        },
        headers: {
          Authorization: "Bearer The token",
          "Content-Type": "application/json",
        },
      }).as("get-contact-details-no-comp");

    cy.visit("http://localhost:3000/");
    cy.get('#email').type('dollyP@email.com');
    cy.get('#password').type('Jolene123');
    cy.get('.login-btn').click();
    cy.wait('@postUserInfo');
    cy.get('a[href="/job_applications"]').first().click();
    cy.wait('@getJobApplications')
    cy.get('a > .bg-cyan-600').click();
  })

  describe("Happy Paths", () => {
    it('accesses the add new application page and its contents', () => {
      cy.url().should("include", "/jobapplications/new")
      cy.get('h1').should('have.text', 'Add New Application');
      cy.get('label').contains('Position Title:').should('exist');
      cy.get('label').contains('Company:').should('exist');
      cy.get('label').contains('Date Applied:').should('exist');
      cy.get('label').contains('Application Status:').should('exist');
      cy.get('label').contains('Job Description:').should('exist');
      cy.get('label').contains('Contact Information:').should('exist');
      cy.get('label').contains('Application URL:').should('exist');
      cy.get('label').contains('Notes:').should('exist');
      cy.get('.text-red-500').first().should('have.text', ' *')
      cy.get('.text-red-500').last().should('have.text', ' *')
    })

    it('has placeholder values in inputs', () => {
      cy.get('#positionTitle').should('have.attr', 'placeholder')
      cy.get('#positionTitle').invoke('attr', 'placeholder')
        .should('eq', 'Position Title (required)')
      cy.get('#jobDescription').should('have.attr', 'placeholder')
      cy.get('#jobDescription').invoke('attr', 'placeholder')
        .should('eq', 'Job Description (required)')
      cy.get('#appURL').should('have.attr', 'placeholder')
      cy.get('#appURL').invoke('attr', 'placeholder')
        .should('eq', 'http://www.example.com')
      // Should be implemented with TipTap testing
      // cy.get('#notes').should('have.attr', 'placeholder')
      // cy.get('#notes').invoke('attr', 'placeholder')
      //   .should('eq', 'Notes...')
    })
  
    it('allows input into form fields', () => {
      cy.get('#positionTitle').type('Test Position').should('have.value', 'Test Position');
      cy.get('#company').select('Company A').should('have.value', '1');
      cy.get('#dateApplied').type('2025-01-01').should('have.value', '2025-01-01');
      cy.get('#appStatus').select('Offer').should('have.value', '3');
      cy.get('#jobDescription').type('Test Description').should('have.value', 'Test Description');
      cy.get('#appContact').select('Jane Smith').should('have.value', '2');
      cy.get('#appURL').type('www.example.com').should('have.value', 'www.example.com');
			cy.get("[data-cy=tiptap-notes-container]")
        .find('.ProseMirror')
        .eq(0)
        .should('exist')
        .click()
        .focus()
        .type("Test notes")
        .should("contains.text", "Test notes");
    })

    it('successfully submits a new job application', () => {

      let exampleURL = 'https://www.google.com/search?q=cypress+test&sca_esv=cf26ac7335e7e159&authuser=0&sxsrf=ADLYWILdV1NUNvEKwobgdpQOx8-tQlRK9A%3A1736359537693&source=hp&ei=cb5-Z4DuJrTAkPIP8eLg2Q0&iflsig=AL9hbdgAAAAAZ37MgTznyKwySqjXpzMI1EENsrF6l5-1&oq=cypress&gs_lp=Egdnd3Mtd2l6IgdjeXByZXNzKgIIAzIEECMYJzIEECMYJzIEECMYJzIKEAAYgAQYQxiKBTIOEAAYgAQYkQIYsQMYigUyCxAAGIAEGJECGIoFMhEQLhiABBixAxiDARjHARivATILEAAYgAQYkQIYigUyCxAAGIAEGJECGIoFMg0QLhiABBixAxgUGIcCSIgvUPoOWIMYcAF4AJABAJgBrAGgAZMHqgEDMC43uAEByAEA-AEBmAIIoAKoB6gCCsICBxAjGCcY6gLCAgoQIxiABBgnGIoFwgIKEC4YgAQYQxiKBcICCBAAGIAEGLEDwgILEAAYgAQYsQMYgwHCAhAQLhiABBgUGIcCGMcBGK8BwgIIEC4YgAQYsQOYAwbxBc2Ws1JZ-CXTkgcDMS43oAfZZQ&sclient=gws-wiz'
    
      cy.get('#positionTitle').type('Test Position');
      cy.get('#company').select('Company A');
      cy.get('#dateApplied').type('2025-01-01');
      cy.get('#appStatus').select('Offer');
      cy.get('#jobDescription').type('Test Description');
      cy.get('#appURL').type(exampleURL);
      cy.get("[data-cy=tiptap-notes-container]")
        .find('.ProseMirror')
        .eq(0)
        .should('exist')
        .click()
        .focus()
        .type("Test notes");

      cy.intercept("GET", "http://localhost:3001/api/v1/users/2/job_applications", {
        statusCode: 200,
        body: {
          data: [
            {
              id: "1",
              type: "job_application",
              attributes: {
                position_title: "Jr. CTO",
                date_applied: "2024-10-31",
                status: 1,
                notes: "Fingers crossed!",
                job_description: "Looking for Turing grad/jr dev to be CTO",
                application_url: "www.example.com",
                company_id: 1
              }
            },
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
                company_id: 3
              }
            },
            {
              id: "456",
              type: "job_application",
              attributes: {
                position_title: "Test Position",
                date_applied: "2025-01-01",
                status: 3,
                notes: "Test Notes",
                job_description: "Test Description",
                application_url: "https://www.google.com/search?q=cypress+test&sca_esv=cf26ac7335e7e159&authuser=0&sxsrf=ADLYWILdV1NUNvEKwobgdpQOx8-tQlRK9A%3A1736359537693&source=hp&ei=cb5-Z4DuJrTAkPIP8eLg2Q0&iflsig=AL9hbdgAAAAAZ37MgTznyKwySqjXpzMI1EENsrF6l5-1&oq=cypress&gs_lp=Egdnd3Mtd2l6IgdjeXByZXNzKgIIAzIEECMYJzIEECMYJzIEECMYJzIKEAAYgAQYQxiKBTIOEAAYgAQYkQIYsQMYigUyCxAAGIAEGJECGIoFMhEQLhiABBixAxiDARjHARivATILEAAYgAQYkQIYigUyCxAAGIAEGJECGIoFMg0QLhiABBixAxgUGIcCSIgvUPoOWIMYcAF4AJABAJgBrAGgAZMHqgEDMC43uAEByAEA-AEBmAIIoAKoB6gCCsICBxAjGCcY6gLCAgoQIxiABBgnGIoFwgIKEC4YgAQYQxiKBcICCBAAGIAEGLEDwgILEAAYgAQYsQMYgwHCAhAQLhiABBgUGIcCGMcBGK8BwgIIEC4YgAQYsQOYAwbxBc2Ws1JZ-CXTkgcDMS43oAfZZQ&sclient=gws-wiz",
                company_id: 1
              }
            }
          ]
        }
      }).as("getNewJobApplications");

      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/job_applications');
      cy.get(':nth-child(3) > :nth-child(2) > a').should('contain', 'Test Position');
      cy.get(':nth-child(3) > :nth-child(3) > a > .py-2').should('contain', 'Offer');
    });
  })

  describe('Sad Path', () => {
    it('Should require position title, company, date, status, and job description', () => {
      cy.get('button[type="submit"]').click();
      cy.get("#positionTitle:invalid").should("exist");
      cy.get("#company:invalid").should("exist"); 
      cy.get("#dateApplied:invalid").should("exist");
      cy.get("#appStatus:invalid").should("exist");
      cy.get("#jobDescription:invalid").should("exist");
    })

    it('Should handle server errors gracefully when the server is down', () => {
      let exampleURL = 'https://www.google.com/search?q=cypress+test&sca_esv=cf26ac7335e7e159&authuser=0&sxsrf=ADLYWILdV1NUNvEKwobgdpQOx8-tQlRK9A%3A1736359537693&source=hp&ei=cb5-Z4DuJrTAkPIP8eLg2Q0&iflsig=AL9hbdgAAAAAZ37MgTznyKwySqjXpzMI1EENsrF6l5-1&oq=cypress&gs_lp=Egdnd3Mtd2l6IgdjeXByZXNzKgIIAzIEECMYJzIEECMYJzIEECMYJzIKEAAYgAQYQxiKBTIOEAAYgAQYkQIYsQMYigUyCxAAGIAEGJECGIoFMhEQLhiABBixAxiDARjHARivATILEAAYgAQYkQIYigUyCxAAGIAEGJECGIoFMg0QLhiABBixAxgUGIcCSIgvUPoOWIMYcAF4AJABAJgBrAGgAZMHqgEDMC43uAEByAEA-AEBmAIIoAKoB6gCCsICBxAjGCcY6gLCAgoQIxiABBgnGIoFwgIKEC4YgAQYQxiKBcICCBAAGIAEGLEDwgILEAAYgAQYsQMYgwHCAhAQLhiABBgUGIcCGMcBGK8BwgIIEC4YgAQYsQOYAwbxBc2Ws1JZ-CXTkgcDMS43oAfZZQ&sclient=gws-wiz'
      
      cy.intercept('POST', 'http://localhost:3001/api/v1/users/2/job_applications', {
        statusCode: 500, 
        body: {
          error: "Internal Server Error",
        },
      }).as('addJobApplicationFailure');
      
      cy.get('#positionTitle').type('Test Position');
      cy.get('#company').select('Company A');
      cy.get('#dateApplied').type('2025-01-01');
      cy.get('#appStatus').select('Offer');
      cy.get('#jobDescription').type('Test Description');
      cy.get('#appURL').type(exampleURL);
      cy.get("[data-cy=tiptap-notes-container]")
        .find('.ProseMirror')
        .eq(0)
        .should('exist')
        .click()
        .focus()
        .type("Test notes")
        .should("contains.text", "Test notes");
    
      cy.get('button[type="submit"]').click();
    
      cy.wait('@addJobApplicationFailure').then((interception) => {
        expect(interception.response.statusCode).to.equal(500);
      }); 
    
      cy.url().should('include', '/jobapplications/new');
    });
  })
})