{Testing, expect, sinon, _} = require 'test/helpers'

Html = require 'components/html'

describe 'Arbitrary Html Component', ->

  beforeEach ->
    @props =
      className: 'html'
      html: '<span>a test phrase</span>'
      processHtmlAndMath: sinon.spy()
      block: true

  it 'renders html', ->
    Testing.renderComponent( Html, props: @props ).then ({dom}) ->
      expect(dom.tagName).equal('DIV')
      expect(dom.textContent).equal('a test phrase')

  it 'calls math processing function when rendered', ->
    Testing.renderComponent( Html, props: @props ).then ({dom}) =>
      expect(@props.processHtmlAndMath).to.have.been.calledWith(dom)

  it 'renders using span when block is false', ->
    @props.block = false
    Testing.renderComponent( Html, props: @props ).then ({dom}) ->
      expect(dom.tagName).equal('SPAN')
