context('Login', () => {
  it('loads tutor', () => {
    cy.loginAccount();
    cy.checkLastPageLoadTime(10, 'seconds');

    // enable once released and test element exists
    // cy.getTestElement('my-courses').should('exist')
  })
  
})
