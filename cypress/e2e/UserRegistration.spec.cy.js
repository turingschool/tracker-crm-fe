describe('User Registration Form - Create New User', () => {
  beforeEach(() => {
    cy.visit('/UserRegistration');
  });

  it('displays the Turing Logo', () => {
    cy.get('turing-logo').should('be.visible');
  });

  it('displays expected text and styling elements', () => {
    cy.get('create-account"]').should('contain', 'Create Account');
    cy.get('label').eq(0).should('contain', 'Name');
    cy.get('label').eq(1).should('contain', 'Email');
    cy.get('label').eq(2).should('contain', 'Password');
    cy.get('label').eq(3).should('contain', 'Confirm Password');
    cy.get('p.login-link').should('contain', 'Already have an account?');
    cy.get('a.link-to-login').should('contain', 'Click here to login.');
    cy.get('tracker').should('contain', 'Tracker');
    cy.get('by-turing').should('contain', 'by Turing');
    cy.get('app-tagline').should('contain', 'Job hunting made easier');

    cy.get('cyan-bar').should('be.visible');
    cy.get('yellow-bar').should('be.visible');
    cy.get('red-bar').should('be.visible');
    cy.get('blue-bar').should('be.visible');
  });

  it('navigates to Login page via link', () => {
    cy.get('a.link-to-login').click();
    cy.url().should('eq', 'http://localhost:3000/login');
  });

  it('can register a new User', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    // STUB/INTERCEPT HERE FOR SUCCESSFULLY CREATED User

    cy.url().should('eq', 'http://localhost:3000/home');
    cy.contains('John Hill').should('be.visible');
  });

  
  // SAD PATHS

  it('does not register a new User when User already exists', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.get('p.error-message').should('contain', 'Email has already been taken');

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User with an invalid email', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Name field is blank', () => {
    cy.get('input').eq(0).type('');
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Email field is blank', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });
  
  it('does not register a new User when Password field is blank', () => {
    cy.get('input').eq(0).type('');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Confirm Password field is blank', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when passwords do not match', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories');

    cy.get('button[type="submit"]').click();

    cy.get('p.error-message').should('contain', 'Passwords must match. Please try again.');

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });
})

/*

AFTER MVP PASSES, COULD ADD STRICTER INPUT VALIDATIONS

Will I need mock data for my POST request?
-> With an intercept

// How to confirm new User successfully created?
//   --> Successfully arrives at home page/Dashboard
//     ONLY need to verify URL has been changed.

Test:
// - All elements visible
//   - Turing Logo
//   - Multicolored bar
//   - Presence of all text
//     - Create Account
//     - Tracker
//     - by Turing
//     - Job hunting made easier.
//   - Input fields
//     - Name
//     - Email
//     - Password
//     - Confirm Password

// - Ensure login link is functional
//   - "Click here to log in." navigates to Log In page
//     --> ONLY verify URL has changed to correct address.
  

// - HAPPY PATH --> E2E Functionality of Creating New User
//   - Correctly create new user
//   - Type all fields
//   - Register button click
//   - Successful creation navigates to User's Dashboard and displays user's name
  
  - SAD PATHS? --> I believe some errors are automatically generated for these inputs
    - Unsuccessful creation throws correct errors
      - Errors for:
        - Email:
          - "Email has already taken"
          - Invalid email
            - No @ symbol or .com
        - "Passwords must match. Please try again."


*/