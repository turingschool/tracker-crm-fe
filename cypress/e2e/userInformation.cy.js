describe('Landing page after logging in spec and clicking user information button', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/users/2', {
      statusCode: 200,
      body: 
        {token: "The token",
        user: {
          id: 2,
          type: "user",
          attributes: {
            name: "Billy",
            email: "billy@email.com",
            companies: []
          }
        }},
    }).as('getUserInfo');

    cy.intercept('POST', 'http://localhost:3001/api/v1/sessions', {
      statusCode: 200,
      body: 
        {token: "The token",
        user: {
          id: 2,
          type: "user",
          attributes: {
            name: "Billy",
            email: "billy@email.com",
            companies: []
          }
        }
      },
    }).as('postUserInfo');

    cy.visit('http://localhost:3000/')
    cy.get('#email').type('dollyP@email.com');
    cy.get('#password').type('Jolene123');
    cy.get('.login-btn').click();
    // cy.wait('@getUserInfo');
    cy.get('[data-testid="update-user"]').click();
  });

  it('Should open the user info page;', () => {
    cy.url().should('include', '/userInformation');

    cy.get('[data-testid="name-input"]').should('have.value', 'Billy');
    cy.get('[data-testid="email-input"]').should('have.value', 'billy@email.com');
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

    cy.get('[data-testid="submit-button"]').should('exist');
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

    cy.intercept('PUT', '/api/v1/user/123', {
      statusCode: 200,
      body: { message: 'User updated successfully' },
    }).as('updateUser');

    cy.get('[data-testid="name-input"]').clear().type('Stubbed User');
    cy.get('[data-testid="email-input"]').clear().type('stubbyemail@email.com');
    cy.get('[data-testid="password-input"]').type('pass123');
    cy.get('[data-testid="password-confirmation-input"]').type('pass123');

    cy.get('[data-testid="submit-button"]').click();

    cy.wait('@updateUser').then((interception) => {
      expect(interception.request.method).to.eq('PUT');
      expect(interception.request.body).to.deep.equal({
        id: 3,
        username: 'Stubbed User', 
        email: "stubbyemail@email.com",
        password: "pass123",
        passwordConfirmation: "pass123"  
      });
    });

    cy.contains('User updated successfully').should('be.visible');
  })

})