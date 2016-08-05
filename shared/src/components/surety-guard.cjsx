React = require 'react'
BS = require 'react-bootstrap'

SuretyGuard = React.createClass

  propTypes:
    onConfirm:  React.PropTypes.func.isRequired
    message:    React.PropTypes.string.isRequired
    placement:  React.PropTypes.string
    okButtonLabel: React.PropTypes.string
    cancelButtonLabel: React.PropTypes.string
    onlyPromptIf: React.PropTypes.func

  getDefaultProps: ->
    title:             'Are you sure?'
    placement:         'top'
    okButtonLabel:     'OK'
    cancelButtonLabel: 'Cancel'

  onConfirm: (ev) ->
    @refs.overlay.hide()
    @props.onConfirm(ev)

  onCancel: ->
    @refs.overlay.hide()

  renderPopover: ->
    <BS.Popover
      id="confirmation-alert"
      className="openstax-surety-guard"
      title={@props.title}
    >
      <span className="message">{@props.message}</span>
      <div className="controls">
        <BS.Button onClick={@onCancel}>
          {@props.cancelButtonLabel}
        </BS.Button>
        <BS.Button onClick={@onConfirm} bsStyle="primary">
          {@props.okButtonLabel}
        </BS.Button>
      </div>
    </BS.Popover>

  maybeShow: (ev) ->
    ev.preventDefault()
    @onConfirm(ev) if @props.onlyPromptIf and not @props.onlyPromptIf()

  render: ->
    <BS.OverlayTrigger
      ref="overlay"
      trigger='click'
      onClick={@maybeShow}
      placement={@props.placement}
      rootClose={true}
      overlay={@renderPopover()}
    >
      {@props.children}
    </BS.OverlayTrigger>


module.exports = SuretyGuard
