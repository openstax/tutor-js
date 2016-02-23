
Helpers = require '../helpers'
{describe} = Helpers

{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'

describe 'Assignment Publishing Tests', ->

  beforeEach ->
    @calendar = new Helpers.Calendar(@)
    @reading = new Helpers.TaskPlanBuilder(@)

    @title = @utils.getFreshId()
    new Helpers.User(@).login(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    new Helpers.CourseSelect(@).goTo('ANY')

    @calendar.createNew('READING')


  @it 'Sets the name of an reading', ->
    @reading.setName(@title)
    @reading.getNameValue().then (name) =>
      expect(name).to.equal(@title)
    @reading.edit(action: 'CANCEL')

  @it 'Publishes a Reading with opensAt to tomorrow and deletes (idempotent)', ->
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
