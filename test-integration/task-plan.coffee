{describe, CourseSelect, Calendar, ReadingBuilder} = require './helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Assignment Creation Tests', ->

  @it 'Shows Validation Error when saving a blank Reading', ->
    @timeout 60 * 1000

    title = @freshId()

    verifyDisplayed = (css) =>
      @waitAnd(css: css)
      .isDisplayed().then (isDisplayed) ->
        expect(isDisplayed).to.be.true


    @loginDev(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    Calendar.createNew(@, 'READING')

    ReadingBuilder.edit(@, action: 'SAVE')

    # Verify all the required fields display their message
    verifyDisplayed('.assignment-name.has-error .required-hint')
    verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    verifyDisplayed('.readings-required')



  @it 'Shows Validation Error when saving a blank Homework', ->
    @timeout 60 * 1000

    title = @freshId()

    verifyDisplayed = (css) =>
      @waitAnd(css: css)
      .isDisplayed().then (isDisplayed) ->
        expect(isDisplayed).to.be.true

    @loginDev(TEACHER_USERNAME)
    CourseSelect.goTo(@, 'ANY')
    Calendar.createNew(@, 'HOMEWORK')
    ReadingBuilder.edit(@, action: 'SAVE')

    # Verify all the required fields display their message
    verifyDisplayed('.assignment-name.has-error .required-hint')
    verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    verifyDisplayed('.problems-required')



  @it 'Shows Validation Error when saving a blank External', ->
    @timeout 60 * 1000

    title = @freshId()

    verifyDisplayed = (css) =>
      @waitAnd(css: css)
      .isDisplayed().then (isDisplayed) ->
        expect(isDisplayed).to.be.true

    @loginDev(TEACHER_USERNAME)
    CourseSelect.goTo(@, 'ANY')
    Calendar.createNew(@, 'EXTERNAL')
    ReadingBuilder.edit(@, action: 'SAVE')

    # Verify all the required fields display their message
    verifyDisplayed('.assignment-name.has-error .required-hint')
    verifyDisplayed('.-assignment-due-date .form-control.empty ~ .required-hint')
    verifyDisplayed('.external-url.has-error .required-hint')


  @it 'Creates a draft Reading with opensAt to today and deletes', ->
    @timeout 2 * 60 * 1000

    # @screenshot('debugging-snapshot.png')

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
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    Calendar.open(@, title)

    ReadingBuilder.edit(@, action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)


  @it 'Publishes a Reading with opensAt to tomorrow and deletes', ->
    @timeout 10 * 60 * 1000 # ~4min to publish a draft (plus mathjax CDN)

    title = @freshId()

    @loginDev(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    Calendar.createNew(@, 'READING')

    ReadingBuilder.edit @,
      name: title
      opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.2]
      action: 'PUBLISH'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    Calendar.open(@, title)

    # Since the Assignment has not been opened yet there is no "Edit Assignment"
    @waitAnd(css: '.-edit-assignment, .reading-plan')
    # If there is a popup then click the "Edit" button
    @driver.isElementPresent(css: '.-edit-assignment').then (isPresent) =>
      if isPresent
        @waitClick(css: '.-edit-assignment')

    ReadingBuilder.edit(@, action: 'DELETE')

    Calendar.verify(@)
