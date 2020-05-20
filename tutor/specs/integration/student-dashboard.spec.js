context('Dashboard', () => {
  beforeEach(() => {
    cy.setRole('student')
    cy.visit('/course/2');
    cy.disableTours();
  });

  afterEach(() => {
    cy.setRole('teacher');
  })
  
  it('switches tabs', () => {
    cy.getTestElement('all-past-work-tab').click()

  });
});
