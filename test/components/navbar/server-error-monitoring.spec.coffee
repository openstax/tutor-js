{Testing, expect, sinon, _} = require '../helpers/component-testing'

_ = require 'underscore'

{AppActions} = require '../../../src/flux/app'
Dialog = require '../../../src/components/tutor-dialog'
ErrorMonitor = require '../../../src/components/navbar/server-error-monitoring'


describe 'Server Error Monitoring', ->

  beforeEach ->
    sinon.spy(Dialog, 'show')
  afterEach ->
    Dialog.show.restore()

  it 'renders error dialog', ->
    AppActions.setServerError(500, 'an error happens',
      {url: '/test', displayError: true})
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      expect(Dialog.show).to.have.been.calledWith(sinon.match(
        title: 'Server Error'
      ))

  it 'renders a no_exercises message', ->
    AppActions.setServerError(422,
      '{"status":422,"errors":[{"code":"no_exercises","message":' +
      '"No exercises were found to build the Practice Widget.","data":null}]}'
      , {url: '/test', displayError: true})
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      expect(Dialog.show).to.have.been.calledWith(sinon.match(
        title: 'Unable to practice topic'
      ))
