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

  render: ->
    if @props.onClick
      styles = cursor: 'pointer'

    <Icon
      type={ICON_TYPES[@props.type]}
      onClick={@props.onClick}
      style={styles}
    />


module.exports = TriStateCheckbox
