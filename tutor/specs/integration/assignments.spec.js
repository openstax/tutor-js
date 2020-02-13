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
    cy.get('[data-chapter-section="2.1"]').click();
    cy.get('[data-chapter-section="2.2"]').click();
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 3')
    cy.get('.controls .btn-primary').should('be.disabled')
    range(3).map(i => cy.get('.exercise-card').eq(i).find('.action.include').trigger('click', { force: true }))
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 4')
    cy.get('.exercise-card').should('have.length', 3)

    cy.get('button.ox-icon-arrow-up').eq(1).click()
  });

  it('loads and advances reading', () => {
    cy.visit('/course/1/assignment/reading/new')
    cy.disableTours();
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 2')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('.chapter[data-is-expanded="false"]').first().click()
    cy.get('[data-chapter-section="2.1"]').click();
    cy.get('[data-chapter-section="2.2"]').click();
    cy.get('[data-chapter-section="2.3"]').click();
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 3')

    cy.get('.selected-section .chapter-section').invoke('text').then(labels => {
      expect(labels).to.eq(['2.1', '2.2', '2.3'].join(''))
    })
    cy.get('button.ox-icon-arrow-up').eq(1).click()
    cy.get('.selected-section .chapter-section').invoke('text').then(labels => {
      expect(labels).to.eq(['2.1', '2.3', '2.2'].join(''))
    })
  });

  it('increases selections', () => {
    cy.visit('/course/2/assignment/homework/new')
    cy.disableTours()
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.chapter-checkbox .btn').first().click()
    cy.get('.controls .btn-primary').click()
    cy.get('[data-test-id="selection-count"]').should('contain.text', '0')
    cy.get('[data-test-id="selection-count-footer"]').should('contain.text', '0')

    cy.get('.action.include:first').click({ force: true })

    cy.get('[data-test-id="selection-count"]').should('contain.text', '1')
    cy.get('[data-test-id="selection-count-footer"]').should('contain.text', '1')
    cy.get('[data-test-id="tutor-count"]').should('contain.text', '3')
    cy.get('[data-test-id="tutor-count-footer"]').should('contain.text', '3')
    cy.get('[data-test-id="total-count"]').should('contain.text', '4')
    cy.get('[data-test-id="total-count-footer"]').should('contain.text', '4')
  });

  it('filters question types', () => {
    cy.visit('/course/2/assignment/homework/new')
    cy.disableTours()
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.chapter-checkbox .btn').first().click()
    cy.get('.controls .btn-primary').click()
    cy.get('[name="filter"][value="oe"]').click({ force: true })
    cy.get('[data-section]').should('not.contain.text', 'Multiple Choice Questions')
    cy.get('[name="filter"][value="mc"]').click({ force: true })
    cy.get('[data-section]').should('not.contain.text', 'Written Response Questions')
  });

});
