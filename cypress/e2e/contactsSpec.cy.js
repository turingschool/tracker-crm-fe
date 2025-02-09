import { mockContactsData } from "../fixtures/mockContactsData";

describe("Contacts page", () => {
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

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");
  });

  it("Should have a header with the text 'Contacts'", () => {
    cy.get("h1").should("have.text", "Contacts");
  });

  it("Should have a search bar", () => {
    cy.get("input[type='search']").should(
      "have.attr",
      "placeholder",
      "Search Contacts..."
    );
  });

  it("Should have a button with the text 'Add Contact +'", () => {
    cy.get("a > .bg-cyan-600").click();
    cy.url().should("include", "/contacts/new");
  });

  it("Should display the correct table headers", () => {
    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Name");
    cy.get("table").find("th").eq(1).should("have.text", "Company");
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });

  it("Should display the correct number of companies", () => {
    cy.wait("@get-contacts");
    cy.get("table").find("tr").should("have.length", 5);
  });

  it("Should display the correct company information", () => {
    cy.wait("@get-contacts");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(0)
      .should("have.text", "John Smith");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(1)
      .should("have.text", "Future Designs LLC");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(2)
      .should("have.text", "Type notes here...");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(0)
      .should("have.text", "Jane Smith");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(1)
      .should("have.text", "Future Designs LLC");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(2)
      .should("have.text", "Type notes here...");
    cy.get("table tbody tr")
      .eq(2)
      .find("td")
      .eq(0)
      .should("have.text", "Alice Green");
    cy.get("table tbody tr")
      .eq(2)
      .find("td")
      .eq(1)
      .should("have.text", "Company A");
    cy.get("table tbody tr")
      .eq(2)
      .find("td")
      .eq(2)
      .should("have.text", "Note about Alice");
  });

  it("Should search for contacts by first name", () => {
    cy.get("#contacts-search").type("jan");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(0)
      .should("have.text", "Jane Smith");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(1)
      .should("have.text", "Future Designs LLC");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(2)
      .should("have.text", "Type notes here...");
  });

  it("Should search for contacts by last name", () => {
    cy.get("#contacts-search").type("gre");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(0)
      .should("have.text", "Alice Green");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(1)
      .should("have.text", "Company A");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(2)
      .should("have.text", "Note about Alice");
  });

  it("Should search for contacts by company name", () => {
    cy.get("#contacts-search").type("fut");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(0)
      .should("have.text", "John Smith");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(1)
      .should("have.text", "Future Designs LLC");
    cy.get("table tbody tr")
      .eq(0)
      .find("td")
      .eq(2)
      .should("have.text", "Type notes here...");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(0)
      .should("have.text", "Jane Smith");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(1)
      .should("have.text", "Future Designs LLC");
    cy.get("table tbody tr")
      .eq(1)
      .find("td")
      .eq(2)
      .should("have.text", "Type notes here...");
  });

  it("Should take you to a contact's page when clicking on a contact's name", () => {
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
    cy.wait("@get-contacts");
    cy.get("table tbody tr").first().find("a").click();
    cy.url().should("include", "/contacts/1");
  });
});

describe("Contacts Page - No contacts", () => {
  it("Should display 'No contacts found' when no contacts exist", () => {
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
      body: { data: [] },
      headers: {
        "Content-Type": "application/json",
      },
    }).as("get-empty-contacts");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table").find("th").should("have.length", 3);
    cy.get("table tbody tr").should("not.exist");
    cy.get('[data-cy="no-contacts-message"]').should(
      "have.text",
      'No contacts saved. Click "Add New +" to start saving contacts.'
    );
  });
});

describe("Sad Paths - Contacts Page", () => {
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
      statusCode: 500,
    }).as("sad-contacts");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");
  });

  it("Should have a header, search bar, add new button, and table header", () => {
    cy.get("h1").should("have.text", "Contacts");

    cy.get("input[type='search']").should(
      "have.attr",
      "placeholder",
      "Search Contacts..."
    );

    cy.get("table").find("th").should("have.length", 3);
    cy.get("table").find("th").eq(0).should("have.text", "Name");
    cy.get("table").find("th").eq(1).should("have.text", "Company");
    cy.get("table").find("th").eq(2).should("have.text", "Notes");
  });

  it("Should render an error message when a fetch request fails", () => {
    cy.get('[data-cy="failed-fetch-message"]');
  });
});
