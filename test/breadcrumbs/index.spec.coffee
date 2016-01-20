{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{Breadcrumbs} = require 'breadcrumbs'
TASK = require 'cc/tasks/C_UUID/m_uuid/GET'
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
      expect(dom.querySelectorAll('.openstax-breadcrumbs-step').length).equal(4)

  it 'calls goToStep callback', ->
    Testing.renderComponent( Breadcrumbs, props: @props ).then ({dom}) =>
      Testing.actions.click dom.querySelector('.openstax-breadcrumbs-step:first-child')
      expect(@props.goToStep).to.have.been.called
