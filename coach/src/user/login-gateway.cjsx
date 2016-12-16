React = require 'react'
_ = require 'underscore'
User  = require './model'
api   = require '../api'
classnames = require 'classnames'

SECOND = 1000

FakeWindowPropTypes = React.PropTypes.shape(
  open: React.PropTypes.func.isRequired
  screen: React.PropTypes.shape(
    height: React.PropTypes.number.isRequired
    width:  React.PropTypes.number.isRequired
    opera:  React.PropTypes.any
  ).isRequired
)

LoginGateway = React.createClass

  statics:
    FakeWindowPropTypes: FakeWindowPropTypes
    openWindow: (windowImpl, options) ->

      width  = Math.min(1000, windowImpl.screen.width - 20)
      height = Math.min(800, windowImpl.screen.height - 30)
      options = ["toolbar=no", "location=" + (if windowImpl.opera then "no" else "yes"),
        "directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no",
        "width=" + width, "height=" + height,
        "top="   + (windowImpl.screen.height - height) / 2,
        "left="  + (windowImpl.screen.width - width)   / 2].join()

      url = @urlForLogin()
      url += '?go=signup' if options.type is 'signup'
      windowImpl.open(url, 'oxlogin', options)


  propTypes:
    isLoggingIn: React.PropTypes.bool.isRequired
    window: FakeWindowPropTypes
    onToggle: React.PropTypes.func

  getDefaultProps: ->
    window: window

  getInitialState: ->
    loginWindow: false

  openLogin: (ev) ->
    ev.preventDefault()

    @setState({loginWindow})
    @props.onToggle?(loginWindow)
    _.delay(@windowClosedCheck, SECOND)

  parseAndDispatchMessage: (msg) ->
    return unless @isMounted()
    try
      @setState(loginWindow: false) # cancel checking for close
      data = JSON.parse(msg.data)
      if data.user
        api.channel.emit 'user.status.fetch.receive.success', data: data
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
    return null unless props.loginWindow

    classes = classnames('login-gateway', @props.className,
      'is-open': @state.loginWindow
      'is-closed': not @state.loginWindow
    )
    <div role="link" className={classes} onClick={@openLogin}>
      {if @state.loginWindow then @renderOpenMessage() else @props.children}
    </div>

module.exports = LoginGateway
