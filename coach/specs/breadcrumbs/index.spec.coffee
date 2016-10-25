{Testing, expect, sinon, _} = require 'shared/specs/helpers'

{Breadcrumbs} = require 'breadcrumbs'
TASK = require '../../api/cc/tasks/C_UUID/m_uuid/GET'
tasks = require 'task/collection'

describe 'Breadcrumbs Component', ->
  beforeEach ->
    @props =
      goToStep: sinon.spy()
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    tasks.load("#{@props.collectionUUID}/#{@props.moduleUUID}",  TASK)


  it 'renders steps', ->
    Testing.renderComponent( Breadcrumbs, props: @props ).then ({dom}) ->
      stepOnlyCrumbs = dom.querySelectorAll('.openstax-breadcrumbs-step:not(.breadcrumb-end):not([class$=-intro])')
      expect(stepOnlyCrumbs.length).equal(TASK.steps.length)

  it 'calls goToStep callback', ->
    Testing.renderComponent( Breadcrumbs, props: @props ).then ({dom}) =>
      Testing.actions.click dom.querySelector('.openstax-breadcrumbs-step:first-child')
      expect(@props.goToStep).to.have.been.called
