{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

React = require 'react'

ConfirmJoinCourse = require '../../../src/components/enroll/confirm-join-course'

COURSE_ENROLLMENT_STORE_WITH_CONFLICT = {
  isBusy: false
  hasConflict: -> true
  description: -> 'New CC course'
  teacherNames: -> 'New course instructors'
  conflictDescription: -> 'Previous CC course'
  conflictTeacherNames: -> 'Previous course instructors'
  getEnrollmentChangeId: -> 42
  getStudentIdentifier: -> 'S000042'
  errorMessages: -> []
}

COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT = {
  isBusy: false
  hasConflict: -> false
  description: -> 'New Tutor course'
  teacherNames: -> 'New course instructors'
  getEnrollmentChangeId: -> 42
  getStudentIdentifier: -> 'S000042'
  errorMessages: -> []
}

describe 'ConfirmJoinCourse Component', ->

  beforeEach -> @courseEnrollmentActions = { confirm: sinon.spy() }

  describe 'with conflict', ->

    it 'displays info about the conflicting CC course', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT}
        />)
      expect(wrapper.find('.conflicts li').text()).to.eq(
        'We will remove you from Previous CC course with Previous course instructors. ' +
        'If you want to stay enrolled in the OpenStax Concept Coach for that course, contact us.'
      )
      undefined

    it 'displays info about the CC course being joined', ->
      wrapper = shallow(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT}
        />)
      expect(wrapper.find('.title .join').text()).to.eq('You are joining')
      expect(wrapper.find('.title .course').text()).to.eq('New CC course')
      expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors')
      undefined

    it 'calls confirm() on the courseEnrollmentActions object when the button is clicked', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT}
        />)
      wrapper.find('.btn.continue').simulate('click')
      expect(@courseEnrollmentActions.confirm.calledOnce).to.be.true
      undefined

    xit 'calls confirm() on the courseEnrollmentActions object when enter is pressed', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITH_CONFLICT}
        />)

      # These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
      # http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
      wrapper.simulate('keyPress', key: 'Enter')
      wrapper.find('.btn.continue').simulate('keyPress', key: 'Enter')
      expect(@courseEnrollmentActions.confirm.called).to.be.true
      undefined

  describe 'without conflict', ->

    it 'does not display conflicting CC course info', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT}
        />)
      expect(wrapper.find('.conflicts li')).to.be.empty
      undefined

    it 'displays info about the course being joined', ->
      wrapper = shallow(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT}
        />)
      expect(wrapper.find('.title .join').text()).to.eq('You are joining')
      expect(wrapper.find('.title .course').text()).to.eq('New Tutor course')
      expect(wrapper.find('.title .teacher').text()).to.eq('New course instructors')
      undefined

    it 'calls confirm() on the courseEnrollmentActions object when the button is clicked', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT}
        />)
      wrapper.find('.btn.continue').simulate('click')
      expect(@courseEnrollmentActions.confirm.calledOnce).to.be.true
      undefined

    xit 'calls confirm() on the courseEnrollmentActions object when enter is pressed', ->
      wrapper = mount(<ConfirmJoinCourse
        courseEnrollmentActions={@courseEnrollmentActions}
        courseEnrollmentStore={COURSE_ENROLLMENT_STORE_WITHOUT_CONFLICT}
        />)

      # These do not work... Enzyme bug? https://github.com/airbnb/enzyme/issues/441
      # http://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
      wrapper.simulate('keyPress', key: 'Enter')
      wrapper.find('.btn.continue').simulate('keyPress', key: 'Enter')
      expect(@courseEnrollmentActions.confirm.called).to.be.true
      undefined
