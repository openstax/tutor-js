React = require 'react'
AccountsIframe = require './accounts-iframe-mixin'

UserLogin = React.createClass

  mixins: [AccountsIframe]
  propTypes:
    onComplete: React.PropTypes.func.isRequired

  # called when an login process completes
  onLogin: (payload) ->
    api.channel.emit 'user.receive.statusUpdate', data: payload
    @props.onComplete()

  # called by iframe when it's content is loaded and it's ready for requests
  iFrameReady: ->
    @sendCommand('displayLogin', User.endpoints.iframe_login)

  render: ->
    <div className="-user-login">
      {@renderIframe()}
    </div>


module.exports = UserLogin
