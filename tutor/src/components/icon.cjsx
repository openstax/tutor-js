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
      trigger: 'click'

  render: ->
    classNames = classnames('tutor-icon', 'fa', "fa-#{@props.type}", @props.className, {
      'fa-spin': @props.spin
      'clickable': @props.onClick or (@props.tooltip and @props.tooltipProps.trigger is 'click')
    })

    unless @props.tooltip
      return <i {...@props} className={classNames} />

    icon = <button {...@props} className={classNames} />

    tooltip = <BS.Tooltip id={@state.uniqueId}
      className={classnames({'on-navbar': @props.onNavbar})}
      >{@props.tooltip}</BS.Tooltip>

    <BS.OverlayTrigger {...@props.tooltipProps} overlay={tooltip}>{icon}</BS.OverlayTrigger>

