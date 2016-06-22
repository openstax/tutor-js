React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'
_  = require 'underscore'

{AppStore, AppActions} = require '../../flux/app'
Dialog = require '../tutor-dialog'

reloadOnce = ->
  navigation = AppStore.errorNavigation()
  return if _.isEmpty navigation
  if navigation.shouldReload
    join = if window.location.search then '&' else '?'
    window.location.href = window.location.href + join + 'reloaded'
  else if navigation.href
    window.location.href = navigation.href


ServerErrorMessage = React.createClass
  displayName: 'ServerErrorMessage'

  propTypes:
    statusCode: React.PropTypes.number.isRequired
    message: React.PropTypes.string.isRequired
    request: React.PropTypes.object.isRequired
    supportLink: React.PropTypes.string
    debug: React.PropTypes.bool

  getDefaultProps: ->
    supportLink: 'https://openstaxtutor.zendesk.com/hc/en-us/requests/new'
    debug: true

  render: ->
    {statusCode, message, request, supportLink, debug} = @props
    dataMessage =  <span>
      with <pre>{request.data}</pre>
    </span> if request.data?

    debugInfo = [
      <p key='error-note'>Additional error messages returned from the server is:</p>
      <pre key='error-response' className='response'>{message or 'No response was received'}</pre>
      <div key='error-request' className='request'>
        <kbd>{request.method}</kbd> on {request.url} {dataMessage}
      </div>
    ] if debug

    errorMessage =
      <div className='server-error'>
        <h3>An error with code {statusCode} has occured</h3>
        <p>Please visit <a target='_blank'
          href={supportLink}>our support page</a> to file a bug report.
        </p>
        {debugInfo}
      </div>


NoExercisesMessage = React.createClass
  render: ->
    <div className="no-exercises">
      <p className="lead">There are no practice problems available for this topic.</p>
    </div>


ERROR_HANDLERS =

  no_exercises: (error, message, router) ->
    hideDialog = ->
      {courseId} = router.getCurrentParams()
      router.transitionTo('viewStudentDashboard', {courseId})
      Dialog.hide()
    dialog:
      title: 'Unable to practice topic'
      body: <NoExercisesMessage />
      buttons: [
        <BS.Button key='ok' onClick={hideDialog} bsStyle='primary'>OK</BS.Button>
      ]
    onOk: hideDialog
    onCancel: hideDialog

  default: (error, message, router) ->
    dialog:
      title: 'Server Error'
      body: <ServerErrorMessage {...error}/>
      buttons: [
        <BS.Button key='ok' onClick={-> Dialog.hide()} bsStyle='primary'>OK</BS.Button>
      ]
    onOk: reloadOnce
    onCancel: reloadOnce

module.exports = React.createClass
  displayName: 'ServerErrorMonitoring'

  mixins: [BindStoreMixin]
  bindStore: AppStore
  bindEvent: 'server-error'

  contextTypes:
    router: React.PropTypes.func

  bindUpdate: ->
    error = AppStore.getError()

    return unless error and -1 is window.location.search.indexOf('reloaded')
    message = {}
    handler = 'default'
    if error.message
      try
        message = JSON.parse(error.message)
      catch e

      if message.errors?.length is 1 and ERROR_HANDLERS[message.errors[0].code]
        handler = message.errors[0].code

    attrs = ERROR_HANDLERS[handler](error, message, @context.router)

    Dialog.show( attrs.dialog ).then(attrs.onOk, attrs.onCancel)


  # We don't actually render anything
  render: -> null
