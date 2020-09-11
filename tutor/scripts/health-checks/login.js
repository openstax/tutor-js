context('Login', () => {
  it('loads application', () => {
    cy.loginAccount();
    cy.checkLastPageLoadTime(5, 'seconds');
  })
  
})
