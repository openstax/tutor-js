context('Student Tasks', () => {

  beforeEach(() => {
    cy.visit('/course/1/task/1')
    cy.disableTours();
  });

  it('advances after answering a free-response only question', () => {
    cy.getTestElement('student-exercise-question').should('exist');
    cy.window().then(w => {
      const ts = w._MODELS.courses.get(1).studentTasks.get(1).steps[0];
      ts.formats = ['free-response'];
      ts.content.questions[0].answers.clear();
    });
    cy.getTestElement('free-response-box').type('this is a answer answering and fully explaining my reasoning for the question');
    cy.getTestElement('submit-answer-btn').click();
    cy.location('pathname').should('equal', '/course/1/task/1/step/2');
  });

})
