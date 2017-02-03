React = require 'react'
SnapShot = require 'react-test-renderer'


MOCK_DASHBOARD_RESPONSE = require '../../../api/courses/1/dashboard'
EventsPanel = require '../../../src/components/student-dashboard/events-panel'


describe 'EventsPanel', ->

  beforeEach ->

    @props =
      events: MOCK_DASHBOARD_RESPONSE.tasks
      courseId: '1'
      isCollege: false

  it 'renders with events', ->
    wrapper = shallow(<EventsPanel {...@props} />)
    expect(SnapShot.create(<EventsPanel {...@props} />).toJSON()).toMatchSnapshot()
    undefined
