context('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/course/2/assignment/homework/new')
    cy.disableTours();
  });

  it('loads details and advances', () => {
    cy.get('.heading').should('contain.text', 'STEP 1')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('input[name="title"]').type('test assignment #1')
    cy.get('.controls .btn-primary').should('not.be.disabled')
    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 2')
  });
});
