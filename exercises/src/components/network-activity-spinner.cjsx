React = require 'react'

NetworkActivitySpinner = React.createClass

  propTypes:
    isLoading: React.PropTypes.bool.isRequired
    message: React.PropTypes.string

  getDefaultProps: ->
    message: 'Loading…'

  render: ->
    return null unless @props.isLoading

    <div className="network-activity">
      <span className="spinner">
        <i className="fa fa-spin fa-spinner fa-4x" />
        <span className="message">{@props.message}</span>
      </span>
    </div>

module.exports = NetworkActivitySpinner
