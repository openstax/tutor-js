_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

Name = React.createClass

  propTypes:
    className:   React.PropTypes.string
    first_name:  React.PropTypes.string
    last_name:   React.PropTypes.string
    name:        React.PropTypes.string
    tooltip:     React.PropTypes.object

  render: ->
    name = if _.isEmpty(@props.name)
      "#{@props.first_name} #{@props.last_name}"
    else
      @props.name

    span = <span className={@props.className or "-name"}>{name}</span>

    if @props.tooltip?.enable
      tooltip = <BS.Tooltip>{name}</BS.Tooltip>
      <BS.OverlayTrigger 
        placement={@props.tooltip.placement}
        delayShow={@props.tooltip.delayShow}
        delayHide={@props.tooltip.delayHide}
        overlay={tooltip}>
        {span}
      </BS.OverlayTrigger>
    else
      span


module.exports = Name
