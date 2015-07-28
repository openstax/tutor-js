{Testing, expect, sinon, _} = require '../helpers/component-testing'

Bar = require '../../../src/components/learning-guide/progress-bar'

describe 'Learning Guide Progress Bar', ->

  beforeEach ->
    @props = {
      onPractice: sinon.spy()
      section: { current_level: 0.82, magic: true }
    }

  it 'calls practice callback', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) =>
      Testing.actions.click(dom)
      expect(@props.onPractice).to.have.been.calledWith(@props.section)

  it 'renders the progress bar with correct level', ->
    Testing.renderComponent( Bar, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.progress-bar').style.width).to.equal('82%')

  it 'does not render the bar when no data is available', ->
    Testing.renderComponent( Bar, props: {onPractice: @props.onPractice, section: {foo:'bar'} } ).then ({dom}) =>
      expect(dom.querySelector('.progress-bar')).to.be.null
      Testing.actions.click(dom)
      expect(@props.onPractice).to.have.been.calledWith({foo: 'bar'})
