React = require 'react'
classnames = require 'classnames'

api   = require '../api'

AccountsIframe = require './accounts-iframe-mixin'
User  = require './model'

UserLogin = React.createClass

  mixins: [AccountsIframe]
  propTypes:
    onComplete: React.PropTypes.func.isRequired

  # called by iframe when it's content is loaded and it's ready for requests
  onIframeReady: ->
    if User.isLoggingOut
      @sendCommand('displayLogout', User.endpoints.iframe_login)
    else
      @sendCommand('displayLogin', User.endpoints.iframe_login)

  render: ->
    <div className='user-login'>
      <div className="heading">
        <h3 className="title">{@state?.title}</h3>
      </div>
      {@renderIframe()}
    </div>



module.exports = UserLogin
