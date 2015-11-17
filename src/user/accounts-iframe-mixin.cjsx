React = require 'react'

api   = require '../api'
User  = require './model'

AccountsIframeMixin =

  getInitialState: ->
    width: '100%', height: 400, isLoading: true

  pageLoad: (page) ->
    @setState(isLoading: false)

  # Note: we're currently not doing anything with the width because we want that to stay at 100%
  pageResize: ({width, height}) ->
    @setState(height: height)

  setTitle: (title) ->
    # Hack for expediency.  Replace strings that mention tutor with Concept Coach
    @setState(title: title.replace(/\btutor\b/gi, "Concept Coach"))

  iFrameReady: ->
    @setState(isLoading: false)
    @onIframeReady()

  loadPage: (pageName) ->
    @setState(isLoading: true)
    @sendCommand('loadPage', pageName)

  sendCommand: (command, payload) ->
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
    if User.endpoints?
      # the other side of the iframe will validate our address and then only send messages to it
      me = window.location.protocol + '//' + window.location.host
      url = "#{User.endpoints.accounts_iframe}?parent=#{me}"
      <iframe src={url} ref='iframe'
        style={width: @state.width, height: @state.height, border: 0}
        id="OxAccountIframe" name="OxAccountIframe">
      </iframe>
    else
      null


module.exports = AccountsIframeMixin
