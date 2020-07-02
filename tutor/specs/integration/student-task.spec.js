context('Student Tasks', () => {

  beforeEach(() => {
    cy.setRole('student')
  });

  it('advances after answering a free-response only question', () => {
    cy.visit('/course/1/task/3') // task id 3 is a hardcoded WRM task
    cy.disableTours();
    cy.get('.icon-instructions').click()
    cy.getTestElement('homework-instructions').should('exist')
    cy.getTestElement('value-prop-continue-btn').click();
    cy.getTestElement('student-free-response').should('exist')
    cy.getTestElement('free-response-box').type('this is a answer answering and fully explaining my reasoning for the question')
    cy.getTestElement('submit-answer-btn').click()
    cy.location('pathname').should('contain', '/course/1/task/3/step')
  })

  it('can change and re-submit answers to questions', () => {
    cy.visit('/course/1/task/4')
    cy.get('.sticky-table [data-step-index=3]').click({ force: true })
    cy.get('.exercise-step').then(st => {
      const fr = st.find('[data-test-id="free-response-box"]')
      if (fr.length > 0){
        cy.wrap(fr).type('why do i need to fill this out?')
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('answer-choice-b').then( bt => {
      if (!bt.closest('.answer-checked').length) {
        cy.getTestElement('answer-choice-b').click()
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('continue-btn').click()
    cy.get('.sticky-table [data-step-index=4]').should('have.class', 'current-step')
    // go back and resubmit
    cy.get('.sticky-table [data-step-index=3]').click({ force: true })
    cy.get('.answer-checked [data-test-id="answer-choice-b"]').should('exist')

    cy.getTestElement('answer-choice-c').click()
    cy.get('.answer-checked [data-test-id="answer-choice-c"]').should('exist')
    cy.getTestElement('submit-answer-btn').click()
    cy.getTestElement('continue-btn').click()
  })
  
})
