context('My Practice Questions', () => {

  beforeEach(() => {
    cy.setRole('student')
  });

  it('should show empty message', () => {
    cy.visit('/course/3/practice-questions')
    cy.disableTours();
    cy.get('.empty-practice-questions-content .empty-practice-questions-header')
      .should('have.text', 'No questions have been saved for practice.');
    cy.getTestElement('save-practice-button').should('be.disabled');
    cy.getTestElement('save-practice-button')
      .should('have.text', 'Save to practice');
  })

  it('should list a question that is not available', () => {
    cy.visit('/course/2/practice-questions')
    cy.disableTours();
    cy.getTestElement('clear-practice-selection').should('exist');
    cy.getTestElement('start-practice').should('exist');
    cy.getTestElement('clear-practice-selection').should('be.disabled');
    cy.getTestElement('start-practice').should('be.disabled');
    cy.get('.card-body').should('exist');
    cy.get('.card-body').click({ force: true });
    cy.get('.card-body .disabled-message').should('be.visible');
    cy.get('.card-body .disable-message').should('have.text', 'This question can be practiced after it has been graded');
  })

  it.only('should list a question that is available', () => {
    cy.visit('/course/1/practice-questions')
    cy.disableTours();
    cy.getTestElement('clear-practice-selection').should('exist');
    cy.getTestElement('start-practice').should('exist');
    cy.getTestElement('clear-practice-selection').should('be.disabled');
    cy.getTestElement('start-practice').should('be.disabled');
    cy.get('.card-body').should('exist');
    cy.get('.card-body .controls-overlay').should('exist');
    //when user includes a question
    cy.get('.action.include').click({ force: true });
    cy.get('.selected-mask').should('exist');
    cy.getTestElement('clear-practice-selection').should('be.enabled');
    cy.getTestElement('start-practice').should('be.enabled');
    //when user excludes the question
    cy.get('.action.exclude').click({ force: true });
    cy.get('.selected-mask').should('not.exist');
    cy.getTestElement('clear-practice-selection').should('be.disabled');
    cy.getTestElement('start-practice').should('be.disabled');
    //when user includes a question and clicks on 'clear selection' button
    cy.get('.action.include').click({ force: true });
    cy.getTestElement('clear-practice-selection').click();
    cy.get('.selected-mask').should('not.exist');
    cy.getTestElement('clear-practice-selection').should('be.disabled');
    cy.getTestElement('start-practice').should('be.disabled');
  })
})
