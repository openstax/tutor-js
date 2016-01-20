{Testing, expect, sinon, _, ReactTestUtils} = require 'openstax-react-components/test/helpers'

{Coach}   = require 'concept-coach/coach'
{CCModal} = require 'concept-coach/modal'

describe 'Coach wrapper component', ->
  beforeEach ->
    @props =
      open: false
      displayLauncher: true
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'

  it 'renders launch state', ->
    Testing.renderComponent( Coach, props: @props ).then ({dom, element}) ->
      expect(dom.textContent).to.contain('Launch Concept Coach')
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, CCModal)).to.be.empty

  it 'renders coach when open=true', ->
    @props.open = true
    Testing.renderComponent( Coach, props: @props ).then ({dom, element}) ->
      expect(ReactTestUtils.scryRenderedComponentsWithType(element, CCModal)).not.to.be.empty
