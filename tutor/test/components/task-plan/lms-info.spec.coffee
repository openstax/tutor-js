{Testing, expect, sinon, _, ReactTestUtils} = require '../helpers/component-testing'


LmsInfo = require '../../../src/components/task-plan/lms-info'

describe 'LmsInfo Component', ->
  beforeEach ->
    @props =
      plan:
        id: '2'
        title: 'A test plan'
        shareable_url: '/@foo/a-test-plan'

  it 'does not render if plan lacks sharable_url',  ->
    Testing.renderComponent( LmsInfo, props: {plan: {}} ).then ({dom}) ->
      expect(dom).to.be.null

  it 'renders link when plan has url', ->
    Testing.renderComponent( LmsInfo, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.equal('Get assignment link')

  it 'displays popover when clicked', ->
    Testing.renderComponent( LmsInfo, props: @props ).then ({dom, element}) =>
      Testing.actions.click( dom.querySelector('.get-link') )
      dom = element.getDOMNode()
      expect(dom.textContent).to.contain('Copy information for your LMS')
      expect( dom.querySelector('input').value ).to.contain(@props.plan.shareable_url)
