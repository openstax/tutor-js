context('Dashboard', () => {
    beforeEach(() => {
        cy.visit('/dashboard');
        cy.setRole('teacher')
    });

    it('hides value prop and displays cards', () => {
        cy.getTestElement('value-prop').find('button').click();
        cy.get('[data-is-preview=false][data-course-id]');
    });
});
