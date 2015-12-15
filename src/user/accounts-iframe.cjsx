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
    @sendCommand('displayProfile')

  # called when an logout process completes
  logoutComplete: (success) ->
    return unless success
    User._signalLogoutCompleted()

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

  safariWarning: ->
    browser = window.navigator.userAgent
    return unless @props.type is 'login' and _.contains(browser, 'Safari') and not _.contains(browser, 'Chrome')
    # strip off the pathname
    a = document.createElement('a')
    a.href = User.endpoints.accounts_iframe
    url = "https://#{a.hostname}/"
    <div class="warning">
      <h3>
        Warning!  You appear to be using the Safari web-browser.
      </h3>
      Unfortunantly, you cannot login from here. Please visit
       the <a target="_blank" href={url}>
        OpenStax Account Login
      </a> page to login directly and then return to Concept Coach.
      After you do so, your login should be activated.
    </div>


  render: ->
    # the other side of the iframe will validate our address and then only send messages to it
    me = window.location.protocol + '//' + window.location.host
    url = if @props.type is 'logout' then User.endpoints.logout else User.endpoints.accounts_iframe
    url = "#{url}?parent=#{me}"
    className = classnames( 'accounts-iframe', @props.type )
    <div className={className}>
      {@safariWarning()}
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
