_     = require 'underscore'
React = require 'react'

Icon  = require './icon'

ICON_TYPES =
  partial:   'check-square-o'
  checked:   'check-square'
  unchecked: 'square-o'

TriStateCheckbox = React.createClass

  propTypes:
    type: React.PropTypes.oneOf(_.keys(ICON_TYPES)).isRequired
    onClick: React.PropTypes.func

  onClick: (ev) ->
    ev.preventDefault()
    @props.onClick?(ev)

  render: ->
    if @props.onClick
      styles = cursor: 'pointer'
    <span tabIndex={1} className='tri-state-checkbox' onClick={@onClick}>
      <Icon
        type={ICON_TYPES[@props.type]}
        onClick={@props.onClick}
        style={styles}
      />
    </span>

module.exports = TriStateCheckbox
