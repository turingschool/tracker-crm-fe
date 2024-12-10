describe('Landing page after logging in spec and clicking user information button', () => {
  beforeEach(() => {
      cy.intercept('GET', '/api/user/123', {
        statusCode: 200,
        body: { username: 'Stubbed User', email: "stubbyemail@email.com" },
      }).as('getUserInfo');
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="update-user"]').click();
  });

  it('Should open the user info page;', () => {
    cy.url().should('include', '/userInformation');

    cy.get('[data-testid="name-input"]').should('contain', '');
    cy.get('[data-testid="email-input"]').should('contain', '');
    cy.get('[data-testid="password-input"]').should('contain', '');
    cy.get('[data-testid="password-confirmation-input"]').should('contain', '');
  });

  it('Should allow the user to fill the form and submit it', () => {
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    const password = 'Password123';
    const passwordConfirmation = 'Password123';

    cy.get('[data-testid="name-input"]').type(name).should('have.value', name);
    cy.get('[data-testid="email-input"]').type(email).should('have.value', email);
    cy.get('[data-testid="password-input"]').type(password).should('have.value', password);
    cy.get('[data-testid="password-confirmation-input"]').type(passwordConfirmation).should('have.value', passwordConfirmation);

    cy.get('[data-testid="submit-button"]').click();
  });
  
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
    const name = 'John Doe';
    const email = 'johndoe@example.com';
    
    cy.get('[data-testid="submit-button"]').click();
    
    cy.get('input:invalid').should('have.length', 2);
    cy.get('[data-testid="name-input"]').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });
    
    cy.get('[data-testid="name-input"]').type(name);
    cy.get('[data-testid="submit-button"]').click();
    
    cy.get('input:invalid').should('have.length', 1);
    cy.get('[data-testid="email-input"]').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    });
  });
  
  it('Should send a fetch request to backend API with update information', () => {
  
  })
  
  it('Should recieve a 200 okay status resolving the update request', () => {
  
  })
})