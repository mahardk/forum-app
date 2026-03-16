describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');
  });

  it('should display login page elements correctly', () => {
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain.text', 'Masuk');
  });

  it('should show error when login with wrong credentials', () => {
    cy.get('input[type="email"]').type('salah@email.com');
    cy.get('input[type="password"]').type('passwordsalah');
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 8000 }).should('include', '/login');
  });

  it('should redirect to homepage after successful login', () => {
    cy.get('input[type="email"]').type(Cypress.env('TEST_EMAIL'));
    cy.get('input[type="password"]').type(Cypress.env('TEST_PASSWORD'));
    cy.get('button[type="submit"]').click();

    cy.url({ timeout: 5000 }).should('eq', 'http://localhost:5173/');
  });
});