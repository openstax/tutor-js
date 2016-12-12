{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

CcJoinConflict = require '../../../src/components/enroll/cc-join-conflict'

COURSE_ENROLLMENT_STORE = {
  isBusy: false
  description: -> 'New CC course'
  teacherNames: -> 'New course instructors'
  conflictDescription: -> 'Previous CC course'
  conflictTeacherNames: -> 'Previous course instructors'
}

describe 'CcJoinConflict Component', ->

  beforeEach -> @courseEnrollmentActions = { conflictContinue: sinon.spy() }

  it 'displays info about the conflicting CC course', ->
    wrapper = mount(<CcJoinConflict
      courseEnrollmentActions={@courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE}
      />)
    expect(wrapper.find('.conflict li').text()).to.eq(
      'You are already enrolled in another OpenStax Concept Coach using this textbook, ' +
      "Previous CC course with Previous course instructors. To make sure you don't lose work, " +
      'we strongly recommend enrolling in only one Concept Coach per textbook. When you join the ' +
      'new course below, we will remove you from the other course.'
    )
    undefined

  it 'displays info about the course being joined', ->
    wrapper = shallow(<CcJoinConflict
      courseEnrollmentActions={@courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE}
      />)
    expect(wrapper.find('.title .join').text()).to.eq('You are joining')
    expect(wrapper.find('.title .course').text()).to.eq('New CC course')
    expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors')
    undefined

  it 'calls conflictContinue() on the courseEnrollmentActions object when the button is clicked', ->
    wrapper = shallow(<CcJoinConflict
      courseEnrollmentActions={@courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE}
      />)
    wrapper.find('.btn.continue').simulate('click')
    expect(@courseEnrollmentActions.conflictContinue.calledOnce).to.be.true
    undefined

  xit 'calls conflictContinue() on the courseEnrollmentActions object when enter is pressed', ->
    wrapper = mount(<CcJoinConflict
      courseEnrollmentActions={@courseEnrollmentActions}
      courseEnrollmentStore={COURSE_ENROLLMENT_STORE}
      />)

    # These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
    # http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
    wrapper.simulate('keyPress', key: 'Enter')
    wrapper.find('.btn.continue').simulate('keyPress', key: 'Enter')
    expect(@courseEnrollmentActions.conflictContinue.called).to.be.true
    undefined
