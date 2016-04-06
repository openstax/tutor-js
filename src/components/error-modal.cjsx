React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ErrorsStore, ErrorsActions} = require '../stores/errors'

ErrorModal = React.createClass

  componentWillMount: ->
    ErrorsStore.addChangeListener(@update)

  componentWillUnmount: ->
    ErrorsStore.removeChangeListener(@update)

  update: -> @forceUpdate()

  onHide: ->
    ErrorsActions.acknowledge()

  render: ->
    error = ErrorsStore.getError()
    return null if _.isEmpty(error)

    {statusCode, message, request} = error
    if request.opts.data?
      dataMessage =
        <span>with <pre>{request.opts.data}</pre></span>

    debugInfo = [
    ]


    <BS.Modal
      className='error-modal'
      enforceFocus={false}
      autoFocus={false}
      backdrop={false}
      animation={false}
      onRequestHide={@onHide}
      title={"An error with code #{statusCode} has occured"}
      onHide={@onHide}>

      <div className='modal-body'>
         <p>Please let the content and/or QA teams know.</p>
         <p>Additional error messages returned from the server is:</p>
         <pre className='response'>{message or 'No response was received'}</pre>
         <div className='request'>
           <kbd>{request.opts.method}</kbd> on {request.url} {dataMessage}
         </div>
      </div>

      <div className='modal-footer'>
        <BS.Button bsStyle='primary' onClick={@onHide}>Close</BS.Button>
      </div>
    </BS.Modal>

module.exports = ErrorModal
