React = require 'react'
_ = require 'underscore'
User  = require './model'
api   = require '../api'
classnames = require 'classnames'

CURRENT_WINDOW = undefined

SECOND = 1000

WindowPropType =
  React.PropTypes.shape(
    open: React.PropTypes.func.isRequired
    screen: React.PropTypes.shape(
      height: React.PropTypes.number.isRequired
      width:  React.PropTypes.number.isRequired
      opera:  React.PropTypes.any
    ).isRequired
    addEventListener: React.PropTypes.func.isRequired
    removeEventListener: React.PropTypes.func.isRequired
    location: React.PropTypes.shape(
      href: React.PropTypes.string
    ).isRequired
 )


LoginGateway = React.createClass

  statics:
    windowPropType: WindowPropType

    urlForLogin: ->
      User.endpoints.login + '?parent=' + encodeURIComponent(window.location.href)

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
      CURRENT_WINDOW = windowImpl.open(url, 'oxlogin', options)


  propTypes:
    windowImpl: WindowPropType
    loginType: React.PropTypes.string
    onLogin:   React.PropTypes.func.isRequired

  getDefaultProps: ->
    windowImpl: window

  getInitialState: ->
    loginWindow: CURRENT_WINDOW

  openLogin: (ev) ->
    ev?.preventDefault()
    loginWindow = LoginGateway.openWindow(@props.windowImpl, {type: @props.loginType})
    @setState({loginWindow})
    _.delay(@windowClosedCheck, SECOND)

  parseAndDispatchMessage: (msg) ->
    return unless @isMounted()
    try
      data = JSON.parse(msg.data)
      if data.user
        api.channel.emit 'user.status.fetch.receive.success', data: data
        @props.onLogin()
    catch error
      console.warn(error)

  componentWillUnmount: ->
    @props.windowImpl.removeEventListener('message', @parseAndDispatchMessage)
  componentWillMount: ->
    @props.windowImpl.addEventListener('message', @parseAndDispatchMessage)

  windowClosedCheck: ->
    return unless @isMounted()
    if @state.loginWindow and @state.loginWindow.closed
      User.ensureStatusLoaded(true)
    else
      _.delay( @windowClosedCheck, SECOND)

  render: ->
    classes = classnames('login-gateway', @props.className,
      'is-open': @state.loginWindow
      'is-closed': not @state.loginWindow
    )

    <div role="link" className={classes} onClick={@openLogin}>
      <span className="message">
        Please log in using your OpenStax account in the window. <a data-bypass
          onClick={@openLogin} href={LoginGateway.urlForLogin()}
        >Click to reopen window.</a>
      </span>
    </div>

module.exports = LoginGateway
