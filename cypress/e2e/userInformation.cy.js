describe('Landing page after logging in spec and clicking user information button', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    /*
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('button').click();

    will be added when functionality for login is restored.
    */
  }
  )

  it('Should have open the user info page;', () => {


  })

  it('Should allow the user to fill the form and submit it', () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = 'Password123';
    const passwordConfirmation = 'Password123';

    cy.get('[data-testid="name-input"]').type(name);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="password-confirmation-input"]').type(passwordConfirmation);

    cy.get('[data-testid="submit-button"]').click();

    // Assert the form submission (you can replace this with your own assertion)
    cy.url().should('include', '/some-confirmation-page'); // Example of a redirect after successful form submission
  });

  it('Should send a fetch request to backend API with update information', () => {

  })

  it('Should recieve a 200 okay status resolving the update request', () => {

  })

  it('Should show an error if the passwords do not match', () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = 'Password123';
    const passwordConfirmation = 'DifferentPassword';

    cy.get('[data-testid="name-input"]').type(name);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="password-confirmation-input"]').type(passwordConfirmation);

    cy.get('[data-testid="submit-button"]').click();

    // Check for the error message (you'll need to adjust this according to your actual error message)
    cy.contains('Passwords do not match').should('be.visible');
  });

  it('Should show an error when the form is submitted with empty fields', () => {
    cy.get('[data-testid="submit-button"]').click();

    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
  });
})