{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'
STATUS = require '../../auth/status/GET'
User = require 'user/model'
Registration = require 'course/registration'
NewCourseRegistration = require 'course/new-registration'
ModifyCourseRegistration = require 'course/modify-registration'

describe 'Registration Component', ->

  beforeEach ->
    @props =
      collectionUUID: 'test-collection-uuid'


  it 'renders new if course is new', ->
    Testing.renderComponent( Registration, props: @props ).then ({element}) ->
      expect(
        ReactTestUtils.scryRenderedComponentsWithType(element, NewCourseRegistration)
      ).not.to.be.empty


  it 'renders modify if course is already registered', ->
    course = new Course(STATUS.courses[0])
    sinon.stub(User, 'getCourse').returns(course)
    Testing.renderComponent( Registration, props: @props ).then ({element}) ->
      expect(
        ReactTestUtils.scryRenderedComponentsWithType(element, ModifyCourseRegistration)
      ).not.to.be.empty
