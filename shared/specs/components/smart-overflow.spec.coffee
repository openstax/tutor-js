React = require 'react'
{Testing, expect, sinon, _} = require 'shared/specs/helpers'

SmartOverflow = require 'components/smart-overflow'

TestChildComponent = React.createClass
  render: -> React.createElement('span', {}, 'i am a test')

describe 'SmartOverflow Component', ->
  props = null

  beforeEach ->
    props =
      className: 'testing'
      children: React.createElement(TestChildComponent)

  it 'renders with className', ->
    Testing.renderComponent( SmartOverflow, props: props ).then ({dom}) ->
      expect(dom.classList.contains('testing')).to.be.true
      expect(dom.classList.contains('openstax-smart-overflow')).to.be.true

  it 'renders child components', ->
    Testing.renderComponent( SmartOverflow, props: props ).then ({dom}) ->
      expect(dom.textContent).equal('i am a test')
