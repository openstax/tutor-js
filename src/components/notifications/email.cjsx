React = require 'react'
BS = require 'react-bootstrap'

Notifications = require '../../model/notifications'

EmailNotification = React.createClass
  propTypes:
    notice: React.PropTypes.shape(
      id: React.PropTypes.number.isRequired
      value: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    Notifications.acknowledge(@props.notice)
    undefined # silence React warning about return value

  getInitialState: ->
    inProgress: false

  onVerify: ->
    @setState(inProgress: true)

  onPinCheck: ->
    @props.notice.verify( @refs.input.getValue() )

  renderPin: ->
    <div className="notification email pin">
      <i className='icon fa fa-envelope-o' />
      Check your email inbox. Enter the 6-digit verification code:
      <BS.Input type="text" ref="input" />
      <a className='action' onClick={@onPinCheck}>Go</a>
    </div>

  renderVerify: ->
    <div className="notification email verify">
      <i className='icon fa fa-envelope-o' />
      Verifying your email address allows you to recover your password if you ever forget it.
      <a className='action' onClick={@onVerify}>Verify now</a>
    </div>

  render: ->
    if @state.inProgress then @renderPin() else @renderVerify()


module.exports = EmailNotification
