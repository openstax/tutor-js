React = require 'react'
Icon  = require './icon'

TriStateCheckbox = React.createClass

  propTypes:
    type: React.PropTypes.oneOf(['unchecked', 'checked', 'partial'])
    onClick: React.PropTypes.func

  render: ->
    [type, title] = switch @props.type
      when 'unchecked' then ['square-o', 'Unselected']
      when 'checked' then ['check-square-o', 'Fully selected']
      when 'partial' then ['check-square', 'Partially selected']
    if @props.onClick
      styles = cursor: 'pointer'

    <Icon type={type}
      onClick={@props.oncClick}
      style={styles}
      tooltip={title}
      tooltipProps={placement: 'top'}/>


module.exports = TriStateCheckbox
