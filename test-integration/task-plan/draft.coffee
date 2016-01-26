{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

describe 'Draft Tests', ->

  @before ->
    @verifyDisplayed = (css) =>
      @waitAnd(css: css).isDisplayed().then (isDisplayed) -> expect(isDisplayed).to.be.true

  beforeEach ->
    @title = @freshId()
    @login(TEACHER_USERNAME)
    # Go to the 1st courses dashboard
    new CourseSelect(@).goTo('ANY')
    Calendar.createNew(@, 'READING')
    @reading = new ReadingBuilder(@)


  @it 'Shows Validation Error when saving a blank Reading, Homework, and External (idempotent)', ->
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.readings-required')
    @reading.edit(action: 'CANCEL')

    Calendar.createNew(@, 'HOMEWORK')
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.problems-required')
    @reading.edit(action: 'CANCEL')


    Calendar.createNew(@, 'EXTERNAL')
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.external-url.has-error')
    @reading.edit(action: 'CANCEL')


  @it 'Creates a draft Reading with opensAt to today and deletes (idempotent)', ->

    @reading.edit
      name: @title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    Calendar.goOpen(@, @title)

    @reading.edit(action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)



  @it 'Creates a draft Reading checks and then unchecks some sections (idempotent)', ->
    @addTimeout(2 * 60)

    # Check all the boxes, uncheck them & verify "Add Readings" is disabled
    @reading.edit
      name: @title
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    Calendar.goOpen(@, @title)

    @reading.edit
      sections: [1.1, 1.2, 2.1, 3]
      verifyAddReadingsDisabled: true

    @reading.edit(action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)
