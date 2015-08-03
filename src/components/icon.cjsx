React    = require 'react'
BS       = require 'react-bootstrap'

module.exports = React.createClass
  displayName: 'Icon'
  propTypes:
    type: React.PropTypes.string
    className: React.PropTypes.string
    tooltip: React.PropTypes.string


  render: ->
    classes = ['tutor-icon', 'fa', "fa-#{@props.type}"]
    classes.push(@props.className) if @props.className
    icon = <i className={classes.join(' ')} />

    if @props.tooltip
      console.log @props
      tooltip = <BS.Tooltip>Useful for talking securely about students over email.</BS.Tooltip>
      <BS.OverlayTrigger placement='bottom' overlay={tooltip}>{icon}</BS.OverlayTrigger>
    else
      icon
