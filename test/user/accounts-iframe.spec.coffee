{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'
User = require 'user/model'
AccountsIframe = require 'user/accounts-iframe'

describe 'Accounts iframe component', ->
  beforeEach ->
    @props =
      type: 'profile'

    User.endpoints =
      login: '/test-login'
      logout: '/logout'
      accounts_iframe: '/accounts'

  it 'sets src with our url as parent', ->
    Testing.renderComponent( AccountsIframe, props: @props ).then ({dom}) ->
      expect(dom.querySelector('iframe').getAttribute('src')).to.equal(
        '/accounts?parent=http://localhost:9880'
      )

  it 'uses logout url', ->
    @props.type = 'logout'
    Testing.renderComponent( AccountsIframe, props: @props ).then ({dom}) ->
      expect(dom.querySelector('iframe').getAttribute('src')).to.equal(
        '/logout?parent=http://localhost:9880'
      )
