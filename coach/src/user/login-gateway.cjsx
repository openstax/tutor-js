React = require 'react'
_ = require 'underscore'
User  = require './model'
api   = require '../api'
classnames = require 'classnames'

SECOND = 1000

LoginGateway = React.createClass

  propTypes:
    window: React.PropTypes.shape(
      open: React.PropTypes.func
    )
    onToggle: React.PropTypes.func

  getDefaultProps: ->
    window: window

  getInitialState: ->
    loginWindow: false

  openLogin: (ev) ->
    ev.preventDefault()

    width  = Math.min(1000, window.screen.width - 20)
    height = Math.min(800, window.screen.height - 30)
    options = ["toolbar=no", "location=" + (if @props.window.opera then "no" else "yes"),
      "directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no",
      "width=" + width, "height=" + height,
      "top="   + (window.screen.height - height) / 2,
      "left="  + (window.screen.width - width)   / 2].join()
    loginWindow = @props.window.open(@urlForLogin(), 'oxlogin', options)
    @setState({loginWindow})
    @props.onToggle?(loginWindow)
    _.delay(@windowClosedCheck, SECOND)

  parseAndDispatchMessage: (msg) ->
    return unless @isMounted()
    try
      data = JSON.parse(msg.data)
      if data.user
        api.channel.emit 'user.status.receive.fetch', data: data
      @setState(loginWindow: false) # cancel checking for close
    catch error
      console.warn(error)
  componentWillUnmount: ->
    window.removeEventListener('message', @parseAndDispatchMessage)
  componentWillMount: ->
    window.addEventListener('message', @parseAndDispatchMessage)

  windowClosedCheck: ->
    return unless @isMounted()
    if @state.loginWindow and @state.loginWindow.closed
      User.ensureStatusLoaded(true)
    else
      _.delay( @windowClosedCheck, SECOND)

  urlForLogin: ->
    User.endpoints.login + '?parent=' + encodeURIComponent(window.location.href)

  renderOpenMessage: ->
    <span className="message">
      Please log in using your OpenStax account in the window. <a data-bypass
        onClick={@openLogin} href={@urlForLogin()}
      >Click to reopen window.</a>
    </span>

  render: ->
    classes = classnames('login-gateway', @props.className,
      'is-open': @state.loginWindow
      'is-closed': not @state.loginWindow
    )
    <div role="link" className={classes} onClick={@openLogin}>
      {if @state.loginWindow then @renderOpenMessage() else @props.children}
    </div>

module.exports = LoginGateway
