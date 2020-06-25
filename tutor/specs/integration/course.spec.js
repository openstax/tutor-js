context('Course', () => {
  beforeEach(() => {
    cy.visit('/course/1');
    cy.disableTours();
    cy.setRole('teacher')
  });

  // disabled until BE has grade counts on taskings
  it.skip('only displays Grade Answers button on Homework type', () => {
    cy.get('.event.type-external label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('.event.type-event label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('.event.type-reading label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('[data-assignment-type="homework"].is-published').first().then(el => {
      cy.window().then(win => {
        const planId = el[0].dataset.planId
        const course = win._MODELS.courses.get(1)
        // make plan need grading
        course.teacherTaskPlans.get(planId).ungraded_step_count = 12
        el.click()
        cy.getTestElement('gradeAnswers').should('exist');
        cy.get('.modal-header .close').click();
      })
    })
  });
});
