React = require 'react'
BS = require 'react-bootstrap'

TagError = React.createClass

  propTypes:
    error: React.PropTypes.string

  render: ->
    return null unless @props.error
    tooltip =
      <BS.Tooltip><strong>{@props.error}</strong></BS.Tooltip>
    <BS.OverlayTrigger placement="top" overlay={tooltip}>
      <i className="fa fa-exclamation-triangle" />
    </BS.OverlayTrigger>

module.exports = TagError
