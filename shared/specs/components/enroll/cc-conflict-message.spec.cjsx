{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

CcConflictMessage = require '../../../src/components/enroll/cc-conflict-message'

describe 'CcConflictMessage Component', ->

  it 'displays the CC conflict message', ->
    courseEnrollmentStore = {
      conflictDescription: -> 'Test Course'
      conflictTeacherNames: -> 'Instructors: Jane Smith and John Smith'
    }
    wrapper = shallow(<CcConflictMessage courseEnrollmentStore={courseEnrollmentStore} />)
    expect(wrapper.text()).to.eq(
      'We will remove you from Test Course with Instructors: Jane Smith and John Smith. ' +
      'If you want to stay enrolled in the OpenStax Concept Coach for that course, contact us.'
    )
    undefined
