{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'
NewCourseRegistration = require 'course/new-registration'
User = require 'user/model'
InviteCodeInput = require 'course/invite-code-input'
ConfirmJoin = require 'course/confirm-join'

describe 'NewCourseRegistration Component', ->

  beforeEach ->
    @props =
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')
      collectionUUID: 'test-collection-uuid'

  describe 'teacher message', ->
    it 'is normally hidden', ->
      Testing.renderComponent( NewCourseRegistration, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.teacher-message')).to.be.null

    it 'is shown to teachers', ->
      sinon.stub(User, 'isTeacherForCourse').returns(true)
      Testing.renderComponent( NewCourseRegistration, props: @props ).then ({dom}) ->
        expect(dom.querySelector('.teacher-message')).not.to.be.null

  it 'renders invite code input if course is incomplete', ->
    sinon.stub(@props.course, 'isIncomplete').returns(true)
    Testing.renderComponent( NewCourseRegistration, props: @props ).then ({element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, ConfirmJoin)).to.be.empty
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, InviteCodeInput)).not.to.be.empty

  it 'renders confirmation if course is pending', ->
    sinon.stub(@props.course, 'isIncomplete').returns(false)
    sinon.stub(@props.course, 'isPending').returns(true)
    Testing.renderComponent( NewCourseRegistration, props: @props ).then ({element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, ConfirmJoin)).not.to.be.empty
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, InviteCodeInput)).to.be.empty
