React    = require 'react'
BS       = require 'react-bootstrap'
classnames = require 'classnames'
{propHelpers} = require 'shared'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'Icon'
  propTypes:
    type: React.PropTypes.string.isRequired
    spin: React.PropTypes.bool
    className: React.PropTypes.string
    tooltip: React.PropTypes.oneOfType([
      React.PropTypes.string, React.PropTypes.element
    ])
    tooltipProps: React.PropTypes.object
    onNavbar: React.PropTypes.bool

  componentWillMount: ->
    uniqueId = _.uniqueId('icon-tooltip-')
    @setState({uniqueId: uniqueId})

  getDefaultProps: ->
    tooltipProps:
      placement: 'bottom',
      trigger: ['hover', 'focus']

  render: ->
    isButton = @props.onClick or (@props.tooltip and @props.tooltipProps.trigger is 'click')
    classNames = classnames('tutor-icon', 'fa', "fa-#{@props.type}", @props.className, {
      'fa-spin': @props.spin
      'clickable': isButton
    })

    unless @props.tooltip
      iconProps = _.omit(@props, 'tooltipProps', 'spin')
      return <i {...iconProps} role={if isButton then "button" else "presentation"} className={classNames} />
    buttonProps = propHelpers.removeDefined(@)
    icon = <button {...buttonProps} className={classNames} />
    tooltip =
      <BS.Tooltip id={@state.uniqueId}
        className={classnames('icon-tt', {'on-navbar': @props.onNavbar})}
      >{@props.tooltip}</BS.Tooltip>

    <BS.OverlayTrigger {...@props.tooltipProps} overlay={tooltip}>{icon}</BS.OverlayTrigger>
