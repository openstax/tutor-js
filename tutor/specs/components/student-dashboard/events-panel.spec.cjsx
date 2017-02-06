React = require 'react'
SnapShot = require 'react-test-renderer'
_ = require 'lodash'

MOCK_DASHBOARD_RESPONSE = require '../../../api/courses/1/dashboard'
EventsPanel = require '../../../src/components/student-dashboard/events-panel'


describe 'EventsPanel', ->

  beforeEach ->

    @props =
      events: MOCK_DASHBOARD_RESPONSE.tasks
      courseId: '1'
      isCollege: false

  # currently this fails on Travis due to timezone differences.
  # we will need to fix this.
  xit 'renders with events', ->
    wrapper = shallow(<EventsPanel {...@props} />)
    expect(SnapShot.create(<EventsPanel {...@props} />).toJSON()).toMatchSnapshot()
    undefined

  it 'renders with events as named', ->
    wrapper = mount(<EventsPanel {...@props} />)
    renderedTitles = wrapper.find('.title').map((item) -> item.text())
    mockTitles = _.map(MOCK_DASHBOARD_RESPONSE.tasks, 'title')
    expect(renderedTitles).to.deep.equal(mockTitles)
    undefined

  it 'renders late only for homework when isCollege is false', ->
    wrapper = mount(<EventsPanel {...@props} />)
    mockHomeworkTasks = _.filter(MOCK_DASHBOARD_RESPONSE.tasks, {type: 'homework', complete: false})
    expect(wrapper.find('.late').length).to.equal(mockHomeworkTasks.length)
    undefined

  it 'renders late only for all tasks when isCollege is true', ->
    @props.isCollege = true
    wrapper = mount(<EventsPanel {...@props} />)
    mockTasks = _.filter(MOCK_DASHBOARD_RESPONSE.tasks, complete: false)
    expect(wrapper.find('.late').length).to.equal(mockTasks.length)
    undefined
