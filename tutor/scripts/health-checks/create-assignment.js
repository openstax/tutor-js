import { range } from 'lodash'
import moment from 'moment'

context('Assignments', () => {
  it('can be created and then deleted', () => {
    cy.loginAccount();
    cy.disableTours();
    cy.selectOrCreateCourse('biology_2e');
    cy.get('.day.today .label').click()
    cy.get('#course-add-dropdown [data-assignment-type="homework"]').click()
    cy.getTestElement('edit-assignment-name').type(`${moment().format('YYYYMMDD-HH')} test homwork`)
    cy.get('.btn-primary').click()

    // TOC load

    cy.get('.chapter[data-is-expanded="true"] .chapter-checkbox').click()
    cy.checkLastRequestTime(/readings$/, 3, 'seconds')
    cy.get('.btn-primary').click()


    range(3).forEach(i => {
      cy.get('.exercise-card .controls-overlay .include').eq(i).click({ force: true })
    })

    // exercises load
    cy.checkLastRequestTime(/homework_core/, 3, 'seconds')
    
    cy.get('.btn-primary').click()

    cy.get('.heading').contains('Set points and review').should('exist')

    cy.get('.delete-assignment').click()
    cy.get('.settings-delete-assessment-modal .btn-danger').click()
  })

})
