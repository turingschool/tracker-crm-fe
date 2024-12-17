// import { mockCompanies } from "../support/mockCompanies";
import { mockContactsData } from "../fixtures/mockContactsData";

describe("New Contacts page after logging in", () => {
    beforeEach(() => {
        
        cy.intercept('POST', 'http://localhost:3001/api/v1/users/4/contacts', {
            statusCode: 201,
            body: {
                id: 123,
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.Smith@example.com',
                phone_number: '555-555-5555',
                current_company: 'Company A',
                notes: 'Test notes'
            }
        }).as('addContact');

        cy.intercept("GET", "http://localhost:3001/api/v1/users/4/contacts", {
            statusCode: 200,
            body: mockContactsData,
            headers: {
              "Content-Type": "application/json"
            }
          }).as("get-contacts");
        cy.visit("http://localhost:3000/contacts");
    });

  
    it("Should navigate to the new contact form and display fields", () => {
      cy.get('a > .bg-cyan-600').click(); 
      cy.contains("Create New Contact")
  
      cy.url().should("include", "/contacts/new");
  
      cy.get("h1").should("have.text", "Add New Contact");
      cy.get('label').contains('First Name').should('exist');
      cy.get('label').contains('Last Name').should('exist');
      cy.get('label').contains('Email').should('exist');
      cy.get('label').contains('Phone Number').should('exist');
      cy.get('label').contains('Company').should('exist');
      cy.get('label').contains('Notes').should('exist');
    });
  
    it("Should allow input in all form fields", () => {
      cy.get('a > .bg-cyan-600').click();
      cy.contains("Create New Contact")
      cy.get('#firstName').type('John').should('have.value', 'John');
      cy.get('#lastName').type('Smith').should('have.value', 'Smith');
      cy.get('#email').type('john.Smith@example.com').should('have.value', 'john.Smith@example.com');
      cy.get('#phoneNumber').type('555-555-5555').should('have.value', '555-555-5555');
    //   cy.get('#Company').type('Company A').should('have.value', 'Company A');
      cy.get('#notes').type('Test notes').should('have.value', 'Test notes');
    });
  
    it("Should require First Name and Last Name", () => {
      cy.get('a > .bg-cyan-600').click();
      cy.contains("Create New Contact")
  
      cy.get('button[type="submit"]').click();
      cy.get('#firstName:invalid').should('exist');
      cy.get('#lastName:invalid').should('exist');
    });
  
    it("Should submit the form with valid data", () => {
      cy.get('a > .bg-cyan-600').click();
      cy.contains("Create New Contact")
  
      cy.get('#firstName').type('John');
      cy.get('#lastName').type('Smith');
  
      cy.get('button[type="submit"]').click();
  
      cy.wait('@addContact').then((interception) => {
        expect(interception.response.statusCode).to.equal(201);
      });
  
      cy.url().should('include', '/contacts');
      cy.contains('John Smith').should('exist');
    });

    it("Should validate the email address format", () => {
        cy.get('a > .bg-cyan-600').click();
        cy.contains("Create New Contact");
        cy.get('#firstName').type('John');
        cy.get('#lastName').type('Smith');
        cy.get('#email').type('invalid-email');
        cy.get('button[type="submit"]').click();
    
        cy.get('#email:invalid').should('exist');
    });

    it("Should validate the phone number format", () => {
        cy.get('a > .bg-cyan-600').click();
        cy.contains("Create New Contact");
        cy.get('#firstName').type('John');
        cy.get('#lastName').type('Smith');
        cy.get('#phoneNumber').type('12345');
        cy.get('button[type="submit"]').click();
        cy.contains("Phone number must be in the format '555-555-5555'").should('exist');
        cy.get('#phoneNumber').clear().type('555-555-5555');
        cy.get('button[type="submit"]').click();
        cy.contains("Phone number must be in the format '555-555-5555'").should('not.exist');
    });
    it("Should not allow duplicate contacts", () => {
        cy.get('a > .bg-cyan-600').click();
        cy.contains("Create New Contact");
    
        cy.get('#firstName').type('John');
        cy.get('#lastName').type('Smith');
        cy.get('#email').type('john.Smith@example.com');
        cy.get('#phoneNumber').type('555-555-5555');
    
        cy.intercept('POST', 'http://localhost:3001/api/v1/users/4/contacts', {
            statusCode: 422,
            body: { error: "Contact already exists" }
        }).as('addDuplicateContact');
    
        cy.get('button[type="submit"]').click();
    
        cy.wait('@addDuplicateContact');
        cy.contains("Contact already exists").should('exist');
    });

    it("Should display an error message if the server fails to create a contact", () => {
        cy.get('a > .bg-cyan-600').click();
        cy.contains("Create New Contact");
    
        cy.get('#firstName').type('John');
        cy.get('#lastName').type('Smith');
    
        cy.intercept('POST', 'http://localhost:3001/api/v1/users/4/contacts', {
            statusCode: 500,
            body: { error: "Server error, please try again" }
        }).as('addContactError');
    
        cy.get('button[type="submit"]').click();
    
        cy.wait('@addContactError');
        cy.contains("Server error, please try again").should('exist');
    });

    it("Should allow submission with only required fields", () => {
        cy.get('a > .bg-cyan-600').click();
        cy.contains("Create New Contact");
    
        cy.get('#firstName').type('Jane');
        cy.get('#lastName').type('Smith');
        cy.get('button[type="submit"]').click();
    
        cy.wait('@addContact').then((interception) => {
            expect(interception.response.statusCode).to.equal(201);
        });
    
        cy.url().should('include', '/contacts');
        cy.contains('Jane Smith').should('exist');
    });

  });
