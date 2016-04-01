Helpers = require '../helpers'
{describe} = Helpers

{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

describe 'Draft Tests', ->

  beforeEach ->
    @verifyDisplayed = (hasError) ->
      expect(hasError).to.be.true

    @calendar = new Helpers.Calendar(@)
    @title = @utils.getFreshId()
    new Helpers.User(@).login(TEACHER_USERNAME)
    # Go to the 1st courses dashboard
    new Helpers.CourseSelect(@).goToByType('ANY')
    @calendar.waitUntilLoaded()
    @calendar.createNew('READING')
    @reading = new Helpers.TaskBuilder(@)


  @it 'Shows Validation Error when saving a blank Reading, Homework, and External (idempotent)', ->
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @reading.hasError('ASSIGNMENT_NAME').then @verifyDisplayed
    @reading.hasRequiredHint('DUE_DATE').then @verifyDisplayed
    @reading.hasRequiredMessage('READINGS').then @verifyDisplayed
    @reading.edit(action: 'CANCEL')

    @calendar.createNew('HOMEWORK')
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @reading.hasError('ASSIGNMENT_NAME').then @verifyDisplayed
    @reading.hasRequiredHint('DUE_DATE').then @verifyDisplayed
    @reading.hasRequiredMessage('PROBLEMS').then @verifyDisplayed
    @reading.edit(action: 'CANCEL')


    @calendar.createNew('EXTERNAL')
    @reading.edit(action: 'SAVE')
    # Verify all the required fields display their message
    @reading.hasError('ASSIGNMENT_NAME').then @verifyDisplayed
    @reading.hasRequiredHint('DUE_DATE').then @verifyDisplayed
    @reading.hasError('EXTERNAL_URL').then @verifyDisplayed

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
    @calendar.goToOpenByTitle(@title)
    @reading.waitUntilLoaded()

    @reading.edit(action: 'DELETE')

    # Just verify we get back to the calendar
    @calendar.waitUntilLoaded()


  @it 'Creates a draft Reading checks and then unchecks some sections (idempotent)', ->
    # Check all the boxes, uncheck them & verify "Add Readings" is disabled
    @reading.edit
      name: @title
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    @calendar.goToOpenByTitle(@title)
    @reading.waitUntilLoaded()

    @reading.edit
      sections: [1.1, 1.2, 2.1, 3]
      verifyAddReadingsDisabled: true

    @reading.edit(action: 'DELETE')

    # Just verify we get back to the calendar
    @calendar.waitUntilLoaded()
