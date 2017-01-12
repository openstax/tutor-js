React = require 'react'
BS = require 'react-bootstrap'
api = require '../api'
Handlers = require './error-handlers'
Course = require '../course/model'

each = require 'lodash/each'
isEmpty = require 'lodash/isEmpty'
isArray = require 'lodash/isArray'

ErrorNotification = React.createClass

  propTypes:
    container: React.PropTypes.object
    close: React.PropTypes.func.isRequired
    course: React.PropTypes.instanceOf(Course)

  getInitialState: ->
    errors: false, isShowingDetails: false

  componentWillMount: ->
    api.channel.on 'error', @onError

  componentWillUnmount: ->
    api.channel.off 'error', @onError

  onError: (exception) ->
    {config, response} = exception

    errors = [exception.toString()] if exception?

    if response?
      if response.status is 0 # either no response, or the response lacked CORS headers and the browser rejected it
        errors = ["Unknown response received from server"]
      else
        errors = if isArray(response.data?.errors) # we have something from server to display
          each response.data.errors, (error) ->
            # All 422 errors from BE *should* have a "code" property.  If not, show whatever it is
            if error.code then error.code else JSON.stringify(error)
        else
          ["#{response.status}: #{response.statusText}"]

    @setState(errors: errors)

  toggleDetails: ->
    @setState(isShowingDetails: not @state.isShowingDetails)

  onHide: ->
    @setState(errors: false)

  render: ->
    return null unless @state.errors

    dialog = Handlers.getDialogAttributes(@state.errors, @onHide, @props.close, @props.course)

    <BS.Modal
      {...dialog.modalProps}
      container={@props.container}
      className='errors'
      show={not isEmpty(@state.errors)}
      onHide={@onHide}>

      <BS.Modal.Header closeButton>
        <BS.Modal.Title>{dialog.title}</BS.Modal.Title>
      </BS.Modal.Header>

      <BS.Modal.Body>
        {dialog.body}
      </BS.Modal.Body>

      <BS.Modal.Footer>
        {dialog.buttons}
      </BS.Modal.Footer>

    </BS.Modal>


module.exports = ErrorNotification
