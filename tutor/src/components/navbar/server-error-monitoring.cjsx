React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'
_  = require 'underscore'

{AppStore, AppActions} = require '../../flux/app'
{CurrentUserStore, CurrentUserActions} = require '../../flux/current-user'
Dialog = require '../tutor-dialog'

SUPPORT_LINK_PARAMS = '&cu=1&fs=ContactUs&q='

makeContactMessage = (statusCode, message, request) ->
  userAgent = window.navigator.userAgent
  location = window.location.href

  errorInfo = "#{statusCode} with #{message} for #{request.method} on #{request.url}"

  if request.data?
    errorInfo += " with\n#{request.data}"

  template = """Hello!
    I ran into a problem on
    #{userAgent} at #{location}.

    Here is some additional info:
    #{errorInfo}."""

makeContactURL = (supportLinkBase, statusCode, message, request) ->
  q = encodeURIComponent(makeContactMessage(statusCode, message, request))
  "#{supportLinkBase}#{SUPPORT_LINK_PARAMS}#{q}"

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
    supportLinkBase: React.PropTypes.string
    debug: React.PropTypes.bool

  getDefaultProps: ->
    supportLinkBase: CurrentUserStore.getHelpLink()
    debug: true

  render: ->
    {statusCode, message, request, supportLinkBase, debug} = @props
    message ?= 'No response was received'

    q = makeContactMessage(statusCode, message, request)

    dataMessage =  <span>
      with <pre>{request.data}</pre>
    </span> if request.data?

    debugInfo = [
      <p key='error-note'>Additional error messages returned from the server is:</p>
      <pre key='error-response' className='response'>{message}</pre>
      <div key='error-request' className='request'>
        <kbd>{request.method}</kbd> on {request.url} {dataMessage}
      </div>
    ] if debug

    errorMessage =
      <div className='server-error'>
        <h3>An error with code {statusCode} has occured</h3>
        <p>Please visit <a target='_blank'
          href={makeContactURL(supportLinkBase, statusCode, message, request)}
        >our support page</a> to file a bug report.
        </p>
        {debugInfo}
      </div>


NoExercisesMessage = React.createClass
  render: ->
    <div className="no-exercises">
      <p className="lead">There are no problems to show for this topic.</p>
    </div>


ERROR_HANDLERS =

  no_exercises: (error, message, router) ->
    hideDialog = ->
      {courseId} = router.getCurrentParams()
      router.transitionTo('viewStudentDashboard', {courseId})
      Dialog.hide()
    dialog:
      title: 'No exercises are available'
      body: <NoExercisesMessage />
      buttons: [
        <BS.Button key='ok' onClick={hideDialog} bsStyle='primary'>OK</BS.Button>
      ]
    onOk: hideDialog
    onCancel: hideDialog

  default: (error, message, router) ->
    if router? and not error.supportLinkBase?
      {courseId} = router.getCurrentParams()
      error.supportLinkBase = CurrentUserStore.getHelpLink(courseId)
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

    if _.isObject(error.message)
      {message} = error
      if message.errors?.length is 1 and ERROR_HANDLERS[message.errors[0].code]
        handler = message.errors[0].code

    attrs = ERROR_HANDLERS[handler](error, message, @context.router)

    Dialog.show( attrs.dialog ).then(attrs.onOk, attrs.onCancel)


  # We don't actually render anything
  render: -> null
