{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{Launcher} = require 'concept-coach/launcher'
{channel} = require 'concept-coach/model'

describe 'Launcher', ->

  it 'renders with launching status', ->
    Testing.renderComponent( Launcher, props: {isLaunching: true} ).then ({dom}) ->
      expect(dom.textContent).to.include('Launch Concept Coach')
      expect(dom.querySelector('.concept-coach-launcher').classList.contains('launching')).to.be.true

  it 'emits launch action when clicked', ->
    spy = sinon.spy()
    channel.on('launcher.clicked', spy)
    Testing.renderComponent( Launcher ).then ({dom}) ->
      Testing.actions.click dom.querySelector('.concept-coach-launcher')
      expect(spy).to.have.been.called
