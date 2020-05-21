context('Student Gradebook', () => {

  beforeEach(() => {
    cy.visit('/course/1/gradebook')
    cy.disableTours();
  });

})
