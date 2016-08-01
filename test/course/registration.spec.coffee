{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

Course = require 'course/model'
STATUS = require '../../auth/status/GET'
User = require 'user/model'
Registration = require 'course/registration'
EnrollOrLogin = require 'course/enroll-or-login'
NewCourseRegistration = require 'course/new-registration'
ModifyCourseRegistration = require 'course/modify-registration'

describe 'Registration Component', ->

  beforeEach ->
    @props =
      collectionUUID: 'test-collection-uuid'
    @course = new Course(STATUS.courses[0])
    @sandbox = sinon.sandbox.create()
    @sandbox.stub(User, 'getCourse').returns(@course)
    @sandbox.stub(User, 'isLoggedIn').returns(true)

  afterEach ->
    @sandbox.restore()

  it 'renders new if course is new', ->
    sinon.stub(@course, 'isRegistered').returns(false)
    Testing.renderComponent( Registration, props: @props ).then ({element}) ->
      expect(
        ReactTestUtils.scryRenderedComponentsWithType(element, NewCourseRegistration)
      ).not.to.be.empty


  it 'renders modify if course is already registered', ->
    Testing.renderComponent( Registration, props: @props ).then ({element}) ->
      expect(
        ReactTestUtils.scryRenderedComponentsWithType(element, ModifyCourseRegistration)
      ).not.to.be.empty

  it 'asks to enroll or login if user doesnt have course and isnt logged in', ->
    User.getCourse.restore()
    User.isLoggedIn.restore()
    @sandbox.stub(User, 'isLoggedIn').returns(false)
    @sandbox.stub(User, 'getCourse').returns(null)
    Testing.renderComponent( Registration, props: @props ).then ({element}) ->
      expect(
        ReactTestUtils.scryRenderedComponentsWithType(element, EnrollOrLogin)
      ).not.to.be.empty
