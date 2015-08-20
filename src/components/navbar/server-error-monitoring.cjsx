React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'

{AppStore, AppActions} = require '../../flux/app'
Dialog = require '../tutor-dialog'

module.exports = React.createClass
  displayName: 'ServerErrorMonitoring'

  mixins: [BindStoreMixin]
  bindStore: AppStore
  bindEvent: 'server-error'

  bindUpdate: ->
    serverErr = AppStore.getError()
    return unless serverErr

    {request} = serverErr
    {url} = request

    if AppStore.canRetrigger(url)
      AppActions.retriggerOnce(url)
    else

      dataMessage =  <span>
        with <pre>{request.opts.data}</pre>
      </span> if request.opts.data?

      errorMessage =
        <div className='server-error'>
          <h3>An error with code {serverErr.statusCode} has occured</h3>
          <p>Please visit <a target='_blank'
            href='https://openstaxtutor.zendesk.com/hc/en-us/requests/new'>our support page</a> to file a bug report.
          </p>
          <p>Additional error messages returned from the server is:</p>
          <pre className='response'>{serverErr.message or 'No response was received'}</pre>
          <div className='request'>
            <kbd>{request.opts.method}</kbd> on {request.url} {dataMessage}
          </div>
        </div>

      dismissError = ->
        AppActions.resetError(url)
        Dialog.hide()

      Dialog.show(
        title: 'Server Error', body: errorMessage
        buttons: [
          <BS.Button key='ok'
            onClick={-> dismissError()} bsStyle='primary'>OK</BS.Button>
        ]
      )


  # We don't actually render anything
  render: -> null
