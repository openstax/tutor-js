context('Assignment Grade', () => {

  beforeEach(() => {
    cy.visit('/course/1/assignment/grade/2')
    cy.disableTours();
  });

  it('loads and views questions', () => {
    cy.getTestElement('questions-bar').should('contain.text', 'Q8')
  });

  it('changes focused student once graded', () => {
    cy.getTestElement('student-answer').then((box) => {
      const { studentId } = box.data()
      box.find('input[name="score"]').val(0.9)
      box.find('textarea[name="comment"]').val('i like this answer a lot!')
      box.find('.btn-primary').click()
      // the currently focused student should have changed and fields reset
      cy.getTestElement('student-answer').should('not.have.attr', 'data-student-id', studentId)
      cy.getTestElement('student-answer', ' input[name="score"]').should('have.value', '1')
      cy.getTestElement('student-answer', ' textarea[name="comment"]').should('be.empty')
    });
  });

});
