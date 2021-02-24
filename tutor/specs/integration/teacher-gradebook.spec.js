context('Teacher Gradebook', () => {

    const goToCourseGradebook = (courseId) => {
        cy.setRole('teacher')
        cy.visit(`/course/${courseId}/gradebook`)
        cy.disableTours();
    }

    it('loads and views grades', () => {
        goToCourseGradebook('1');
        cy.getTestElement('page-title').should('contain.text', 'Gradebook')
    });

    it('switches tabs', () => {
        goToCourseGradebook('1');
        cy.getTestElement('tabs', ' [role=tab]').last().click()
    })

    it('searches', () => {
        goToCourseGradebook('1');
        cy.getTestElement('search-by-name-input').clear().type('horse with no name')
        cy.get('[data-cell="student-name"]').should('not.exist')
        cy.getTestElement('search-by-name-input').clear()
        cy.get('[data-cell="student-name"]').should('exist')
    })

    it('sorts', () =>{
        goToCourseGradebook('1');
        cy.get('[data-purpose="sort"]').each(icon => {
            icon.click();
        })
    });

    it('sets preferences', () =>{
        goToCourseGradebook('1');
        cy.getTestElement('settings-btn').click();
        [
            'displayScoresAsPoints', 'arrangeColumnsByType','showDroppedStudents',
        ].forEach((pref) => {
            cy.getTestElement(`${pref}-checkbox`).click()
        })
    })

    it('shows no assignments message when there are no assignments due', () =>{
    // course with id 5 has no assignment headings
        goToCourseGradebook('5');
        cy.get('[data-test-id="gb-no-assignments-message"]').should('exist');
    })
})
