context('My Practice Questions', () => {

  beforeEach(() => {
    cy.visit('/course/1/practice-questions')
    cy.setRole('student')
  });

  it.only('should show empty message', () => {
    cy.get('.empty-practice-questions-content .empty-practice-questions-header')
      .should('have.text', 'No questions have been saved for practice.');
    cy.getTestElement('save-practice-button').should('be.disabled');
    cy.getTestElement('save-practice-button')
      .should('have.text', 'Save to practice');
  })
})
