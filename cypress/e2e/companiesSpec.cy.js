describe('Companies page after logging in', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    /*
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('button').click();

    will be added when functionality for login is restored.
    */
  })
  it ('Should have a header with the text "Companies"', () => {
    cy.get('img[alt="Companies"]').click();
    cy.get('h1').should('have.text', 'Companies');
    cy.get("input").should('have.attr', 'placeholder', 'Search companies...');
    cy.contains('button', 'Add New').should('exist')

  })
})