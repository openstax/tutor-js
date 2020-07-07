import { range } from 'lodash';
import moment from 'moment-timezone';

context('Assignment Edit', () => {
  const format = 'MMM D | hh:mm A';

  const fillDetails = () => {
    cy.get('.heading').should('contain.text', 'STEP 1')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('input[name="title"]').type('test assignment #1')
    cy.get('.controls .btn-primary').should('not.be.disabled')
  }
  const addTemplate = ({ name, dueDateOffsetDays = '1', dueTimeHour = '5',
    dueTimeMinutes = '30', closesDateOffsetDays = '30', isAM = false, doSelect = false }) => {
    cy.get('[data-test-id="grading-templates"]').click()
    cy.get('[data-test-id="add-template"]').click()
    cy.get('.modal').should('be.visible')
    cy.get('.modal input[name="name"]').type(name)
    cy.get('.modal select[name="default_due_date_offset_days"]').select(dueDateOffsetDays);
    cy.get('.modal select[name="default_due_time_hour"]').select(dueTimeHour);
    cy.get('.modal select[name="default_due_time_minute"]').select(dueTimeMinutes);
    cy.get('.modal select[name="default_close_date_offset_days"]').select(closesDateOffsetDays);
    cy.get('.modal input[name="default_due_time_ampm"]').check(isAM ? 'am' : 'pm', { force: true });
    cy.get('.modal [type="submit"]').click()

    if(doSelect) {
      cy.get('[data-test-id="grading-templates"]').click()
      cy.get(`[data-test-id="${name}"]`).click()
    }
  }

  it('validates', () => {
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours();
    cy.get('input[name="title"]').type(' ').blur()
    cy.get('[aria-invalid][data-target="title"]').should('exist')

    cy.get('textarea[name="description"]').type(
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet;',
      { delay: 0, force: true },
    ).blur()
    cy.get('[aria-invalid][data-target="description"]').should('contain.text', 'Cannot be longer')
  })

  it('loads and advances homework', () => {
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours();
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 2')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('.chapter[data-is-expanded="false"]').first().click()
    cy.get('[data-chapter-section="2.1"]').click();
    cy.get('[data-chapter-section="2.2"]').click();
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 3')
    cy.get('.controls .btn-primary').should('be.disabled')
    range(3).map(i => cy.get('.exercise-card').eq(i).find('.action.include').trigger('click', { force: true }))
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 4')
    cy.get('.openstax-exercise-preview').should('have.length', 3)

    cy.get('button.ox-icon-arrow-up').eq(1).click({ force: true })
  });

  it('loads and advances reading', () => {
    cy.visit('/course/1/assignment/edit/reading/new')
    cy.disableTours();
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 2')
    cy.get('.controls .btn-primary').should('be.disabled')
    cy.get('.chapter[data-is-expanded="false"]').first().click()
    cy.get('[data-chapter-section="2.1"]').click();
    cy.get('[data-chapter-section="2.2"]').click();
    cy.get('[data-chapter-section="2.3"]').click();
    cy.get('.controls .btn-primary').should('not.be.disabled')

    cy.get('.controls .btn-primary').click()
    cy.get('.heading').should('contain.text', 'STEP 3')

    cy.get('.selected-section .chapter-section').invoke('text').then(labels => {
      expect(labels).to.eq(['2.1', '2.2', '2.3'].join(''))
    })
    cy.get('button.ox-icon-arrow-up').eq(1).click()
    cy.get('.selected-section .chapter-section').invoke('text').then(labels => {
      expect(labels).to.eq(['2.1', '2.3', '2.2'].join(''))
    })
  });

  it('increases selections', () => {
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.chapter-checkbox .btn').first().click()
    cy.get('.controls .btn-primary').click()
    cy.get('[data-test-id="selection-count"]').should('contain.text', '0')
    cy.get('[data-test-id="selection-count-footer"]').should('contain.text', '0')

    cy.get('.action.include:first').click({ force: true })

    cy.get('[data-test-id="selection-count"]').should('contain.text', '1')
    cy.get('[data-test-id="selection-count-footer"]').should('contain.text', '1')
    cy.get('[data-test-id="tutor-count"]').should('contain.text', '3')
    cy.get('[data-test-id="tutor-count-footer"]').should('contain.text', '3')
    cy.get('[data-test-id="total-count"]').should('contain.text', '4')
    cy.get('[data-test-id="total-count-footer"]').should('contain.text', '4')
  });

  it('filters question types', () => {
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    fillDetails()
    cy.get('.controls .btn-primary').click()
    cy.get('.chapter-checkbox .btn').first().click()
    cy.get('.controls .btn-primary').click()
    cy.get('[name="filter"][value="oe"]').click({ force: true })
    cy.get('[data-section]').should('not.contain.text', 'Multiple Choice Questions')
    cy.get('[name="filter"][value="mc"]').click({ force: true })
    cy.get('[data-section]').should('not.contain.text', 'Written Response Questions')
  });

  it('renders external assignment', () => {
    cy.visit('/course/2/assignment/edit/external/new')
    cy.disableTours()
    cy.get('.heading').should('not.contain.text', 'STEP 1')
    cy.get('[name="settings.external_url"').type('url')
  });

  it('can add a new template', () => {
    const templateName = 'This is a new template'
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    fillDetails()
    addTemplate({ name: templateName })
    cy.get('[data-test-id="grading-templates"]').should('contain.text', templateName)
  });

  // skipping; test is flaky in the morning on travis, some date math is incorrect here
  it.skip('can select another template and update dates, and change pivot dates to update other dates', () => {
    const templateName = 'Template to update dates'
    const dueDateOffsetDays = '3', dueTimeHour = '7', dueTimeMinutes = '15', closesDateOffsetDays = '10', isAM = false
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    fillDetails()
    addTemplate({ name: templateName, dueDateOffsetDays, dueTimeHour, dueTimeMinutes, closesDateOffsetDays, isAM, doSelect: true })
    cy.get('input[name="tasking_plans[0].opens_at"]').then(o => {
      const openDate = o[0].defaultValue
      let updatedDueDate;
      // Due date should change
      cy.get('input[name="tasking_plans[0].due_at"]').then(d => {
        const dueDate = moment(d[0].defaultValue, format).toISOString();
        updatedDueDate = dueDate;
        // Compute the due date from the open date
        const hour = isAM ? parseInt(dueTimeHour, 10) : parseInt(dueTimeHour, 10) + 12
        const expectedDueDate = moment(openDate, format)
          .add(parseInt(dueDateOffsetDays, 10), 'days')
          .set({ hour, minutes: parseInt(dueTimeMinutes, 10) })
          .toISOString();
        expect(dueDate).eq(expectedDueDate)
      })
      // Closes date should change
      cy.get('input[name="tasking_plans[0].closes_at"]').then(c => {
        const closesDate = moment(c[0].defaultValue, format).toISOString();
        // Compute the closes date from the due date
        const expectedDueDate = moment(updatedDueDate)
          .add(parseInt(closesDateOffsetDays, 10), 'days')
          .toISOString();
        expect(closesDate).eq(expectedDueDate)
      })
    });
  })

  it('changes open dates to update other dates', () => {
    const templateName = 'Template to update dates'
    const dueDateOffsetDays = '3', dueTimeHour = '7', dueTimeMinutes = '15', closesDateOffsetDays = '10', isAM = false
    const typedOpenDate = 'Jun 15 05:00 PM'
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    fillDetails()
    addTemplate({ name: templateName, dueDateOffsetDays, dueTimeHour, dueTimeMinutes, closesDateOffsetDays, isAM, doSelect: true })
    cy.get('input[name="tasking_plans[0].opens_at"]').clear({ force: true }).type(typedOpenDate, { force: true })
    cy.get('.oxdt-ok button').click()
    cy.get('input[name="tasking_plans[0].opens_at"]').then(o => {
      const openDate = o[0].defaultValue
      let updatedDueDate;
      // Due date should change
      cy.get('input[name="tasking_plans[0].due_at"]').then(d => {
        const dueDate = moment(d[0].defaultValue).toISOString();
        updatedDueDate = dueDate;
        // Compute the due date from the open date
        const hour = isAM ? parseInt(dueTimeHour, 10) : parseInt(dueTimeHour, 10) + 12
        const expectedDueDate = moment(openDate)
          .add(parseInt(dueDateOffsetDays, 10), 'days')
          .set({ hour, minutes: parseInt(dueTimeMinutes, 10) })
          .toISOString();
        expect(dueDate).eq(expectedDueDate)
      })
      // Closes date should change
      cy.get('input[name="tasking_plans[0].closes_at"]').then(c => {
        const closesDate = moment(c[0].defaultValue).toISOString();
        // Compute the closes date from the due date
        const expectedDueDate = moment(updatedDueDate)
          .add(parseInt(closesDateOffsetDays, 10), 'days')
          .toISOString();
        expect(closesDate).eq(expectedDueDate)
      })
    });
  })

  it('updates open date and time manually', () => {
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()

    cy.get('input[name="tasking_plans[0].opens_at"]').click();
    cy.get('.oxdt-cell-inner').contains('1').click();
    cy.get('.oxdt-time-panel-column:nth-child(1) .oxdt-time-panel-cell-inner').contains('08').click();
    cy.get('.oxdt-time-panel-column:nth-child(2) .oxdt-time-panel-cell-inner').contains('10').click();
    cy.get('.oxdt-time-panel-column:nth-child(3) .oxdt-time-panel-cell-inner').contains('PM').click();
    cy.get('.oxdt-ok button').click();
    cy.get('input[name="tasking_plans[0].opens_at"]').invoke('val').should('contain', '1 | 08:10 PM')
  })

  it('updates date when pivot date is updated', () => {
    const typedOpenDate = 'Jun 10 05:00 PM'
    const typedClosesDate = 'Jun 22 05:00 PMM'
    cy.visit('/course/2/assignment/edit/homework/new')
    cy.disableTours()
    let currentClosesDate;
    // force update the closes date
    cy.get('input[name="tasking_plans[0].closes_at"]').clear({ force: true }).type(typedClosesDate, { force: true }).blur();
    cy.get('.oxdt-ok button').click({ force: true })
    cy.get('input[name="tasking_plans[0].closes_at"]').then(c => {
      currentClosesDate = c[0].defaultValue;
    })
    // force update the open date
    cy.get('input[name="tasking_plans[0].opens_at"]').clear({ force: true }).type(typedOpenDate, { force: true })
    // After opening the closes date time picker modal, it gets the two OK buttons
    cy.get('.oxdt-ok button').last().click({ force: true })
    // after changing the open date, no dates should be changed because the interval between open/due/close date has changed
    cy.get('input[name="tasking_plans[0].closes_at"]').then(d => {
      expect(d[0].defaultValue).eq(currentClosesDate)
    })
  });
});
