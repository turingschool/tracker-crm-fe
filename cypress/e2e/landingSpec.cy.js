describe('Landing page after logging in spec', () => {
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

  it('Should have images in sidebar;', () => {
    cy.get('[src="/static/media/turing-logo-gray.59a7002c9c188f4f0265.png"').should('have.attr', 'src').should('include', 'turing-logo')

    cy.get('[src="/static/media/home_738822.d05df93742daba39e5e7.png"').should('have.attr', 'src').should('include', 'home_738822')

    cy.get('[src="/static/media/person-icon.7a1fafe972143cff67a1.png"').should('have.attr', 'src').should('include', 'person-icon')

    cy.get('[src="/static/media/building-1062.81aab7e590dfc1bc416c.png"').should('have.attr', 'src').should('include', 'building-1062')

    cy.get('[href="https://www.google.com/search?q=papers"] >.m-auto').should('have.attr', 'src').should('include', 'VORK5CYII')

    cy.get('[href="https://www.google.com/search?q=plus"] > .m-auto').should('have.attr', 'src').should('include', 'SuQmCC')

    cy.get('[href="https://www.google.com/search?q=account"] > .m-auto').should('have.attr', 'src').should('include', '/static/media/person-icon.7a1fafe972143cff67a1.png')


  })
  it('Should have clickable links for each icon;', () => {
    cy.get('[href="https://www.google.com/search?q=Turing.edu"] > .m-auto');
    cy.url('match', 'https://www.google.com/search?q=Turing.edu');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=home"]').click()
    cy.url('match', 'https://www.google.com/search?q=home');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=person"]').click()
    cy.url('match', 'https://www.google.com/search?q=person');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=building"]').click()
    cy.url('match', 'https://www.google.com/search?q=building');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=papers"]').click()
    cy.url('match', 'https://www.google.com/search?q=papers');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=plus"]').click()
    cy.url('match', 'https://www.google.com/search?q=plus');
    cy.visit('http://localhost:3000/')

    cy.get('[href="https://www.google.com/search?q=account"]').click()
    cy.url('match', 'https://www.google.com/search?q=account');
    cy.visit('http://localhost:3000/')

  })


})