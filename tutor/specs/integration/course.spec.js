context('Course', () => {
  beforeEach(() => {
    cy.visit('/course/1');
    cy.disableTours();
  });

  it('only displays Grade Answers button on Homework type', () => {
    cy.get('.event.type-external label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('.event.type-event label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('.event.type-reading label').first().click();
    cy.getTestElement('gradeAnswers').should('not.exist');
    cy.get('.modal-header .close').click();

    cy.get('.event.type-homework label').first().click();
    cy.getTestElement('gradeAnswers').should('exist');
    cy.get('.modal-header .close').click();

    // Check upcoming assignment
    cy.get('.upcoming .event.type-homework label').first().click();
    cy.getTestElement('gradeAnswers').should('exist').should('have.class', 'disabled');
    cy.get('.modal-header .close').click();

    // Check past due assignment
    cy.get('.past .event.type-homework label').first().click();
    cy.getTestElement('gradeAnswers').should('exist').should('not.have.class', 'disabled');
  });
});
