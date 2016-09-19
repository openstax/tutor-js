{Testing, expect, sinon, _, React, ReactTestUtils} = require 'shared/test/helpers'

{ConceptCoach}    = require 'concept-coach/base'
ErrorNotification = require 'concept-coach/error-notification'

TASK  = require 'cc/tasks/C_UUID/m_uuid/GET'
tasks = require 'task/collection'
api   = require 'api'

Render = (props) ->
  Testing.renderComponent( ConceptCoach, {props, unmountAfter: 200} ).then (args) ->
    _.extend(args, element: ReactTestUtils.findRenderedComponentWithType(args.element, ErrorNotification))

getModal = (dom) -> dom.querySelector('.errors.modal')

ERROR =
  response: {status: 500, statusText: 'Its On Fire!'}
  failedData:
    data:
      errors: [ {code: 'test_test_test'} ]

describe 'CC Error Notification Component', ->
  beforeEach ->
    @props =
      close: sinon.spy()
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    tasks.load("#{@props.collectionUUID}/#{@props.moduleUUID}",  TASK)

  it "doesn't render by default", ->
    Render(@props).then ({element, dom}) ->
      expect(getModal(dom)).not.to.exist

  it 'renders when errors are present', (done) ->
    Render(@props).then ({element, dom}) ->
      api.channel.emit('error', ERROR)
      _.defer ->
        dom = getModal(dom)
        expect(dom).to.exist
        expect(dom.textContent).to.contain('Error encountered')
        # details shouldn't be shown yet
        expect(dom.textContent).not.to.contain('test_test_test')
        done()

  it 'can show error details', (done) ->
    Render(@props).then ({element, dom}) ->
      api.channel.emit('error', ERROR)
      _.defer ->
        dom = getModal(dom)
        Testing.actions.click(dom.querySelector('.-display-errors'))
        expect(dom.textContent).to.contain('test_test_test')
        done()
