describe('User Registration Form - Create New User', () => {
  beforeEach(() => {
    cy.visit('/UserRegistration');

      cy.intercept('POST', 'http://localhost:3001/api/v1/users', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
      req.reply({
        statusCode: 201,
        fixture: 'mockUserRegistration',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('getUserRegistration');
  });

  it('displays the Turing Logo', () => {
    cy.get('.turing-logo').should('be.visible');
  });

  it('displays expected text and styling elements', () => {
    cy.get('.create-account').should('contain', 'Create Account');
    cy.get('label').eq(0).should('contain', 'Name');
    cy.get('label').eq(1).should('contain', 'Email');
    cy.get('label').eq(2).should('contain', 'Password');
    cy.get('label').eq(3).should('contain', 'Confirm Password');
    cy.get('p.login-link').should('contain', 'Already have an account?');
    cy.get('a.link-to-login').should('contain', 'Click here to login.');
    cy.get('.tracker').should('contain', 'Tracker');
    cy.get('.by-turing').should('contain', 'by Turing');
    cy.get('.app-tagline').should('contain', 'Job hunting made easier');

    cy.get('.cyan-bar').should('be.visible');
    cy.get('.yellow-bar').should('be.visible');
    cy.get('.red-bar').should('be.visible');
    cy.get('.green-bar').should('be.visible');
  });

  it('navigates to Login page via link', () => {
    cy.get('a.link-to-login').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('can register a new User', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');
    
    cy.intercept('POST', 'http://localhost:3001/api/v1/users', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
      req.reply({
        statusCode: 201,
        fixture: 'mockUserRegistration',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('getUserRegistration');

    cy.get('button[type="submit"]').click();

    cy.intercept('POST', 'http://localhost:3001/api/v1/sessions', (req) => {
      
      req.reply({
        statusCode: 201,
        fixture: 'mockUserSession',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('userSession');

    cy.url().should('eq', 'http://localhost:3000/home');
    cy.contains('John Hill').should('be.visible');
  });

  it('Displays a spinner while loading and shows data after loading completes', () => {
    cy.get('div.login-form-wrap').should('be.visible');

    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.intercept('POST', 'http://localhost:3001/api/v1/users', (req) => {
      req.on('response', (res) => {
        res.setDelay(2000);
      });
      req.reply({
        statusCode: 201,
        fixture: 'mockUserRegistration',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('getUserRegistration');

    cy.get('button[type="submit"]').click();

    cy.get('span').should('be.visible');

    cy.intercept('POST', 'http://localhost:3001/api/v1/sessions', (req) => {
      
      req.reply({
        statusCode: 201,
        fixture: 'mockUserSession',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('userSession');

    cy.get('span').should('not.exist');
    cy.url().should('eq', 'http://localhost:3000/home');
    cy.contains('John Hill').should('be.visible');
  });

  // SAD PATHS
  it('does not register a new User when User already exists', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('propane_accesories@example.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    
    cy.intercept('POST', 'http://localhost:3001/api/v1/users', (req) => {
      req.reply({
        statusCode: 400,
        fixture: 'mockUserAlreadyTakenError',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }).as('userAlreadyExists');
    
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
    cy.get('input').eq(1).type('king_of_the_hill@email.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Email field is blank', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(2).type('PropaneAccessories2024');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Password field is blank', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(3).type('PropaneAccessories2024');

    cy.get('button[type="submit"]').click();

    cy.url().should('not.eq', 'http://localhost:3000/home');
    cy.url().should('eq', 'http://localhost:3000/UserRegistration');
  });

  it('does not register a new User when Confirm Password field is blank', () => {
    cy.get('input').eq(0).type('John Hill');
    cy.get('input').eq(1).type('king_of_the_hillatemail.com');
    cy.get('input').eq(2).type('PropaneAccessories2024');

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
});
