{React} = require '../helpers/component-testing'

Sidebar = require '../../../src/components/course-calendar/add-assignment-sidebar'

EnzymeContext = require '../helpers/enzyme-context'

describe 'CourseCalendar AddAssignmentMenu', ->

  beforeEach ->

    @props =
      courseId: '1'
      onSidebarToggle: sinon.spy()
      hasPeriods: true

  it 'renders with style for periods', ->
    wrapper = mount(<Sidebar {...@props} />, EnzymeContext.withDnD())
    links = wrapper.find('.new-assignments li').map (el) -> el.render().text()
    expect(links).to.deep.equal([
      'Add Reading', 'Add Homework', 'Add External Assignment', 'Add Event'
    ])
    undefined
