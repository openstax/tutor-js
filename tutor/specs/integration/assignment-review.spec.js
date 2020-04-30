context('Assignment Review', () => {

  beforeEach(() => {
    cy.visit('/course/1/assignment/review/2')
    cy.disableTours();
  });

  it('loads and views feedback', () => {
    cy.contains('Submission Overview').click();
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
  });

  it('can render grading template preview', () => {
    cy.getTestElement('grading-template-card').should('not.exist');
    cy.getTestElement('preview-card-trigger').click();
    cy.getTestElement('grading-template-card').should('exist');
  });

  it('can delete assignment', () => {
    cy.getTestElement('delete-assignment').click();
    cy.getTestElement('confirm-delete-assignment').click();
    cy.location('pathname').should('include', '/course/1/t/month');
  });

  it.only('can update details', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    cy.wait('@getGradingTemplates');
    cy.getTestElement('edit-assignment').click();
    cy.getTestElement('edit-assignment-name').clear().type('Update');
    cy.getTestElement('confirm-save-assignment').click();
    cy.getTestElement('assignment-name').should('have.text', 'Update');
  });

});
