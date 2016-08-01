React = require 'react'

NetworkActivitySpinner = React.createClass

  propTypes:
    message: React.PropTypes.string

  getDefaultProps: ->
    message: 'Loading…'

  render: ->
    <div className="network-activity">
      <span className="spinner">
        <i className="fa fa-spin fa-spinner fa-4x" />
        <span className="message">{@props.message}</span>
      </span>
    </div>

module.exports = NetworkActivitySpinner
