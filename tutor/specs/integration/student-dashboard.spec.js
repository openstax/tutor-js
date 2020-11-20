import { withScreenSizes } from './helpers'

const setupDashboard = () => {
  cy.setRole('student')
  cy.visit('/course/2');
  cy.disableTours();
}

context('Dashboard', () => {

  afterEach(() => {
    cy.setRole('teacher');
  })
  
  it('switches tabs', () => {
    setupDashboard();
    cy.getTestElement('all-past-work-tab').click()
  });

  it('loads assignments', () => {
    withScreenSizes(() => {
      setupDashboard();
      cy.getTestElement('all-past-work-tab').click()
      cy.get('.task.homework').first().click()
      cy.getTestElement('student-task').should('exist')
    })
  })
});
