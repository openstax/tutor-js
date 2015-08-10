{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Assignment Creation Tests', ->

  @it 'Publishes a Reading with opensAt to tomorrow and deletes (idempotent)', ->
    title = @freshId()

    @login(TEACHER_USERNAME)

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
    Calendar.goOpen(@, title)

    # Since the Assignment has not been opened yet there is no "Edit Assignment"
    @waitAnd(css: '.-edit-assignment, .reading-plan')
    # If there is a popup then click the "Edit" button
    @driver.isElementPresent(css: '.-edit-assignment').then (isPresent) =>
      if isPresent
        @waitClick(css: '.-edit-assignment')

    ReadingBuilder.edit(@, action: 'DELETE')

    Calendar.verify(@)
