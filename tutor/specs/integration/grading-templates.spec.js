context('Grading Templates', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.dismissTour();
    cy.getTestElement('course-card').first().click()
    cy.dismissLinksPrompt();
    cy.get('.sidebar-toggle:not(.open)').click();
    cy.getTestElement('grading-template-link').click();
  });

  it('renders cards and can edit', () => {
    cy.get('[data-type="reading"]').first().find('[data-icon=edit]').click();
    // TODO set name and a few other fields and click save
    // then verify that the card updates
  });


});
