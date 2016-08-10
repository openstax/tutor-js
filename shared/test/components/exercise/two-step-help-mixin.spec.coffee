{Testing, expect, sinon, _, React} = require 'test/helpers'

TwoStepHelpMixin = require 'components/exercise/two-step-help-mixin'
Networking = require 'model/networking'
UiSettings = require 'model/ui-settings'

TestComponent = React.createClass
  mixins: [TwoStepHelpMixin]
  render: ->
    return @renderTwoStepHelp() if @hasTwoStepHelp()
    <span>No Help Displayed</span>


describe 'Two Step Help Mixin', ->

  beforeEach ->
    sinon.stub(Networking, 'perform')
    @props =
      parts: [{
        type: 'exercise'
        content:
          questions: [
            formats: ['free-response']
          ]
      }]

  afterEach ->
    UiSettings._reset()
    Networking.perform.restore()

  it 'renders help message', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, wrapper}) ->
      expect(dom.textContent).to.include('Two-step questions')

  it 'tolerates props not being set correctly', ->
    @props = {}
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, wrapper}) ->
      expect(dom.textContent).to.equal('No Help Displayed')

  it 'marks help as shown when continue is clicked', ->
    Testing.renderComponent( TestComponent, props: @props ).then ({dom, wrapper}) ->
      Testing.actions.click dom.querySelector('button')
      expect(UiSettings.get('has-viewed-two-step-help')).to.be.true
