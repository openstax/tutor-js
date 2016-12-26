{React, Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

Course = require 'course/model'
NewCourseRegistration = require 'course/new-registration'
User = require 'user/model'
EnrollmentCodeInput = require 'course/enrollment-code-input'
JoinConflict = require 'course/join-conflict'
ConfirmJoin = require 'course/confirm-join'

describe 'NewCourseRegistration Component', ->

  beforeEach ->
    @props =
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')
      collectionUUID: 'test-collection-uuid'

  describe 'teacher message', ->

    it 'sets second semester prop when it’s prop is set', ->
      @props.secondSemester = true
      wrapper = shallow(<NewCourseRegistration {...@props} />)
      expect(wrapper.find('EnrollmentCodeInput[secondSemester=true]')).to.have.length(1)
      undefined

    it 'is normally hidden', ->
      Testing.renderComponent( NewCourseRegistration, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.teacher-message')).to.be.null

    it 'is shown to teachers', ->
      sinon.stub(User, 'isTeacherForCourse').returns(true)
      Testing.renderComponent( NewCourseRegistration, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.teacher-message')).not.to.be.null

  it 'renders enrollment code input if course is incomplete', ->
    sinon.stub(@props.course, 'isIncomplete').returns(true)
    Testing.renderComponent( NewCourseRegistration, props: @props ).then ({element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, ConfirmJoin)).to.be.empty
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, EnrollmentCodeInput)).not.to.be.empty

  it 'renders join conflict page if course is conflicting', ->
    sinon.stub(@props.course, 'isIncomplete').returns(false)
    sinon.stub(@props.course, 'isConflicting').returns(true)
    sinon.stub(@props.course, 'description').returns('Some course')
    Testing.renderComponent( NewCourseRegistration, props: @props ).then ({element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, JoinConflict)).not.to.be.empty
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, EnrollmentCodeInput)).to.be.empty

  it 'renders confirmation if course is pending', ->
    sinon.stub(@props.course, 'isIncomplete').returns(false)
    sinon.stub(@props.course, 'isPending').returns(true)
    Testing.renderComponent( NewCourseRegistration, props: @props ).then ({element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, ConfirmJoin)).not.to.be.empty
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, EnrollmentCodeInput)).to.be.empty
