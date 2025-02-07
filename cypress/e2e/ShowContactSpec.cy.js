import { mockContactsData } from "../fixtures/mockContactsData";
import { mockDashboard } from "../fixtures/mockDashBoard.json"

describe("Show a single contact page", () => {
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
              companies: [],
            },
          },
        },
      },
    }).as("postUserInfo");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("get-contacts");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 200,
      body: {
        data: {
          id: "1",
          type: "contacts",
          attributes: {
            first_name: "John",
            last_name: "Smith",
            company_id: 1,
            email: "123@example.com",
            phone_number: "123-555-6789",
            notes: "Detailed notes for John Smith",
            user_id: 2,
            company: {
              id: 1,
              name: "Future Designs LLC",
              website: "https://futuredesigns.com",
              street_address: "456 Future Blvd",
              city: "Austin",
              state: "TX",
              zip_code: "73301",
              notes: "Great partner for UI projects.",
            },
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/2/companies/1/contacts",
      {
        statusCode: 200,
        body: {
          contacts: {
            data: [
              {
                id: "1",
                type: "contact",
                attributes: {
                  first_name: "John",
                  last_name: "Smith",
                  email: "123@example.com",
                  phone_number: "123-555-6789",
                  notes: "Works with Future Designs LLC",
                },
              },
            ],
          },
        },
        headers: {
          Authorization: "Bearer The token",
          "Content-Type": "application/json",
        },
      }
    ).as("get-company-contacts");

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/2/dashboard',
      { statusCode: 200, fixture: 'mockDashBoard' }
    );

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().find("a").click();
    cy.url().should("include", "/contacts/1");
  });

  it("Should have a header of the contact's name", () => {
    cy.wait("@get-contact-details");
    cy.get('[data-testid="contact-name"]').should("have.text", "John Smith");
  });

  it("Should display the company's name", () => {
    cy.wait("@get-contact-details");
    cy.get('[data-testid="company-name"]').should("have.text", "Future Designs LLC");
  });

  it("Should display the contact's email and phone number", () => {
    cy.wait("@get-contact-details");
    cy.get('[data-testid="contact-email"]').should("have.text", "Email: ");
    cy.get('[data-testid="email-address"]').should("have.text", "123@example.com");
    cy.get('[data-testid="email-address"]').should("have.text", "123@example.com");
    cy.get('[data-testid="contact-phone"]').should("have.text", "Phone: ");
    cy.get('[data-testid="phone-num"]').should("have.text", "123-555-6789");
  });

  it("Should display a users notes", () => {
    cy.wait("@get-contact-details");
    cy.get('[data-testid="notes"]').should("have.text", "Notes: ");
    cy.get('[data-testid="note-text"]').should("have.text", 'Detailed notes for John Smith');
  });

  it("Should display other contacts that are at the same company", () => {
    cy.wait("@get-contact-details");
    cy.get('[data-testid="other-contacts"]').should("have.text", 'Other contacts at Future Designs LLC');
  });

  it("Should display no companies and associated contacts correctly if contact has no company", () => {
    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 200,
      body: {
        data: {
          id: "1",
          type: "contacts",
          attributes: {
            first_name: "John",
            last_name: "Smith",
            company_id: null,
            email: "123@example.com",
            phone_number: "123-555-6789",
            notes: "Detailed notes for John Smith",
            user_id: 2,
            company: null,
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details-no-comp");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.get("table tbody tr").first().find("a").click();

    cy.wait("@get-contact-details-no-comp");
    cy.get('[data-testid="other-contacts"]').should("have.text", 'No Contacts');
    cy.get('[data-testid="company-name"]').should("have.text", "No Affiliated Companies");

  })
});

describe("Show a single contact page (Sad Path)", () => {
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
              companies: [],
            },
          },
        },
      },
    }).as("postUserInfo");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 500,
      body: { message: "Internal server error" },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details-error");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("get-contacts");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().find("a").click();
    cy.url().should("include", "/contacts/1");
  });

  it("Should display an error message when the contact data fails to load", () => {
    cy.wait("@get-contact-details-error");
    cy.get(".error").should("be.visible");
    cy.get(".error").should(
      "have.text",
      "Failed to fetch contact: Internal Server Error. Please try again later."
    );
  });
});

describe ("Additional contacts link navigates to contact", () => {
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
              companies: [],
            },
          },
        },
      },
    }).as("postUserInfo");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("get-contacts");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 200,
      body: {
        data: {
          id: "1",
          type: "contacts",
          attributes: {
            first_name: "John",
            last_name: "Smith",
            company_id: 1,
            email: "123@example.com",
            phone_number: "123-555-6789",
            notes: "Detailed notes for John Smith",
            user_id: 2,
            company: {
              id: 1,
              name: "Future Designs LLC",
              website: "https://futuredesigns.com",
              street_address: "456 Future Blvd",
              city: "Austin",
              state: "TX",
              zip_code: "73301",
              notes: "Great partner for UI projects.",
            },
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/2/companies/1/contacts",
      {
        statusCode: 200,
        body: {
          contacts: {
            data: [
              {
                id: "1",
                type: "contact",
                attributes: {
                  first_name: "John",
                  last_name: "Smith",
                  email: "123@example.com",
                  phone_number: "123-555-6789",
                  notes: "Works with Future Designs LLC",
                },
              },
              {
                id: "4",
                type: "contact",
                attributes: {
                  first_name: "Bill",
                  last_name: "Nye",
                  email: "scienceguy@example.com",
                  phone_number: "234-555-6789",
                  notes: "Works at Future Designs LLC",
                },
              },
            ],
          },
        },
        headers: {
          Authorization: "Bearer The token",
          "Content-Type": "application/json",
        },
      }
    ).as("get-company-contacts");

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/2/dashboard',
      { statusCode: 200, fixture: 'mockDashBoard' }
    );

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts/4", {
      statusCode: 200,
      body: {
        data: {
          id: "1",
          type: "contacts",
          attributes: {
            first_name: "Bill",
            last_name: "Nye",
            company_id: 1,
            email: "scienceguy@example.com",
            phone_number: "234-555-6789",
            notes: "Detailed notes for Bill Nye",
            user_id: 2,
            company: {
              id: 1,
              name: "Future Designs LLC",
              website: "https://futuredesigns.com",
              street_address: "456 Future Blvd",
              city: "Austin",
              state: "TX",
              zip_code: "73301",
              notes: "Great partner for UI projects.",
            },
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().find("a").click();
    cy.url().should("include", "/contacts/1");
  });
  
  it ("should navigate to the contact page after clicking a contact in the additional contacts list", () => {
    cy.get('[data-testid="other-contacts"]').closest('section').find('li').first().find('a').click();
    cy.url().should("include", "/contacts/4");
    cy.wait("@get-contact-details");
    cy.get('[data-testid="contact-name"]').should("have.text", "Bill Nye");
  });
});