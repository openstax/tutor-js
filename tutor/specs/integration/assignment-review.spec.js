context('Assignment Review', () => {

  beforeEach(() => {
    cy.visit('/course/1/assignment/review/2')
    cy.disableTours();
    cy.server();
    cy.route('GET', '/api/plans/*').as('taskPlan');
  });

  it('loads and views feedback', () => {
    cy.wait('@taskPlan');
    cy.getTestElement('submission-overview-tab').click();
    cy.getTestElement('overview').should('exist');
    cy.getTestElement('student-free-responses').should('exist');
  });

  it('loads and views scores', () => {
    cy.wait('@taskPlan');
    cy.getTestElement('assignment-scores-tab').click()
    cy.getTestElement('scores').should('exist');
  });

  it.skip('can publish scores', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    cy.route('PUT', '/api/tasking_plans/*/grade*').as('publishScores');
    cy.wait('@getGradingTemplates');

    cy.getTestElement('assignment-scores-tab').click();
    cy.getTestElement('publish-scores').click();
    cy.getTestElement('published-scores-toast').should('exist');
  });

  it.skip('can drop questions', () => {
    cy.getTestElement('assignment-scores-tab').click()
    cy.getTestElement('drop-questions-btn').click()
    cy.getTestElement('drop-questions-modal').should('exist')

    cy.getTestElement('drop-question-row').then(([,row]) => {
      row.querySelector('input[type="checkbox"]').click()
      const { questionId } = row.dataset;
      cy.wrap(row.querySelector('input[type="radio"][value="zeroed"]')).should('be.checked')
      cy.getTestElement('save-btn').should('be.disabled')
      cy.getTestElement('cancel-btn').click()
      cy.getTestElement('drop-questions-modal').should('not.exist')
      cy.getTestElement('drop-questions-btn').click()
      cy.get(`[data-question-id=${questionId}] input[type="checkbox"]`).should('be.checked')
    })
  });

  it('can render grading template preview', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    cy.getTestElement('grading-template-card').should('not.exist');
    cy.getTestElement('preview-card-trigger').click();
    cy.getTestElement('grading-template-card').should('exist');
  });

  it('can delete assignment', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    cy.route('DELETE', '/api/plans/2*').as('deletePlan');
    cy.getTestElement('delete-assignment').click();
    cy.getTestElement('confirm-delete-assignment').click();
    cy.wait('@deletePlan');
    cy.location('pathname').should('include', '/course/1/t/month');
  });

  it('can update details', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    cy.getTestElement('edit-assignment').click();
    cy.getTestElement('edit-assignment-name').clear().type('Update');
    cy.getTestElement('confirm-save-assignment').click();
    cy.getTestElement('assignment-name').should('have.text', 'Update');
  });

  it('requires confirmation when changing grading template', () => {
    cy.server();
    cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
    // Can change
    cy.getTestElement('edit-assignment').click();
    cy.getTestElement('grading-templates').click();
    cy.getTestElement('Second Homework').click();
    cy.getTestElement('confirm-change-template').click();
    cy.getTestElement('grading-templates', ' button').should('have.text', 'Second Homework');

    // Can cancel
    cy.getTestElement('grading-templates').click();
    cy.getTestElement('Default Homework').click();
    cy.getTestElement('cancel-confirm-change-template').click();
    cy.getTestElement('grading-templates', ' button').should('have.text', 'Second Homework');
  });

  // TODO: fix this test
  it.skip('only renders grading & questions blocks for homework', () => {
    cy.visit('/course/1/assignment/review/1');
    cy.getTestElement('grading-block').should('not.exist');
    cy.getTestElement('questions-block').should('not.exist');


    cy.visit('/course/1/assignment/review/2');
    cy.server();
    cy.route('GET', '/api/plans/*').as('taskPlan');
    cy.wait('@taskPlan');
    cy.getTestElement('grading-block').should('exist');
    cy.getTestElement('questions-block').should('exist');

    cy.visit('/course/1/assignment/review/4');
    cy.getTestElement('grading-block').should('not.exist');
    cy.getTestElement('questions-block').should('not.exist');

    cy.visit('/course/1/assignment/review/5');
    cy.getTestElement('grading-block').should('not.exist');
    cy.getTestElement('questions-block').should('not.exist');
  });

  it.skip('can edit assigned questions', () => {
    cy.getTestElement('edit-assigned-questions').click();
    cy.location('pathname').should('include', '/course/1/assignment/edit/homework/2/points');
  });

  it('hides overview and scores tabs if not reading or homework', () => {
    // Homework
    cy.wait('@taskPlan');
    cy.getTestElement('submission-overview-tab').should('exist');
    cy.getTestElement('assignment-scores-tab').should('exist');

    // Reading
    cy.visit('/course/1/assignment/review/1');
    cy.getTestElement('submission-overview-tab').should('exist');
    cy.getTestElement('assignment-scores-tab').should('exist');

    // External
    cy.visit('/course/1/assignment/review/3');
    cy.getTestElement('submission-overview-tab').should('not.exist');
    cy.getTestElement('assignment-scores-tab').should('not.exist');

    // Event
    cy.visit('/course/1/assignment/review/4');
    cy.getTestElement('submission-overview-tab').should('not.exist');
    cy.getTestElement('assignment-scores-tab').should('not.exist');
  });

  it('cannot deselect sections', () => {
    cy.wait('@taskPlan');
    cy.getTestElement('edit-assignment').click();
    cy.getTestElement('select-sections').click({ force: true });
    cy.getTestElement('tasking').first().find('[data-icon="check-square"]').first().trigger('mouseover')
    cy.get('[role="tooltip"]').contains('cannot withdraw')
  });

  it('should go directly to the submission overview tab', () => {
    cy.visit('/course/1/assignment/review/2/1?tab=1')
    cy.getTestElement('overview').should('exist');
    cy.getTestElement('student-free-responses').should('exist');
  });

  it('should go directly to the assignment scores tab', () => {
    cy.visit('/course/1/assignment/review/2/1?tab=2')
    cy.getTestElement('scores').should('exist');
  });

  it('should hide the student names', () => {
    cy.visit('/course/1/assignment/review/2/1?tab=1')
    cy.getTestElement('names-toogle-button').should('exist');
    // names are shown first, so button label is "Hide student names"
    cy.getTestElement('names-toogle-button-text').should('have.text', 'Hide student names');
    cy.getTestElement('names-toogle-button').click({ force: true });
    cy.getTestElement('names-toogle-button-text').should('have.text', 'Show student names');
    // all names should be hidden
    cy.getTestElement('wrq-response-student-name').should(($name) => {
      expect($name).to.contain('Student response')
    })
  });

});
