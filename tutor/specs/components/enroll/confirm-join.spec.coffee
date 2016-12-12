{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

ConfirmJoin = require 'components/enroll/confirm-join'
{CourseEnrollmentActions, CourseEnrollmentStore} = require 'flux/course-enrollment'
ENROLLMENT_CHANGE_DATA = require '../../../api/enrollment_changes/POST'

describe 'ConfirmJoin Component', ->

  beforeEach ->
    CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA)
    sinon.stub(CourseEnrollmentActions, 'confirm')

  afterEach -> CourseEnrollmentActions.confirm.restore()

  it 'sets title with course', ->
    wrapper = mount(<ConfirmJoin
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    title = wrapper.find('.title').text()
    expect(title).to.include('You are joining')
    expect(title).to.include('Physics with Courseware')
    expect(title).to.include('Instructors: Charles Morris and William Blake')
    undefined

  it 'confirms the EnrollmentChange when submit is clicked', ->
    wrapper = mount(<ConfirmJoin
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    wrapper.find('input').node.value = 'student id'
    wrapper.find('.btn-success').simulate('click')
    expect(CourseEnrollmentActions.confirm).to.have.been.calledWith('1', 'student id').once
    undefined

  xit 'confirms model when enter is pressed in input', ->
    wrapper = mount(<ConfirmJoin
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore} />)
    wrapper.find('input').node.value = 'student id'
    # Simulate does not work
    wrapper.find('.btn-success').simulate('keyPress', key: 'Enter')
    expect(CourseEnrollmentActions.confirm).to.have.been.calledWith('1', 'student id').once
    undefined
