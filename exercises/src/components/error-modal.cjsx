# coffeelint: disable=max_line_length

React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{ErrorsStore, ErrorsActions} = require '../stores/errors'

SUPPORT_URL = 'https://docs.google.com/a/rice.edu/forms/d/1gw-KCCQ1oHzfCQ8JjgDgZa9K5bfGEbp959RweYCKcG8/viewform'

HTMLResponse = React.createClass

  markup: ->
    __html: @props.message

  render: ->
    <div className="html" dangerouslySetInnerHTML={@markup()} />

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

    if statusCode is 500 # 500 errors from BE are HTML encoded
      message = <HTMLResponse message={message} />

    <BS.Modal
      className='error-modal'
      enforceFocus={false}
      autoFocus={false}
      show={true}
      backdrop={false}
      animation={false}
      onRequestHide={@onHide}
      title={"An error with code #{statusCode} has occured"}
      onHide={@onHide}>

      <div className='modal-body'>
        <p>Please fill out an <a target="_blank" href={SUPPORT_URL}>internal support
          request</a> <i>(opens in new tab)</i>.
        </p>
        <p>
          When submitting the request, please include the error details show below.
        </p>
        <p>Error details returned from the server:</p>
        <div className='response'>{message or 'No response was received'}</div>
        <div className='request'>
          <kbd>{request.opts.method}</kbd> on {request.url} {dataMessage}
        </div>
      </div>

      <div className='modal-footer'>
        <BS.Button bsStyle='primary' onClick={@onHide}>Close</BS.Button>
      </div>
    </BS.Modal>

module.exports = ErrorModal
