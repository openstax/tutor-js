React = require 'react'
SnapShot = require 'react-test-renderer'

MissingStudentId = require '../../../src/components/notifications/missing-student-id'

describe 'Notifications MissingStudentId notice', ->
  props = null

  beforeEach ->
    props =
      callbacks:
        onAdd: jest.fn()
      notice:
        role:
          id: '1'
          type: 'student'
          joined_at: '2012-01-01'
          latest_enrollment_at: '2012-01-01'
        course:
          id: '1'

  it 'renders and matches snapshot', ->
    component = SnapShot.create(<MissingStudentId {...props} />)
    expect(component.toJSON()).toMatchSnapshot()
    undefined

  it 'calls onAdd callback', ->
    wrapper = shallow(<MissingStudentId {...props} />)
    wrapper.find('a.action').simulate('click')
    expect(props.callbacks.onAdd).toHaveBeenCalled()
    undefined
