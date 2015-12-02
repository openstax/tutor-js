React = require 'react'

api   = require '../api'
User  = require './model'

AccountsIframeMixin =

  getInitialState: ->
    width: '100%', height: 400

  pageLoad: (page) ->


  # Note: we're currently not doing anything with the width because we want that to stay at 100%
  pageResize: ({width, height}) ->
    @setState(height: height)

  setTitle: (title) ->
    @setState(title: title)

  iFrameReady: ->
    @onIframeReady()

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

  renderIframe: ->
    # the other side of the iframe will validate our address and then only send messages to it
    me = window.location.protocol + '//' + window.location.host

    url = if User.isLoggingOut then User.endpoints.iframe_logout else User.endpoints.accounts_iframe
    url = "#{url}?parent=#{me}"
    <iframe src={url} ref='iframe'
      style={width: @state.width, height: @state.height, border: 0}
      id="OxAccountIframe" name="OxAccountIframe">
    </iframe>


module.exports = AccountsIframeMixin
