{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

JoinConflict = require 'components/enroll/join-conflict'
{CourseEnrollmentActions, CourseEnrollmentStore} = require 'flux/course-enrollment'
ENROLLMENT_CHANGE_DATA = require '../../../api/enrollment_changes/POST_WITH_CONFLICT'

describe 'JoinConflict Component', ->

  beforeEach ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    sinon.stub(CourseEnrollmentActions, 'conflictContinue')

  afterEach -> CourseEnrollmentActions.conflictContinue.restore()

  it 'sets title with course', ->
    wrapper = mount(<JoinConflict
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    title = wrapper.find('.title').text()
    expect(title).to.include('You are joining')
    expect(title).to.include('Physics with Concept Coach II (section 2nd)')
    expect(title).to.include('Instructor: William Blake')
    undefined

  it 'sets the conflict message', ->
    wrapper = mount(<JoinConflict
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    conflicts = wrapper.find('.conflict .errors').text()
    expect(conflicts).to.include(
      'You are already enrolled in another OpenStax Concept Coach using this textbook, ' +
      'College Physics with Concept Coach (section 1st) with Instructor: Charles Morris. ' +
      "To make sure you don\'t lose work, we strongly recommend enrolling in only one " +
      'Concept Coach per textbook. When you join the new course below, ' +
      'we will remove you from the other course.')
    undefined

  it 'continues from conflict when submit is clicked', ->
    wrapper = mount(<JoinConflict
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    wrapper.find('.btn-success').simulate('click')
    expect(CourseEnrollmentActions.conflictContinue).to.have.been.calledOnce
    undefined

  xit 'continues from conflict when enter is pressed in input', ->
    wrapper = mount(<JoinConflict
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    # Simulate does not work
    wrapper.find('.btn-success').simulate('keyPress', key: 'Enter')
    expect(CourseEnrollmentActions.conflictContinue).to.have.been.calledOnce
    undefined
