React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
classnames = require 'classnames'
_ = require 'underscore'

URLs = require '../../model/urls'
Notifications = require '../../model/notifications'

EmailNotification = React.createClass

  propTypes:
    onDismiss: React.PropTypes.func.isRequired
    notice: React.PropTypes.shape(
      id: React.PropTypes.number.isRequired
      value: React.PropTypes.string.isRequired
    ).isRequired

  acknowledge: ->
    Notifications.acknowledge(@props.notice)
    undefined # silence React warning about return value

  # If used elsewhere, the on/off dance needs to be extracted to a component
  componentWillMount: ->
    @props.notice.on('change', @onChange)
  componentWillUnmount: ->
    @props.notice.off('change', @onChange)
  componentWillReceiveProps: (nextProps) ->
    if nextProps.notice and nextProps.notice isnt @props.notice
      @props.notice.off('change', @onChange)
      nextProps.notice.on('change', @onChange)

  onChange: ->
    @forceUpdate()

  onVerify: ->
    @props.notice.sendConfirmation()

  onPinCheck: ->
    @props.notice.sendVerification( ReactDOM.findDOMNode(@refs.verifyInput).value, @onSuccess)

  renderSpinner: ->
    <span className="body">
      <span className="message">
        Requesting...
      </span>
      <i className='fa fa-spin fa-2x fa-spinner' />
    </span>

  renderStart: ->
    <span className="body">
      <i className='icon fa fa-envelope-o' />
      Verifying your email address allows you to recover your password if you ever forget it.
      <a className='action' onClick={@onVerify}>Verify now</a>
    </span>

  onVerifyKey: (ev) ->
    if ev.key is 'Enter'
      @onPinCheck()

  renderPin: ->
    _.defer => @refs.verifyInput?.focus()
    <span className="body verify">
      <i className='icon fa fa-envelope-o' />
      <span className="message">
        Check your email inbox. Enter the 6-digit verification code:
      </span>
      <input autoFocus ref='verifyInput' onKeyPress={@onVerifyKey} type="text" />
      <a className='pin-check action' onClick={@onPinCheck}>Go</a>
    </span>

  renderFailure: ->
    <span className="body">
      <a href={URLs.get('accounts_profile')} className="action" target="_blank">
        Visit Profile >>
      </a>
    </span>

  renderSuccess: ->
    <span className="body">
      <i className='icon fa fa-envelope-o' />
      <span className="message">Verification was successful!</span>
    </span>

  onSuccess: ->
    # wait a bit so the "Success" message is seen, then hide
    _.delay @props.onDismiss, 1500

  render: ->

    body = if @props.notice.is_verified
      @renderSuccess()
    else if @props.notice.requestInProgress
      @renderSpinner()
    else if @props.notice.verifyInProgress
      if @props.notice.verificationFailed
        @renderFailure()
      else
        @renderPin()
    else
      @renderStart()

    if @props.notice.error
      error =
        <span className="error">
          <i className='icon fa fa-exclamation-circle' />
          <span className="body">{@props.notice.error}</span>
        </span>

    classNames = classnames('notification', 'email',
      {'with-error': @props.notice.error, acknowledged: @props.notice.acknowledged}
    )
    <div className={classNames}>
      {error}
      {body}
      <a className='dismiss' onClick={@props.onDismiss}>
        <i className="icon fa fa-close" />
      </a>
    </div>


module.exports = EmailNotification
