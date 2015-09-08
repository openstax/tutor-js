{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Assignment Publishing Tests', ->

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
    # Then, open the popup, click edit, and delete the assignment
    # BUG: .course-list shouldn't be in the DOM
    Calendar.goOpen(@, title)
    Calendar.Popup.goEdit(@)

    ReadingBuilder.edit(@, action: 'DELETE')

    Calendar.verify(@)
