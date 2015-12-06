React    = require 'react'
BS       = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'Icon'
  propTypes:
    type: React.PropTypes.string
    className: React.PropTypes.string
    tooltip: React.PropTypes.string
    tooltipProps: React.PropTypes.object

  getDefaultProps: ->
    tooltipProps: { placement: 'bottom' }

  render: ->
    classes = ['tutor-icon', 'fa', "fa-#{@props.type}"]
    classes.push(@props.className) if @props.className
    icon = <i className={classes.join(' ')} />

    if @props.tooltip
      tooltip = <BS.Tooltip>{@props.tooltip}</BS.Tooltip>
      <BS.OverlayTrigger {...@props.tooltipProps} overlay={tooltip}>{icon}</BS.OverlayTrigger>
    else
      icon
