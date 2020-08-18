context('Student Tasks', () => {

  beforeEach(() => {
    cy.viewport(1200, 720)
    cy.setRole('student')
  });

  // eslint-disable-next-line
  const submitAnswer = () => {
    cy.get('.exercise-step').then(st => {
      const fr = st.find('[data-test-id="free-response-box"]')
      if (fr.length > 0) {
        cy.wrap(fr).type('this is a answer answering and fully explaining my reasoning for the question')
        cy.getTestElement('submit-answer-btn').click()
      }
    })
    cy.getTestElement('answer-choice-a').click()
    cy.getTestElement('submit-answer-btn').click()
    cy.getTestElement('continue-btn').click()

  }

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
    cy.visit('/course/1/task/2')
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
  
  it('should show late clock icon and the late points info, if task step is late', () => {
    cy.visit('/course/1/task/4')
    cy.get('[data-test-id="late-icon"]').should('exist')
    cy.get('.isLateCell').first().trigger('mouseover').then(() => {
      cy.get('[data-test-id="late-info-points-table"]').should('exist')
    })
  })

  it('deals with steps being removed', () => {
    const taskId = 8
    cy.visit(`/course/1/task/${taskId}`)
    // FIXME - this has infinite loop and eventually crashes cypress
    
    // cy.get('.task-homework').then(card => {
    //   let btn = card.find('[data-test-id="value-prop-continue-btn"]')
    //   while(btn.length > 0) {
    //     cy.wrap(btn).click()
    //     btn = card.find('[data-test-id="value-prop-continue-btn"]')
    //   }
    // })
    //    submitAnswer()

    // cy.window().then(win => {
    //   win._MODELS.courses.get(1).studentTasks.get(taskId).steps[3].type = 'placeholder'
    // })
    // range(2).forEach(submitAnswer)
    // cy.getTestElement('individual-review-intro-value-prop').should('exist')
    // cy.getTestElement('value-prop-continue-btn').click()
    // cy.get('.exercise-step').should('exist')
  })
})
