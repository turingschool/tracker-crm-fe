import { mockContactsData } from "../fixtures/mockContactsData";
import { mockCompanies } from "../fixtures/mockCompanies";

describe("Menu Bar after logging in spec", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
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
    }).as("getContacts");

    cy.intercept("GET", "http://localhost:3001/api/v1/users/2/companies", {
      statusCode: 200,
      body: mockCompanies,
    }).as("getCompanies");

    cy.intercept(
      "GET",
      "http://localhost:3001/api/v1/users/2/job_applications",
      {
        statusCode: 200,
        fixture: "mockJobApps",
      }
    ).as("getApplications");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dollyP@email.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");
  });

  it("Desktop Menu Bar(DMB) should have images in the sidebar", () => {
    cy.get('img[alt="Logo"]')
      .should("have.attr", "src")
      .should("include", "turing-logo-gray");

    cy.get('[href="/home"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/contacts"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/companies"] > .MuiSvgIcon-root').should("exist");
    cy.get('[href="/job_applications"] > .MuiSvgIcon-root').should("exist");
  });

  it("DMB should have clickable links for each icon", () => {
    cy.get('[data-testid="logo"]').click();
    cy.url().should("include", "/");

    // Home is active/cyan upon login
    cy.get('[data-testid="home-iconD"]').should('have.class', 'text-cyan-800').click();
    cy.url().should("include", "/home");
    cy.get('[data-testid="home-iconD"]').should('have.class', 'text-cyan-800');

    cy.get('[data-testid="contacts-iconD"]').should('have.class', 'text-gray-500').click();
    cy.url().should("include", "/contacts");
    cy.get('[data-testid="contacts-iconD"]').should('have.class', 'text-cyan-800')

    // Home is now inactive/gray upon selecting Contacts
    cy.get('[data-testid="home-iconD"]').should('have.class', 'text-gray-500');

    cy.get('[data-testid="companies-iconD"]').should('have.class', 'text-gray-500').click();
    cy.url().should("include", "/companies");
    cy.get('[data-testid="companies-iconD"]').should('have.class', 'text-cyan-800')

    cy.get('[data-testid="applications-iconD"]').should('have.class', 'text-gray-500').click();
    cy.url().should("include", "/job_applications");
    cy.get('[data-testid="applications-iconD"]').should('have.class', 'text-cyan-800')
  });

  it("DMB should toggle the desktop plus sign dropdown menu when the plus sign icon is clicked", () => {
    cy.get('[data-testid="plus-iconD"]').click();
    cy.get("ul.bg-cyan-600")
      .should("have.class", "scale-100")
      .and("be.visible");
    cy.get('[data-testid="plus-iconD"]').click();
    cy.get("ul.bg-cyan-600").should("have.class", "hidden");
  });

  it('DBM should close desktop plus sign dropdown after clicking a link', () => {
   cy.get('[data-testid="plus-iconD"]').click();
   cy.get('ul.bg-cyan-600').should('be.visible');

   cy.contains('Add New Contact').click(); 
   cy.url().should('include', '/contacts/new');

   cy.get('ul.bg-cyan-600').should('not.be.visible');
 });

  it("DMB should toggle the desktop User Management dropdown menu when the User Management icon is clicked", () => {
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-gray-500").click();
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-cyan-800");
    cy.get("ul.bg-cyan-600").should("have.class", "scale-100").and("be.visible")
  });

  it('DBM should close desktop User Management dropdown after clicking a link', () => {
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-gray-500").click();
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-cyan-800");

  cy.contains('User Profile').click(); 
  cy.url().should('include', '/userInformation');

  cy.get('ul.bg-cyan-600').should('not.be.visible');
  });

  it('DBM should log the user out when user clicks logout in the User Management Dropdown', () => {
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-gray-500").click();
    cy.get('[data-testid="updateUser-iconD"]').should("have.class", "text-cyan-800");

    cy.contains('Logout').click(); 
    cy.url().should('include', '/');
    cy.reload()
    cy.url().should('include', '/');
  });

 it('should have the desktop dropdown closed by default', () => {
  cy.viewport(1280, 800);
  cy.get('ul.bg-cyan-600').should('not.be.visible'); 
});

it('should have the mobile menu hidden by default', () => {
  cy.viewport('iphone-xr');
  cy.get('nav.fixed').should('have.class', '-translate-x-full');
});

