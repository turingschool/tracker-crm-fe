describe('testing for Login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/') // Need to find the actual URL. Temporary code until the login is the first page.
    cy.get('[data-testid="login-button"]').click()
  });

  it('checks for the elements on the page', () => {
    cy.get('.login-form-wrap > .form-inputs > .flex > .turing-logo').should('be.visible')
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
      .get('.login-form-wrap > .form-inputs > form > .no-account-message').should('be.visible')
      .get('.login-form-wrap > .form-inputs > form > .no-account-message').should('contain', 'No Account? Click Here To Register.')

      .get('.login-form-wrap > .form-inputs > form > .no-account-message > a').should('be.visible')
      .get('.login-form-wrap > .form-inputs > form > .no-account-message > a').should('contain', 'Here')

      .get('.login-form-wrap > .quad-color-bar').should('be.visible')
      .get('.login-form-wrap > .quad-color-bar > .cyan-bar').should('be.visible')
      .get('.login-form-wrap > .quad-color-bar > .yellow-bar').should('be.visible')
      .get('.login-form-wrap > .quad-color-bar > .red-bar').should('be.visible')
      .get('.login-form-wrap > .quad-color-bar > .green-bar').should('be.visible')

      .get('.login-form-wrap > .title-wrap').should('be.visible')
      .get('.login-form-wrap > .title-wrap > .app-name-and-author > .app-name').should('be.visible')
      .get('.login-form-wrap > .title-wrap > .app-name-and-author > .app-name').should('contain', 'Tracker')
      .get('.login-form-wrap > .title-wrap > .app-name-and-author > .app-author').should('be.visible')
      .get('.login-form-wrap > .title-wrap > .app-name-and-author > .app-author').should('contain', 'by Turing')
      .get('.login-form-wrap > .title-wrap > .app-tagline').should('be.visible')
      .get('.login-form-wrap > .title-wrap > .app-tagline').should('contain', 'Job hunting made easier')
  });

  it.skip('checks the navigation to the user registration page', () => { // This test is needs the UserRegistration branch to merge to main
    cy.get('.login-form-wrap > .form-inputs > form > .no-account-message > a').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .no-account-message > a').click()
    .get('')
  });

  it('logs in a user successfully', () => {
    cy.get('.login-form-wrap > .form-inputs > form > .email-input > #email').type("IdveBeenMarried@ALongTimeAgo.com")
      .get('.login-form-wrap > .form-inputs > form > .password-input > #password').type("W3reD1dYouC0meFromW3reDidY0uGo!$")
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 200,
      body: {
        "token": "fake-token",
        "user":{
          "data": {
            "id": "21",
            "type": "user",
            "attributes": {
              "name": "Cotton Eyed Joe",
              "email": "IdveBeenMarried@ALongTimeAgo.com"
            }
          }
        }
      }
    })
    .get('.login-form-wrap > .form-inputs > form > .login-btn').click()
    .get('.flex.flex-row > .flex-1.m-auto > .flex.flex-col > h1').should('contain', 'Welcome, Cotton Eyed Joe')
  });

  it('tries to log in as a user that doesn\'t exist', () => { // not working at the moment. will need to refactor tests TBD.
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
    cy.intercept("POST", "http://localhost:3001/api/v1/sessions", {
      statusCode: 401,
      body: {
        "message": "Invalid login credentials",
        "status": 401
      }
    })
      .get('.login-form-wrap > .form-inputs > form > .login-btn').click()
      .get('.login-form-wrap > .form-inputs > .failed-login').should('be.visible')
      .get('.login-form-wrap > .form-inputs > .failed-login').should('contain', 'Error in Login: Invalid login credentials')
  });
});