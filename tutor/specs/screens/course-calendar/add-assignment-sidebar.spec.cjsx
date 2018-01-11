last = require 'lodash/last'

jest.mock('../../../src/screens/teacher-dashboard/helper')
Helper = require '../../../src/screens/teacher-dashboard/helper'
Sidebar = require '../../../src/screens/teacher-dashboard/add-assignment-sidebar'
EnzymeContext = require '../../components/helpers/enzyme-context'

describe 'CourseCalendar AddAssignmentMenu', ->

  beforeEach ->

    @props =
      courseId: '1'
      onSidebarToggle: sinon.spy()
      isOpen: false
      shouldIntro: false
      hasPeriods: true

  it 'renders with style for periods', ->
    wrapper = mount(<Sidebar {...@props} />, EnzymeContext.withDnD())
    links = wrapper.find('.new-assignments li').map (el) -> el.render().text()
    expect(links).to.deep.equal([
      'Add Reading', 'Add Homework', 'Add External Assignment', 'Add Event'
    ])
    undefined


  it 'set state as events are called', ->
    wrapper = mount(<Sidebar {...@props} />, EnzymeContext.withDnD())
    expect(Helper.scheduleIntroEvent).not.toHaveBeenCalled()
    wrapper.setState(willShowIntro: true)
    wrapper.setProps(isOpen: true)
    expect(Helper.scheduleIntroEvent).toHaveBeenCalled()
    expect(wrapper.state('showIntro')).to.be.undefined
    last(Helper.scheduleIntroEvent.mock.calls)[0]()
    expect(wrapper.state('showIntro')).to.be.true
    last(Helper.scheduleIntroEvent.mock.calls)[0]()
    expect(wrapper.state('showPopover')).to.be.true
    wrapper.unmount()
    # nothing pending, so no clear call
    expect(Helper.clearScheduledEvent).toHaveBeenCalledWith(false)
    undefined

  it 'clears timeout on unmount', ->
    Helper.scheduleIntroEvent.mockReturnValueOnce('one')
    wrapper = mount(<Sidebar {...@props} />, EnzymeContext.withDnD())
    wrapper.setState(willShowIntro: true)
    wrapper.setProps(isOpen: true)
    expect(Helper.scheduleIntroEvent).toHaveBeenCalled()
    wrapper.unmount()
    expect(Helper.clearScheduledEvent).toHaveBeenCalledWith('one')
    undefined
