{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{CCModal} = require 'concept-coach/modal'
api = require 'api'

describe 'CC Modal Component', ->

  it 'sets isLoaded class if api call is pending', ->
    sinon.stub(api, 'isPending').returns(true)
    Testing.renderComponent( CCModal ).then ({dom}) ->
      expect(dom.classList.contains('loaded')).to.be.false
      api.channel.emit('completed')
      expect(dom.classList.contains('loaded')).to.be.true
