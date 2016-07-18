{Testing, expect, sinon, _} = require '../helpers/component-testing'

_ = require 'underscore'

{AppActions} = require '../../../src/flux/app'
Dialog = require '../../../src/components/tutor-dialog'
ErrorMonitor = require '../../../src/components/navbar/server-error-monitoring'


describe 'Error display messages', ->

  beforeEach ->
    sinon.spy(Dialog, 'show')
  afterEach ->
    Dialog.show.restore()

  it 'renders error dialog', ->
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      expect(Dialog.show).to.have.been.calledWith(sinon.match(
        title: 'Server Error'
      ))
    AppActions.setServerError(500, 'an error happens',
      {url: '/test', opts: {displayError: true}})

  it 'renders a no_exercises message', ->
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      expect(Dialog.show).to.have.been.calledWith(sinon.match(
        title: 'No exercises are available'
      ))
    AppActions.setServerError(422,
      '{"status":422,"errors":[{"code":"no_exercises","message":' +
      '"No exercises were found to build the Practice Widget.","data":null}]}'
      , {url: '/test', opts: {displayError: true}})
