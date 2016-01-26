{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Assignment Publishing Tests', ->

  beforeEach ->
    @title = @freshId()

    @login(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    new CourseSelect(@).goTo('ANY')

    # I think the Calendar should return an instance of ReadingBuilder
    # when createNew('Reading') is called
    Calendar.createNew(@, 'READING')
    @reading = new ReadingBuilder(@)

  @it 'Sets the name of an reading', ->
    @reading.setName(@title)
    @reading.el.name.get().getAttribute('value').then (name) =>
      expect(name).to.equal(@title)

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
    Calendar.goOpen(@, @title)
    Calendar.Popup.goEdit(@)

    ReadingBuilder.edit(@, action: 'DELETE')

    Calendar.verify(@)
