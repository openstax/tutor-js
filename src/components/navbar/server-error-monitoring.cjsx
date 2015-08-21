React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'
_  = require 'underscore'

{AppStore, AppActions} = require '../../flux/app'
Dialog = require '../tutor-dialog'


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
      with <pre>{request.opts.data}</pre>
    </span> if request.opts.data?

    debugInfo = [
      <p>Additional error messages returned from the server is:</p>
      <pre className='response'>{message or 'No response was received'}</pre>
      <div className='request'>
        <kbd>{request.opts.method}</kbd> on {request.url} {dataMessage}
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


module.exports = React.createClass
  displayName: 'ServerErrorMonitoring'

  mixins: [BindStoreMixin]
  bindStore: AppStore
  bindEvent: 'server-error'

  bindUpdate: ->
    serverErr = AppStore.getError()
    return unless serverErr

    dismissError = ->
      navigation = AppStore.errorNavigation()
      return if _.isEmpty navigation
      if navigation.shouldReload
        window.location.reload()
      else
        window.location.href = navigation.href

    Dialog.show(
      title: 'Server Error', body: <ServerErrorMessage {...serverErr}/>
      buttons: [
        <BS.Button key='ok'
          onClick={-> Dialog.hide()} bsStyle='primary'>OK</BS.Button>
      ]
    ).then(dismissError, dismissError)


  # We don't actually render anything
  render: -> null
