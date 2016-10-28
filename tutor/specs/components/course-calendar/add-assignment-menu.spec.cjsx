{React, shallow, sinon} = require '../helpers/component-testing'

AddAssignmentMenu = require '../../../src/components/course-calendar/add-assignment-menu'

describe 'CourseCalendar AddAssignmentMenu', ->

  beforeEach ->
    @props =
      courseId: '1'
      onSidebarToggle: sinon.spy()
      hasPeriods: true
    @context =
      router: {}

  it 'renders with style for periods', ->
    wrapper = shallow(<AddAssignmentMenu {...@props} />, {context: @context})
    expect(wrapper.is('[bsStyle="primary"]')).to.be.true
    wrapper.setProps(hasPeriods: false)
    expect(wrapper.is('[bsStyle="primary"]')).to.be.false
    expect(wrapper.is('[bsStyle="default"]')).to.be.true
    undefined
