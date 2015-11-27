React = require 'react'
BS = require 'react-bootstrap'

api = require '../api'


ErrorNotification = React.createClass

  getInitialState: ->
    error: false

  componentWillMount: ->
    api.channel.on 'error', @onError

  componentWillUnmount: ->
    api.channel.off 'error', @onError

  onError: ({response}) ->
    return if response.stopErrorDisplay # someone else is handling displaying the error
    errors = ["#{response.status}: #{response.statusText}"]
    if response.data?.errors # we have something from server to display
      errors = errors.concat(
        _.flatten _.map response.data.errors, (error) ->
          # All 422 errors from BE *should* have a "code" property.  If not, show whatever it is
          if error.code then error.code else JSON.stringify(error)
        )
    @setState(errors: errors)

  onHide: ->
    @setState(errors: false)

  render: ->
    return null unless @state.errors
    <BS.Modal className='errors' onRequestHide={@onHide} title="Server Error">
      <div className='modal-body'>
        <ul>
          {for error in @state.errors
            <li>{error}</li>}
        </ul>
      </div>
      <div className='modal-footer'>
        <BS.Button className='ok' bsStyle='primary' onClick={@onHide}>OK</BS.Button>
      </div>
    </BS.Modal>


module.exports = ErrorNotification
