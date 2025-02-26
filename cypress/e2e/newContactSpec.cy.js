import { mockContactsData } from "../fixtures/mockContactsData";

describe("New Contacts page after logging in", () => {
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

    cy.intercept("GET", `http://localhost:3001/api/v1/users/2/contacts`, {
      statusCode: 200,
      body: mockContactsData,
      headers: {
        "Content-Type": "application/json",
      },
    }).as("getContacts");

    cy.intercept("POST", "http://localhost:3001/api/v1/users/2/contacts", {
      statusCode: 201,
      body: {
        id: 123,
        first_name: "John",
        last_name: "Smith",
        email: "john.Smith@example.com",
        phone_number: "555-555-5555",
        current_company: "Company A",
        notes: "Test notes",
      },
    }).as("addContact");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: {
        data: [
          { id: 1, attributes: { name: "Company A" } },
          { id: 2, attributes: { name: "Company B" } },
        ],
      },
    }).as("getCompanies");

    cy.intercept("POST", `http://localhost:3001/api/v1/users/2/companies`, {
      statusCode: 201,
      body: {
        data: {
          id: 3,
          type: "company",
          attributes: {
            name: "Company 123",
            website: "www.testcompany.com",
            street_address: "123 Test St",
            city: "Test City",
            state: "CO",
            zip_code: "80237",
            notes: "Test notes",
          },
        },
      },
    }).as("addCompany");

    cy.visit("http://localhost:3000/contacts");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");
  });

  describe("Happy Path", () => {
    it("Should navigate to the new contact form and display fields", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.url().should("include", "/contacts/new");

      cy.get("h1").should("have.text", "Add New Contact");
      cy.get("label").contains("First Name").should("exist");
      cy.get("label").contains("Last Name").should("exist");
      cy.get("label").contains("Email").should("exist");
      cy.get("label").contains("Phone Number").should("exist");
      cy.get("label").contains("Company").should("exist");
      cy.get("label").contains("Notes").should("exist");
    });

    it("Should allow input in all form fields", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.wait("@getCompanies");

      cy.get("#firstName").type("John").should("have.value", "John");
      cy.get("#lastName").type("Smith").should("have.value", "Smith");
      cy.get("#email")
        .type("john.Smith@example.com")
        .should("have.value", "john.Smith@example.com");
      cy.get("#phoneNumber")
        .type("555-555-5555")
        .should("have.value", "555-555-5555");
      cy.get("#notes").type("Test notes").should("have.value", "Test notes");

      cy.get("#companyId").select("Company A").should("have.value", "1");
    });

    it("Should allow submission with only required fields", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.get("#firstName").type("Jane");
      cy.get("#lastName").type("Smith");
      cy.get('button[type="submit"]').click();

      cy.wait("@addContact").then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });

      cy.url().should("include", "/contacts");
      cy.contains("Jane Smith").should("exist");
    });

    it("Should fetch and display a list of companies in the company dropdown", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.wait("@getCompanies");

      cy.get("#companyId").select("Company A").should("have.value", "1");
      cy.get("#companyId").select("Company B").should("have.value", "2");
    });

    it("Should allow a user to select a company and submit the form with that company", () => {
      cy.intercept(
        "POST",
        "http://localhost:3001/api/v1/users/2/companies/1/contacts",
        {
          statusCode: 201,
          body: {
            id: 125,
            first_name: "Alice",
            last_name: "Green",
            email: "alice.green@example.com",
            phone_number: "555-555-5555",
            current_company: "Company A",
            notes: "Note about Alice",
          },
        }
      ).as("addContactWithCompany");

      cy.get("a > .bg-cyan-600").click();
      cy.wait("@getCompanies");

      cy.get("#firstName").type("Alice");
      cy.get("#lastName").type("Green");
      cy.get("#companyId").select("Company A");

      cy.get('button[type="submit"]').click();

      cy.wait("@addContactWithCompany").then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });

      cy.url().should("include", "/contacts");
      cy.contains("Alice Green").should("exist");
      cy.contains("Company A").should("exist");
    });

    it("Should be able to view modal and exit out by clicking outside of modal", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("button", "Add new company").click();
      cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("be.visible");
      cy.get(".fixed.inset-0.bg-black.bg-opacity-50").click("topLeft");
      cy.get(".fixed.inset-0.bg-black.bg-opacity-50").should("not.exist");
    });

    it("Should be able to add new company and create new contact", () => {
      cy.intercept(
        "POST",
        "http://localhost:3001/api/v1/users/2/companies/3/contacts",
        {
          statusCode: 201,
          body: {
            id: 125,
            first_name: "Emma",
            last_name: "Boots",
            email: "emmaboots@example.com",
            phone_number: "777-777-7777",
            current_company: "Company C",
            notes: "Note about Emma",
          },
        }
      ).as("addContactWithUpdatedCompany");

      cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
        statusCode: 200,
        body: {
          data: [
            { id: 1, attributes: { name: "Company A" } },
            { id: 2, attributes: { name: "Company B" } },
            { id: 3, attributes: { name: "Company C" } },
          ],
        },
      }).as("getUpdatedCompanies");

      cy.get("a > .bg-cyan-600").click();
      cy.get("#firstName").type("Emma");
      cy.get("#lastName").type("Boots");

      cy.contains("button", "Add new company").click();
      cy.get("label").contains("Company Name:").should("exist");
      cy.get("label").contains("Website:").should("exist");
      cy.get("label").contains("Street Address:").should("exist");
      cy.get("label").contains("City:").should("exist");
      cy.get("label").contains("State:").should("exist");
      cy.get("label").contains("Zip Code:").should("exist");
      cy.get("label").contains("Notes:").should("exist");

      cy.get("#companyName").type("Company Placeholder");
      cy.get(".max-w-4xl")
        .find("button[type='submit']")
        .scrollIntoView()
        .should("be.visible")
        .click();
      cy.wait("@addCompany");

      cy.get(".bg-black.bg-opacity-50").should("not.exist");

      cy.wait("@getUpdatedCompanies");
      cy.get("#companyId").should("exist").and("be.visible");
      cy.get("#companyId")
        .should("have.value", "3")
        .find("option:selected")
        .should("have.text", "Company C");

      cy.get('button[type="submit"]').click();

      cy.wait("@addContactWithUpdatedCompany").then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });

      cy.url().should("include", "/contacts");
      cy.contains("Emma Boots").should("exist");
      cy.contains("Company C").should("exist");
    });
  });

  describe("Sad Path and Edge Cases", () => {
    it("Should require First Name and Last Name", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.get('button[type="submit"]').click();
      cy.get("#firstName:invalid").should("exist");
      cy.get("#lastName:invalid").should("exist");
    });

    it("Should validate the email address format", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");
      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Smith");
      cy.get("#email").type("invalid-email");
      cy.get('button[type="submit"]').click();

      cy.get("#email:invalid").should("exist");
    });

    it("Should not allow duplicate contacts", () => {
      cy.intercept("POST", "http://localhost:3001/api/v1/users/2/contacts", {
        statusCode: 422,
        body: {
          message: "Contact already exists",
        },
      }).as("addDuplicateContact");

      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Smith");
      cy.get("#email").type("john.Smith@example.com");
      cy.get("#phoneNumber").type("555-555-5555");

      cy.get('button[type="submit"]').click();

      cy.wait("@addDuplicateContact");
      cy.contains("Contact already exists").should("exist");
    });

    it("Should display an error message if the server fails to create a contact", () => {
      cy.intercept("POST", "http://localhost:3001/api/v1/users/2/contacts", {
        statusCode: 500,
        body: {
          message: "Server error, please try again",
        },
      }).as("addContactError");

      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Smith");
      cy.get('button[type="submit"]').click();

      cy.wait("@addContactError");
      cy.contains("Server error, please try again").should("exist");
    });

    it("Should validate the phone number format", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.contains("Add New Contact");

      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Smith");

      cy.get("#phoneNumber").type("12345");
      cy.get('button[type="submit"]').click();

      cy.contains("Phone number must be in the format '555-555-5555'").should(
        "exist"
      );

      cy.get("#phoneNumber").clear().type("555-555-5555");

      cy.intercept("POST", "http://localhost:3001/api/v1/users/2/contacts", {
        statusCode: 201,
        body: {
          id: 124,
          first_name: "John",
          last_name: "Smith",
          email: "john.Smith@example.com",
          phone_number: "555-555-5555",
          current_company: null,
          notes: "Test notes",
        },
      }).as("addContact");

      cy.get('button[type="submit"]').click();
      cy.wait("@addContact");

      cy.contains("Phone number must be in the format '555-555-5555'").should(
        "not.exist"
      );
    });

    it("Should not be able to create a new company with the same name", () => {
      cy.intercept("POST", "http://localhost:3001/api/v1/users/2/companies", {
        statusCode: 422,
        body: {
          error: "A company with this name already exists.",
        },
      }).as("duplicateCompany");

      cy.get("a > .bg-cyan-600").click();
      cy.contains("button", "Add new company").click();

      cy.get("#companyName").type("Company A");
      cy.get(".max-w-4xl")
        .find("button[type='submit']")
        .scrollIntoView()
        .click();
      cy.get(".text-red-500").should(
        "contain.text",
        "A company with this name already exists."
      );
      cy.contains("button", "X").scrollIntoView().click();
    });

    it("Should keep the add company modal open when clicked", () => {
      cy.get("a > .bg-cyan-600").click();
      cy.get("#firstName").type("Emma");
      cy.get("#lastName").type("Boots");
      cy.contains("Add New Contact");
      cy.contains("button", "Add new company").click();
      cy.wait(5000)

      cy.get("label").contains("Company Name:").should("exist");
      cy.get("label").contains("Website:").should("exist");
      cy.get("label").contains("Street Address:").should("exist");
      cy.get("label").contains("City:").should("exist");
      cy.get("label").contains("State:").should("exist");
      cy.get("label").contains("Zip Code:").should("exist");
      cy.get("label").contains("Notes:").should("exist");
    })
  });
});
