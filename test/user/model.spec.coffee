{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

User = require 'user/model'

describe 'User', ->

  it 'defaults to not logged in', ->
    expect(User.isLoggedIn()).to.be.false
