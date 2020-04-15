import expect from 'expect';

context('Grading Templates', () => {

  beforeEach(() => {
    cy.visit('/dashboard');
    cy.disableTours();
    cy.getTestElement('course-card').first().click();
    cy.get('.sidebar-toggle:not(.open)').click();
    cy.getTestElement('grading-template-link').click();
  });

  it('renders cards and can edit', () => {
    const card = () => cy.getTestElement('grading-template-card', '[data-type="reading"]').first()
    const editor = (selector) => cy.get(`.modal-dialog ${selector}`)

    card().find('[data-icon=edit]').click();
    editor('input[name="name"]').clear().type('updated from test');
    editor('input[name="correctness_weight"]').clear().type('80')
    editor('input[name="completion_weight"]')
      .should(el => expect(el.val()).toEqual('20')) // 100 - 80
      .clear().type('30')

    editor('input[name="correctness_weight"]')
      .should(el => expect(el.val()).toEqual('70'))

    editor('input[name="late_work_penalty_toggle"] + label').click();
    editor('[data-test-id="late-work-penalty"]').should('exist');

    editor('input[name="late_work_penalty_applied"][value="daily"]').click({ force: true });
    editor('#late_day_deduction').should('be.enabled');
    editor('#late_assignment_deduction').should('be.disabled');

    editor('input[name="late_work_penalty_applied"][value="immediately"]').click({ force: true });
    editor('#late_assignment_deduction').should('be.enabled');
    editor('#late_day_deduction').should('be.disabled');

    editor('input[name="late_work_penalty_applied"][value="never"] + label').click({ force: true });
    editor('[data-test-id="late-work-penalty"]').should('not.exist');

    editor('[name="default_due_date_offset_days"]').select('3');
    editor('[name="default_due_time_hour"]').select('10');
    editor('[name="default_due_time_minute"]').select('45');
    editor('[name="default_due_time_ampm"][value="pm"]').click({ force: true });

    cy.get('.modal-dialog .btn-primary').click();

    card().find('.card-header').should((title) => {
      expect(title.text()).toContain('updated from test');
    })

    card().find('.card-body').should(c => {
      const text = c.text();
      expect(text).toContain('Weight for correctness:70%')
      expect(text).toContain('Weight for completion:30%')
      expect(text).toContain('Due date for assignments:3 days')
      expect(text).toContain('Due time for assignments:10:45 PM')
    })

  });
});
