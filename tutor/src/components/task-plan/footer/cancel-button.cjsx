React = require 'react'
BS = require 'react-bootstrap'


CancelButton = React.createClass

  propTypes:
    onClick:    React.PropTypes.func.isRequired
    isWaiting:  React.PropTypes.bool.isRequired
    isEditable: React.PropTypes.bool.isRequired

  render: ->
    return null unless @props.isEditable

    <BS.Button aria-role='close' disabled={@props.isWaiting} onClick={@props.onClick}>Cancel</BS.Button>


module.exports = CancelButton
