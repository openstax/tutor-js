import { range } from 'lodash';

context('Dashboard', () => {
  const fillDetails = () => {
    cy.get('.heading').should('contain.text', 'STEP 1')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('input[name="title"]').type('test assignment #1')
    cy.get('.controls .btn-primary').should('not.be.disabled')
  }

  it('loads and advances homework', () => {
    cy.visit('/course/2/assignment/homework/new')
    cy.disableTours();

    fillDetails()

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 2')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('.chapter[data-is-expanded="false"]').first().click()
    cy.get('[data-chapter-section="2.2"]').click();
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 3')
    cy.get('.controls .btn-primary').should('be.disabled')
    range(3).map(i => cy.get('.openstax-exercise-preview').eq(i).find('.action.include').trigger('click', { force: true }))
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 4')
    cy.get('.openstax-exercise-preview').should('have.length', 3)


    cy.get('.openstax-exercise-preview').eq(1).then((preview) => {
      preview.find('.card-actions .move-up').click();

    })
  });

});
