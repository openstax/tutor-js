context('Assignment Grade', () => {

  beforeEach(() => {
    cy.visit('/course/1/gradebook')
    cy.disableTours();
  });

  it('loads and views grades', () => {
    cy.getTestElement('questions-bar').should('contain.text', 'Q8')
  });
})
