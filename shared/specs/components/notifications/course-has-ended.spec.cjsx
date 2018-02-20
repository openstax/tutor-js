React = require 'react'
SnapShot = require 'react-test-renderer'

CourseHasEnded = require '../../../src/components/notifications/course-has-ended'

describe 'Notifications MissingStudentId notice', ->
  props = null
  beforeEach ->
    props =
      callbacks:
        onCCSecondSemester: jest.fn()
      notice:
        role: {}
        course:
          id: '1'
          ends_at: '2011-11-11T01:15:43.807Z'

  it 'renders and matches snapshot', ->
    component = SnapShot.create(<CourseHasEnded {...props} />)
    expect(component.toJSON()).toMatchSnapshot()
    undefined

  it 'calls onCCSecondSemester callback', ->
    wrapper = shallow(<CourseHasEnded {...props} />)
    wrapper.find('a.action').simulate('click')
    expect(props.callbacks.onCCSecondSemester).toHaveBeenCalled()
    undefined
