import { visitPage } from './helpers'

// // playwright has a 30s timeout, make jests larger so we see errors
jest.setTimeout(15 * 1000)

describe('Assignment Review', () => {

  beforeEach(async () => {
    context.setDefaultTimeout(10*1000)

    await visitPage(page, '/course/1/assignment/review/2')
    await page.route('/api/plans/*', req => req.continue())

    // cy.visit('/course/1/assignment/review/2')
    // cy.disableTours();
    // cy.server();
    // cy.route('GET', '/api/plans/*').as('taskPlan');
  });

  it('loads and views feedback', async () => {
    await page.click('testEl=submission-overview-tab')
    await expect(page).toHaveSelector('testEl=student-free-responses')
  });

  it('loads and views scores', async () => {
    await page.click('testEl=assignment-scores-tab')
    await expect(page).toHaveSelector('testEl=scores')
  });

  it('can grade WRM', async () => {
    await page.route('/api/courses/1/grading_templates*', req => req.continue())
    await page.click('testEl=grade-answers-btn')
    await page.fill('input[name="score"]', '1')
    await page.fill('textarea[name="comment"]', 'good answer!')
    await page.click('testEl=save-grade-btn')
  });

  // this spec will fail if re-ran repeatedlly when it runs out of questions to drop
  it('can drop questions', async () => {
    await page.click('testEl=assignment-scores-tab')
    await page.click('testEl=drop-questions-btn')
    const qId = await page.$eval('testEl=drop-question-row >> input[type="checkbox"]:not(:checked)', el => el.id)
    await page.click(`label[for="${qId}"] >> svg`)
    await page.click('testEl=save-btn')
    await expect(page).toHaveSelector('[data-test-id="dropped-question-indicator"]')
  })


  fit('can render grading template preview', async () => {
    await expect(page).not.toHaveSelector('testEl=grading-template-card', { timeout: 10 })
    await page.click('testEl=preview-card-trigger')
    await expect(page).toHaveSelector('testEl=grading-template-card')

  //   cy.server();
  //   cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
  //   cy.getTestElement('grading-template-card').should('not.exist');
  //   cy.getTestElement('preview-card-trigger').click();
  //   cy.getTestElement('grading-template-card').should('exist');
  });

  // it('can delete assignment', () => {
  //   cy.server();
  //   cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
  //   cy.route('DELETE', '/api/plans/2*').as('deletePlan');
  //   cy.getTestElement('delete-assignment').click();
  //   cy.getTestElement('confirm-delete-assignment').click();
  //   cy.wait('@deletePlan');
  //   cy.location('pathname').should('include', '/course/1/t/month');
  // });

  // it('can update details', () => {
  //   cy.server();
  //   cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
  //   cy.getTestElement('edit-assignment').click();
  //   cy.getTestElement('edit-assignment-name').clear().type('Update');
  //   cy.getTestElement('confirm-save-assignment').click();
  //   cy.getTestElement('assignment-name').should('have.text', 'Update');
  // });

  // it('requires confirmation when changing grading template', () => {
  //   cy.server();
  //   cy.route('GET', '/api/courses/1/grading_templates*').as('getGradingTemplates');
  //   // Can change
  //   cy.getTestElement('edit-assignment').click();
  //   cy.getTestElement('grading-templates').click();
  //   cy.getTestElement('Second Homework').click();
  //   cy.getTestElement('confirm-change-template').click();
  //   cy.getTestElement('grading-templates', ' button').should('have.text', 'Second Homework');

  //   // Can cancel
  //   cy.getTestElement('grading-templates').click();
  //   cy.getTestElement('Default Homework').click();
  //   cy.getTestElement('cancel-confirm-change-template').click();
  //   cy.getTestElement('grading-templates', ' button').should('have.text', 'Second Homework');
  // });

  // // TODO: fix this test
  // it.skip('only renders grading & questions blocks for homework', () => {
  //   cy.visit('/course/1/assignment/review/1');
  //   cy.getTestElement('grading-block').should('not.exist');
  //   cy.getTestElement('questions-block').should('not.exist');


  //   cy.visit('/course/1/assignment/review/2');
  //   cy.server();
  //   cy.route('GET', '/api/plans/*').as('taskPlan');
  //   cy.wait('@taskPlan');
  //   cy.getTestElement('grading-block').should('exist');
  //   cy.getTestElement('questions-block').should('exist');

  //   cy.visit('/course/1/assignment/review/4');
  //   cy.getTestElement('grading-block').should('not.exist');
  //   cy.getTestElement('questions-block').should('not.exist');

  //   cy.visit('/course/1/assignment/review/5');
  //   cy.getTestElement('grading-block').should('not.exist');
  //   cy.getTestElement('questions-block').should('not.exist');
  // });

  // it.skip('can edit assigned questions', () => {
  //   cy.getTestElement('edit-assigned-questions').click();
  //   cy.location('pathname').should('include', '/course/1/assignment/edit/homework/2/points');
  // });

  // it('hides overview and scores tabs if not reading or homework', () => {
  //   // Homework
  //   cy.wait('@taskPlan');
  //   cy.getTestElement('submission-overview-tab').should('exist');
  //   cy.getTestElement('assignment-scores-tab').should('exist');

  //   // Reading
  //   cy.visit('/course/1/assignment/review/1');
  //   cy.getTestElement('submission-overview-tab').should('exist');
  //   cy.getTestElement('assignment-scores-tab').should('exist');

  //   // External
  //   cy.visit('/course/1/assignment/review/3');
  //   cy.getTestElement('submission-overview-tab').should('not.exist');
  //   cy.getTestElement('assignment-scores-tab').should('not.exist');

  //   // Event
  //   cy.visit('/course/1/assignment/review/4');
  //   cy.getTestElement('submission-overview-tab').should('not.exist');
  //   cy.getTestElement('assignment-scores-tab').should('not.exist');
  // });

  // it('cannot deselect sections', () => {
  //   cy.wait('@taskPlan');
  //   cy.getTestElement('edit-assignment').click();
  //   cy.getTestElement('select-sections').click({ force: true });
  //   cy.getTestElement('tasking').first().find('[data-icon="check-square"]').first().trigger('mouseover')
  //   cy.get('[role="tooltip"]').contains('cannot withdraw')
  // });

  // it('should go directly to the submission overview tab', () => {
  //   cy.visit('/course/1/assignment/review/2/1?tab=1')
  //   cy.getTestElement('overview').should('exist');
  //   cy.getTestElement('student-free-responses').should('exist');
  // });

  // it.skip('should go directly to the assignment scores tab', () => {
  //   cy.visit('/course/1/assignment/review/2/1?tab=2')
  //   cy.getTestElement('scores').should('exist');
  // });

  // it('should hide the student names', () => {
  //   cy.visit('/course/1/assignment/review/2/1?tab=1')
  //   cy.getTestElement('names-toogle-button').should('exist');
  //   // names are shown first, so button label is "Hide student names"
  //   cy.getTestElement('names-toogle-button-text').should('have.text', 'Hide student names');
  //   cy.getTestElement('names-toogle-button').click({ force: true });
  //   cy.getTestElement('names-toogle-button-text').should('have.text', 'Show student names');
  //   // all names should be hidden
  //   cy.getTestElement('wrq-response-student-name').should(($name) => {
  //     expect($name).to.contain('Student response')
  //   })
  // });

});
