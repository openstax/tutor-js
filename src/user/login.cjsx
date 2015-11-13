React = require 'react'

api   = require '../api'
User  = require './model'

UserLogin = React.createClass

  propTypes:
    onComplete: React.PropTypes.func.isRequired

  getInitialState: ->
    width: '100%', height: 400

  # called by iframe when it's content is loaded and it's ready for requests
  iFrameReady: ->
    @sendCommand('displayLogin', User.endpoints.iframe_login)

  setUser: (user) ->
    User.update(user)

  # called when an login process completes
  onLogin: (payload) ->
    api.channel.emit 'user.status.receive.fetch', data: payload
    @props.onComplete()

  pageLoad: (page) ->
    console.log "Loaded #{page}"

  # Note: we're currently not doing anything with the width because we want that to stay at 100%
  pageResize: ({width, height}) ->
    @setState(height: height)

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
  componentDidMount: ->
    window.addEventListener('message', @parseAndDispatchMessage)

  render: ->
    # the other side of the iframe will validate our address and then only send messages to it
    me = window.location.protocol + '//' + window.location.host
    url = "#{User.endpoints.accounts_iframe}?parent=#{me}"

    <iframe src={url} ref='iframe'
      style={width: @state.width, height: @state.height, border: 0}
      id="OxAccountIframe" name="OxAccountIframe">
    </iframe>


module.exports = UserLogin
