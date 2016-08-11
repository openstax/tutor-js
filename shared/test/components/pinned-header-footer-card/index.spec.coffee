React = require 'react'
{Testing, expect, sinon, _} = require 'test/helpers'

PinnedHeaderFooterCard = require 'components/pinned-header-footer-card'

TestChildComponent = React.createClass
  render: -> React.createElement('span', {}, 'i am a test')

describe 'Pinned Header/Footer Card Component', ->

  beforeEach ->
    @props =
      cardType: 'test'
      children: React.createElement(TestChildComponent)

  it 'renders child components', ->
    Testing.renderComponent( PinnedHeaderFooterCard, props: @props ).then ({dom}) ->
      expect(dom.textContent).equal('i am a test')

  it 'sets body class', ->
    Testing.renderComponent( PinnedHeaderFooterCard, props: @props ).then ({dom}) ->
      expect(document.body.classList.contains('test-view')).to.be.true
      expect(document.body.classList.contains('pinned-view')).to.be.true
      expect(document.body.classList.contains('pinned-force-shy')).to.be.false

  it 'sets pinned-shy when scrolled down', (done) ->
    @props.header = React.createElement('span', {}, 'i am header')

    Testing.renderComponent( PinnedHeaderFooterCard, unmountAfter: 20, props: @props ).then ({dom, element}) ->
      expect(document.body.classList.contains('pinned-shy')).to.be.false
      element.setState(scrollTop: 400) # imitate react-scroll-components
      _.defer ->
        expect(document.body.classList.contains('pinned-shy')).to.be.true
        done()
