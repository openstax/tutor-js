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

  componentWillMount: ->
    uniqueId = _.uniqueId('icon-tooltip-')
    @setState({uniqueId: uniqueId})

  getDefaultProps: ->
    tooltipProps:
      placement: 'bottom',
      trigger: 'click'

  render: ->
    classNames = classnames('tutor-icon', 'fa', "fa-#{@props.type}", @props.className, {
      'fa-spin': @props.spin
      'clickable': @props.tooltip and @props.tooltipProps.trigger is 'click'
    })

    icon = <i {...@props} className={classNames} />

    if @props.tooltip
      tooltip = <BS.Tooltip id={@state.uniqueId}>{@props.tooltip}</BS.Tooltip>
      <BS.OverlayTrigger {...@props.tooltipProps} overlay={tooltip}>{icon}</BS.OverlayTrigger>
    else
      icon
