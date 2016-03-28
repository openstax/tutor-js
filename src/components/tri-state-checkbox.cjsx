_     = require 'underscore'
React = require 'react'
classnames = require 'classnames'

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
    classNames = classnames('tri-state-checkbox', @props.type)
    <span tabIndex={1} className={classNames} onClick={@onClick}>
      <Icon
        type={ICON_TYPES[@props.type]}
        onClick={@props.onClick}
        style={styles}
      />
    </span>

module.exports = TriStateCheckbox
