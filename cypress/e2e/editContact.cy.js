describe("Edit Contact Functionality", () => {
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
      body: {
        data: [
          {
            id: "1",
            attributes: {
              first_name: "John",
              last_name: "Smith",
              email: "john@example.com",
              phone_number: "123-555-6789",
              notes: "Old Notes",
            },
          },
        ],
      },
      headers: { "Content-Type": "application/json" },
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
            email: "john@example.com",
            phone_number: "123-555-6789",
            notes: "Old Notes",
          },
        },
      },
      headers: {
        Authorization: "Bearer The token",
        "Content-Type": "application/json",
      },
    }).as("get-contact-details");

    cy.intercept(
      "PATCH",
      "http://localhost:3001/api/v1/users/2/contacts/1",
      (req) => {
        const { first_name, last_name, email, phone_number, notes } =
          req.body.contact;
        req.reply({
          statusCode: 200,
          body: {
            data: {
              id: "1",
              type: "contacts",
              attributes: {
                first_name,
                last_name,
                email,
                phone_number,
                notes,
              },
            },
          },
        });
      }
    ).as("update-contact");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");

    cy.get('[data-testid="contacts-iconD"]').click();
    cy.url().should("include", "/contacts");

    cy.get("table tbody tr").first().click();
    cy.url().should("include", "/contacts/1");
  });

  it("Should open the edit modal when clicking the Edit button", () => {
    cy.get("button").contains("Edit").click();
    cy.get(".bg-white").should("be.visible");
    cy.get("input[name='firstName']").should("have.value", "John");
    cy.get("input[name='lastName']").should("have.value", "Smith");
    cy.get("input[name='email']").should("have.value", "john@example.com");
    cy.get("input[name='phoneNumber']").should("have.value", "123-555-6789");
    cy.get("textarea[name='notes']").should("have.value", "Old Notes");
  });

  it("Should allow the user to edit the contact and save changes", () => {
    cy.get("button").contains("Edit").click();
    cy.get("input[name='firstName']").clear().type("Johnny");
    cy.get("input[name='lastName']").clear().type("Doe");
    cy.get("input[name='email']").clear().type("johnny.doe@example.com");
    cy.get("input[name='phoneNumber']").clear().type("999-999-9999");
    cy.get("textarea[name='notes']").clear().type("Updated Notes");

    cy.get("button").contains("Save").click();
    cy.wait("@update-contact");

    cy.get('[data-testid="contact-name"]').should("have.text", "Johnny Doe");
    cy.get('[data-testid="email-address"]').should(
      "have.text",
      "johnny.doe@example.com"
    );
    cy.get('[data-testid="phone-num"]').should("have.text", "999-999-9999");
    cy.get('[data-testid="note-text"]').should("have.text", "Updated Notes");
  });

  it("Should close the modal when clicking the X button", () => {
    cy.get("button").contains("Edit").click();
    cy.get(".absolute.top-2.right-2").click();
    cy.get(".bg-white").should("not.exist");
  });

  it("Should show an error message if the update request fails", () => {
    cy.intercept("PATCH", "http://localhost:3001/api/v1/users/2/contacts/1", {
      statusCode: 500,
      body: { message: "Internal server error" },
    }).as("update-contact-error");

    cy.get("button").contains("Edit").click();
    cy.get("input[name='firstName']").clear().type("Johnny");
    cy.get("button").contains("Save").click();
    cy.wait("@update-contact-error");
    cy.get("[data-testid='error-message']")
      .should("be.visible")
      .and("have.text", "Failed to update contact.");
  });

  it("Should show an error if phone number is not a valid format", () => {
    cy.get("button").contains("Edit").click();
    cy.get("input[name='phoneNumber']").clear().type("12345");
    cy.get('button[type="submit"]').click();

    cy.contains("Phone number must be in the format '555-555-5555'").should(
      "exist"
    );
  });
});