it(" if plus icon is clicked multiple times, still behaves correctly", () => {
  cy.get('[data-testid="plus-iconD"]').click();
  cy.get('ul.bg-cyan-600').should('be.visible');
  cy.get('[data-testid="plus-iconD"]').click().click().click();
  cy.get('ul.bg-cyan-600').should('not.be.visible');
});

  describe("Mobile Slide-out Menu", () => {
    beforeEach(() => {
      cy.viewport("iphone-xr");
      cy.get('[data-testid="menu-iconM"]').should("be.visible").click();
      cy.get('[data-testid="slideout-menu"]').should("exist");
    });

    it("it should open and close the mobile slide-out menu(MSM)", () => {
      cy.get('[data-testid="close-iconM"]').click();
      cy.get('[data-testid="slideout-menu"]').should("not.be.visible");
    });

    it("MSM should have clickable links for home icon", () => {
      cy.get('[data-testid="home-iconM"]').click();
      cy.url().should("include", "/home");
    });

    it("MSM should have clickable links for contact icon", () => {
      cy.get('[data-testid="contacts-iconM"]').click();
      cy.url().should("include", "/contacts");
    });

    it("MSM should have clickable links for companies icon", () => {
      cy.get('[data-testid="companies-iconM"]').click();
      cy.url().should("include", "/companies");
    });

    it("MSM should have clickable links for job applications icon", () => {
      cy.get('[data-testid="applications-iconM"]').click();
      cy.url().should("include", "/job_applications");
    });

    it("MSM should render plus sign dropdown menu with link to add new contact", () => {
      cy.get('[data-testid="plus-iconM"]').click();
      cy.contains("Add New Contact").should("exist");
      cy.get('[data-testid="newContactLink"]').click();
      cy.url().should("include", "/contacts/new");
    });

    it("MSM should render plus sign dropdown menu with link to add new company", () => {
      cy.get('[data-testid="plus-iconM"]').click();
      cy.contains("Add New Company").should("exist");
      cy.get('[data-testid="newCompanyLink"]').click();
      cy.url().should("include", "/companies/new");
    });

    it("MSM should render dropdown menu with link to add new job application", () => {
      cy.get('[data-testid="plus-iconM"]').click();
      cy.contains("Add New Job Application").should("exist");
      cy.get('[data-testid="newAppLink"]').click();
      cy.url().should("include", "/jobapplications/new");
    });

    it("MSM should render User management dropdown menu with link to viw user profile", () => {
      cy.get('[data-testid="updateUser-iconM"]').click();
      cy.contains("User Profile").should("exist");
      cy.get('[data-testid="userProfileLink"]').click();
      cy.url().should("include", "/userInformation");
    });

    it("MSM should render User management dropdown menu with link to logout", () => {
      cy.get('[data-testid="updateUser-iconM"]').click();
      cy.contains("Logout").should("exist");
      cy.get('[data-testid="userLogoutLink"]').click();
      cy.url().should("include", "/");
      cy.reload()
      cy.url().should("include", "/");
    });

    it("if hamburger icon is clicked again while open, still behaves correctly", () => {
      cy.get('[data-testid="slideout-menu"]').should("have.class", "translate-x-0");
      cy.get('[data-testid="menu-iconM"]').click().click();
      cy.get('[data-testid="slideout-menu"]').should("not.be.visible");
    });

    it("should display the Turing logo in the top of the menu bar", () => {
      cy.get('[data-testid="close-iconM"]').click();
      cy.get('.w-11').should("be.visible");
    });

    it("Turing logo when clicked will navigative to home screen", () => {
      cy.get('[data-testid="close-iconM"]').click();
      cy.get('.w-11').should("be.visible").click();
      cy.url().should("include", "/home");
    });
  });

  it("Should have a quad-color-bar to the right of the nav bar", () => {
    cy.get(".quad-color-bar > .bg-cyan-500").should("exist");
    cy.get(".quad-color-bar > .bg-yellow-500").should("exist");
    cy.get(".quad-color-bar > .bg-red-500").should("exist");
    cy.get(".quad-color-bar > .bg-green-500").should("exist");
  });

  describe("Menu Bar with no user data", () => {
    beforeEach(() => {
      cy.intercept("POST", "**/sessions", { statusCode: 200, body: {} });
      cy.visit("http://localhost:3000/"); 
    });
  
    it("Should not crash if userData is missing", () => {
      cy.get(".quad-color-bar").should("exist");
    });
  });
});

describe("Sad Path: Unauthorized contacts", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

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
              email: "dolly@example.com",
              companies: [],
            },
          },
        },
      },
    }).as("postUserInfo");

    cy.intercept("GET", "**/users/2/contacts", {
      statusCode: 401,
      body: { error: "Unauthorized" },
    }).as("getContactsFail");

    cy.intercept("GET", "**/users/2/companies", {
      statusCode: 200,
      body: [],
    }).as("getCompanies");
    cy.intercept("GET", "**/users/2/job_applications", {
      statusCode: 200,
      body: [],
    }).as("getApplications");

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("dolly@example.com");
    cy.get("#password").type("Jolene123");
    cy.get(".login-btn").click();
    cy.wait("@postUserInfo");
  });

  it("Displays an error if contacts API call fails", () => {
    cy.get('[data-testid="contacts-iconD"]').click();
    cy.wait("@getContactsFail"); 
    cy.contains("Unauthorized").should("exist");
  });
});

