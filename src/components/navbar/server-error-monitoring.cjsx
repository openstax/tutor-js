React = require 'react'
BindStoreMixin = require '../bind-store-mixin'
BS = require 'react-bootstrap'

{AppStore} = require '../../flux/app'
Dialog = require '../tutor-dialog'

module.exports = React.createClass
  displayName: 'AdminLink'

  mixins: [BindStoreMixin]
  bindStore: AppStore
  bindEvent: 'server-error'

  bindUpdate: ->
    serverErr = AppStore.getError()
    return unless serverErr
    errorMessage =
      <div className='server-error'>
        <h3>An error with code {serverErr.statusCode} has occured</h3>
        <p>Please visit <a target='_blank'
          href='https://openstaxtutor.zendesk.com/hc/en-us/requests/new'>our support page</a> to file a bug report.
        </p>
        <p>Additional error messages returned from the server is:</p>
        <div className='response'>{serverErr.message or 'No response was received'}</div>
      </div>
    Dialog.show(
      title: 'Server Error', body: errorMessage
      buttons: [
        <BS.Button key='ok'
          onClick={-> Dialog.hide()} bsStyle='primary'>OK</BS.Button>
      ]
    )


  # We don't actually render anything
  render: -> null
