{React} = require '../helpers/component-testing'

jest.mock('../../../src/components/course-calendar/helper')
Helper = require '../../../src/components/course-calendar/helper'

Toggle = require '../../../src/components/course-calendar/sidebar-toggle'

describe 'CourseCalendar Sidebar Toggle', ->

  beforeEach ->
    @props =
      onToggle: sinon.spy()

  it 'renders and toggles', ->
    wrapper = shallow(<Toggle {...@props} />)
    expect(wrapper.hasClass('open')).to.equal false
    wrapper.simulate('click')
    expect(wrapper.hasClass('open')).to.equal true
    expect(@props.onToggle).to.have.been.calledWith(true)
    undefined

  it 'schedules and then clears timeout on unmount', ->
    Helper.scheduleIntroEvent.mockReturnValueOnce(42)
    wrapper = shallow(<Toggle {...@props} />)
    expect(Helper.scheduleIntroEvent).toHaveBeenCalled()
    wrapper.unmount()
    expect(Helper.clearScheduledEvent).toHaveBeenCalledWith(42)
    undefined
