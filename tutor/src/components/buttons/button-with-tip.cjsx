React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'ButtonWithTip'

  propTypes:
    isDisabled:  React.PropTypes.bool
    onClick: React.PropTypes.func
    id: React.PropTypes.string.isRequired
    placement: React.PropTypes.oneOf(['bottom', 'top', 'left', 'right'])
    className: React.PropTypes.string
    getTip: React.PropTypes.func.isRequired

  getDefaultProps: ->
    placement: 'bottom'
    isDisabled: false

  render: ->
    {isDisabled, onClick, id, placement, children, className, getTip, disabledState} = @props

    tip = getTip(@props)

    buttonProps = _.pick(@props, 'className', 'bsStyle', 'block')
    buttonProps.disabled = isDisabled
    buttonProps.onClick = onClick unless isDisabled

    if disabledState? and isDisabled
      button = disabledState
    else
      button = <BS.Button {...buttonProps} role="link">{children}</BS.Button>

    if tip
      tooltip = <BS.Tooltip id={id}>{tip}</BS.Tooltip>
      <BS.OverlayTrigger placement={placement} overlay={tooltip}>
        {button}
      </BS.OverlayTrigger>
    else
      button
