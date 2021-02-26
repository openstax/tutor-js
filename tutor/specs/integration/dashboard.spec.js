context('My Courses', () => {
    beforeEach(() => {
        cy.visit('/courses');
        cy.setRole('teacher')
    });

    it('hides value prop and displays cards', () => {
        cy.getTestElement('value-prop').find('button').click();
        cy.get('[data-is-preview=false][data-course-id]');
    });
});
