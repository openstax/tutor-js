{Testing, expect, sinon, _} = require 'test/helpers'

Html = require 'components/html'

describe 'Arbitrary Html Component', ->

  beforeEach ->
    @props =
      className: 'html'
      html: '<span>a test phrase</span>'
      processHtmlAndMath: sinon.spy()
      block: true

    @frameProps =
      className: 'html'
      html: """<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
      frameborder="0" allowfullscreen></iframe>"""
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

  it 'wraps iframes with embed classes', ->
    Testing.renderComponent( Html, props: @frameProps ).then ({dom}) ->
      expect(dom.getElementsByClassName('embed-responsive').length).equal(1)
