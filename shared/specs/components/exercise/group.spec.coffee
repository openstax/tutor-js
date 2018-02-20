{Testing, sinon, _} = require 'shared/specs/helpers'

Group = require 'components/exercise/group'

describe 'Exercise Group Component', ->
  props = null

  beforeEach ->
    props =
      project: 'tutor'
      group: 'personalized'
      related_content: [
        {title: 'Test', chapter_section: [1, 2]}
      ]


  it 'renders the label and icon', ->
    Testing.renderComponent( Group, props: props ).then ({dom, wrapper}) ->
      expect(dom.textContent).equal('Personalized')
      expect(dom.querySelector('i.icon-personalized')).not.to.be.null

  it 'renders null label and icon for groups that should not be visible', ->
    props.group = 'core'
    Testing.renderComponent( Group, props: props ).then ({dom, wrapper}) ->
      expect(dom.querySelector('i.icon-personalized')).to.be.null
      expect(dom.textContent).equal('')

  it 'renders the exercise uid when passed in', ->
    props.group = 'spaced practice'
    Testing.renderComponent( Group, props: props ).then ({dom, wrapper, root, element}) ->
      expect(dom.textContent).toContain('Spaced Practice')
