describe('testing for Login page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/') // Need to find the actual URL. Temporary code until the login is the first page.
    cy.get('[data-testid="login-button"]').click()
  });

  it.skip('checks for the elements on the page', () => {
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
    .get('.turing-logo').should('be.visible')
    .get('.login-form-wrap > .form-inputs > form > .create-account').should('contain', 'Create Account')
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
    cy.intercept("GET", "http://localhost:3001/api/v1/users/21/dashboard", {
      statusCode: 200,
      body: {
        "data": {
          "id": "5",
          "type": "dashboard",
          "attributes": {
              "id": 5,
              "name": "Danny DeVito",
              "email": "danny_de@email.com",
              "dashboard": {
                  "weekly_summary": {
                      "job_applications": [
                          {
                              "id": 1,
                              "position_title": "Jr. CTO",
                              "date_applied": "2024-10-31",
                              "status": 1,
                              "notes": "Fingers crossed!",
                              "job_description": "Looking for Turing grad/jr dev to be CTO",
                              "application_url": "www.example.com",
                              "contact_information": "boss@example.com",
                              "created_at": "2024-12-14T17:20:41.979Z",
                              "updated_at": "2024-12-14T17:20:41.979Z",
                              "company_id": 1,
                              "user_id": 5
                          },
                          {
                              "id": 2,
                              "position_title": " CTO",
                              "date_applied": "2024-10-31",
                              "status": 2,
                              "notes": "Fingers crossed!",
                              "job_description": "Looking for Turing grad/jr dev to be CTO",
                              "application_url": "www.testexample.com",
                              "contact_information": "boss1@example.com",
                              "created_at": "2024-12-14T17:37:28.465Z",
                              "updated_at": "2024-12-14T17:37:28.465Z",
                              "company_id": 2,
                              "user_id": 5
                          }
                      ],
                      "contacts": [
                          {
                              "id": 1,
                              "first_name": "Jonny",
                              "last_name": "Smith",
                              "email": "jonny@gmail.com",
                              "phone_number": "555-785-5555",
                              "notes": "Good contact for XYZ",
                              "created_at": "2024-12-14T17:55:21.875Z",
                              "updated_at": "2024-12-14T17:55:21.875Z",
                              "user_id": 5,
                              "company_id": 1
                          },
                          {
                              "id": 2,
                              "first_name": "Josnny",
                              "last_name": "Smsith",
                              "email": "jonny@gmail.com",
                              "phone_number": "555-785-5555",
                              "notes": "Good contact for XYZ",
                              "created_at": "2024-12-15T01:57:14.557Z",
                              "updated_at": "2024-12-15T01:57:14.557Z",
                              "user_id": 5,
                              "company_id": 1
                          }
                      ],
                      "companies": [
                          {
                              "id": 1,
                              "user_id": 5,
                              "name": "New Company",
                              "website": "www.company.com",
                              "street_address": "123 Main St",
                              "city": "New York",
                              "state": "NY",
                              "zip_code": "10001",
                              "notes": "This is a new company.",
                              "created_at": "2024-12-14T17:20:10.909Z",
                              "updated_at": "2024-12-14T17:20:10.909Z"
                          },
                          {
                              "id": 2,
                              "user_id": 5,
                              "name": "New Company1",
                              "website": "www.company1.com",
                              "street_address": "1231 Main St",
                              "city": "New York",
                              "state": "NY",
                              "zip_code": "10001",
                              "notes": "This is a new company1.",
                              "created_at": "2024-12-14T17:37:24.153Z",
                              "updated_at": "2024-12-14T17:37:24.153Z"
                          }
                      ]
                  }
              }
          }
      }
      }
    })
    .get('.login-form-wrap > .form-inputs > form > .login-btn').click()
    .get('.flex > .flex-grow > .fixed > h1').should('contain', 'Welcome, Cotton Eyed Joe')
  });

  it.skip('tries to log in as a user that doesn\'t exist', () => {
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