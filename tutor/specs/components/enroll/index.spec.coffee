{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

Enroll = require 'components/enroll'
{CourseEnrollmentActions, CourseEnrollmentStore} = require 'flux/course-enrollment'
ENROLLMENT_CHANGE_DATA = require '../../../api/enrollment_changes/POST_WITH_CONFLICT'

JoinConflict = require 'components/enroll/join-conflict'
ConfirmJoin = require 'components/enroll/confirm-join'

describe 'Enroll Component', ->

  beforeEach -> @wrapper = mount(<Enroll />)

  it 'renders loading message if EnrollmentChange is loading', ->
    expect(@wrapper.find(JoinConflict)).to.be.empty
    expect(@wrapper.find(ConfirmJoin)).to.be.empty
    expect(@wrapper.text()).to.include('Loading')
    undefined

  it 'renders join conflict page if EnrollmentChange is conflicting', ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    @wrapper.node.forceUpdate()
    expect(@wrapper.find(JoinConflict)).not.to.be.empty
    expect(@wrapper.find(ConfirmJoin)).to.be.empty
    undefined

  it 'renders confirmation if EnrollmentChange is pending', ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    CourseEnrollmentActions.conflictContinue()
    @wrapper.node.forceUpdate()
    expect(@wrapper.find(JoinConflict)).to.be.empty
    expect(@wrapper.find(ConfirmJoin)).not.to.be.empty
    undefined

  it 'renders done message if EnrollmentChange is approved', ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    CourseEnrollmentActions.conflictContinue()
    CourseEnrollmentActions.confirmed(_.extend(ENROLLMENT_CHANGE_DATA, status: "processed"))
    @wrapper.node.forceUpdate()
    expect(@wrapper.find(JoinConflict)).to.be.empty
    expect(@wrapper.find(ConfirmJoin)).to.be.empty
    expect(@wrapper.text()).to.include(
      'You have successfully joined College Physics with Concept Coach II (section 2nd)')
    undefined
