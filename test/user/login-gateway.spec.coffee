# coffeelint: disable=max_line_length, spacing_after_comma

{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'
User = require 'user/model'
LoginGateway = require 'user/login-gateway'

describe 'User login gateway component', ->
  beforeEach ->
    @props =
      title: 'My Login Screen'
      window:
        open: sinon.stub().returns({})
    User.endpoints.login = '/test-login'

  it 'sets title', ->
    Testing.renderComponent( LoginGateway, props: @props ).then ({dom}) =>
      expect(dom.querySelector('h3').textContent).to.equal(@props.title)

  it 'opens a propup window when clicked', ->
    Testing.renderComponent( LoginGateway, props: @props ).then ({dom, element}) =>
      Testing.actions.click(dom.querySelector('a.login'))
      expect(@props.window.open).to.have.been.calledWith(
        sinon.match(/test-login\?parent=http%3A%2F%2Flocalhost%3A\d+%2Fcontext.html/), 'oxlogin',
        sinon.match(/toolbar=no,location=yes,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=\d+,height=\d+,top=\d+,left=\d+/)
      )
      expect( element.getDOMNode().textContent ).to.include('Click to reopen window')
