describe('Landing page after logging in spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')

    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

  }
  )

  it('Should have images in the sidebar', () => {
    cy.get('img[alt="Logo"]').should('have.attr', 'src').should('include', 'turing-logo-gray');

    cy.get('[href="/home"] > .MuiSvgIcon-root').should('exist');
    cy.get('[href="/profile"] > .MuiSvgIcon-root').should('exist');
    cy.get('[href="/companies"] > .MuiSvgIcon-root').should('exist');
    cy.get('[href="/documents"] > .MuiSvgIcon-root').should('exist');
    cy.get('[href="/add-new"] > .MuiSvgIcon-root').should('exist');
    cy.get('[href="/userInformation"] > .MuiSvgIcon-root').should('exist');
  });

  it('Should have clickable links for each icon', () => {
    cy.get('[data-testid="home-iconD"]').click();
    cy.url().should('include', '/home');
    cy.visit('http://localhost:3000/');
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="profile-iconD"]').click();
    cy.url().should('include', '/profile');
    cy.visit('http://localhost:3000/');
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="companies-iconD"]').click();
    cy.url().should('include', '/companies');
    cy.visit('http://localhost:3000/');
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="applications-iconD"]').click();
    cy.url().should('include', '/documents');
    cy.visit('http://localhost:3000/');
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="add-iconD"]').click();
    cy.url().should('include', '/add-new');
    cy.visit('http://localhost:3000/');
    cy.get('#email').type("danny_de@email.com")
    cy.get('#password').type("jerseyMikesRox7")
    cy.get('[data-testid="login-button"]').click();

    cy.get('[data-testid="updateUser-iconD"]').click();
    cy.url().should('include', '/userInformation');
  });

  describe('DropDown Menu', () => {
    beforeEach(() => {
      cy.viewport('iphone-xr')
      cy.visit('http://localhost:3000/')
      cy.get('#email').type("danny_de@email.com")
      cy.get('#password').type("jerseyMikesRox7")
      cy.get('[data-testid="login-button"]').click();

    }
    )

    it('has a container for dropdown elements', () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get('.bg-cyan-600').should('exist');
    });
    it('should render dropdown menu with link to create new contact', () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get('.bg-cyan-600').should('exist');
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains('Create New Contact').should('exist');
      cy.get('[href="/newContact"]').click();
      cy.url().should('include', '/newContact');
    });
    it('should render dropdown menu with link to create new company', () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get('.bg-cyan-600').should('exist');
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains('Create New Company').should('exist');
      cy.get('[href="/companies/new"]').click();
      cy.url().should('include', '/companies/new');
    });
    it('should render dropdown menu with link to create new job application', () => {
      cy.get('[data-testid="menu-iconM"]').click();
      cy.get('.bg-cyan-600').should('exist');
      cy.get('[data-testid="newmenu-iconM"]').click();
      cy.contains('Create New Job Application').should('exist');
      cy.get('[href="/jobapplications/new"]').click();
      cy.url().should('include', '/jobapplications/new');
    });
  })
})