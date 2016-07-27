{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

Menu = require 'user/menu'
User = require 'user/model'
Course = require 'course/model'
sandbox = null

describe 'User menu component', ->
  beforeEach ->
    @props =
      course: new Course(ecosystem_book_uuid: 'test-collection-uuid')
    sandbox = sinon.sandbox.create()
  afterEach ->
    sandbox.restore()

  describe 'course options', ->

    beforeEach ->
      sandbox.stub(User, 'isLoggedIn').returns(true)

    it 'renders for registration when course is not registered', ->
      sinon.stub(@props.course, 'isRegistered').returns(false)
      Testing.renderComponent( Menu, props: @props ).then ({dom}) ->
        expect(dom.textContent).to.match(/Register for Section/)

    it 'renders modification when registered', ->
      sinon.stub(@props.course, 'isRegistered').returns(true)
      Testing.renderComponent( Menu, props: @props ).then ({dom}) ->
        expect(dom.textContent).to.match(/Change Section/)
        expect(dom.textContent).to.match(/Change student ID/)