// describe("New Contacts page after logging in", () => {
//   let uniqueContactName = `Test Company ${Date.now()}`;

//   beforeEach(() => {
//     cy.visit("http://localhost:3000/");

//     cy.intercept('POST', 'http://localhost:3001/api/v1/users/2/contacts', {
//       statusCode: 201,
//       body: {
//         id: 123,
//         first_name: 'John',
//         last_name: 'Smith',
//         email: 'john.Smith@example.com',
//         phone_number: '555-555-5555',
//         current_company: 'Company A',
//         notes: 'Test notes'
//       }
//     }).as('addContact');
    
//     cy.intercept("GET", "http://localhost:3001/api/v1/users/2/contacts", {
//       statusCode: 200,
//       body: {
//         data: [
//         //   ...mockCompanies.data, 
//           {
//             id: 123,
//             type: "contact",
//             attributes: {
//               id: 123,
//               first_name: 'John',
//               last_name: 'Smith',
//               email: 'john.Smith@example.com',
//               phone_number: '555-555-5555',
//               current_company: 'Company A',
//               notes: 'Test notes'
//             }
//           }
//         ]
//       },
//       headers: {
//         "Content-Type": "application/json"
//       }
//     }).as("getContacts");
    
//     // cy.get("img[alt='Contacts']").click();
//     // cy.contains("Add New").click();
    
//     /*
//     cy.get("#email").type("danny_de@email.com")
//     cy.get("#password").type("jerseyMikesRox7")
//     cy.get("button").click();
// `
//     will be added when functionality for login is restored.
//     */
//   });
  
// //   it("Should display the new contact form", () => {

// //     cy.get("button").contains("AddCircleIcon").click(); 
// //     cy.get("ul").should("be.visible");
// //     cy.contains("Create New Contact").click();
// //     cy.url().should("include", "/contacts/new");
// //     cy.get("h1").should("have.text", "Add New Contact");
// //   });

//   it('should have the correct labels for the form fields', () => {
//     cy.get('label').contains('First Name').should('exist');
//     cy.get('label').contains('Last Name').should('exist');
//     cy.get('label').contains('Email').should('exist');
//     cy.get('label').contains('Phone Number').should('exist');
//     cy.get('label').contains('Company').should('exist');
//     cy.get('label').contains('Notes').should('exist');
//   });

//   it('should allow input in all form fields', () => {
//     cy.get('#firstName').type('John').should('have.value', 'John');
//     cy.get('#lastName').type('Smith').should('have.value', 'Smith');
//     cy.get('#email').type('john.Smith@example.com').should('have.value', 'john.Smith@example.com');
//     cy.get('#phoneNumber').type('555-555-5555').should('have.value', '555-555-5555');
//     cy.get('#Company').type('Company A').should('have.value', 'Company A');
//     cy.get('#notes').type('Test notes').should('have.value', 'Test notes');
//   });

//   it('should require Contacts First Name and Last Name', () => {
//     cy.get('button[type="submit"]').click();
//     cy.get('#firstName:invalid').should('exist');
//     cy.get('#lastName:invalid').should('exist');
//   });

//   it('should submit the form with valid data', () => {
//     cy.get('#firstName').type('John');
//     cy.get('#lastName').type('Smith');
//     cy.get('#email').type('john.Smith@example.com');
//     cy.get('#phoneNumber').type('555-555-5555');
//     cy.get('#Company').type('Company A');
//     cy.get('#notes').type('Test notes');

//     cy.get('button[type="submit"]').click();

//     cy.wait('@addContact').then((interception) => {
//       expect(interception.response.statusCode).to.equal(201);
//     });
//     cy.url().should('include', '/contacts');
//     cy.contains('John Smith').should('exist');
//   });
// })