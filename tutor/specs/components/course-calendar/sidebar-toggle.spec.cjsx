{React} = require '../helpers/component-testing'

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
