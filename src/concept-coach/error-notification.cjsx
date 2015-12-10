React = require 'react'
BS = require 'react-bootstrap'

api = require '../api'


ErrorNotification = React.createClass

  getInitialState: ->
    error: false, isShowingDetails: false

  componentWillMount: ->
    api.channel.on 'error', @onError

  componentWillUnmount: ->
    api.channel.off 'error', @onError

  onError: ({response, failedData, exception}) ->
    return if failedData?.stopErrorDisplay # someone else is handling displaying the error
    if exception?
      errors = [exception.toString()]
    else if response.status is 0 # either no response, or the response lacked CORS headers and the browser rejected it
      errors = ["Unknown response received from server"]
    else
      errors = ["#{response.status}: #{response.statusText}"]
      if _.isArray(failedData.data?.errors) # we have something from server to display
        errors = errors.concat(
          _.flatten _.map failedData.data.errors, (error) ->
            # All 422 errors from BE *should* have a "code" property.  If not, show whatever it is
            if error.code then error.code else JSON.stringify(error)
          )
    @setState(errors: errors)

  toggleDetails: ->
    @setState(isShowingDetails: not @state.isShowingDetails)

  onHide: ->
    @setState(errors: false)

  renderDetails: ->
    <BS.Panel header="Error Details">
      <ul className="errors-listing">
        {for error, i in @state.errors
          <li key={i}>{error}</li>}
      </ul>
    </BS.Panel>

  render: ->
    return null unless @state.errors
    <BS.Modal className='errors' onRequestHide={@onHide} title="Server Error">
      <div className='modal-body'>
        <h3>Server error encountered</h3>
        <p>
          An unexpected error has occured.  Please
          visit <a target="_blank"
            href="https://openstaxtutor.zendesk.com/hc/en-us/requests/new"
          > our support site </a> so we can help to diagnose and correct the issue.
        </p>
        <BS.Button onClick={@toggleDetails}>
          {if @state.isShowingDetails then "Hide" else "Show"} Details
        </BS.Button>
        {@renderDetails() if @state.isShowingDetails}
      </div>
      <div className='modal-footer'>
        <BS.Button className='ok' bsStyle='primary' onClick={@onHide}>OK</BS.Button>
      </div>
    </BS.Modal>


module.exports = ErrorNotification
