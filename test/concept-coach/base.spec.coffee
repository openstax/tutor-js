{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{ConceptCoach} = require 'concept-coach/base'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'
tasks = require 'task/collection'

describe 'ConceptCoach base component', ->
  beforeEach ->
    @props =
      close: sinon.spy()
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    tasks.load("#{@props.collectionUUID}/#{@props.moduleUUID}",  TASK)

  it 'renders as loading by default', ->
    Testing.renderComponent( ConceptCoach, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.contain('Loading ...')

  it 'calls close callback', ->
    Testing.renderComponent( ConceptCoach, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.concept-coach-dashboard-nav'))
      expect(@props.close).to.have.been.called
