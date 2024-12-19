describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

/*

DO I NEED TO WRITE MORE BE TESTS?
-> If I do, it'll be on the BE repo.

Will I need mock data for my POST request?
-> With an intercept

How to confirm new User successfully created?

Test:
- Presence of all elements (including all containers?)
- Presence of all text
- Input fields can receive text
- Ensure link is functional
  - "Click here to log in."
  

- E2E Functionality of Creating New User
  - Successful creation navigates to User's Dashboard
  - Unsuccessful creation throws correct errors


*/