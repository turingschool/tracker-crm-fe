import { mockCompanies } from "../fixtures/mockCompanies.js";

describe("Company Show Page", () => {
  const userId = 2;
  
  beforeEach(() => {
    // Intercept the login POST request
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          data: {
            id: userId,
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

    // Mock the company data
    const mockCompany = {
      company: {
        data: {
          attributes: {
            name: "Google",
            website: "https://google.com",
            street_address: "1600 Amphitheatre Parkway",
            city: "Mountain View",
            state: "CA",
            zip_code: "94043",
            notes: "Innovative tech company.",
          },
        },
      },
      contacts: {
        data: [
          {
            id: "101", // Change to string to match interface
            type: "contact", // Add type field
            attributes: {
              first_name: "John",
              last_name: "Doe",
              email: "johndoe@example.com",
              phone_number: "555-1234", // Changed from phone to phone_number
              notes: "",
              user_id: userId
            },
          },
          {
            id: "102",
            type: "contact",
            attributes: {
              first_name: "Jane",
              last_name: "Smith",
              email: "janesmith@example.com",
              phone_number: "555-5678",
              notes: "",
              user_id: userId
            },
          },
        ],
      },
    };

    // Intercept the GET request to fetch companies list
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies`, {
      statusCode: 200,
      body: mockCompanies,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer fake-token",
      },
    }).as("getCompanies");

    // Intercept the GET request to fetch job applications
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/job_applications`,{
      statusCode: 200,
      body: {
        data: [],
      },
    })

    // Intercept the GET request to fetch company details with Authorization header
    cy.intercept("GET", `http://localhost:3001/api/v1/users/${userId}/companies/1/contacts`, {
      statusCode: 200,
      body: mockCompany,
    }).as("getCompany");

    // Visit the login page and perform login
    cy.visit("/");
    cy.get("#email").type("danny_de@email.com");
    cy.get("#password").type("jerseyMikesRox7");
    cy.get('[data-testid="login-button"]').click();
    cy.wait("@mockSession");
    cy.get('a[href="/companies"]').click();
    cy.wait("@getCompanies");
    cy.get("table tbody tr").first().click();
    cy.wait("@getCompany");
  });

  it("Should display the correct company details", () => {
    cy.get("h1").should("have.text", "Company Details");

    cy.get("h2").contains("Company Name:")
      .next().should("have.text", "Google");
    
    cy.get("h2").contains("Website:")
      .next().should("have.text", "https://google.com");
    
    cy.get("h2").contains("Address:")
      .next().should(
        "have.text",
        "1600 Amphitheatre Parkway Mountain View, CA 94043"
      );
    
    cy.get("h2").contains("Notes:")
      .next().should("have.text", "Innovative tech company.");
  });

  it("Should open the company website in a new tab", () => {
    cy.get('a[href="https://google.com"]')
      .should("have.attr", "target", "_blank")
      .and("have.attr", "rel", "noopener noreferrer")
      .then((link) => {
        const url = link.prop("href").replace(/\/$/, ""); // Remove trailing slash
        expect(url).to.equal("https://google.com");
      });
  });

  it("Should display the dynamic contacts correctly", () => {
    cy.contains("Contacts").should("exist");

    const contacts = [
      { name: "John Doe", link: "/contacts/101" },
      { name: "Jane Smith", link: "/contacts/102" },
    ];

    contacts.forEach((contact) => {
      cy.contains(contact.name).should("have.attr", "href", contact.link);
    });
  });

  it("Should navigate to the correct contact detail page when a contact is clicked", () => {
    cy.contains("John Doe").click();
    cy.url().should("include", "/contacts/101");

    cy.go("back");

    cy.contains("Jane Smith").click();
    cy.url().should("include", "/contacts/102");
  });

  it("Should navigate back to the companies page when clicking 'Back to Companies'", () => {
    cy.contains("Back to Companies").click();
    cy.url().should("include", "/companies");
  });
});

