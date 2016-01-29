{describe, CourseSelect, User, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} =  Calendar

describe 'Assignment Publishing Tests', ->

  beforeEach ->
    @title = @utils.getFreshId()
    new User(@).login(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    new CourseSelect(@).goTo('ANY')

    @calendar = new CalendarHelper(@)
    @calendar.createNew('READING')

    @reading = new ReadingBuilder(@)

  @it 'Sets the name of an reading', ->
    @reading.setName(@title)
    @reading.getNameValue().then (name) =>
      expect(name).to.equal(@title)
    @reading.edit(action: 'CANCEL')

  @it 'Publishes a Reading with opensAt to tomorrow and deletes (idempotent)', ->
    @addTimeout(120)
    @reading.edit(
      name: @title
      opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.2]
      action: 'PUBLISH'
    )
    # Wait until the Calendar loads back up
    # Then, open the popup, click edit, and delete the assignment
    # BUG: .course-list shouldn't be in the DOM
    @calendar.goOpen(@title)
    @calendar.el.planPopup.goEdit()
    @reading.edit(action: 'DELETE')
    @calendar.waitUntilLoaded()
