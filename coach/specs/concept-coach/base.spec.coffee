{Testing, expect, sinon, _} = require 'shared/specs/helpers'

{ConceptCoach} = require 'concept-coach/base'
TASK = require '../../api/cc/tasks/C_UUID/m_uuid/GET'
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

  xit 'calls close callback', ->
    Testing.renderComponent( ConceptCoach, props: @props ).then ({dom}) =>
      Testing.actions.click(dom.querySelector('.concept-coach-dashboard-nav'))
      expect(@props.close).to.have.been.called
