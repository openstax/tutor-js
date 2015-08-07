React = require 'react'
BindStoreMixin = require '../bind-store-mixin'

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
        <h1>An error has occured</h1>
        <p>Please visit <a target='_blank'
          href='https://openstaxtutor.zendesk.com/hc/en-us/requests/new'>our support page</a> to file a bug report.
        </p>
        <p>Additional error messages returned from the server is:</p>
        <div className='response'>{serverErr.message}</div>
      </div>
    Dialog.show(title: "An error has occured.  Code: #{serverErr.statusCode}", body: errorMessage)


  # We don't actually render anything
  render: -> null
