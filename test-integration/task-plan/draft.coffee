{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

describe 'Draft Tests', ->

  @before ->
    @verifyDisplayed = (css) =>
      @waitAnd(css: css)
      .isDisplayed().then (isDisplayed) ->
        expect(isDisplayed).to.be.true


  @it 'Shows Validation Error when saving a blank Reading, Homework, and External (idempotent)', ->
    @timeout 60 * 1000

    title = @freshId()

    @loginDev(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    Calendar.createNew(@, 'READING')
    ReadingBuilder.edit(@, action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error .required-hint')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.readings-required')
    ReadingBuilder.edit(@, action: 'CANCEL')

    Calendar.createNew(@, 'HOMEWORK')
    ReadingBuilder.edit(@, action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error .required-hint')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.problems-required')
    ReadingBuilder.edit(@, action: 'CANCEL')

    Calendar.createNew(@, 'EXTERNAL')
    ReadingBuilder.edit(@, action: 'SAVE')
    # Verify all the required fields display their message
    @verifyDisplayed('.assignment-name.has-error .required-hint')
    @verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    @verifyDisplayed('.external-url.has-error .required-hint')
    ReadingBuilder.edit(@, action: 'CANCEL')


  @it 'Deletes all drafts (not really a test but nice cleanup)', ->
    @timeout 10 * 60 * 1000

    @loginDev(TEACHER_USERNAME)
    CourseSelect.goTo(@, 'ANY')
    Calendar.verify(@)

    finishedCount = 0
    @driver.findElements(css: '.plan:not([data-isopen="true"])').then (plans) =>
      console.log 'plans count', plans.length if plans.length

      for i in [0...plans.length]
        @waitClick(css: '.plan:not([data-isopen="true"])')
        ReadingBuilder.edit(@, action: 'DELETE').then ->
          finishedCount += 1
          console.log 'Deleted', finishedCount
        Calendar.verify(@)


  @it 'Creates a draft Reading with opensAt to today and deletes (idempotent)', ->
    @timeout 2 * 60 * 1000

    title = @freshId()

    @loginDev(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    # Click to add a reading
    Calendar.createNew(@, 'READING')

    ReadingBuilder.edit @,
      name: title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    Calendar.goOpen(@, title)

    ReadingBuilder.edit(@, action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)



  @it 'Creates a draft Reading checks and then unchecks some sections (idempotent)', ->
    @timeout 2 * 60 * 1000

    title = @freshId()

    @loginDev(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    # Click to add a reading
    Calendar.createNew(@, 'READING')

    # Check all the boxes and then uncheck them & verify error message shows up
    ReadingBuilder.edit @,
      name: title
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    Calendar.goOpen(@, title)

    ReadingBuilder.edit @,
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    @verifyDisplayed('.readings-required')

    ReadingBuilder.edit(@, action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)
