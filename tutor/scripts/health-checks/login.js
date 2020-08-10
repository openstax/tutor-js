context('Login', () => {
  it('loads application', () => {
    cy.loginAccount();
    cy.checkLastPageLoadTime(5, 'seconds');
    // enable once released and test element exists
    // cy.getTestElement('my-courses').should('exist')
  })
  
})
