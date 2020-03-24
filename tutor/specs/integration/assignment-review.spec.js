context('Assignment Review', () => {

  beforeEach(() => {
    cy.visit('/course/1/assignment/review/1')
    cy.disableTours();
  });

  it('loads and views feedback', () => {
    cy.getTestElement('overview').should('exist');
    cy.getTestElement('student-free-responses').should('not.exist');
    cy.get('.homework-questions .ox-icon-caret-right').first().click()
    cy.getTestElement('student-free-responses').should('exist');
  });

  it('loads and views scores', () => {
    cy.get('.tutor-tabs li a').last().click()
    cy.getTestElement('scores').should('exist');
  });

});
