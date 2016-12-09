{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

Enroll = require 'components/enroll'
{CourseEnrollmentActions, CourseEnrollmentStore} = require 'flux/course-enrollment'
ENROLLMENT_CHANGE_DATA = require '../../../api/enrollment_changes/POST_WITH_CONFLICT'

JoinConflict = require 'components/enroll/join-conflict'
ConfirmJoin = require 'components/enroll/confirm-join'

describe 'Enroll Component', ->

  beforeEach ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    sinon.stub(CourseEnrollmentStore, 'isLoading').returns(false)
    sinon.stub(CourseEnrollmentStore, 'isConflicting').returns(false)
    sinon.stub(CourseEnrollmentStore, 'isPending').returns(false)
    sinon.stub(CourseEnrollmentStore, 'isRegistered').returns(false)

  afterEach ->
    CourseEnrollmentStore.isLoading.restore()
    CourseEnrollmentStore.isConflicting.restore()
    CourseEnrollmentStore.isPending.restore()
    CourseEnrollmentStore.isRegistered.restore()

  it 'renders loading message if EnrollmentChange is loading', ->
    CourseEnrollmentStore.isLoading.restore()
    sinon.stub(CourseEnrollmentStore, 'isLoading').returns(true)
    wrapper = mount(<Enroll />)
    expect(wrapper.find(JoinConflict)).to.be.empty
    expect(wrapper.find(ConfirmJoin)).to.be.empty
    expect(wrapper.text()).to.include('Loading')
    undefined

  it 'renders join conflict page if EnrollmentChange is conflicting', ->
    CourseEnrollmentStore.isConflicting.restore()
    CourseEnrollmentStore.isPending.restore()
    sinon.stub(CourseEnrollmentStore, 'isConflicting').returns(true)
    sinon.stub(CourseEnrollmentStore, 'isPending').returns(true)
    wrapper = mount(<Enroll />)
    expect(wrapper.find(JoinConflict)).not.to.be.empty
    expect(wrapper.find(ConfirmJoin)).to.be.empty
    undefined

  it 'renders confirmation if EnrollmentChange is pending', ->
    CourseEnrollmentStore.isPending.restore()
    sinon.stub(CourseEnrollmentStore, 'isPending').returns(true)
    wrapper = mount(<Enroll />)
    expect(wrapper.find(JoinConflict)).to.be.empty
    expect(wrapper.find(ConfirmJoin)).not.to.be.empty
    undefined

  it 'renders done message if EnrollmentChange is approved', ->
    CourseEnrollmentStore.isRegistered.restore()
    sinon.stub(CourseEnrollmentStore, 'isRegistered').returns(true)
    wrapper = mount(<Enroll />)
    expect(wrapper.find(JoinConflict)).to.be.empty
    expect(wrapper.find(ConfirmJoin)).to.be.empty
    expect(wrapper.text()).to.include(
      'You have successfully joined College Physics with Concept Coach II (section 2nd)')
    undefined
