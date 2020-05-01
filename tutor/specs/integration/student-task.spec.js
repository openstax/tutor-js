context('Student Tasks', () => {

  beforeEach(() => {

  });

  it('advances after answering a free-response only question', () => {
    cy.visit('/course/1/task/3') // task id 3 is a hardcoded WRM task
    cy.disableTours();

    cy.getTestElement('student-free-response').should('exist')
    cy.getTestElement('free-response-box').type('this is a answer answering and fully explaining my reasoning for the question');
    cy.getTestElement('submit-answer-btn').click();
    cy.location('pathname').should('equal', '/course/1/task/1/step/2');
  });

})
