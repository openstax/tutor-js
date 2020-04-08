context('Assignment Review', () => {

  beforeEach(() => {
    cy.visit('/course/1/assignment/review/2')
    cy.disableTours();
  });

  it('loads and views feedback', () => {
    cy.getTestElement('overview').should('exist');
    cy.getTestElement('student-free-responses').should('not.exist');
    cy.get('.homework-questions .ox-icon-caret-right').first().click()
    cy.getTestElement('student-free-responses').should('exist');
  });

  it('loads and views scores', () => {
    cy.getTestElement('assignment-scores-tab').click()
    cy.getTestElement('scores').should('exist');
  });

  it('can drop questions', () => {
    cy.getTestElement('assignment-scores-tab').click()
    cy.getTestElement('drop-questions-btn').click()
    cy.getTestElement('drop-questions-modal').should('exist')

    cy.getTestElement('drop-question-row').then(([,row]) => {
      row.querySelector('input[type="checkbox"]').click()
      const { questionId } = row.dataset;
      cy.wrap(row.querySelector('input[type="radio"][value="zeroed"]')).should('be.checked')
      cy.getTestElement('save-btn').click()
      cy.getTestElement('drop-questions-modal').should('not.exist')
      cy.getTestElement('drop-questions-btn').click()
      cy.get(`[data-question-id=${questionId}] input[type="checkbox"]`).should('be.checked')
    })

  })

});
