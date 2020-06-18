context('Teacher Gradebook', () => {

  beforeEach(() => {
    cy.setRole('teacher')
    cy.visit('/course/1/gradebook')
    cy.disableTours();
  });

  it('loads and views grades', () => {
    cy.getTestElement('page-title').should('contain.text', 'Gradebook')
  });

  it('switches tabs', () => {
    cy.getTestElement('tabs', ' [role=tab]').last().click()
  })

  it('searches', () => {
    cy.getTestElement('search-by-name-input').clear().type('horse with no name')
    cy.get('[data-cell="student-name"]').should('not.exist')
    cy.getTestElement('search-by-name-input').clear()
    cy.get('[data-cell="student-name"]').should('exist')
  })

  it('sorts', () =>{
    cy.get('[data-purpose="sort"]').each(icon => {
      icon.click();
    })
  });

  it('sets preferences', () =>{
    cy.getTestElement('settings-btn').click();
    [
      'displayScoresAsPoints', 'arrangeColumnsByType','showDroppedStudents',
    ].forEach((pref) => {
      cy.getTestElement(`${pref}-checkbox`).click()
    })
  })
})
