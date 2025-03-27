describe('testing for Login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/') // Need to find the actual URL. Temporary code until the login is the first page.
    cy.get('[data-testid="login-button"]').click()
  });

  it('checks for the elements on the page', () => {
    cy.get('.turing-logo').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > h1').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > h1').should('contain', 'Please login')

    .get('.login-form-wrap > .form-inputs > form > .email-input > label').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .email-input > label').should('contain', 'Email:')
    .get('.login-form-wrap > .form-inputs > form > .email-input > #email').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .email-input > #email').should('contain', '')

    .get('.login-form-wrap > .form-inputs > form > .password-input > label').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .password-input > label').should('contain', 'Password:')
    .get('.login-form-wrap > .form-inputs > form > .password-input > #password').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .password-input > #password').should('contain', '')

    .get('.login-form-wrap > .form-inputs > form > .login-btn').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .login-btn').should('contain', 'Login')
  
    .get('.no-account-message').should('be.visible')
    .get('.no-account-message').should('contain', 'No Account? Click Here To Register.')

    .get('a').should('be.visible')
    .get('a').should('contain', 'Here')

    .get('.login-form-wrap > .quad-color-bar').should('be.visible')
    .get('.login-form-wrap > .quad-color-bar > .cyan-bar').should('be.visible')
    .get('.login-form-wrap > .quad-color-bar > .yellow-bar').should('be.visible')
    .get('.login-form-wrap > .quad-color-bar > .red-bar').should('be.visible')
    .get('.login-form-wrap > .quad-color-bar > .green-bar').should('be.visible')

    .get('.login-form-wrap > .title-wrap').should('be.visible')
    .get('.login-form-wrap > .title-wrap > .app-name-and-author > .tracker').should('be.visible')
    .get('.login-form-wrap > .title-wrap > .app-name-and-author > .tracker').should('contain', 'Tracker')
    .get('.login-form-wrap > .title-wrap > .app-name-and-author > .by-turing').should('be.visible')
    .get('.login-form-wrap > .title-wrap > .app-name-and-author > .by-turing').should('contain', 'by Turing')
    .get('.login-form-wrap > .title-wrap > .app-tagline').should('be.visible')
    .get('.login-form-wrap > .title-wrap > .app-tagline').should('contain', 'Job hunting made easier')
  });

  it('tests login page funtionality', () => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 401,
      body: {
        "message": "Error in Login: Invalid login credentials",
        "status": 401
      }
    }).as("postUserInfo");

    cy.get('.login-form-wrap > .form-inputs > form > .login-btn').click()
    .get('.login-form-wrap > .form-inputs > form > .email-input > #email').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    })
    .get('.login-form-wrap > .form-inputs > form > .email-input > #email').type('NotARealEmail@emailExample.com')
    .get('.login-form-wrap > .form-inputs > form > .login-btn').click()
    .get('.login-form-wrap > .form-inputs > form > .password-input > #password').then(($input) => {
      expect($input[0].validationMessage).to.eq('Please fill out this field.')
    })
    .get('.login-form-wrap > .form-inputs > form > .password-input > #password').type("NotARealPassword")
    .get('.login-form-wrap > .form-inputs > form > .login-btn').click()
    .get('.login-form-wrap > .form-inputs > .failed-login').should('be.visible')
    .get('.login-form-wrap > .form-inputs > .failed-login').should('contain', 'Error in Login: Invalid login credentials')
  });

  it('persists login after a refresh', () => {
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        token: 'fake-token',
        user: {
          data: {
            id: 1,
            type: 'user',
            attributes: {
              name: 'Danny DeVito',
              email: 'danny_de@email.com',
              companies: []
            }
          }
        }
      }
    }).as("mockSession");

    cy.intercept(
      'GET',
      'http://localhost:3001/api/v1/users/1/dashboard',
      { statusCode: 200, fixture: 'mockDashBoard' }
    );

    cy.visit("http://localhost:3000/");
    cy.get("#email").type("danny_de@email.com")
    cy.get("#password").type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();
    cy.get("h1").should("have.text", "Welcome, Danny DeVito");
    cy.reload();
    cy.get("h1").should("have.text", "Welcome, Danny DeVito");
  })
});