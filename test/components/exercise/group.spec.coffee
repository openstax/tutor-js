{Testing, expect, sinon, _} = require 'test/helpers'

Group = require 'components/exercise/group'

describe 'Exercise Group Component', ->

  beforeEach ->
    @props =
      group: 'personalized'
      related_content: [
        {title: 'Test', chapter_section: [1, 2]}
      ]


  it 'renders the label and icon', ->
    Testing.renderComponent( Group, props: @props ).then ({dom, wrapper}) ->
      expect(dom.textContent).equal('Personalized')
      expect(dom.querySelector('i.icon-personalized')).not.to.be.null

  it 'renders null for groups that should not be visible', ->
    @props.group = 'core'
    Testing.renderComponent( Group, props: @props ).then ({dom, wrapper}) ->
      expect(dom).to.be.null
