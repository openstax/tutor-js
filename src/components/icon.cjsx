React    = require 'react'
BS       = require 'react-bootstrap'
classnames = require 'classnames'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'Icon'
  propTypes:
    type: React.PropTypes.string.isRequired
    spin: React.PropTypes.bool
    className: React.PropTypes.string
    tooltip: React.PropTypes.string
    tooltipProps: React.PropTypes.object

  getDefaultProps: ->
    tooltipProps: { placement: 'bottom' }

  render: ->
    classNames = classnames('tutor-icon', 'fa', "fa-#{@props.type}", @props.className, {
      'fa-spin': @props.spin
    })

    icon = <i {...@props} className={classNames} />

    if @props.tooltip
      tooltip = <BS.Tooltip id={_.uniqueId('icon-tooltip-')}>{@props.tooltip}</BS.Tooltip>
      <BS.OverlayTrigger {...@props.tooltipProps} overlay={tooltip}>{icon}</BS.OverlayTrigger>
    else
      icon
