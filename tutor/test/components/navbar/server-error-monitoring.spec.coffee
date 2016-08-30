{Testing, expect, sinon, _} = require '../helpers/component-testing'

_ = require 'underscore'

{AppActions} = require '../../../src/flux/app'
Dialog = require '../../../src/components/tutor-dialog'
ErrorMonitor = require '../../../src/components/navbar/server-error-monitoring'

updateAndSetError = (statusCode, message, requestDetails) ->
  # normally, updateForResponse would be called within the axios interceptor.
  AppActions.updateForResponse(statusCode, message, requestDetails)
  AppActions.setServerError(statusCode, message, requestDetails)

describe 'Server Error Monitoring', ->

  beforeEach ->
    sinon.spy(Dialog, 'show')
  afterEach ->
    Dialog.show.restore()
    AppActions.resetServerErrors()

  it 'renders error dialog', ->
    updateAndSetError(500, 'an error happens',
      {url: '/test', displayError: true})
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      expect(Dialog.show).to.have.been.calledWith(sinon.match(
        title: 'Server Error'
      ))

  it 'renders a no_exercises message', (done) ->
    Testing.renderComponent( ErrorMonitor ).then ({dom}) ->
      _.defer ->
        expect(Dialog.show).to.have.been.calledWith(sinon.match(
          title: 'No exercises are available'
        ))
        done()
    updateAndSetError(422,
      '{"status":422,"errors":[{"code":"no_exercises","message":' +
      '"No exercises were found to build the Practice Widget.","data":null}]}'
      , {url: '/test', displayError: true})

  it 'renders no error dialog when displayError is set to false', ->
    updateAndSetError(500, 'an error happens',
      {url: '/test', displayError: false})
    Testing.renderComponent( ErrorMonitor ).then ->
      expect(Dialog.show).to.have.not.been.calledWith(sinon.match(
        title: 'Server Error'
      ))

