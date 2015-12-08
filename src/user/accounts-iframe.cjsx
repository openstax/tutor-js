# coffeelint: disable=no_empty_functions

React = require 'react'
classnames = require 'classnames'

api   = require '../api'
User  = require './model'

AccountsIframe = React.createClass

  getInitialState: ->
    width: '100%', height: 400, isClosable: @props.type is "profile"

  pageLoad: (page) ->
    if page is "/login"
      if User.isLoggingOut # we've logged out and are re-displaying login
        User._signalLogoutCompleted()
      @setState(isClosable: false)
    else # we're displaying a profile or settings related page
      if User.isLoggedIn()
        @setState(isClosable: true)
      else
        @setState(isClosable: false)
        # somehow we're displaying the profile page but we don't know we're logged in?
        if page is "/profile"
          # redisplaying the login page so we can pickup the login info
          @sendCommand('displayLogin', User.endpoints.iframe_login)

  # Note: we're currently not doing anything with the width because we want that to stay at 100%
  pageResize: ({width, height}) ->
    @setState(height: height)

  setTitle: (title) ->
    @setState(title: title)

  iFrameReady: ->
    if @props.type is 'login'
      if User.isLoggingOut
        @sendCommand('displayLogout', User.endpoints.iframe_login)
      else
        @sendCommand('displayLogin', User.endpoints.iframe_login)
    else
      @sendCommand('displayProfile')

  # called when an login process completes
  onLogin: (payload) ->
    api.channel.emit 'user.status.receive.fetch', data: payload
    @props.onComplete()

  sendCommand: (command, payload = {}) ->
    msg = JSON.stringify(data: {"#{command}": payload})
    React.findDOMNode(@refs.iframe).contentWindow.postMessage(msg, '*')

  parseAndDispatchMessage: (msg) ->
    return unless @isMounted()
    try
      json = JSON.parse(msg.data)
      for method, payload of json.data
        if @[method]
          @[method](payload)
        else
          console.warn?("Received message for unsupported #{method}")
    catch error
      console.warn(error)

  componentWillUnmount: ->
    window.removeEventListener('message', @parseAndDispatchMessage)
  componentWillMount: ->
    window.addEventListener('message', @parseAndDispatchMessage)

  render: ->
    # the other side of the iframe will validate our address and then only send messages to it
    me = window.location.protocol + '//' + window.location.host

    url = if User.isLoggingOut then User.endpoints.iframe_logout else User.endpoints.accounts_iframe
    url = "#{url}?parent=#{me}"
    className = classnames( 'accounts-iframe', {
      'is-closable': @state.isClosable
    })
    <div className={className}>
      <div className="heading">
        <h3 className="title">{@state?.title}</h3>
        <i className='close-icon' onClick={@props.onComplete}/>
      </div>
      <iframe src={url} ref='iframe'
        style={width: @state.width, height: @state.height, border: 0}
        id="OxAccountIframe" name="OxAccountIframe">
      </iframe>
    </div>




module.exports = AccountsIframe
